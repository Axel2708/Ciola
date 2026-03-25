"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabaseClient"

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts"

export default function HomePage() {

  const [ordenes, setOrdenes] = useState([])

  useEffect(() => {
    obtenerOrdenes()
  }, [])

  async function obtenerOrdenes() {

    const { data, error } = await supabase
      .from("ordenes")
      .select(`
        id,
        total,
        estado,
        fecha,
        clientes ( nombre ),
        detalle_orden (
          cantidad,
          productos ( nombre )
        )
      `)
      .order("fecha", { ascending: true })

    if (error) {
      console.log(error)
      return
    }

    setOrdenes(data || [])
  }

  // 📊 STATS
  const stats = useMemo(() => {

    const totalOrdenes = ordenes.length

    const ventas = ordenes
      .filter(o => o.estado === "Entregado")
      .reduce((acc, curr) => acc + Number(curr.total || 0), 0)

    return { totalOrdenes, ventas }

  }, [ordenes])

  // 👑 CLIENTES TOP
  const topClientes = useMemo(() => {

    const conteo = {}

    ordenes.forEach(o => {

      const nombre = o.clientes?.nombre || "Cliente"

      if (!conteo[nombre]) conteo[nombre] = 0

      conteo[nombre] += Number(o.total || 0)
    })

    return Object.entries(conteo)
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)

  }, [ordenes])

  // 🔥 PRODUCTOS (TOP Y MENOS)
  const productosStats = useMemo(() => {

    const conteo = {}

    ordenes.forEach(o => {
      o.detalle_orden?.forEach(d => {

        const nombre = d.productos?.nombre || "Producto"

        if (!conteo[nombre]) conteo[nombre] = 0

        conteo[nombre] += Number(d.cantidad || 1)
      })
    })

    const lista = Object.entries(conteo)
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total)

    return {
      top5: lista.slice(0, 5),
      menos: lista[lista.length - 1]
    }

  }, [ordenes])

  // 📈 LÍNEA
  const dataLinea = ordenes.map((o, i) => ({
    name: `Día ${i + 1}`,
    ventas: Number(o.total || 0)
  }))

  // 📊 BARRAS
  const dataBarras = productosStats.top5.map(p => ({
    name: p.nombre,
    total: p.total
  }))

  return (
    <div className="w-full space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-black">
          Dashboard
        </h1>
        <div className="w-10 h-10 rounded-full bg-[#b89c80]" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Órdenes totales</p>
          <h2 className="text-3xl font-bold text-black mt-2">
            {stats.totalOrdenes}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Ventas entregadas</p>
          <h2 className="text-3xl font-bold text-black mt-2">
            ${stats.ventas}
          </h2>
        </div>

        {/* 👑 CLIENTES TOP */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm mb-2">
            👑 Clientes top
          </p>

          {topClientes.map((c, i) => (
            <div key={i} className="flex justify-between text-black font-semibold">
              <span>{c.nombre}</span>
              <span>${c.total}</span>
            </div>
          ))}
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PRODUCTO TOP */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Producto más vendido</p>
          <h3 className="text-xl font-bold text-black mt-2">
            {productosStats.top5[0]?.nombre || "Sin datos"}
          </h3>
        </div>

        {/* LÍNEA */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dataLinea}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Line type="monotone" dataKey="ventas" stroke="#b89c80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🧊 MENOS VENDIDO */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">
            Producto menos vendido
          </p>

          <h3 className="text-xl font-bold text-black mt-3 text-center">
            {productosStats.menos?.nombre || "Sin datos"}
          </h3>

          <p className="text-gray-500 mt-2">
            {productosStats.menos?.total || 0} ventas
          </p>
        </div>

        {/* TOP 5 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500 text-sm mb-4">
            Top 5 productos
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Bar dataKey="total" fill="#5f8368" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}