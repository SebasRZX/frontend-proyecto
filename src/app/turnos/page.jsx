'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventosLista from '@/components/EventosLista';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react'; // Icono opcional

export default function TurnosPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!usuario || !['admin', 'coordinador'].includes(usuario.rol))) {
      router.push('/');
    }
  }, [usuario, cargando, router]);

  if (cargando || !usuario) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 bg-white dark:bg-gray-950 shadow-lg rounded-xl p-6 sm:p-8">

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primario dark:text-white">
            Eventos y Roles
          </h1>

          <button
            onClick={() => router.push('/turnos/nuevo')}
            className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-md shadow btn-personalizado transition"
          >
            <Plus className="w-5 h-5" />
            Crear nuevo evento
          </button>
        </div>

        {/* Lista de eventos */}
        <div>
          <EventosLista />
        </div>

      </div>
    </div>
  );
}
