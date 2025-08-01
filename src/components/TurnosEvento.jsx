'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { CalendarPlus, Users, Clock3, UserPlus } from 'lucide-react';

export default function TurnosEvento({ eventoId }) {
  //const { eventoId } = useParams();
  const [turnos, setTurnos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [rolAsignado, setRolAsignado] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  const [modoEdicionTurnoId, setModoEdicionTurnoId] = useState(null);
  const [fechaEdit, setFechaEdit] = useState('');
  const [inicioEdit, setInicioEdit] = useState('');
  const [finEdit, setFinEdit] = useState('');

  const [modoEdicionRolId, setModoEdicionRolId] = useState(null);
  const [nuevoRolEditado, setNuevoRolEditado] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/turnos/evento/${eventoId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTurnos(data));

    fetch(`${API_URL}/usuarios`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, [eventoId]);

  const cargarAsignaciones = async (turnoId) => {
    setTurnoSeleccionado(turnoId);
    const res = await fetch(`${API_URL}/turnos/usuarios/${turnoId}`, {
      credentials: 'include'
    });
    const data = await res.json();
    setAsignaciones(data);
  };

  const asignarUsuario = async () => {
    if (!nuevoUsuario || !rolAsignado) {
      toast.error('Seleccione usuario y rol');
      return;
    }

    const res = await fetch(`${API_URL}/turnos/asignar`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turno_id: turnoSeleccionado,
        usuario_id: nuevoUsuario,
        rol_asignado: rolAsignado
      }),
    });

    if (res.ok) {
      toast.success('Usuario asignado');
      setNuevoUsuario('');
      setRolAsignado('');
      cargarAsignaciones(turnoSeleccionado);
    } else {
      toast.error('Error al asignar usuario');
    }
  };

  const crearTurno = async () => {
    if (!nuevaFecha || !horaInicio || !horaFin) {
      toast.error('Complete todos los campos del turno');
      return;
    }

    const res = await fetch(`${API_URL}/turnos`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evento_id: Number(eventoId),
        fecha: nuevaFecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        asignaciones: []
      }),
    });

    if (res.ok) {
      toast.success('Turno creado');
      setNuevaFecha('');
      setHoraInicio('');
      setHoraFin('');
      const data = await res.json();
      setTurnos(prev => [...prev, {
        id: data.turno_id,
        fecha: nuevaFecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      }]);
    } else {
      toast.error('Error al crear turno');
    }
  };

  const eliminarTurno = async (turnoId) => {
    if (!confirm('¿Desea eliminar este turno?')) return;

    const res = await fetch(`${API_URL}/turnos/${turnoId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      toast.success('Turno eliminado');
      setTurnos(prev => prev.filter(t => t.id !== turnoId));
      if (turnoSeleccionado === turnoId) setTurnoSeleccionado(null);
    } else {
      toast.error('Error al eliminar turno');
    }
  };

  const guardarEdicionTurno = async (turnoId) => {
    const res = await fetch(`${API_URL}/turnos/${turnoId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fecha: fechaEdit,
        hora_inicio: inicioEdit,
        hora_fin: finEdit
      })
    });

    if (res.ok) {
      toast.success('Turno actualizado');
      setTurnos(prev =>
        prev.map(t =>
          t.id === turnoId ? { ...t, fecha: fechaEdit, hora_inicio: inicioEdit, hora_fin: finEdit } : t
        )
      );
      setModoEdicionTurnoId(null);
    } else {
      toast.error('Error al actualizar turno');
    }
  };

  const eliminarAsignacion = async (asignacionId) => {
    if (!confirm('¿Eliminar esta asignación?')) return;
    const res = await fetch(`${API_URL}/turnos/asignacion/${asignacionId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      toast.success('Asignación eliminada');
      cargarAsignaciones(turnoSeleccionado);
    } else {
      toast.error('Error al eliminar asignación');
    }
  };

  const activarEdicionRol = (asignacionId, rolActual) => {
    setModoEdicionRolId(asignacionId);
    setNuevoRolEditado(rolActual);
  };

  const guardarRolEditado = async (asignacionId) => {
    const res = await fetch(`${API_URL}/turnos/asignacion/${asignacionId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol_asignado: nuevoRolEditado }),
    });

    if (res.ok) {
      toast.success('Rol actualizado');
      setModoEdicionRolId(null);
      cargarAsignaciones(turnoSeleccionado);
    } else {
      toast.error('Error al actualizar el rol');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Crear turno */}
      <section className="bg-white border rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-primario flex items-center gap-2">
          <CalendarPlus className="w-5 h-5" />
          Crear nuevo turno
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <button onClick={crearTurno} className="btn-personalizado text-white px-5 py-2 rounded transition w-fit">
          Guardar turno
        </button>
      </section>

      {/* Listado de turnos */}
      <section>
        <h2 className="text-xl font-semibold text-primario mb-4 flex items-center gap-2">
          <Clock3 className="w-5 h-5" />
          Turnos existentes
        </h2>

        <ul className="space-y-4">
          {turnos.map(t => (
            <li key={t.id} className="bg-white border rounded-lg shadow p-5">
              <div className="flex justify-between items-center">
                {modoEdicionTurnoId === t.id ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="date" value={fechaEdit} onChange={(e) => setFechaEdit(e.target.value)} className="border p-1 rounded" />
                    <input type="time" value={inicioEdit} onChange={(e) => setInicioEdit(e.target.value)} className="border p-1 rounded" />
                    <input type="time" value={finEdit} onChange={(e) => setFinEdit(e.target.value)} className="border p-1 rounded" />
                    <button onClick={() => guardarEdicionTurno(t.id)} className="text-green-600 hover:underline text-sm">Guardar</button>
                    <button onClick={() => setModoEdicionTurnoId(null)} className="text-gray-500 hover:underline text-sm">Cancelar</button>
                  </div>
                ) : (
                  <p className="text-gray-800">
                    📅 {new Date(t.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    · 🕒 {new Date(`1970-01-01T${t.hora_inicio}`).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(`1970-01-01T${t.hora_fin}`).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}

                <div className="flex gap-2">
                  <button onClick={() => cargarAsignaciones(t.id)} className="text-blue-600 hover:underline text-sm">Ver / asignar usuarios</button>
                  <button onClick={() => eliminarTurno(t.id)} className="text-red-600 hover:underline text-sm">Eliminar turno</button>
                  <button onClick={() => {
                    setModoEdicionTurnoId(t.id);
                    setFechaEdit(t.fecha);
                    setInicioEdit(t.hora_inicio);
                    setFinEdit(t.hora_fin);
                  }} className="text-orange-600 hover:underline text-sm">Editar turno</button>
                </div>
              </div>

              {turnoSeleccionado === t.id && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" /> Usuarios asignados:
                    </p>
                    {asignaciones.length === 0 ? (
                      <p className="text-gray-500 text-sm">Sin asignaciones</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {asignaciones.map(a => (
                          <li key={a.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span>
                              {a.nombre} — <span className="italic">{a.rol_asignado}</span>
                            </span>
                            <div className="flex gap-2">
                              <button onClick={() => activarEdicionRol(a.id, a.rol_asignado)} className="text-orange-500 text-xs hover:underline">Editar rol</button>
                              <button onClick={() => eliminarAsignacion(a.id)} className="text-red-500 text-xs hover:underline">Eliminar</button>
                            </div>
                            {modoEdicionRolId === a.id && (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={nuevoRolEditado}
                                  onChange={(e) => setNuevoRolEditado(e.target.value)}
                                  className="border p-1 rounded text-xs"
                                />
                                <button onClick={() => guardarRolEditado(a.id)} className="text-green-600 text-xs hover:underline">Guardar</button>
                                <button onClick={() => setModoEdicionRolId(null)} className="text-gray-500 text-xs hover:underline">Cancelar</button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> Asignar nuevo usuario
                    </p>
                    <select value={nuevoUsuario} onChange={(e) => setNuevoUsuario(e.target.value)} className="border p-2 rounded w-full">
                      <option value="">Seleccione usuario</option>
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={rolAsignado}
                      onChange={(e) => setRolAsignado(e.target.value)}
                      placeholder="Ej: Cajero, Apoyo, Supervisor"
                      className="border p-2 rounded w-full"
                    />
                    <button onClick={asignarUsuario} className="btn-personalizado text-white px-4 py-2 rounded transition">Asignar usuario</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
