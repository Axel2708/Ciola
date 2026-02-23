"use client"

import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer
} from "recharts"

export default function ReportesPage() {

  const [fechaInicio, setFechaInicio] = useState("2025-04-04")
  const [fechaFin, setFechaFin] = useState("2025-05-04")

  // Simulación dinámica de datos
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

  const dataBarras = generarDatos()

  const dataPie = [
    { name: "Pasteles", value: 400 },
    { name: "Gelatinas", value: 300 },
    { name: "Cupcakes", value: 200 },
    { name: "Otros", value: 100 },
  ]

  const COLORS = ["#f4b183", "#e76f51", "#6a4c93", "#2a9d8f"]

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Generar informe</h1>

      {/* Rango fechas */}
      <div style={styles.dateContainer}>
        <label>Rango de fechas</label>
        <div style={styles.dateInputs}>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <span>To</span>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      {/* Gráficos */}
      <div style={styles.grid}>

        {/* Barras */}
        <div style={styles.card}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataBarras}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#f4b183" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div style={styles.card}>
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

        {/* Línea */}
        <div style={styles.cardWide}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dataBarras}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ventas" stroke="#b89c80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Botones */}
      <div style={styles.buttons}>
        <button style={styles.export}>Exportar PDF</button>
        <button style={styles.cancel}>Cancelar</button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    padding: "20px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  dateContainer: {
    marginBottom: "20px",
  },

  dateInputs: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  cardWide: {
    gridColumn: "span 2",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "15px",
  },

  export: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#b89c80",
    cursor: "pointer",
  },

  cancel: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
}