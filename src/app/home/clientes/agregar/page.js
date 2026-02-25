"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AgregarClientePage() {

  const router = useRouter()

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!nombre || !email) {
      alert("Nombre y email son obligatorios")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("clientes")
      .insert([
        {
          nombre,
          email,
          telefono,
          direccion,
        },
      ])

    setLoading(false)

    if (error) {
      console.log(error)
      alert("Error al guardar cliente")
    } else {
      router.push("/home/clientes")
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Agregar cliente</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Guardando..." : "Guardar cliente"}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f3f1ed",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "400px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "100px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#d9cbb6",
    fontWeight: "bold",
    cursor: "pointer",
  },
}