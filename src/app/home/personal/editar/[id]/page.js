"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditarPersonalPage() {

  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState({
    nombre: "Persona",
    email: "persona@gmail.com",
    telefono: "9930000000",
    rol: "Staff",
    direccion: "Dirección ejemplo"
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Editar personal</h1>
        <div style={styles.avatar}></div>
      </div>

      {/* Card */}
      <div style={styles.card}>

        <div style={styles.formGrid}>

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            style={{ ...styles.input, ...styles.inputTop }}
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
          />

          <div style={styles.row}>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              style={styles.input}
            />

            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              style={styles.input}
            >
              <option>Admin</option>
              <option>Staff</option>
            </select>
          </div>

          <textarea
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            style={styles.textarea}
          />

        </div>

        <div style={styles.buttons}>
          <button
            style={styles.cancelButton}
            onClick={() => router.push("/home/personal")}
          >
            Cancelar
          </button>

          <button
            style={styles.saveButton}
            onClick={() => router.push("/home/personal")}
          >
            Añadir
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
    backgroundColor: "#d9cbb6",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  row: {
    display: "flex",
    gap: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2d8cc",
    backgroundColor: "#f7f3ef",
    outline: "none",
  },

  inputTop: {
    backgroundColor: "#e8e0ef",
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2d8cc",
    backgroundColor: "#e6cfc0",
    minHeight: "100px",
    resize: "none",
    outline: "none",
  },

  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },

  cancelButton: {
    padding: "12px 30px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#f7f3ef",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#8a5a00",
  },

  saveButton: {
    padding: "12px 30px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#a5a078",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
}