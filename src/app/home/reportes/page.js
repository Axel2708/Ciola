"use client"

import { useState, useMemo, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer
} from "recharts"

export default function ReportesPage() {

  const [fechaInicio, setFechaInicio] = useState("2025-01-01")
  const [fechaFin, setFechaFin] = useState("2026-12-31")

  const [ordenes, setOrdenes] = useState([])
  const [detalle, setDetalle] = useState([])

  useEffect(() => {
    obtenerDatos()
  }, [fechaInicio, fechaFin])

  async function obtenerDatos() {

    // 🔥 TRAER ORDENES CON RANGO CORRECTO
    const { data: ordenesData, error } = await supabase
      .from("ordenes")
      .select(`
        *,
        clientes ( nombre )
      `)
      .gte("fecha", fechaInicio + "T00:00:00")
      .lte("fecha", fechaFin + "T23:59:59")

    if (error) {
      console.error("Error ordenes:", error)
      return
    }

    if (!ordenesData || ordenesData.length === 0) {
      setOrdenes([])
      setDetalle([])
      return
    }

    // 🔥 TRAER DETALLE SOLO DE ESAS ORDENES
    const { data: detalleData, error: errorDetalle } = await supabase
      .from("detalle_orden")
      .select(`
        cantidad,
        subtotal,
        productos ( nombre )
      `)
      .in("orden_id", ordenesData.map(o => o.id))

    if (errorDetalle) {
      console.error("Error detalle:", errorDetalle)
    }

    setOrdenes(ordenesData)
    setDetalle(detalleData || [])
  }

  // 📊 VENTAS POR DÍA
  const dataBarras = useMemo(() => {

    const dias = {}

    ordenes.forEach(o => {
      if (!o.fecha) return

      const fecha = new Date(o.fecha)
      const dia = fecha.toLocaleDateString("es-MX", { weekday: "short" })

      if (!dias[dia]) dias[dia] = 0
      dias[dia] += Number(o.total || 0)
    })

    return Object.keys(dias).map(d => ({
      name: d,
      ventas: dias[d]
    }))

  }, [ordenes])

  // 🥧 PRODUCTOS
  const dataPie = useMemo(() => {

    const conteo = {}

    detalle.forEach(d => {
      const nombre = d.productos?.nombre || "Personalizado"

      if (!conteo[nombre]) conteo[nombre] = 0
      conteo[nombre] += Number(d.subtotal || 0)
    })

    return Object.keys(conteo).map(k => ({
      name: k,
      value: conteo[k]
    }))

  }, [detalle])

  // 👑 CLIENTES TOP
  const clientesTop = useMemo(() => {

    const mapa = {}

    ordenes.forEach(o => {
      const nombre = o.clientes?.nombre || "Sin nombre"

      if (!mapa[nombre]) mapa[nombre] = 0
      mapa[nombre] += Number(o.total || 0)
    })

    return Object.entries(mapa)
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

  }, [ordenes])

  const COLORS = ["#f4b183", "#e76f51", "#6a4c93", "#2a9d8f"]

  // 📄 EXPORTAR PDF
  const exportarPDF = () => {

    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Reporte de Ventas - Ciola", 14, 15)

    doc.setFontSize(10)
    doc.text(`Desde: ${fechaInicio}  Hasta: ${fechaFin}`, 14, 22)

    autoTable(doc, {
      startY: 30,
      head: [["Cliente", "Total"]],
      body: clientesTop.map(c => [
        c.nombre,
        `$${c.total}`
      ])
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Día", "Ventas"]],
      body: dataBarras.map(d => [
        d.name,
        `$${d.ventas}`
      ])
    })

    doc.save("reporte-ciola.pdf")
  }

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-black">
          Generar informe
        </h1>
        <p className="text-gray-500 mt-1">
          Analiza el rendimiento de ventas
        </p>
      </div>

      {/* FECHAS */}
      <div className="bg-white p-6 rounded-2xl shadow flex gap-4">

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="px-4 py-2 border rounded-lg text-black"
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="px-4 py-2 border rounded-lg text-black"
        />

      </div>

      {/* CLIENTES TOP */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-black font-semibold mb-4">
          👑 Clientes Top
        </h3>

        {clientesTop.length === 0 && (
          <p className="text-gray-500">No hay datos</p>
        )}

        {clientesTop.map((c, i) => (
          <div key={i} className="flex justify-between py-2 border-b">
            <span className="font-bold text-black">{c.nombre}</span>
            <span className="font-bold text-black">${c.total}</span>
          </div>
        ))}
      </div>

      {/* GRÁFICAS */}
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
              <Pie data={dataPie} dataKey="value" outerRadius={80}>
                {dataPie.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LÍNEA */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dataBarras}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Line dataKey="ventas" stroke="#b89c80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* BOTÓN */}
      <div>
        <button
          onClick={exportarPDF}
          className="px-6 py-3 bg-[#b89c80] text-black rounded-xl font-semibold hover:bg-[#a38366]"
        >
          Exportar PDF
        </button>
      </div>

    </div>
  )
}