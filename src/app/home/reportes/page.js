"use client"

import { useState, useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer
} from "recharts"

export default function ReportesPage() {

  const [fechaInicio, setFechaInicio] = useState("2025-04-04")
  const [fechaFin, setFechaFin] = useState("2025-05-04")

  const generarDatos = () => {
    return [
      { name: "Lun", ventas: Math.floor(Math.random() * 500) },
      { name: "Mar", ventas: Math.floor(Math.random() * 500) },
      { name: "Mié", ventas: Math.floor(Math.random() * 500) },
      { name: "Jue", ventas: Math.floor(Math.random() * 500) },
      { name: "Vie", ventas: Math.floor(Math.random() * 500) },
      { name: "Sáb", ventas: Math.floor(Math.random() * 500) },
    ]
  }

  const dataBarras = useMemo(() => generarDatos(), [fechaInicio, fechaFin])

  const dataPie = [
    { name: "Pasteles", value: 400 },
    { name: "Gelatinas", value: 300 },
    { name: "Cupcakes", value: 200 },
    { name: "Otros", value: 100 },
  ]

  const COLORS = ["#f4b183", "#e76f51", "#6a4c93", "#2a9d8f"]

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-black">
          Generar informe
        </h1>
        <p className="text-gray-500 mt-1">
          Analiza el rendimiento de ventas por rango de fechas
        </p>
      </div>

      {/* FILTRO FECHAS */}
      <div className="bg-white p-6 rounded-2xl shadow flex flex-wrap items-center gap-4">

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">
            Fecha inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">
            Fecha fin
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          />
        </div>

      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BARRAS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-black font-semibold mb-4">
            Ventas por día
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Bar dataKey="ventas" fill="#f4b183" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-black font-semibold mb-4">
            Distribución de productos
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LÍNEA */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h3 className="text-black font-semibold mb-4">
            Tendencia semanal
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dataBarras}>
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

      </div>

      {/* BOTONES */}
      <div className="flex gap-4">

        <button
          className="px-6 py-3 rounded-xl
                     bg-[#b89c80] text-black font-semibold
                     hover:bg-[#a38366] transition"
        >
          Exportar PDF
        </button>

        <button
          className="px-6 py-3 rounded-xl
                     border border-gray-300 text-black
                     hover:bg-gray-100 transition"
        >
          Cancelar
        </button>

      </div>

    </div>
  )
}