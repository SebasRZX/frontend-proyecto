'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ReporteVentasEvento() {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [reporte, setReporte] = useState(null);
   const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Obtener lista de eventos
    const fetchEventos = async () => {
      try {
        const res = await fetch(`${API_URL}/eventos`, {
          credentials: 'include',
        });
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        toast.error('Error al cargar eventos');
      }
    };

    fetchEventos();
  }, []);

  const obtenerReporte = async () => {
    if (!eventoSeleccionado || !desde || !hasta) {
      toast.warning('Debe seleccionar evento y rango de fechas');
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/ventas/reporte?evento_id=${eventoSeleccionado}&desde=${desde}&hasta=${hasta}`,
        { credentials: 'include' }
      );

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Error al generar reporte');
        return;
      }

      const data = await res.json();
      setReporte(data);
    } catch (err) {
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-vino-sacerdotal">Reporte de Ventas por Evento</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
          <select
            value={eventoSeleccionado}
            onChange={(e) => setEventoSeleccionado(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          >
            <option value="">Seleccione un evento</option>
            {eventos.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={obtenerReporte}
          className="bg-vino-sacerdotal text-white px-6 py-2 rounded-lg hover:bg-vino-claro transition"
        >
          Generar Reporte
        </button>
      </div>

      {reporte && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Resultados del reporte:</h3>
          <p><strong>Total de ventas:</strong> {reporte.total_ventas}</p>
          <p><strong>Monto total:</strong> ₡{reporte.monto_total?.toLocaleString() || 0}</p>
          <p><strong>Ventas en efectivo:</strong> ₡{reporte.total_efectivo?.toLocaleString() || 0}</p>
          <p><strong>Ventas por SINPE:</strong> ₡{reporte.total_sinpe?.toLocaleString() || 0}</p>
        </div>
      )}
    </div>
  );
}