"use client"

import { useMemo, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts"

export default function HomePage() {

  const [ordenes] = useState([
    { id: 1, total: 200, status: "Entregado" },
    { id: 2, total: 150, status: "Pendiente" },
    { id: 3, total: 300, status: "Entregado" },
    { id: 4, total: 100, status: "Cancelado" },
    { id: 5, total: 250, status: "Entregado" },
    { id: 6, total: 180, status: "Entregado" },
  ])

  const stats = useMemo(() => {

    const totalOrdenes = ordenes.length

    const ventas = ordenes
      .filter(o => o.status === "Entregado")
      .reduce((acc, curr) => acc + curr.total, 0)

    const low = ordenes.filter(o => o.total < 150).length

    const porcentaje =
      totalOrdenes > 0
        ? Math.round((ventas / 1500) * 100)
        : 0

    return { totalOrdenes, ventas, low, porcentaje }

  }, [ordenes])

  const dataLinea = ordenes.map((o, i) => ({
    name: `Día ${i + 1}`,
    ventas: o.total
  }))

  const dataBarras = ordenes.map((o) => ({
    name: `#${o.id}`,
    total: o.total
  }))

  return (
    <div className="w-full space-y-10">

      {/* TOPBAR */}
      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-semibold text-black">
          Dashboard
        </h1>

        <div className="flex items-center gap-6">
          <input
            placeholder="Buscar..."
            className="px-4 py-2 rounded-full border border-gray-300
                       text-black focus:ring-2 focus:ring-[#b89c80]"
          />
          <div className="w-10 h-10 rounded-full bg-[#b89c80]" />
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">
            Órdenes totales
          </p>
          <h2 className="text-3xl font-bold text-black mt-2">
            {stats.totalOrdenes}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">
            Ventas entregadas
          </p>
          <h2 className="text-3xl font-bold text-black mt-2">
            ${stats.ventas}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">
            Pedidos bajos
          </p>
          <h2 className="text-3xl font-bold text-black mt-2">
            {stats.low}
          </h2>
        </div>

      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Producto Top */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Producto Top
            </p>
            <h3 className="text-2xl font-semibold text-black mt-2">
              Pastel Chocolate
            </h3>
          </div>

          <div className="mt-6 text-[#e76f51] font-bold text-lg">
            🔥 Más vendido
          </div>
        </div>

        {/* Línea */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm mb-4">
            Ventas generales
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dataLinea}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#b89c80"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Porcentaje */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">
            Meta alcanzada
          </p>

          <div className="w-32 h-32 rounded-full
                          bg-[#5f8368] text-white
                          flex items-center justify-center
                          text-3xl font-bold mt-4">
            {stats.porcentaje}%
          </div>
        </div>

        {/* Barras */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm mb-4">
            Resumen de pedidos
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#5f8368"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}