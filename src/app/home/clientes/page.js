"use client"

import { useRouter } from "next/navigation"

export default function ClientesPage() {

  const router = useRouter()

  const clientes = [
    { id: 1, nombre: "Miranda", email: "miri@gmail.com", telefono: "748484", direccion: "my heart" },
    { id: 2, nombre: "Axel", email: "alonso@gmail.com", telefono: "9932187993", direccion: "her heart" },
    { id: 3, nombre: "Lupita", email: "lup@gmail.com", telefono: "99323565313", direccion: "house" },
    { id: 4, nombre: "Jose", email: "barahona2002@homtail.com", telefono: "9933113255", direccion: "work" },
    { id: 5, nombre: "Kamy", email: "k@gmail.com", telefono: "idk", direccion: "----" },
  ]

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Clientes</h1>
        <div style={styles.avatar}></div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <input
          placeholder="Buscar cliente"
          style={styles.search}
        />

        <button
          style={styles.addButton}
          onClick={() => router.push("/home/clientes/agregar")}
        >
          Añadir cliente
        </button>
      </div>

      {/* Tabla */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Dirección</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} style={styles.tr}>
                <td style={styles.td}>{cliente.nombre}</td>
                <td style={styles.td}>{cliente.email}</td>
                <td style={styles.td}>{cliente.telefono}</td>
                <td style={styles.td}>{cliente.direccion}</td>
                <td style={styles.td}>
                  <button
                    style={styles.editButton}
                    onClick={() => router.push(`/home/clientes/editar/${cliente.id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  search: {
    width: "300px",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #d1c7bb",
    backgroundColor: "#d9cbb6",
    outline: "none",
  },

  addButton: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#d9cbb6",
    cursor: "pointer",
    fontWeight: "bold",
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
    fontWeight: "bold",
  },

  tr: {
    borderTop: "1px solid #eee",
  },

  td: {
    padding: "15px",
  },

  editButton: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f4b183",
    cursor: "pointer",
  },
}