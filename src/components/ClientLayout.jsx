'use client';

import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import { AuthProvider } from '@/context/AuthContext'; // Asegúrate que la ruta sea correcta
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const esInicio = pathname === '/';

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main
          className={`flex-grow ${
            esInicio ? "bg-cover bg-center" : ""
          }`}
          style={esInicio ? { backgroundImage: "url('/fondo1.jpeg')" } : {}}
        >
          {children}
        </main>

        <footer className="bg-vino-sacerdotal dark:bg-gray-800 text-center text-sm py-4 text-white dark:text-gray-300">
          © {currentYear} Sistema Ventas Centro Parroquial. Todos los derechos reservados.
        </footer>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}
