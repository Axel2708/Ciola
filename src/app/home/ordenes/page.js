"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"

export default function OrdenesPage() {

  const router = useRouter()

  const ordenes = [
    { id: "01", cliente: "AXEL", fecha: "2025-05-04", status: "Pendiente", total: 200 },
    { id: "02", cliente: "MIRANDA", fecha: "2025-05-04", status: "Entregado", total: 400 },
    { id: "03", cliente: "JOSÉ", fecha: "2025-05-04", status: "Cancelado", total: 150 },
    { id: "04", cliente: "Keila", fecha: "2025-05-04", status: "Pendiente", total: 200 },
  ]

  const [search, setSearch] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("")
  const [fechaFiltro, setFechaFiltro] = useState("")

  // 🔥 FILTRADO REAL
  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter(o => {

      const coincideBusqueda =
        o.cliente.toLowerCase().includes(search.toLowerCase())

      const coincideStatus =
        !statusFiltro || o.status === statusFiltro

      const hoy = new Date().toISOString().split("T")[0]

      const coincideFecha =
        !fechaFiltro ||
        (fechaFiltro === "Hoy" && o.fecha === hoy) ||
        (fechaFiltro === "Semana")

      return coincideBusqueda && coincideStatus && coincideFecha
    })
  }, [search, statusFiltro, fechaFiltro])

  // 🔥 MÉTRICAS
  const totalVentas = ordenes.reduce((acc, o) => acc + o.total, 0)
  const pendientes = ordenes.filter(o => o.status === "Pendiente").length
  const entregados = ordenes.filter(o => o.status === "Entregado").length

  const getStatusStyle = (status) => {
    if (status === "Pendiente")
      return "bg-yellow-200 text-yellow-800"
    if (status === "Entregado")
      return "bg-green-200 text-green-800"
    if (status === "Cancelado")
      return "bg-red-200 text-red-700"
  }

  const getStatusIcon = (status) => {
    if (status === "Pendiente") return "🟡"
    if (status === "Entregado") return "🟢"
    if (status === "Cancelado") return "🔴"
  }

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-black">
          Lista de pedidos
        </h1>

        <button
          onClick={() => router.push("/home/ordenes/nueva")}
          className="px-6 py-3 rounded-xl bg-[#b89c80]
                     text-black font-semibold
                     hover:bg-[#a38366] transition"
        >
          Orden nueva
        </button>
      </div>

      {/* 🔥 MÉTRICAS */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <p className="text-gray-600 text-sm">Total ventas</p>
          <h2 className="text-2xl font-bold text-black">
            ${totalVentas}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <p className="text-gray-600 text-sm">Pendientes</p>
          <h2 className="text-2xl font-bold text-yellow-700">
            {pendientes}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <p className="text-gray-600 text-sm">Entregados</p>
          <h2 className="text-2xl font-bold text-green-700">
            {entregados}
          </h2>
        </div>

      </div>

      {/* 🔎 FILTROS */}
      <div className="flex gap-4">

        <input
          placeholder="Buscar cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300
                     bg-white text-black
                     focus:outline-none focus:ring-2 focus:ring-[#b89c80]"
        />

        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300
                     bg-white text-black"
        >
          <option value="">Todos</option>
          <option>Pendiente</option>
          <option>Entregado</option>
          <option>Cancelado</option>
        </select>

        <select
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300
                     bg-white text-black"
        >
          <option value="">Todas las fechas</option>
          <option>Hoy</option>
          <option>Semana</option>
        </select>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-[#d6c6b2] text-black">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4">Detalle</th>
            </tr>
          </thead>

          <tbody className="divide-y text-black">

            {ordenesFiltradas.map((orden) => (
              <motion.tr
                key={orden.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-4">{orden.id}</td>
                <td className="p-4 font-medium">{orden.cliente}</td>
                <td className="p-4">{orden.fecha}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${getStatusStyle(orden.status)}`}
                  >
                    {getStatusIcon(orden.status)}
                    {orden.status}
                  </span>
                </td>

                <td className="p-4 font-semibold">
                  ${orden.total}
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      router.push(`/home/ordenes/${orden.id}`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#e76f51]
                               text-white hover:bg-[#d65d3f] transition"
                  >
                    Ver
                  </button>
                </td>
              </motion.tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}