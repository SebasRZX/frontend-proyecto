'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function FormularioVenta({ usuario }) {
  const [eventoId, setEventoId] = useState(null);
  const [productos, setProductos] = useState([]);
  const [venta, setVenta] = useState([]);
  const [total, setTotal] = useState(0);
  const [formaPago, setFormaPago] = useState('efectivo');
  const [montoPagado, setMontoPagado] = useState('');
  const [comprobanteSinpe, setComprobanteSinpe] = useState('');
  const [nombre_cliente, setNombre_Cliente] = useState('');
  const [vuelto, setVuelto] = useState(null);
  const [keyFormulario, setKeyFormulario] = useState(Date.now());

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔶 1. Obtener evento activo al montar
  useEffect(() => {
    const obtenerEventoActivo = async () => {
      try {
        const res = await fetch(`${API_URL}/eventos/activo`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('No hay evento activo');
        const data = await res.json();
        setEventoId(data.id);
      } catch (err) {
        console.error('Error al obtener evento activo:', err);
        toast.error('No hay evento activo disponible.');
      }
    };

    obtenerEventoActivo();
  }, []);

  // 🔶 2. Obtener productos
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        toast.error('Error al cargar productos');
      }
    };

    cargarProductos();
  }, []);

  // 🔶 3. Calcular total
  useEffect(() => {
    const totalCalculado = venta.reduce((acc, item) => {
      const extra = item.paraLlevar ? 100 * item.cantidad : 0;
      return acc + item.precio * item.cantidad + extra;
    }, 0);
    setTotal(totalCalculado);
  }, [venta]);

  const agregarProducto = (producto) => {
    setVenta((prev) => [...prev, { ...producto, cantidad: 1, paraLlevar: false }]);
  };

  const cambiarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setVenta((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const toggleParaLlevar = (index) => {
    setVenta((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, paraLlevar: !item.paraLlevar } : item
      )
    );
  };

  const eliminarProducto = (index) => {
    setVenta((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔶 4. Enviar venta
  const enviarVenta = async () => {
    if (!eventoId) {
      toast.error('No hay evento activo para asociar la venta');
      return;
    }

    if (!nombre_cliente.trim()) {
      toast.error('Debe ingresar el nombre del cliente');
      return;
    }

    if (formaPago === 'efectivo' && (!montoPagado || Number(montoPagado) < total)) {
      toast.error('Debe ingresar un monto válido para el pago en efectivo');
      return;
    }

    if (formaPago === 'sinpe' && comprobanteSinpe.trim() === '') {
      toast.error('Debe ingresar el comprobante de la transferencia SINPE');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: venta.map((p) => ({
            id: p.id,
            cantidad: p.cantidad,
            precio: p.precio,
            paraLlevar: p.paraLlevar,
          })),
          forma_pago: formaPago,
          comprobante: formaPago === 'sinpe' ? comprobanteSinpe : null,
          monto_pagado: formaPago === 'efectivo' ? Number(montoPagado) : null,
          nombre_cliente: nombre_cliente.trim(),
          evento_id: eventoId, // 🔥 Ya no viene de useParams
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar la venta');

      toast.success('Venta registrada con éxito');

      if (formaPago === 'efectivo' && data.vuelto !== undefined) {
        setVuelto(data.vuelto);
        toast.info(`Vuelto: ₡${Number(data.vuelto).toLocaleString()}`);
        setTimeout(() => setVuelto(null), 4000);
      }

      // Resetear formulario
      setVenta([]);
      setTotal(0);
      setFormaPago('efectivo');
      setMontoPagado('');
      setComprobanteSinpe('');
      setNombre_Cliente('');
      setKeyFormulario(Date.now());

      // Abrir PDF comanda
      setTimeout(() => {
        window.open(`${API_URL}/comandas/${data.venta_id}`, '_blank');
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error('Error al procesar la venta, no hay caja abierta');
    }
  };

  return (
    <div key={keyFormulario} className="max-w-5xl mx-auto p-6 bg-gris-piedra shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-black">Realizar Venta</h2>

      <div>
        <label className="font-semibold block mb-1">Nombre del Cliente:</label>
        <input
          type="text"
          value={nombre_cliente}
          onChange={(e) => setNombre_Cliente(e.target.value)}
          placeholder="Ej: María Rodríguez"
          className="border p-2 rounded w-full sm:w-96"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div
            key={p.id + Math.random()}
            className={`border rounded p-3 hover:bg-gray-50 cursor-pointer relative ${p.cantidad <= 10 ? 'border-red-500' : ''
              }`}
            onClick={() => agregarProducto(p)}
          >
            <p className="font-semibold">{p.nombre}</p>
            <p className="text-sm text-gray-600">₡{p.precio}</p>

            {p.cantidad <= 10 && (
              <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                Stock bajo ({p.cantidad})
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Productos Seleccionados</h3>
        {venta.length === 0 ? (
          <p className="text-gray-500">No hay productos aún.</p>
        ) : (
          <table className="w-full text-left border-t">
            <thead>
              <tr className="text-gray-700">
                <th className="py-2">Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Para llevar</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {venta.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{item.nombre}</td>
                  <td>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(index, parseInt(e.target.value))
                      }
                      className="w-16 border rounded p-1"
                      min="1"
                    />
                  </td>
                  <td>₡{item.precio}</td>
                  <td>
                    ₡
                    {(
                      item.precio * item.cantidad +
                      (item.paraLlevar ? 100 * item.cantidad : 0)
                    ).toLocaleString()}
                    {item.paraLlevar && (
                      <span className="block text-xs text-gray-500">
                        (+₡{100 * item.cantidad} por empaque)
                      </span>
                    )}
                  </td>
                  <td>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={item.paraLlevar}
                        onChange={() => toggleParaLlevar(index)}
                      />
                      Para llevar
                    </label>
                  </td>
                  <td>
                    <button
                      onClick={() => eliminarProducto(index)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-right text-xl font-bold text-primario">
        Total: ₡{total.toLocaleString()}
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-semibold block mb-1">Forma de Pago:</label>
          <select
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}
            className="border p-2 rounded w-full sm:w-64"
          >
            <option value="efectivo">Efectivo</option>
            <option value="sinpe">Transferencia SINPE</option>
          </select>
        </div>

        {formaPago === 'efectivo' && (
          <div>
            <label className="font-semibold block mb-1">Monto entregado:</label>
            <input
              type="number"
              min={total}
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              className="border p-2 rounded w-full sm:w-64"
            />
            {montoPagado && Number(montoPagado) >= total && (
              <p className="mt-1 text-green-600 font-medium">
                Vuelto: ₡{(Number(montoPagado) - total).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {formaPago === 'sinpe' && (
          <div>
            <label className="font-semibold block mb-1">Comprobante SINPE:</label>
            <input
              type="text"
              value={comprobanteSinpe}
              onChange={(e) => setComprobanteSinpe(e.target.value)}
              placeholder="Ej: SINPE #123456"
              className="border p-2 rounded w-full sm:w-96"
              autoComplete="off"
            />
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          onClick={enviarVenta}
          disabled={venta.length === 0}
          className="bg-oro-liturgico text-white px-6 py-2 rounded btn-personalizado disabled:opacity-50"
        >
          Confirmar Venta
        </button>

        {vuelto !== null && formaPago === 'efectivo' && (
          <div className="mt-2 text-green-700 font-semibold">
            Vuelto entregado: ₡{Number(vuelto).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
