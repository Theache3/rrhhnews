'use client';

import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { uploadFile, UploadResponse, SheetReport } from '@/lib/api';

export function FileUploader({ onUploaded }: { onUploaded?: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.match(/\.xlsx?$/i)) {
      setFile(dropped);
      setResult(null);
      setError(null);
    } else {
      setError('Solo se aceptan archivos .xlsx');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const res = await uploadFile(file, setProgress);
      setResult(res);
      setFile(null);
      setProgress(null);
      onUploaded?.();
    } catch (err: any) {
      setError(err.message);
      setProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        className={`
          relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 transition-all
          ${dragging
            ? 'border-primary bg-primary/5 shadow-inner'
            : 'border-primary/30 bg-white hover:border-primary/60'}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-sm text-foreground/70">
          Arrastrá un archivo Excel acá o{' '}
          <label className="cursor-pointer font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
            seleccioná uno
            <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileSelect} />
          </label>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Formatos aceptados: .xlsx &middot; Máximo 50MB
        </p>
      </div>

      {/* File selected */}
      {file && (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {progress !== null && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-medium text-primary">{progress}%</span>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {uploading ? 'Procesando...' : 'Subir archivo'}
            </button>
            <button
              onClick={reset}
              disabled={uploading}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && <UploadReport response={result} />}
    </div>
  );
}

function UploadReport({ response }: { response: UploadResponse }) {
  const { upload, report } = response;

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-semibold text-primary">Archivo procesado correctamente</span>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">Tipo detectado</span>
          <p className="mt-0.5 font-semibold text-foreground">{upload.file_type}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Período</span>
          <p className="mt-0.5 font-semibold text-foreground">{upload.period || '-'}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Filas importadas</span>
          <p className="mt-0.5 font-semibold text-foreground">{upload.rows_imported}</p>
        </div>
      </div>

      {report.sheets.map((sheet, i) => (
        <SheetDetail key={i} sheet={sheet} />
      ))}
    </div>
  );
}

function SheetDetail({ sheet }: { sheet: SheetReport }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-medium">{sheet.sheetName}</span>
            <span className="ml-2 text-xs text-muted-foreground">({sheet.rowsImported} filas)</span>
          </div>
          <Badge variant="secondary" className="ml-1 text-xs">{sheet.targetTable}</Badge>
        </div>
        <svg className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3 text-xs">
          <div>
            <p className="mb-1.5 font-medium text-muted-foreground">Columnas mapeadas</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(sheet.columnsMapped).map(([db, orig]) => (
                <span key={db} className="inline-flex items-center rounded-md bg-primary/8 px-2 py-1 text-[11px] font-medium text-primary">
                  {orig} &rarr; {db}
                </span>
              ))}
            </div>
          </div>
          {sheet.columnsIgnored.length > 0 && (
            <div>
              <p className="mb-1.5 font-medium text-muted-foreground">Columnas ignoradas</p>
              <div className="flex flex-wrap gap-1.5">
                {sheet.columnsIgnored.map((col) => (
                  <Badge key={col} variant="outline" className="text-[11px]">{col}</Badge>
                ))}
              </div>
            </div>
          )}
          {sheet.warnings.length > 0 && (
            <div>
              <p className="mb-1 font-medium text-amber-600">Advertencias</p>
              {sheet.warnings.map((w, i) => (
                <p key={i} className="text-amber-600">{w}</p>
              ))}
            </div>
          )}
          {sheet.missingRequired.length > 0 && (
            <div>
              <p className="mb-1 font-medium text-red-600">Columnas requeridas faltantes</p>
              <div className="flex flex-wrap gap-1.5">
                {sheet.missingRequired.map((m) => (
                  <Badge key={m} variant="destructive" className="text-[11px]">{m}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
