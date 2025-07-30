'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FormularioUsuario from '@/components/FormularioUsuario';

export default function UsuariosPage() {
  const { usuario, cargando } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Protección de acceso
  useEffect(() => {
    if (!cargando && (!usuario || !['admin', 'coordinador'].includes(usuario.rol))) {
      router.push('/'); // o '/login'
    }

    if (!cargando && usuario && ['admin', 'coordinador'].includes(usuario.rol)) {
      obtenerUsuarios();
    }
  }, [usuario, cargando, router]);

  const obtenerUsuarios = async () => {
    const res = await fetch(`${API_URL}/usuarios`, {
      credentials: 'include',
    });
    const data = await res.json();
    setUsuarios(data);
  };

  const eliminarUsuario = async (id) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    obtenerUsuarios();
  };

  const handleGuardado = () => {
    setUsuarioEditado(null);
    obtenerUsuarios();
  };

  // Esperar a que se cargue la sesión
  if (cargando || !usuario) return null;

  return (
    <div className="min-h-screen bg-gris-piedra p-6">
      <h1 className="text-2xl font-bold mb-6 text-vino-sacerdotal text-center">Gestión de Usuarios</h1>

      {!usuarioEditado && (
        <div className="max-w-3xl mx-auto bg-oro-liturgico p-6 rounded-xl shadow mb-10">
          <h2 className="text-lg font-semibold mb-4 text-vino-sacerdotal">Crear nuevo usuario</h2>
          <FormularioUsuario onGuardado={handleGuardado} />
        </div>
      )}

      {usuarioEditado && (
        <div className="max-w-3xl mx-auto bg-oro-liturgico p-6 rounded-xl shadow mb-10">
          <FormularioUsuario usuarioEditado={usuarioEditado} onGuardado={handleGuardado} />
          <button
            onClick={() => setUsuarioEditado(null)}
            className="mt-4 px-4 text-white py-2 border rounded btn-personalizado"
          >
            Cancelar edición
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-oro-liturgico p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-vino-sacerdotal">Usuarios existentes</h2>
        <ul className="divide-y">
          {usuarios.map((u) => (
            <li key={u.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-vino-sacerdotal">
                  {u.nombre} ({u.usuario})
                </p>
                <p className="text-sm text-gray-600">
                  Rol: {u.rol} | Estado: {u.estado}
                </p>
              </div>
              <div>
                <button
                  onClick={() => setUsuarioEditado(u)}
                  className="text-white hover:underline mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarUsuario(u.id)}
                  className="text-vino-sacerdotal hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
