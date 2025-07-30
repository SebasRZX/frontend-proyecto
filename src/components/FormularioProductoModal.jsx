'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function FormularioProductoModal({ producto, onCerrar, onActualizado }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    categoria_id: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        cantidad: producto.cantidad || '',
        categoria_id: producto.categoria_id || '',
      });
    }

    const fetchCategorias = async () => {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(data);
    };

    fetchCategorias();
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    if (imagen) formData.append('imagen', imagen);

    try {
      const res = await fetch(`${API_URL}/productos/${producto.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        onActualizado();
        onCerrar();
      } else {
        console.error('Error al actualizar producto');
      }
    } catch (err) {
      console.error('Error al enviar formulario:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Producto</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen actual</label>
              {producto.imagen_url ? (
                <img
                  src={`http://localhost:4000/uploads/${producto.imagen_url}`}
                  alt="Imagen del producto"
                  className="w-24 h-24 object-cover rounded-md border mb-2"
                />
              ) : (
                <p className="text-gray-500 text-sm">Este producto no tiene imagen.</p>
              )}

              <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                Cambiar imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

