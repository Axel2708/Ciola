"use client"

import { useRouter } from "next/navigation"

export default function AgregarCliente() {

  const router = useRouter()

  return (
    <div>
      <h1 style={styles.title}>Agregar clientes</h1>

      <div style={styles.card}>

        <input placeholder="Nombre" style={styles.input} />
        <input placeholder="Email" style={styles.input} />
        <input placeholder="Teléfono" style={styles.input} />
        <textarea placeholder="Dirección" style={styles.textarea} />

        <div style={styles.buttons}>
          <button
            style={styles.cancel}
            onClick={() => router.push("/home/clientes")}
          >
            Cancelar
          </button>

          <button style={styles.add}>
            Añadir
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  title: { fontSize: "28px", marginBottom: "20px" },

  card: {
    background: "#d9cbb6",
    padding: "30px",
    borderRadius: "50px",
    maxWidth: "1000px",
    minHeight: "500px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    minHeight: "100px",
    marginBottom: "20px",
  },

  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },

  cancel: {
    padding: "10px 20px",
    background: "#eee",
    border: "none",
    borderRadius: "8px",
  },

  add: {
    padding: "10px 20px",
    background: "#b89c80",
    border: "none",
    borderRadius: "8px",
    color: "white",
  },
}