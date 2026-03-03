import { NextRequest, NextResponse } from 'next/server';
import { getTableCount } from '@/lib/server/upload.service';

const VALID_TABLES = ['busquedas', 'promociones', 'capacitaciones', 'nomina', 'altas_bajas'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  const table = (await params).table;
  if (!VALID_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Tabla inválida' }, { status: 400 });
  }
  try {
    const result = await getTableCount(table);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al obtener count' },
      { status: 500 },
    );
  }
}
