"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function DetallePedidoPage() {

  const { id } = useParams()
  const router = useRouter()

  const [pedido, setPedido] = useState({
    id: id,
    cliente: "AXEL",
    fecha: "04/04/2025",
    status: "Pendiente",
    payment: "Online",
    productos: [
      {
        nombre: "Pastel chocolate",
        cantidad: 1,
        total: 4.3,
      },
      {
        nombre: "Pastel personalizado",
        cantidad: 1,
        total: 50,
        personalizado: true,
        descripcion: "Pastel de cumpleaños con flores",
        sabor: "Chocolate",
        tamaño: "2 pisos",
        imagen_url: "/ejemplo.jpg"
      }
    ]
  })

  const estados = ["Pendiente", "En preparación", "Listo", "Entregado"]

  const cambiarEstado = () => {
    if (pedido.status === "Cancelado") return
    const index = estados.indexOf(pedido.status)
    if (index < estados.length - 1) {
      setPedido({ ...pedido, status: estados[index + 1] })
    }
  }

  const cancelarPedido = () => {
    if (pedido.status === "Cancelado") return
    setPedido({ ...pedido, status: "Cancelado" })
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
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-gray-300 
                       text-black hover:bg-gray-100 transition"
          >
            ← Regresar
          </button>

          <h1 className="text-3xl font-semibold text-black">
            Detalles del pedido
          </h1>
        </div>

      </div>

      {/* CARD */}
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
            <div className="flex justify-between items-center pt-6 border-t">
              {estados.map((estado, index) => {

                const activo = estados.indexOf(pedido.status) >= index

                return (
                  <div key={estado} className="flex-1 text-center">
                    <div className={`w-8 h-8 mx-auto rounded-full 
                      ${activo ? "bg-[#b89c80]" : "bg-gray-300"}`} />
                    <p className="text-sm mt-2 text-black">
                      {estado}
                    </p>
                  </div>
                )
              })}
            </div>

            <button
              onClick={cambiarEstado}
              className="px-6 py-2 bg-gray-200 rounded-lg text-black hover:bg-gray-300 transition"
            >
              Avanzar estado
            </button>
          </>
        )}

        {/* CANCELAR */}
        <div className="flex justify-end">
          <button
            onClick={cancelarPedido}
            disabled={pedido.status === "Cancelado"}
            className={`px-6 py-2 rounded-xl font-semibold transition
              ${
                pedido.status === "Cancelado"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
          >
            {pedido.status === "Cancelado"
              ? "Pedido cancelado"
              : "Cancelar pedido"}
          </button>
        </div>

        {/* PRODUCTOS */}
        <div className="space-y-6 pt-6 border-t">

          {pedido.productos.map((item, index) => (
            <div key={index} className="bg-[#f7f3ef] p-4 rounded-xl space-y-3">

              <div className="flex justify-between">
                <h3 className="font-semibold text-black">
                  {item.nombre}
                </h3>
                <span className="font-semibold text-black">
                  ${item.total}
                </span>
              </div>

              {item.personalizado && (
                <div className="space-y-2 text-sm text-gray-700">

                  <p><strong>Descripción:</strong> {item.descripcion}</p>
                  <p><strong>Sabor:</strong> {item.sabor}</p>
                  <p><strong>Tamaño:</strong> {item.tamaño}</p>

                  {item.imagen_url && (
                    <img
                      src={item.imagen_url}
                      alt="Pastel personalizado"
                      className="w-48 rounded-lg"
                    />
                  )}

                </div>
              )}

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