"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function EditarClientePage() {

  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCliente()
  }, [])

  async function fetchCliente() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.log("Error cargando cliente:", error)
      alert("No se pudo cargar el cliente")
      router.push("/home/clientes")
    } else {
      setNombre(data.nombre)
      setEmail(data.email || "")
      setTelefono(data.telefono || "")
      setDireccion(data.direccion || "")
    }

    setLoading(false)
  }

  async function handleUpdate(e) {
    e.preventDefault()

    if (!nombre || !email) {
      alert("Nombre y email son obligatorios")
      return
    }

    const { error } = await supabase
      .from("clientes")
      .update({
        nombre,
        email,
        telefono,
        direccion,
      })
      .eq("id", id)

    if (error) {
      console.log("Error actualizando:", error)
      alert("No se pudo actualizar")
    } else {
      router.push("/home/clientes")
    }
  }

  if (loading) return <div style={{ padding: "40px" }}>Cargando...</div>

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Editar cliente</h1>

      <form onSubmit={handleUpdate} style={styles.form}>
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

        <button type="submit" style={styles.button}>
          Guardar cambios
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