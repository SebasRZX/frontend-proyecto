'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormularioVenta from '@/components/FormularioVenta';
import { useAuth } from '@/context/AuthContext';

export default function VentasPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!usuario || !['admin', 'coordinador', 'voluntario'].includes(usuario.rol))) {
      router.push('/'); // redirige si no tiene acceso
    }
  }, [usuario, cargando, router]);

  if (cargando || !usuario) return null;

  return (
    <main className="p-4 bg-oro-liturgico">
      <FormularioVenta usuario={usuario} />
    </main>
  );
}

