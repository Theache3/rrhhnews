import { NextRequest, NextResponse } from 'next/server';
import { getTableData } from '@/lib/server/upload.service';

const VALID_TABLES = ['busquedas', 'promociones', 'capacitaciones', 'nomina', 'altas_bajas'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  const table = (await params).table;
  if (!VALID_TABLES.includes(table)) {
    return NextResponse.json(
      { error: `Tabla inválida. Válidas: ${VALID_TABLES.join(', ')}` },
      { status: 400 },
    );
  }
  try {
    const { searchParams } = new URL(_request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const data = await getTableData(table, limit);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al obtener datos' },
      { status: 500 },
    );
  }
}
