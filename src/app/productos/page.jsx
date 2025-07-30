'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormularioProducto from '@/components/FormularioProducto';
import { useAuth } from '@/context/AuthContext';

export default function ProductosPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!usuario || !['admin', 'coordinador'].includes(usuario.rol))) {
      router.push('/'); // o '/login' según la experiencia deseada
    }
  }, [usuario, cargando, router]);

  if (cargando || !usuario) return null;

  return (
    <div className="flex-grow flex bg-gris-piedra p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-vino-sacerdotal text-center mb-6">
          Gestión de Productos
        </h1>
        <FormularioProducto usuario={usuario} />
      </div>
    </div>
  );
}
