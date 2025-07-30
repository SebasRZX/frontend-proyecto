'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReportesCaja from '@/components/ReportesCaja';
import ReporteVentasEvento from '@/components/ReporteVentasEvento';

export default function ReportesPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!usuario || !['admin', 'coordinador'].includes(usuario.rol))) {
      router.push('/');
    }
  }, [usuario, cargando, router]);

  if (cargando || !usuario) return null;

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gris-piedra p-6 space-y-4">
      {/* ✅ Botón destacado para volver a /caja */}
      <div className="self-start">
        <button
          onClick={() => router.push('/caja')}
          className="text-white px-4 py-2 rounded btn-personalizado transition"
        >
          ← Volver a cajas y reportes
        </button>
      </div>

      {/* Componente de control de caja */}
      <ReportesCaja/>
      <ReporteVentasEvento/>
    </div>
  );
}
