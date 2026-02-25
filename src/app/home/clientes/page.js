"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ClientesPage() {

  const router = useRouter()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    setLoading(true)

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("Error cargando clientes:", error)
    } else {
      setClientes(data)
    }

    setLoading(false)
  }

  async function handleDelete(id) {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este cliente?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("Error eliminando cliente:", error)
      alert("No se pudo eliminar")
    } else {
      fetchClientes()
    }
  }

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Clientes</h1>
        <div style={styles.avatar}></div>
      </div>

      <div style={styles.actions}>
        <input
          placeholder="Buscar cliente"
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          style={styles.addButton}
          onClick={() => router.push("/home/clientes/agregar")}
        >
          Añadir cliente
        </button>
      </div>

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
            {loading ? (
              <tr>
                <td style={styles.td}>Cargando...</td>
              </tr>
            ) : filteredClientes.length === 0 ? (
              <tr>
                <td style={styles.td}>No hay clientes</td>
              </tr>
            ) : (
              filteredClientes.map((cliente) => (
                <tr key={cliente.id} style={styles.tr}>
                  <td style={styles.td}>{cliente.nombre}</td>
                  <td style={styles.td}>{cliente.email}</td>
                  <td style={styles.td}>{cliente.telefono}</td>
                  <td style={styles.td}>{cliente.direccion}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() =>
                        router.push(`/home/clientes/editar/${cliente.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        ...styles.editButton,
                        backgroundColor: "#e57373",
                        marginLeft: "8px"
                      }}
                      onClick={() => handleDelete(cliente.id)}
                    >
                      Eliminar
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "#f3f1ed",
    padding: "30px",
    minHeight: "100vh",
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