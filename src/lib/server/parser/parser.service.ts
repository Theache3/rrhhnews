import * as ExcelJS from 'exceljs';
import { mapColumns, sheetNameMatches, MapResult } from './column-mapper';
import {
  BUSQUEDAS_SHEET_PATTERNS,
  PROMOCIONES_SHEET_PATTERNS,
  busquedasColumns,
  promocionesColumns,
} from './strategies/busquedas.strategy';
import {
  CAPACITACIONES_DATA_SHEET,
  CAPACITACIONES_MASTER_SHEET,
  capacitacionesColumns,
} from './strategies/capacitaciones.strategy';
import {
  NOMINA_DOTACION_SHEET,
  NOMINA_ALTAS_BAJAS_SHEET,
  nominaColumns,
  altasBajasColumns,
} from './strategies/nomina.strategy';

export type FileType = 'busquedas' | 'capacitaciones' | 'nomina';

export interface SheetParseResult {
  sheetName: string;
  targetTable: string;
  rows: Record<string, unknown>[];
  mapResult: MapResult;
}

export interface ParseResult {
  fileType: FileType;
  sheets: SheetParseResult[];
  totalRows: number;
}

function log(msg: string) {
  console.log(`[Parser] ${msg}`);
}
function warn(msg: string) {
  console.warn(`[Parser] ${msg}`);
}

export async function parseExcel(buffer: Buffer, filename: string): Promise<ParseResult> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);

  const sheetNames = workbook.worksheets.map((ws) => ws.name);
  log(`Sheets found: ${sheetNames.join(', ')}`);

  const fileType = detectFileType(sheetNames, filename);
  if (!fileType) {
    throw new Error(
      `No se pudo detectar el tipo de archivo. Hojas encontradas: ${sheetNames.join(', ')}. ` +
        'Tipos soportados: busquedas, capacitaciones, nomina.',
    );
  }

  const sheets: SheetParseResult[] = [];

  switch (fileType) {
    case 'busquedas':
      sheets.push(...parseBusquedas(workbook, sheetNames));
      break;
    case 'capacitaciones':
      sheets.push(...parseCapacitaciones(workbook, sheetNames));
      break;
    case 'nomina':
      sheets.push(...parseNomina(workbook, sheetNames));
      break;
  }

  const totalRows = sheets.reduce((sum, s) => sum + s.rows.length, 0);
  return { fileType, sheets, totalRows };
}

function detectFileType(sheetNames: string[], filename: string): FileType | null {
  const hasBusquedas = sheetNames.some((s) =>
    sheetNameMatches(s, BUSQUEDAS_SHEET_PATTERNS),
  );
  const hasPromociones = sheetNames.some((s) =>
    sheetNameMatches(s, PROMOCIONES_SHEET_PATTERNS),
  );
  if (hasBusquedas || hasPromociones) return 'busquedas';

  const hasDotacion = sheetNames.some((s) =>
    sheetNameMatches(s, NOMINA_DOTACION_SHEET),
  );
  const hasAltasBajas = sheetNames.some((s) =>
    sheetNameMatches(s, NOMINA_ALTAS_BAJAS_SHEET),
  );
  if (hasDotacion || hasAltasBajas) return 'nomina';

  const hasCapacitacionesData = sheetNames.some((s) =>
    sheetNameMatches(s, CAPACITACIONES_DATA_SHEET),
  );
  const hasCapacitacionesMaster = sheetNames.some((s) =>
    sheetNameMatches(s, CAPACITACIONES_MASTER_SHEET),
  );
  if (hasCapacitacionesData || hasCapacitacionesMaster) return 'capacitaciones';

  const normFilename = filename.toLowerCase();
  if (normFilename.includes('busqueda')) return 'busquedas';
  if (normFilename.includes('capacitacion')) return 'capacitaciones';
  if (normFilename.includes('nomina')) return 'nomina';

  return null;
}

function parseBusquedas(workbook: ExcelJS.Workbook, sheetNames: string[]): SheetParseResult[] {
  const results: SheetParseResult[] = [];
  const busquedasSheet = sheetNames.find((s) =>
    sheetNameMatches(s, BUSQUEDAS_SHEET_PATTERNS),
  );
  if (busquedasSheet) {
    results.push(
      parseSheet(workbook.getWorksheet(busquedasSheet)!, busquedasColumns, 'busquedas'),
    );
  }
  const promoSheet = sheetNames.find((s) =>
    sheetNameMatches(s, PROMOCIONES_SHEET_PATTERNS),
  );
  if (promoSheet) {
    results.push(
      parseSheet(workbook.getWorksheet(promoSheet)!, promocionesColumns, 'promociones'),
    );
  }
  return results;
}

