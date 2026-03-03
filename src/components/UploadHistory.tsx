'use client';

import { useEffect, useState } from 'react';
import { fetchUploads, UploadRecord } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completado', className: 'bg-primary/10 text-primary' },
  processing: { label: 'Procesando', className: 'bg-amber-100 text-amber-700' },
  error: { label: 'Error', className: 'bg-red-100 text-red-700' },
  replaced: { label: 'Reemplazado', className: 'bg-muted text-muted-foreground' },
};

const TYPE_LABELS: Record<string, string> = {
  busquedas: 'Búsquedas',
  capacitaciones: 'Capacitaciones',
  nomina: 'Nómina',
};

export function UploadHistory({ refreshKey }: { refreshKey: number }) {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchUploads()
      .then(setUploads)
      .catch(() => setUploads([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = uploads.filter((u) =>
    u.filename.toLowerCase().includes(search.toLowerCase()) ||
    (TYPE_LABELS[u.file_type] || u.file_type).toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        <svg className="mr-2 h-5 w-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Cargando historial...
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-8 w-8 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground/70">No hay cargas registradas todavía</p>
        <p className="mt-1 text-xs text-muted-foreground">Subí tu primer archivo desde la pestaña &quot;Cargar Archivo&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar archivos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_0.7fr_1fr_1.2fr] gap-4 px-4 text-xs font-semibold uppercase tracking-wider text-primary">
        <span>Archivo</span>
        <span>Tipo</span>
        <span>Período</span>
        <span className="text-right">Filas</span>
        <span>Estado</span>
        <span>Fecha</span>
      </div>

      {/* Rows */}
      <div className="divide-y overflow-hidden rounded-lg border bg-white shadow-sm">
        {filtered.map((u) => {
          const status = STATUS_MAP[u.status] || { label: u.status, className: 'bg-muted text-muted-foreground' };
          return (
            <div key={u.id} className="grid grid-cols-[2fr_1fr_1fr_0.7fr_1fr_1.2fr] items-center gap-4 px-4 py-3.5 text-sm transition-colors hover:bg-muted/30">
              <span className="truncate font-medium">{u.filename}</span>
              <span>
                <Badge variant="secondary" className="font-medium">
                  {TYPE_LABELS[u.file_type] || u.file_type}
                </Badge>
              </span>
              <span className="text-muted-foreground">{u.period || '-'}</span>
              <span className="text-right font-mono text-muted-foreground">{u.rows_imported}</span>
              <span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                  {status.label}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(u.created_at).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && search && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No se encontraron resultados para &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
