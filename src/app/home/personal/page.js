"use client"

import Link from "next/link"

export default function PersonalPage() {

  const personal = [
    { id: 1, nombre: "persona", email: "persona832@gmail.com", rol: "Admin", status: "Activo" },
    { id: 2, nombre: "persona", email: "persona832@gmail.com", rol: "Staff", status: "Activo" },
    { id: 3, nombre: "persona", email: "persona832@gmail.com", rol: "Staff", status: "Desactivado" },
    { id: 4, nombre: "persona", email: "persona832@gmail.com", rol: "Staff", status: "Activo" },
  ]

  const getStatusStyle = (status) => {
    if (status === "Activo") {
      return { backgroundColor: "#cfe8d5", color: "#2f6b3f" }
    }
    return { backgroundColor: "#f8cfcf", color: "#a11d1d" }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lista de personal</h1>

      <div style={styles.actions}>
        <input placeholder="Busca personal" style={styles.search} />
        <button style={styles.rolButton}>Rol</button>
        <Link href="/home/personal/agregar" style={styles.addButton}>
          + Añadir personal
        </Link>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {personal.map((persona) => (
              <tr key={persona.id}>
                <td style={styles.td}>{persona.nombre}</td>
                <td style={styles.td}>{persona.email}</td>
                <td style={styles.td}>{persona.rol}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.status, ...getStatusStyle(persona.status) }}>
                    {persona.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/home/personal/editar/${persona.id}`} style={styles.edit}>
                      ✏️
                    </Link>
                    <button style={styles.delete}>🗑️</button>
                  </div>
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
  container: { padding: "20px" },
  title: { fontSize: "28px", marginBottom: "20px" },
  actions: { display: "flex", gap: "10px", marginBottom: "20px" },
  search: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd" },
  rolButton: { padding: "10px 15px", borderRadius: "8px", background: "#d9cbb6", border: "none" },
  addButton: { padding: "10px 15px", borderRadius: "8px", background: "#d9cbb6", textDecoration: "none", color: "black" },
  tableContainer: { background: "white", borderRadius: "12px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "15px", background: "#f0ede9", textAlign: "left" },
  td: { padding: "15px" },
  status: { padding: "5px 12px", borderRadius: "20px", fontSize: "12px" },
  edit: { padding: "6px 10px", background: "#f4b183", borderRadius: "6px", textDecoration: "none" },
  delete: { padding: "6px 10px", background: "#e76f51", border: "none", borderRadius: "6px", color: "white" }
}