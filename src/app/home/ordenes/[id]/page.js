"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DetallePedidoPage() {

  const { id } = useParams()
  const router = useRouter()

  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    fetchPedido()
  }, [])

  async function fetchPedido() {

    const { data: orden } = await supabase
      .from("ordenes")
      .select(`
        id,
        fecha,
        estado,
        metodo_pago,
        clientes ( nombre )
      `)
      .eq("id", id)
      .single()

    const { data: detalles } = await supabase
      .from("detalle_orden")
      .select(`
        cantidad,
        subtotal,
        descripcion,
        imagen_url,
        sabor,
        tamaño,
        productos ( nombre )
      `)
      .eq("orden_id", id)

    const productos = (detalles || []).map(d => {

      const esPersonalizado = !d.productos

      return {
        nombre: esPersonalizado
          ? "🎂 Pastel personalizado"
          : d.productos?.nombre,

        cantidad: d.cantidad,
        total: d.subtotal,
        descripcion: d.descripcion,
        imagen_url: d.imagen_url,
        sabor: d.sabor,
        tamaño: d.tamaño,
        personalizado: esPersonalizado
      }
    })

    setPedido({
      id: orden.id,
      cliente: orden.clientes?.nombre || "Sin cliente",
      fecha: orden.fecha,
      status: orden.estado,
      payment: orden.metodo_pago || "N/A",
      productos
    })
  }

  if (!pedido) return <div className="p-6 text-black">Cargando...</div>

  const estados = ["Pendiente", "En preparación", "Listo", "Entregado"]

  const cambiarEstado = async () => {

    const index = estados.indexOf(pedido.status)
    if (index >= estados.length - 1) return

    const nuevoEstado = estados[index + 1]

    await supabase
      .from("ordenes")
      .update({ estado: nuevoEstado })
      .eq("id", pedido.id)

    setPedido({ ...pedido, status: nuevoEstado })
    router.refresh()
  }

  const cancelarPedido = async () => {

    await supabase
      .from("detalle_orden")
      .delete()
      .eq("orden_id", pedido.id)

    await supabase
      .from("ordenes")
      .delete()
      .eq("id", pedido.id)

    alert("Pedido eliminado 💀")
    router.push("/home/ordenes")
  }

  const totalGeneral = pedido.productos.reduce(
    (acc, item) => acc + item.total,
    0
  )

  const getStatusColor = (estado) => {
    if (estado === "Pendiente") return "bg-yellow-200 text-yellow-800"
    if (estado === "En preparación") return "bg-blue-200 text-blue-800"
    if (estado === "Listo") return "bg-green-200 text-green-800"
    if (estado === "Entregado") return "bg-emerald-300 text-emerald-900"
    if (estado === "Cancelado") return "bg-red-200 text-red-800"
  }

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border text-black hover:bg-gray-100"
        >
          ← Regresar
        </button>

        <h1 className="text-3xl font-semibold text-black">
          Detalles del pedido
        </h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md space-y-8">

        {/* INFO */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Orden ID</p>
            <h3 className="text-lg font-semibold text-black">
              #{pedido.id}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(pedido.status)}`}>
              {pedido.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <h3 className="text-lg font-semibold text-black">
              {pedido.cliente}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <h3 className="text-lg font-semibold text-black">
              {pedido.fecha}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Método de pago</p>
            <h3 className="text-lg font-semibold text-black">
              {pedido.payment}
            </h3>
          </div>

        </div>

        {/* TIMELINE */}
        {pedido.status !== "Cancelado" && (
          <>
            <div className="flex justify-between pt-6 border-t">
              {estados.map((estado, index) => {

                const activo = estados.indexOf(pedido.status) >= index

                return (
                  <div key={estado} className="flex-1 text-center">
                    <div className={`w-8 h-8 mx-auto rounded-full 
                      ${activo ? "bg-[#b89c80]" : "bg-gray-300"}`} />
                    <p className="text-sm mt-2 text-black">{estado}</p>
                  </div>
                )
              })}
            </div>

            <button
              onClick={cambiarEstado}
              className="px-6 py-2 bg-gray-200 rounded-lg text-black"
            >
              Avanzar estado
            </button>
          </>
        )}

        {/* CANCELAR */}
        <div className="flex justify-end">
          <button
            onClick={cancelarPedido}
            className="px-6 py-2 bg-red-500 text-white rounded-xl"
          >
            Cancelar pedido
          </button>
        </div>

        {/* PRODUCTOS */}
        <div className="space-y-6 pt-6 border-t">

          {pedido.productos.map((item, index) => (
            <div key={index} className="bg-[#f7f3ef] p-4 rounded-xl space-y-3">

              {/* TITULO */}
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-black text-lg">
                  {item.nombre}
                </h3>
                <span className="font-bold text-black">
                  ${item.total}
                </span>
              </div>

              {/* IMAGEN */}
              {item.imagen_url && (
                <img
                  src={item.imagen_url}
                  className="w-full max-w-xs rounded-xl shadow-md border"
                />
              )}

              {/* DETALLES */}
              {item.personalizado && (
                <div className="text-sm text-gray-700 space-y-1">

                  {item.descripcion && (
                    <p>📝 {item.descripcion}</p>
                  )}

                  {item.sabor && (
                    <p>🍫 Sabor: <strong>{item.sabor}</strong></p>
                  )}

                  {item.tamaño && (
                    <p>📏 Tamaño: <strong>{item.tamaño}</strong></p>
                  )}

                </div>
              )}

              <p className="text-sm text-gray-500">
                Cantidad: {item.cantidad}
              </p>

            </div>
          ))}

        </div>

        {/* TOTAL */}
        <div className="flex justify-between text-xl font-bold text-black border-t pt-4">
          <span>Total</span>
          <span>${totalGeneral}</span>
        </div>

      </div>
    </div>
  )
}