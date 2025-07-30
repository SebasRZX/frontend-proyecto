'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, User } from 'lucide-react';

export default function ReporteCajas() {
  const [cajas, setCajas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/usuarios`, { credentials: 'include' })
      .then(res => res.json())
      .then(setUsuarios);
  }, []);

  const cargarCajas = async () => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) {
      // Incluir toda la fecha hasta el final del día
      const fechaFinCompleta = fechaFin + 'T23:59:59';
      params.append('fecha_fin', fechaFinCompleta);
    }
    if (usuarioId) params.append('usuario_id', usuarioId);

    const res = await fetch(`${API_URL}/caja/reporte?${params.toString()}`, {
      credentials: 'include',
    });
    const data = await res.json();
    setCajas(data);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primario">📊 Reporte de Cajas</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <select
            value={usuarioId}
            onChange={e => setUsuarioId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={cargarCajas}
        className="btn-personalizado px-4 py-2 text-white rounded"
      >
        Buscar
      </button>

      <div className="space-y-4">
        {cajas.length === 0 ? (
          <p className="text-gray-500 italic">No hay resultados para mostrar.</p>
        ) : (
          cajas.map((caja) => (
            <div key={caja.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Usuario:</strong> {caja.nombre_usuario || 'Desconocido'}<br />
                <strong>Estado:</strong> {caja.estado}<br />
                <strong>Apertura:</strong> {new Date(caja.fecha_apertura).toLocaleString('es-CR')}<br />
                {caja.estado === 'cerrada' && (
                  <>
                    <strong>Cierre:</strong> {new Date(caja.fecha_cierre).toLocaleString('es-CR')}<br />
                    <strong>Monto Apertura:</strong> ₡{caja.monto_apertura}<br />
                    <strong>Monto Cierre:</strong> ₡{caja.monto_cierre}<br />
                    <strong>Observaciones:</strong> {caja.observaciones || 'Ninguna'}
                  </>
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