function parseCapacitaciones(workbook: ExcelJS.Workbook, sheetNames: string[]): SheetParseResult[] {
  const results: SheetParseResult[] = [];
  const dataSheet = sheetNames.find((s) =>
    sheetNameMatches(s, CAPACITACIONES_DATA_SHEET),
  );
  if (dataSheet) {
    results.push(
      parseSheet(workbook.getWorksheet(dataSheet)!, capacitacionesColumns, 'capacitaciones'),
    );
  }
  return results;
}

function parseNomina(workbook: ExcelJS.Workbook, sheetNames: string[]): SheetParseResult[] {
  const results: SheetParseResult[] = [];
  const dotacionSheet = sheetNames.find((s) =>
    sheetNameMatches(s, NOMINA_DOTACION_SHEET),
  );
  if (dotacionSheet) {
    results.push(
      parseSheet(workbook.getWorksheet(dotacionSheet)!, nominaColumns, 'nomina'),
    );
  }
  const abSheet = sheetNames.find((s) =>
    sheetNameMatches(s, NOMINA_ALTAS_BAJAS_SHEET),
  );
  if (abSheet) {
    results.push(
      parseSheet(workbook.getWorksheet(abSheet)!, altasBajasColumns, 'altas_bajas'),
    );
  }
  return results;
}

function parseSheet(
  worksheet: ExcelJS.Worksheet,
  columnDefs: { dbField: string; aliases: string[]; required: boolean }[],
  targetTable: string,
): SheetParseResult {
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber - 1] = cell.text?.toString().trim() || `col_${colNumber}`;
  });

  while (headers.length > 0 && (!headers[headers.length - 1] || headers[headers.length - 1].startsWith('col_'))) {
    headers.pop();
  }

  const mapResult = mapColumns(headers, columnDefs);

  if (mapResult.missing.length > 0) {
    warn(
      `Sheet "${worksheet.name}" - Missing required columns: ${mapResult.missing.join(', ')}`,
    );
  }

  const reverseMap: Record<number, string> = {};
  for (const [dbField, originalHeader] of Object.entries(mapResult.mapped)) {
    const colIdx = headers.indexOf(originalHeader);
    if (colIdx !== -1) reverseMap[colIdx] = dbField;
  }

  const rows: Record<string, unknown>[] = [];
  const rowCount = worksheet.rowCount ?? 0;

  for (let r = 2; r <= rowCount; r++) {
    const row = worksheet.getRow(r);
    const record: Record<string, unknown> = {};
    let hasData = false;

    for (const [colIdxStr, dbField] of Object.entries(reverseMap)) {
      const colIdx = parseInt(colIdxStr, 10);
      const cell = row.getCell(colIdx + 1);
      const value = extractCellValue(cell);
      record[dbField] = value;
      if (value !== null && value !== undefined && value !== '') hasData = true;
    }

    if (hasData) rows.push(record);
  }

  log(
    `Sheet "${worksheet.name}" -> ${targetTable}: ${rows.length} rows, ` +
      `${Object.keys(mapResult.mapped).length} cols mapped, ` +
      `${mapResult.ignored.length} cols ignored`,
  );

  return { sheetName: worksheet.name, targetTable, rows, mapResult };
}

function extractCellValue(cell: ExcelJS.Cell): unknown {
  if (cell.value === null || cell.value === undefined) return null;

  if (cell.value instanceof Date) {
    return isNaN(cell.value.getTime()) ? null : cell.value;
  }

  if (typeof cell.value === 'object' && 'error' in cell.value) {
    return null;
  }

  if (typeof cell.value === 'object' && 'result' in cell.value) {
    const result = (cell.value as { result: unknown }).result;
    if (result instanceof Date) return isNaN(result.getTime()) ? null : result;
    if (typeof result === 'object' && result !== null && 'error' in result) return null;
    return result ?? null;
  }

  if (typeof cell.value === 'object' && 'richText' in cell.value) {
    return (cell.value as { richText: { text: string }[] }).richText.map((rt) => rt.text).join('');
  }

  if (typeof cell.value === 'object' && 'text' in cell.value) {
    return (cell.value as { text: string }).text;
  }

  if (typeof cell.value === 'number' && !isFinite(cell.value)) return null;

  return cell.value;
}
