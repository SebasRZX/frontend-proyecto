'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function EventoNuevo() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [cargando, setCargando] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const crearEvento = async () => {
    if (!nombre || !descripcion || !inicio || !fin) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombre,
          descripcion,
          fecha_inicio: inicio,
          fecha_fin: fin
        }),
      });

      if (res.ok) {
        toast.success('Evento creado correctamente');
        setNombre('');
        setDescripcion('');
        setInicio('');
        setFin('');
      } else {
        toast.error('Error al crear el evento');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-vino-sacerdotal">Crear nuevo evento</h2>

      <div>
        <label className="block font-semibold mb-1">Nombre del evento:</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-vino-sacerdotal"
          placeholder="Ej. Festival de Navidad"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-vino-sacerdotal"
          placeholder="Breve descripción del evento"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Fecha de inicio:</label>
          <input
            type="date"
            value={inicio}
            onChange={e => setInicio(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-vino-sacerdotal"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Fecha de fin:</label>
          <input
            type="date"
            value={fin}
            onChange={e => setFin(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-vino-sacerdotal"
          />
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={crearEvento}
          disabled={cargando}
          className="bg-vino-sacerdotal hover:bg-vino-claro text-white font-semibold px-6 py-2 rounded transition disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : 'Guardar Evento'}
        </button>
      </div>
    </div>
  );
}
