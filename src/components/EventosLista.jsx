'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, ArrowRight, Pencil, Trash2, X, Lock, Unlock } from 'lucide-react';

export default function EventosLista() {
  const [eventos, setEventos] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    const res = await fetch(`${API_URL}/eventos`, { credentials: 'include' });
    const data = await res.json();
    setEventos(data);
  };

  const formatearFecha = (iso) =>
    new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso));

  const abrirModalEditar = (evento) => {
    setEventoEditando(evento.id);
    setFormEdit({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha_inicio: evento.fecha_inicio.split('T')[0],
      fecha_fin: evento.fecha_fin.split('T')[0],
    });
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    const res = await fetch(`${API_URL}/eventos/${eventoEditando}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formEdit),
    });

    if (res.ok) {
      setMostrarModal(false);
      setEventoEditando(null);
      cargarEventos();
    } else {
      alert('Error al actualizar el evento');
    }
  };

  const eliminarEvento = async (id) => {
    if (!confirm('¿Desea eliminar este evento?')) return;
    const res = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) cargarEventos();
    else alert('Error al eliminar evento');
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    const res = await fetch(`${API_URL}/eventos/${id}/estado`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (res.ok) {
      cargarEventos();
    } else {
      alert('Error al cambiar estado del evento');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primario mb-6">📋 Eventos de Venta</h2>

      {eventos.length === 0 ? (
        <div className="text-center text-gray-500 italic py-10">No hay eventos registrados.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((ev) => (
            <div
              key={ev.id}
              className="relative bg-white border border-gray-200 shadow-sm rounded-lg p-5 transition hover:shadow-md group"
            >
              <h3 className="text-lg font-semibold text-gray-800 group-hover:underline">{ev.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{ev.descripcion}</p>

              <div className="flex items-center text-sm text-gray-600 gap-2 mb-2">
                <CalendarDays className="w-4 h-4" />
                <span>
                  {formatearFecha(ev.fecha_inicio)} – {formatearFecha(ev.fecha_fin)}
                </span>
              </div>

              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  ev.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {ev.estado}
              </span>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => router.push(`/turnos/${ev.id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <ArrowRight className="w-4 h-4" /> Ver turnos
                </button>

                <div className="flex gap-2">
                  <button onClick={() => abrirModalEditar(ev)} className="text-sm text-blue-600 hover:text-blue-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => eliminarEvento(ev.id)} className="text-sm text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      cambiarEstado(ev.id, ev.estado === 'activo' ? 'inactivo' : 'activo')
                    }
                    className={`text-sm ${
                      ev.estado === 'activo'
                        ? 'text-yellow-600 hover:text-yellow-800'
                        : 'text-green-600 hover:text-green-800'
                    }`}
                    title={ev.estado === 'activo' ? 'Desactivar evento' : 'Activar evento'}
                  >
                    {ev.estado === 'activo' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal flotante */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-primario mb-4">Editar Evento</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                rows="3"
                placeholder="Descripción"
                value={formEdit.descripcion}
                onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formEdit.fecha_inicio}
                  onChange={(e) => setFormEdit({ ...formEdit, fecha_inicio: e.target.value })}
                  className="w-1/2 border rounded px-3 py-2"
                />
                <input
                  type="date"
                  value={formEdit.fecha_fin}
                  onChange={(e) => setFormEdit({ ...formEdit, fecha_fin: e.target.value })}
                  className="w-1/2 border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={guardarCambios}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
