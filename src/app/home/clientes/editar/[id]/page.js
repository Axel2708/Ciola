"use client"

import { useParams, useRouter } from "next/navigation"

export default function EditarCliente() {

  const { id } = useParams()
  const router = useRouter()

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>
        Editar clientes #{id}
      </h1>

      <div style={{
        background: "#d9cbb6",
        padding: "30px",
        borderRadius: "20px",
        maxWidth: "1000px",
        minHeight:"500px",

      }}>
        <input placeholder="Nombre" style={{ width: "100%", marginBottom: "15px", padding: "12px", borderRadius: "8px", border: "none" }} />
        <input placeholder="Email" style={{ width: "100%", marginBottom: "15px", padding: "12px", borderRadius: "8px", border: "none" }} />
        <input placeholder="Teléfono" style={{ width: "100%", marginBottom: "15px", padding: "12px", borderRadius: "8px", border: "none" }} />
        <textarea placeholder="Dirección" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", minHeight: "100px", marginBottom: "20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/home/clientes")}>
            Cancelar
          </button>

          <button style={{
            padding: "10px 20px",
            background: "#b89c80",
            borderRadius: "8px",
            border: "none",
            color: "white",
          }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}