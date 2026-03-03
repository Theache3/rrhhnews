'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { UploadHistory } from '@/components/UploadHistory';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h2 className="mb-6 text-xl font-semibold text-primary">Carga de Documentos</h2>

      <div className="mb-8 flex overflow-hidden rounded-lg bg-primary shadow-sm">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-primary-foreground text-primary shadow-inner'
              : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Cargar Archivo
        </button>
        <button
          onClick={() => { setActiveTab('history'); setRefreshKey((k) => k + 1); }}
          className={`flex flex-1 items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all ${
            activeTab === 'history'
              ? 'bg-primary-foreground text-primary shadow-inner'
              : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial de Cargas
        </button>
      </div>

      {activeTab === 'upload' && (
        <FileUploader onUploaded={() => setRefreshKey((k) => k + 1)} />
      )}

      {activeTab === 'history' && (
        <UploadHistory refreshKey={refreshKey} />
      )}
    </div>
  );
}
