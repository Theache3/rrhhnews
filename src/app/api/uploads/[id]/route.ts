import { NextRequest, NextResponse } from 'next/server';
import { getUploadById } from '@/lib/server/upload.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  try {
    const upload = await getUploadById(id);
    if (!upload) {
      return NextResponse.json({ error: 'Upload no encontrado' }, { status: 404 });
    }
    return NextResponse.json({
      ...upload,
      parse_report: upload.parse_report ? JSON.parse(upload.parse_report) : null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al obtener detalle' },
      { status: 500 },
    );
  }
}
