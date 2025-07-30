'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CajaPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!usuario || !['admin', 'coordinador'].includes(usuario.rol))) {
      router.push('/');
    }
  }, [usuario, cargando, router]);

  if (cargando || !usuario) return null;

  const irACajas = () => router.push('/caja/control');
  const irAReportes = () => router.push('/caja/reportes');

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gris-piedra p-6">
      <h1 className="text-2xl font-bold text-vino-sacerdotal text-center mb-10">
        Cajas y Reportes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        <button
          onClick={irACajas}
          className="bg-oro-liturgico hover:bg-yellow-600 text-white font-bold py-8 text-xl rounded-xl shadow-lg active:scale-95 transition"
        >
          Cajas
        </button>

        <button
          onClick={irAReportes}
          className="bg-oro-liturgico hover:bg-yellow-600 text-white font-bold py-8 text-xl rounded-xl shadow-lg active:scale-95 transition"
        >
          Reportes
        </button>
      </div>
    </div>
  );
}
