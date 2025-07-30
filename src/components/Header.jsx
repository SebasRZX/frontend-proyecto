//Header
'use client';

import { useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { usuario, setUsuario } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogout = async () => {
    await fetch(`${API_URL}/usuarios/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUsuario(null);
    setMostrarModal(false);

    // Espera 300ms antes de redirigir
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  return (
    <>
      <header className="bg-vino-sacerdotal shadow-md dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            Centro Parroquial
          </h1>
          <nav className="flex gap-4 items-center">
            <a href="/" className="text-sm text-gray-200 hover:text-primario font-medium">
              Inicio
            </a>

            {(usuario?.rol === 'admin' || usuario?.rol === 'coordinador') && (
              <a href="/admin" className="text-sm text-gray-200 hover:text-primario font-medium">
                Panel administrador
              </a>
            )}

            {!usuario && (
              <a
                href="/login"
                className="text-sm text-white hover:text-yellow-300 font-semibold"
              >
                Iniciar sesión
              </a>
            )}

            {usuario && (
              <button
                onClick={() => setMostrarModal(true)}
                className="flex items-center gap-1 text-sm text-white hover:text-red-300 font-semibold"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Modal de Confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-gris-piedra rounded-xl shadow-lg p-6 w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setMostrarModal(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ¿Desea cerrar sesión?
            </h2>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
