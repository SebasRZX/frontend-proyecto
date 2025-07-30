'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormularioProducto() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    categoria_id: '',
    imagen: null,
  });

  const [categorias, setCategorias] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categorias`);
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        toast.error('No se pudieron cargar las categorías');
      }
    };

    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setForm((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    }

    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        toast.success('Producto guardado con éxito');
        setForm({
          nombre: '',
          descripcion: '',
          precio: '',
          cantidad: '',
          categoria_id: '',
          imagen: null,
        });
      } else {
        const errorText = await res.text();
        console.error('Error al guardar producto:', errorText);
        toast.error('Error al guardar producto');
      }
    } catch (err) {
      console.error('Error en la solicitud:', err);
      toast.error('Error de red al guardar producto');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-oro-liturgico p-6 rounded shadow max-w-xl mx-auto mt-10"
    >
      <h2 className="text-xl font-bold text-center text-vino-sacerdotal">Crear Producto</h2>

      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="p-2 border rounded w-full"
        required
      />
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="p-2 border rounded w-full"
      />
      <input
        type="number"
        name="precio"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
        className="p-2 border rounded w-full"
        required
      />
      <input
        type="number"
        name="cantidad"
        value={form.cantidad}
        onChange={handleChange}
        placeholder="Cantidad"
        className="p-2 border rounded w-full"
        required
      />
      <select
        name="categoria_id"
        value={form.categoria_id}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        required
      >
        <option value="">Seleccione una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="p-2 border rounded w-full"
      />

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-white px-4 py-2 border rounded btn-personalizado"
        >
          Volver al panel
        </button>
        <button
          type="submit"
          className="text-white px-4 border py-2 rounded btn-personalizado"
        >
          Crear Producto
        </button>
      </div>
    </form>
  );
}
