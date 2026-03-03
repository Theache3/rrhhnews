import { DataSource } from 'typeorm';
import { Upload, Busqueda, Promocion, Capacitacion, Nomina, AltaBaja } from './entities';
import { getDataSource } from './db';
import { parseExcel, ParseResult } from './parser/parser.service';

const MONTH_MAP: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04',
  mayo: '05', junio: '06', julio: '07', agosto: '08',
  septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
};

const TABLE_SCHEMA: Record<string, { int: Set<string>; float: Set<string>; date: Set<string> }> = {
  busquedas: {
    int: new Set(['cantidad']),
    float: new Set(['dias_en_cerrarse']),
    date: new Set(['fecha_inicio', 'fecha_ingreso']),
  },
  promociones: {
    int: new Set(['cantidad']),
    float: new Set([]),
    date: new Set(['fecha_promocion']),
  },
  capacitaciones: {
    int: new Set([]),
    float: new Set(['monto', 'horas_duracion']),
    date: new Set(['fecha']),
  },
  nomina: {
    int: new Set(['antiguedad', 'edad']),
    float: new Set([]),
    date: new Set(['fecha_ingreso', 'fecha_antiguedad', 'fecha_nacimiento']),
  },
  altas_bajas: {
    int: new Set([]),
    float: new Set(['motivo_medida', 'cod_ingreso', 'cod_egreso']),
    date: new Set([]),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeRow(row: Record<string, any>, table: string): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized: Record<string, any> = {};
  const schema = TABLE_SCHEMA[table] || { int: new Set(), float: new Set(), date: new Set() };

  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) {
      sanitized[key] = null;
      continue;
    }
    if (typeof value === 'object' && 'error' in value) {
      sanitized[key] = null;
      continue;
    }

    if (schema.int.has(key)) {
      if (typeof value === 'number') sanitized[key] = isFinite(value) ? Math.round(value) : null;
      else sanitized[key] = parseInt(String(value), 10) || null;
      continue;
    }
    if (schema.float.has(key)) {
      if (typeof value === 'number') sanitized[key] = isFinite(value) ? value : null;
      else sanitized[key] = parseFloat(String(value)) || null;
      continue;
    }
    if (schema.date.has(key)) {
      if (value instanceof Date) {
        sanitized[key] = isNaN(value.getTime()) ? null : value;
      } else {
        sanitized[key] = null;
      }
      continue;
    }

    if (value instanceof Date) {
      sanitized[key] = isNaN(value.getTime()) ? null : value.toISOString();
    } else if (typeof value === 'object') {
      sanitized[key] = String(value);
    } else {
      sanitized[key] = String(value);
    }
  }
  return sanitized;
}

function extractPeriod(filename: string): string | null {
  const norm = filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  for (const [month, num] of Object.entries(MONTH_MAP)) {
    if (norm.includes(month)) {
      const yearMatch = norm.match(/(\d{4})/);
      const shortYearMatch = norm.match(/\b(\d{2})\b/);
      if (yearMatch) return `${num}-${yearMatch[1]}`;
      if (shortYearMatch) return `${num}-20${shortYearMatch[1]}`;
    }
  }
  const yearOnly = norm.match(/(\d{4})/);
  if (yearOnly) return yearOnly[1];
  return null;
}

export interface ProcessedUpload {
  id: number;
  filename: string;
  file_type: string;
  period: string;
  rows_imported: number;
  status: string;
}

export async function processUpload(buffer: Buffer, originalname: string): Promise<{
  upload: ProcessedUpload;
  report: ReturnType<typeof buildReport>;
}> {
  const ds = await getDataSource();
  const uploadRepo = ds.getRepository(Upload);
  const upload = uploadRepo.create({
    filename: originalname,
    file_type: 'detecting',
    status: 'processing',
  });
  await uploadRepo.save(upload);

  try {
    const result = await parseExcel(buffer, originalname);
    const period = extractPeriod(originalname);

    upload.file_type = result.fileType;
    upload.period = period ?? '';
    await uploadRepo.save(upload);

    await removePreviousData(ds, result.fileType, upload.id);
    await persistData(ds, upload.id, result, period);

    const report = buildReport(result);
    upload.rows_imported = result.totalRows;
    upload.status = 'completed';
    upload.parse_report = JSON.stringify(report);
    await uploadRepo.save(upload);

    return {
      upload: {
        id: upload.id,
        filename: upload.filename,
        file_type: upload.file_type,
        period: upload.period,
        rows_imported: upload.rows_imported,
        status: upload.status,
      },
      report,
    };
  } catch (err: unknown) {
    upload.status = 'error';
    upload.error_message = err instanceof Error ? err.message : String(err);
    await uploadRepo.save(upload);
    throw err;
  }
}

