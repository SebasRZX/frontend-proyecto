'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function FormularioUsuario({ usuarioEditado, onGuardado }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState({
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    usuario: '',
    contrasena: '',
    rol: 'voluntario',
    estado: 'activo',
  });

  useEffect(() => {
    if (usuarioEditado) {
      setForm({
        nombre: usuarioEditado.nombre,
        primer_apellido: usuarioEditado.primer_apellido,
        segundo_apellido: usuarioEditado.segundo_apellido,
        usuario: usuarioEditado.usuario,
        contrasena: '',
        rol: usuarioEditado.rol,
        estado: usuarioEditado.estado,
      });
    } else {
      setForm({
        nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        usuario: '',
        contrasena: '',
        rol: 'voluntario',
        estado: 'activo',
      });
    }
  }, [usuarioEditado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = usuarioEditado
      ? `${API_URL}/usuarios/${usuarioEditado.id}`
      : `${API_URL}/usuarios`;

    const method = usuarioEditado ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error en el servidor');

      toast.success(usuarioEditado ? 'Usuario editado correctamente' : 'Usuario creado correctamente');
      onGuardado();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gris-piedra p-6 rounded-xl shadow-md max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-vino-sacerdotal">{usuarioEditado ? 'Editar Usuario' : 'Crear Usuario'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="p-2 border rounded"
          required
        />
        <input
          name="primer_apellido"
          value={form.primer_apellido}
          onChange={handleChange}
          placeholder="Primer Apellido"
          className="p-2 border rounded"
          required
        />
        <input
          name="segundo_apellido"
          value={form.segundo_apellido}
          onChange={handleChange}
          placeholder="Segundo Apellido"
          className="p-2 border rounded"
        />
        <input
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
          placeholder="Usuario"
          className="p-2 border rounded"
          required
          disabled={!!usuarioEditado}
        />
        <input
          type="password"
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          placeholder={usuarioEditado ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
          className="p-2 border rounded"
          {...(!usuarioEditado && { required: true })}
        />
        <select name="rol" value={form.rol} onChange={handleChange} className="p-2 border rounded" required>
          <option value="admin">Admin</option>
          <option value="coordinador">Coordinador</option>
          <option value="voluntario">Voluntario</option>
        </select>
        <select name="estado" value={form.estado} onChange={handleChange} className="p-2 border rounded" required>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="bg-oro-liturgico border text-white px-4 py-2 rounded btn-personalizado"
        >
          {usuarioEditado ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-white border px-4 py-2 rounded btn-personalizado"
        >
          Volver al Panel
        </button>
      </div>
    </form>
  );
}
