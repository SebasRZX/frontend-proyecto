'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // ✅ importa el contexto

export default function LoginPage() {
  const [usuario, setUsuarioInput] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const { setUsuario } = useAuth(); // ✅ obtiene el setter global

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ usuario, contrasena }),
    });

    if (res.ok) {
      //verifica al backend y actualiza el contexto global
      const verificar = await fetch(`${API_URL}/usuarios/verificar`, {
        credentials: 'include',
      });

      const data = await verificar.json();
      setUsuario(data.usuario); // actualiza el contexto global
      router.push('/admin');
    } else {
      const data = await res.json();
      setMensaje(data.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-gris-piedra dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Iniciar Sesión
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
            Usuario
          </label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuarioInput(e.target.value)}
            placeholder="Ingrese su usuario"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primario"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Ingrese su contraseña"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primario"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-vino-sacerdotal btn-personalizado transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Entrar
        </button>

        {mensaje && (
          <p className="text-sm text-red-600 mt-4 text-center">{mensaje}</p>
        )}
      </form>
    </div>
  );
}
