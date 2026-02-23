"use client"

import { useRouter } from "next/navigation"

export default function OrdenesPage() {

  const router = useRouter()

  const ordenes = [
    { id: "01", cliente: "AXEL", fecha: "04-05-2025", status: "Pendiente", total: 200 },
    { id: "02", cliente: "MIRANDA", fecha: "04-05-2025", status: "Entregado", total: 400 },
    { id: "03", cliente: "JOSÉ", fecha: "04-05-2025", status: "Cancelado", total: 150 },
    { id: "04", cliente: "Keila", fecha: "04-05-2025", status: "Pendiente", total: 200 },
  ]

  const getStatusStyle = (status) => {
    if (status === "Pendiente")
      return { backgroundColor: "#f4d9a5", color: "#8a5a00" }

    if (status === "Entregado")
      return { backgroundColor: "#cfe8d5", color: "#2f6b3f" }

    if (status === "Cancelado")
      return { backgroundColor: "#f8cfcf", color: "#a11d1d" }
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Lista de pedidos</h1>
        <div style={styles.avatar}></div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <input
          placeholder="Buscar producto"
          style={styles.search}
        />

        <select style={styles.filter}>
          <option>Status</option>
          <option>Pendiente</option>
          <option>Entregado</option>
          <option>Cancelado</option>
        </select>

        <select style={styles.filter}>
          <option>Fecha</option>
          <option>Hoy</option>
          <option>Esta semana</option>
        </select>
      </div>

      {/* Tabla */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Detalle</th>
            </tr>
          </thead>

          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id} style={styles.tr}>
                <td style={styles.td}>{orden.id}</td>
                <td style={styles.td}>{orden.cliente}</td>
                <td style={styles.td}>{orden.fecha}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      ...getStatusStyle(orden.status),
                    }}
                  >
                    {orden.status}
                  </span>
                </td>

                <td style={styles.td}>{orden.total}</td>

                <td style={styles.td}>
                  <button
                    style={styles.detailButton}
                    onClick={() =>
                      router.push(`/home/ordenes/${orden.id}`)
                    }
                  >
                    📄
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón inferior */}
        <div style={styles.newOrderContainer}>
          <button
            style={styles.newOrderButton}
            onClick={() => router.push("/home/ordenes/nueva")}
          >
            Orden nueva
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "#f3f1ed",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#3b2f2f",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#b89c80",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },

  search: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#ffffff",
    width: "220px",
  },

  filter: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#d9cbb6",
    cursor: "pointer",
  },

  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "15px",
    backgroundColor: "#f0ede9",
  },

  tr: {
    borderTop: "1px solid #eee",
  },

  td: {
    padding: "15px",
  },

  status: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  detailButton: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#e76f51",
    color: "white",
    cursor: "pointer",
  },

  newOrderContainer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "20px",
  },

  newOrderButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b89c80",
    cursor: "pointer",
    fontWeight: "bold",
  },
}