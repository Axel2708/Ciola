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

  // 📈 Datos para línea (ventas por día)
  const dataLinea = ordenes.map((o, i) => ({
    name: `Día ${i + 1}`,
    ventas: o.total
  }))

  // 📊 Datos para barras
  const dataBarras = ordenes.map((o, i) => ({
    name: `#${o.id}`,
    total: o.total
  }))

  return (
    <div style={styles.main}>

      {/* Topbar */}
      <div style={styles.topbar}>
        <h1>Dashboard</h1>
        <div style={styles.searchContainer}>
          <input placeholder="Buscar" style={styles.search} />
          <div style={styles.avatar}></div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.card}>
          <h4>Órdenes totales</h4>
          <h2>{stats.totalOrdenes}</h2>
        </div>

        <div style={styles.card}>
          <h4>Ventas</h4>
          <h2>${stats.ventas}</h2>
        </div>

        <div style={styles.card}>
          <h4>Low</h4>
          <h2>{stats.low}</h2>
        </div>
      </div>

      {/* Grid principal */}
      <div style={styles.grid}>

        {/* Producto top */}
        <div style={styles.smallCard}>
          <h3>Producto Top</h3>
          <p style={styles.productName}>Pastel</p>
        </div>

        {/* 📈 Ventas generales - Línea */}
        <div style={styles.largeCard}>
          <h3>Ventas generales</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dataLinea}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#c98f8f"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Porcentaje */}
        <div style={styles.smallCard}>
          <h3>Ventas generales</h3>
          <div style={styles.circle}>
            {stats.porcentaje}%
          </div>
        </div>

        {/* 📊 Resumen de pedidos - Barras */}
        <div style={styles.largeCard}>
          <h3>Resumen de pedidos</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="name" />
              <YAxis />
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

const styles = {
  main: { padding: "40px", backgroundColor: "#f3f1ed" },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  searchContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  search: {
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    backgroundColor: "#d9cbb6",
  },

  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#b89c80",
    borderRadius: "50%",
  },

  statsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    flex: 1,
    backgroundColor: "#d9cbb6",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "20px",
  },

  smallCard: {
    backgroundColor: "#d9cbb6",
    padding: "20px",
    borderRadius: "15px",
  },

  largeCard: {
    backgroundColor: "#d9cbb6",
    padding: "20px",
    borderRadius: "15px",
  },

  circle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#5f8368",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: "bold",
    marginTop: "20px",
  },

  productName: {
    fontSize: "24px",
    color: "#e76f51",
    marginTop: "10px",
  },
}