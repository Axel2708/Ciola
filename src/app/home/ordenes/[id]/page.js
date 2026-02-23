"use client"

import { useParams } from "next/navigation"

export default function DetallePedidoPage() {

  const { id } = useParams()

  // Simulación de pedido cargado por ID
  const pedido = {
    id: id,
    cliente: "AXEL",
    fecha: "04/04/2025",
    status: "Activo",
    payment: "Online",
    productos: [
      { nombre: "Pastel chocolate", cantidad: 1, total: 4.3 },
    ]
  }

  const totalGeneral = pedido.productos.reduce(
    (acc, item) => acc + item.total,
    0
  )

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Detalles del pedido</h1>
        <div style={styles.avatar}></div>
      </div>

      <div style={styles.card}>

        {/* Info principal */}
        <div style={styles.infoGrid}>

          <div>
            <p style={styles.label}>Orden Id</p>
            <h3>#{pedido.id}</h3>
          </div>

          <div>
            <p style={styles.label}>Status</p>
            <span style={styles.status}>Activo</span>
          </div>

          <div>
            <p style={styles.label}>Cliente</p>
            <h3>{pedido.cliente}</h3>
          </div>

          <div>
            <p style={styles.label}>Fecha</p>
            <h3>{pedido.fecha}</h3>
          </div>

          <div>
            <p style={styles.label}>Payment Method</p>
            <h3>{pedido.payment}</h3>
          </div>

        </div>

        <hr style={styles.divider} />

        {/* Tabla productos */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Productos</th>
              <th style={styles.th}>Cantidad</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>

          <tbody>
            {pedido.productos.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.nombre}</td>
                <td style={styles.td}>{item.cantidad}</td>
                <td style={styles.td}>${item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={styles.divider} />

        {/* Total */}
        <div style={styles.totalRow}>
          <h2>Total</h2>
          <h2>${totalGeneral}</h2>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.pdfButton}>
            Descargar PDF
          </button>
        </div>

      </div>

    </div>
  )
}

const styles = {
  container: {
    padding: "30px",
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

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  label: {
    margin: 0,
    fontSize: "14px",
    color: "#888",
  },

  status: {
    backgroundColor: "#cfe8d5",
    color: "#2f6b3f",
    padding: "5px 15px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "12px",
  },

  divider: {
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #eee",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    paddingBottom: "10px",
  },

  td: {
    padding: "10px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },

  pdfButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b89c80",
    cursor: "pointer",
    fontWeight: "bold",
  },
}