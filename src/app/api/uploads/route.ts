import { NextRequest, NextResponse } from 'next/server';
import { processUpload, getUploads } from '@/lib/server/upload.service';

export async function GET() {
  try {
    const uploads = await getUploads();
    return NextResponse.json(
      uploads.map((u) => ({
        id: u.id,
        filename: u.filename,
        file_type: u.file_type,
        period: u.period,
        rows_imported: u.rows_imported,
        status: u.status,
        error_message: u.error_message,
        created_at: u.created_at,
      })),
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al obtener historial' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ningún archivo' },
        { status: 400 },
      );
    }
    if (!file.name.match(/\.xlsx?$/i)) {
      return NextResponse.json(
        { success: false, error: 'Solo se aceptan archivos .xlsx' },
        { status: 400 },
      );
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Archivo demasiado grande' },
        { status: 400 },
      );
    }

    let originalname = file.name;
    try {
      originalname = Buffer.from(originalname, 'latin1').toString('utf8');
    } catch {
      // keep original if decode fails
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { upload, report } = await processUpload(buffer, originalname);

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        filename: upload.filename,
        file_type: upload.file_type,
        period: upload.period,
        rows_imported: upload.rows_imported,
        status: upload.status,
      },
      report,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Error al procesar el archivo',
      },
      { status: 422 },
    );
  }
}
