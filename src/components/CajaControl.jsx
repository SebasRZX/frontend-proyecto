'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function CajaControl() {
  const [caja, setCaja] = useState(null); // caja actual
  const [montoApertura, setMontoApertura] = useState('');
  const [montoCierre, setMontoCierre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resumenCaja, setResumenCaja] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    obtenerCajaActual();
  }, []);

  const obtenerCajaActual = async () => {
    try {
      const res = await fetch(`${API_URL}/caja/actual`, {
        credentials: 'include',
      });
      const data = await res.json();
      setCaja(data);

      if (data && data.estado === 'abierta') {
        const resumenRes = await fetch(`${API_URL}/caja/resumen`, {
          credentials: 'include',
        });
        const resumenData = await resumenRes.json();
        setResumenCaja(resumenData.resumen);
      } else {
        setResumenCaja(null);
      }
    } catch (err) {
      toast.error('Error al obtener datos de caja');
    }
  };

  const abrirCaja = async () => {
    if (!montoApertura || Number(montoApertura) < 0) {
      toast.error('Debe ingresar un monto válido para apertura');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/caja/abrir`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto_apertura: Number(montoApertura) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al abrir caja');

      toast.success('Caja abierta correctamente');
      setCaja({ ...data, monto_apertura: montoApertura, estado: 'abierta' });
      setMontoApertura('');
      obtenerCajaActual();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCargando(false);
    }
  };

  const cerrarCaja = async () => {
    if (!montoCierre || Number(montoCierre) < 0) {
      toast.error('Debe ingresar el monto contado final');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/caja/cerrar`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto_cierre: Number(montoCierre),
          observaciones,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cerrar caja');

      toast.success('Caja cerrada correctamente');
      setMontoCierre('');
      setObservaciones('');
      obtenerCajaActual();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center text-black">Control de Caja</h2>

      {caja && caja.estado === 'abierta' ? (
        <>
          <p className="text-green-700 font-semibold text-center">
            Caja abierta desde: {new Date(caja.fecha_apertura).toLocaleString()}
          </p>
          <p className="text-center">
            Monto de apertura: ₡{Number(caja.monto_apertura).toLocaleString()}
          </p>

          <hr />

          <div>
            <label className="font-semibold block mb-1">Monto contado final:</label>
            <input
              type="number"
              value={montoCierre}
              onChange={(e) => setMontoCierre(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="₡"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Observaciones (opcional):</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="border p-2 rounded w-full"
              rows={3}
              placeholder="Comentarios al cerrar caja..."
            />
          </div>

          {resumenCaja && (
            <div className="bg-gray-100 border p-4 rounded text-sm mt-4">
              <p><strong>Resumen de Ventas:</strong></p>
              <ul className="pl-4 list-disc">
                <li>Efectivo: ₡{resumenCaja.efectivo.toLocaleString()}</li>
                <li>SINPE: ₡{resumenCaja.sinpe.toLocaleString()}</li>
                <li>Total: ₡{resumenCaja.total.toLocaleString()}</li>
                {montoCierre && (
                  <li>
                    Diferencia (efectivo vs contado):{' '}
                    <span className={Number(montoCierre) - resumenCaja.efectivo === 0 ? 'text-green-700' : 'text-red-600'}>
                      ₡{(Number(montoCierre) - resumenCaja.efectivo).toLocaleString()}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}


          <div className="text-right">
            <button
              onClick={cerrarCaja}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={cargando}
            >
              Cerrar Caja
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-yellow-600 text-center">No hay caja abierta actualmente.</p>

          <div>
            <label className="font-semibold block mb-1">Monto de apertura:</label>
            <input
              type="number"
              value={montoApertura}
              onChange={(e) => setMontoApertura(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="₡"
            />
          </div>

          <div className="text-right">
            <button
              onClick={abrirCaja}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={cargando}
            >
              Abrir Caja
            </button>
          </div>
        </>
      )}
    </div>
  );
}