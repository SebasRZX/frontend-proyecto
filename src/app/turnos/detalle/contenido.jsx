'use client';
 
import { useSearchParams } from 'next/navigation';
import TurnosEvento from '@/components/TurnosEvento';
 
export default function DetalleTurnosContenido() {
  const searchParams = useSearchParams();
  const eventoId = searchParams.get('eventoId');
 
  if (!eventoId) {
    return (
<div className="p-6 text-red-600">
        Debe indicar un evento válido: <code>?eventoId=123</code>
</div>
    );
  }
 
  return <TurnosEvento eventoId={eventoId} />;
}