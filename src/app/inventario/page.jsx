'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ListaProductos from '@/components/ListaProductos';
import { useAuth } from '@/context/AuthContext';

export default function InventarioPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y el usuario no tiene acceso, redirigir
    if (!cargando && (!usuario || !['admin', 'coordinador'].includes(usuario.rol))) {
      router.push('/'); // o '/login', según preferencia
    }
  }, [usuario, cargando, router]);

  if (cargando || !usuario) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos registrados</h1>
      <ListaProductos />
    </div>
  );
}
