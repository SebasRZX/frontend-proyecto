'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, Pencil, Trash2, RotateCcw, Ban } from 'lucide-react';
import FormularioProductoModal from './FormularioProductoModal';

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    cargarProductos();
  }, [mostrarInactivos]);

  const cargarProductos = async () => {
    try {
      const url = mostrarInactivos
        ? `${API_URL}/productos/inactivos`
        : `${API_URL}/productos`;

      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Desea eliminar este producto?')) return;
    try {
      await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      cargarProductos();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const restaurarProducto = async (id) => {
    if (!confirm('¿Desea restaurar este producto?')) return;
    try {
      await fetch(`${API_URL}/productos/restaurar/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });
      cargarProductos();
    } catch (err) {
      console.error('Error al restaurar producto:', err);
    }
  };

  const getStockColor = (cantidad) => {
    if (cantidad === 0) return 'bg-red-100 text-red-700';
    if (cantidad < 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {mostrarInactivos ? 'Productos inactivos' : 'Productos activos'}
        </h2>
        <button
          onClick={() => setMostrarInactivos(!mostrarInactivos)}
          className="btn-personalizado text-sm text-white px-4 py-2 rounded-lg shadow"
        >
          {mostrarInactivos ? 'Ver activos' : 'Ver inactivos'}
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 py-16 col-span-full">
          <Ban size={48} className="mb-4 text-red-400" />
          <p className="text-lg font-semibold">
            {mostrarInactivos
              ? 'No hay productos inactivos para mostrar.'
              : 'No hay productos activos disponibles.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg border border-gray-200"
            >
              {producto.imagen_url && (
                <img
                  src={`http://localhost:4000/uploads/${producto.imagen_url}`}
                  alt={producto.nombre}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{producto.nombre}</h3>
                <p className="text-sm text-gray-500 mb-2">{producto.descripcion}</p>

                <p className="text-gray-800 font-medium text-sm">
                  Precio: <span className="text-primario font-bold">₡{producto.precio}</span>
                </p>
                <p className="text-sm text-gray-600">Categoría: {producto.categoria || 'N/A'}</p>

                <div
                  className={`text-xs inline-block px-2 py-1 mt-2 rounded-full font-medium ${getStockColor(
                    producto.cantidad
                  )}`}
                >
                  Stock: {producto.cantidad}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  {mostrarInactivos ? (
                    <button
                      onClick={() => restaurarProducto(producto.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded transition"
                    >
                      <RotateCcw size={16} />
                      Restaurar
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setProductoEditando(producto)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded transition"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded transition"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {productoEditando && (
        <FormularioProductoModal
          producto={productoEditando}
          onCerrar={() => setProductoEditando(null)}
          onActualizado={cargarProductos}
        />
      )}
    </div>
  );
}