async function removePreviousData(ds: DataSource, fileType: string, currentUploadId: number) {
  const uploadRepo = ds.getRepository(Upload);
  const previous = await uploadRepo.find({ where: { file_type: fileType } });
  const idsToRemove = previous.filter((u) => u.id !== currentUploadId).map((u) => u.id);
  if (idsToRemove.length === 0) return;

  console.log(`[Upload] Removing ALL previous data for ${fileType}: upload IDs ${idsToRemove}`);

  const qr = ds.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();
  try {
    for (const id of idsToRemove) {
      await qr.manager.delete(Busqueda, { upload_id: id });
      await qr.manager.delete(Promocion, { upload_id: id });
      await qr.manager.delete(Capacitacion, { upload_id: id });
      await qr.manager.delete(Nomina, { upload_id: id });
      await qr.manager.delete(AltaBaja, { upload_id: id });
      await qr.manager.update(Upload, id, { status: 'replaced' });
    }
    await qr.commitTransaction();
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRepoMap(ds: DataSource): Record<string, any> {
  return {
    busquedas: ds.getRepository(Busqueda),
    promociones: ds.getRepository(Promocion),
    capacitaciones: ds.getRepository(Capacitacion),
    nomina: ds.getRepository(Nomina),
    altas_bajas: ds.getRepository(AltaBaja),
  };
}

async function persistData(ds: DataSource, uploadId: number, result: ParseResult, period: string | null) {
  const repoMap = getRepoMap(ds);

  for (const sheet of result.sheets) {
    const repo = repoMap[sheet.targetTable];
    if (!repo) {
      console.warn(`[Upload] No repository for table: ${sheet.targetTable}`);
      continue;
    }
    if (sheet.mapResult.missing.length > 0) {
      console.warn(
        `[Upload] Skipping sheet "${sheet.sheetName}" due to missing required columns: ${sheet.mapResult.missing.join(', ')}`,
      );
      continue;
    }

    const BATCH_SIZE = 50;
    for (let i = 0; i < sheet.rows.length; i += BATCH_SIZE) {
      const batch = sheet.rows.slice(i, i + BATCH_SIZE).map((row) => {
        const sanitized = sanitizeRow(row as Record<string, unknown>, sheet.targetTable);
        return repo.create({ ...sanitized, upload_id: uploadId, periodo: period ?? null });
      });
      await repo.save(batch);
    }
    console.log(`[Upload] Persisted ${sheet.rows.length} rows to ${sheet.targetTable}`);
  }
}

function buildReport(result: ParseResult) {
  return {
    fileType: result.fileType,
    totalRows: result.totalRows,
    sheets: result.sheets.map((s) => ({
      sheetName: s.sheetName,
      targetTable: s.targetTable,
      rowsImported: s.rows.length,
      columnsMapped: s.mapResult.mapped,
      columnsIgnored: s.mapResult.ignored,
      missingRequired: s.mapResult.missing,
      warnings: s.mapResult.warnings,
    })),
  };
}

export async function getUploads() {
  const ds = await getDataSource();
  return ds.getRepository(Upload).find({ order: { created_at: 'DESC' } });
}

export async function getUploadById(id: number) {
  const ds = await getDataSource();
  return ds.getRepository(Upload).findOneBy({ id });
}

export async function getTableData(table: string, limit: number) {
  const ds = await getDataSource();
  const repoMap = getRepoMap(ds);
  const repo = repoMap[table];
  if (!repo) return [];
  return repo.find({ take: Math.min(limit, 500), order: { id: 'DESC' } });
}

export async function getTableCount(table: string) {
  const ds = await getDataSource();
  const repoMap = getRepoMap(ds);
  const repo = repoMap[table];
  if (!repo) return { table, count: 0 };
  const count = await repo.count();
  return { table, count };
}
