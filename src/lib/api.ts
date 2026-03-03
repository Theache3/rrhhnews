export interface UploadRecord {
  id: number;
  filename: string;
  file_type: string;
  period: string | null;
  rows_imported: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

export interface SheetReport {
  sheetName: string;
  targetTable: string;
  rowsImported: number;
  columnsMapped: Record<string, string>;
  columnsIgnored: string[];
  missingRequired: string[];
  warnings: string[];
}

export interface UploadResponse {
  success: boolean;
  upload: UploadRecord;
  report: {
    fileType: string;
    totalRows: number;
    sheets: SheetReport[];
  };
  error?: string;
}

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.error || data.message || 'Error al procesar el archivo'));
        }
      } catch {
        reject(new Error('Respuesta inválida del servidor'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Error de conexión')));
    xhr.open('POST', '/api/uploads');
    xhr.send(formData);
  });
}

export async function fetchUploads(): Promise<UploadRecord[]> {
  const res = await fetch('/api/uploads');
  if (!res.ok) throw new Error('Error al obtener historial');
  return res.json();
}

export async function fetchUploadDetail(id: number) {
  const res = await fetch(`/api/uploads/${id}`);
  if (!res.ok) throw new Error('Error al obtener detalle');
  return res.json();
}
