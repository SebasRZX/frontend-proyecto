'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PanelAdmin from '@/components/PanelAdmin';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (!cargando && !usuario) {
    router.push('/login');
  }
}, [usuario, cargando, router]);


  if (cargando || !usuario) return null;

  return (
    <div className="flex-grow flex bg-fondo p-6">
      <PanelAdmin usuario={usuario} />
    </div>
  );
}