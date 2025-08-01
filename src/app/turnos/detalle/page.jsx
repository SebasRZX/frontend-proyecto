import { Suspense } from 'react';
import DetalleTurnosContenido from './contenido';
 
export default function DetalleTurnosPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Cargando turnos...</div>}>
      <DetalleTurnosContenido />
    </Suspense>
  );
}
 