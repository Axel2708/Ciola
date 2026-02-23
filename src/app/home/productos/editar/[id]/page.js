"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditarProducto() {

  const router = useRouter()
  const { id } = useParams()

  // Simulación de producto cargado por ID
  const [form, setForm] = useState({
    nombre: "Pastel chocolate",
    categoria: "Pastel",
    precio: 20,
    stock: 25
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
        <h1 style={styles.title}>Editar producto</h1>
        <div style={styles.avatar}></div>
      </div>

      {/* Card */}
      <div style={styles.card}>

        {/* Imagen */}
        <div style={styles.imageBox}>
          <div style={styles.imageIcon}>🖼</div>
          <p style={{ marginTop: "10px", color: "#7a6f63" }}>Imagen</p>
        </div>

        {/* Formulario */}
        <div style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              style={styles.input}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Categoría</label>
            <select
              name="categoria"
              value={form.categoria}
              style={styles.input}
              onChange={handleChange}
            >
              <option>Pastel</option>
              <option>Pan</option>
              <option>Bebida</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Precio</label>
            <input
              name="precio"
              value={form.precio}
              style={styles.input}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Stock</label>
            <input
              name="stock"
              value={form.stock}
              style={styles.input}
              onChange={handleChange}
            />
          </div>

          <div style={styles.buttons}>
            <button
              style={styles.saveButton}
              onClick={() => router.push("/home/productos")}
            >
              Guardar
            </button>

            <button
              style={styles.cancelButton}
              onClick={() => router.push("/home/productos")}
            >
              Cancelar
            </button>
          </div>

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
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    color: "#3b2f2f",
    margin: 0,
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#b89c80",
  },

  card: {
    display: "flex",
    gap: "50px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },

  imageBox: {
    width: "220px",
    height: "220px",
    border: "2px dashed #e6c6bd",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f5f2",
  },

  imageIcon: {
    fontSize: "40px",
    color: "#d8a7a0",
  },

  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "5px",
    fontSize: "14px",
    color: "#5f5f5f",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2d8cc",
    backgroundColor: "#f7f3ef",
    outline: "none",
  },

  buttons: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },

  saveButton: {
    padding: "10px 25px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#a5a078",
    color: "white",
    cursor: "pointer",
  },

  cancelButton: {
    padding: "10px 25px",
    borderRadius: "8px",
    border: "1px solid #d1c7bb",
    backgroundColor: "#f7f3ef",
    cursor: "pointer",
  },
}