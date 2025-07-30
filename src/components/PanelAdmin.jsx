'use client';
import { useRouter } from 'next/navigation';
import {
  PackageCheck,
  FileBarChart,
  Users,
  Boxes,
  Clock,
  ShoppingCart,
} from 'lucide-react';

export default function PanelAdmin({ usuario }) {
  const router = useRouter();

  const botonesAdmin = [
    {
      nombre: 'Inventario',
      ruta: '/inventario',
      icono: <PackageCheck size={32} color="black" />,
      color: 'bg-blue-100',
    },
    {
      nombre: 'Cajas y Reportes',
      ruta: '/caja',
      icono: <FileBarChart size={32} color="black" />,
      color: 'bg-yellow-100',
    },
    {
      nombre: 'Gestión de Usuarios',
      ruta: '/usuarios',
      icono: <Users size={32} color="black" />,
      color: 'bg-green-100',
    },
    {
      nombre: 'Gestión de Productos',
      ruta: '/productos',
      icono: <Boxes size={32} color="black" />,
      color: 'bg-purple-100',
    },
    {
      nombre: 'Eventos y Roles',
      ruta: '/turnos',
      icono: <Clock size={32} color="black" />,
      color: 'bg-pink-100',
    },
    {
      nombre: 'Ventas',
      ruta: '/ventas',
      icono: <ShoppingCart size={32} color="black" />,
      color: 'bg-orange-100',
    },
  ];

  const botonesVoluntario = [
    {
      nombre: 'Ventas',
      ruta: '/ventas',
      icono: <ShoppingCart size={32} color="black" />,
      color: 'bg-orange-100',
    },
  ];

  const botones = (usuario.rol === 'admin' || usuario.rol === 'coordinador')
    ? botonesAdmin
    : botonesVoluntario;

  return (
    <div className="flex-grow bg-fondo p-6 relative">
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-primario">
          Panel de Administración
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {botones.map((btn) => (
          <button
            key={btn.nombre}
            onClick={() => btn.ruta && router.push(btn.ruta)}
            className={`${btn.color} text-black flex flex-col items-center justify-center font-semibold py-6 rounded-2xl shadow-md hover:scale-105 transition-transform`}
          >
            {btn.icono}
            <span className="mt-3 text-lg text-center">{btn.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}