import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RRHH - Carga de Documentos",
  description: "Sistema de carga y procesamiento de archivos Excel de RRHH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-primary px-6 shadow-md">
          <div className="flex items-center gap-3">
            <svg className="h-7 w-7 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-lg font-semibold tracking-tight text-primary-foreground">
              Recursos Humanos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-foreground/80">RRHH Admin</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold text-primary-foreground">
              R
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
