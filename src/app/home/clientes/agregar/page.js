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
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    setErrorMsg("")
    setSuccess(false)

    if (!nombre || !email) {
      setErrorMsg("Nombre y email son obligatorios")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("clientes")
      .insert([{ nombre, email, telefono, direccion }])

    setLoading(false)

    if (error) {
      setErrorMsg("Error al guardar cliente")
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/home/clientes")
      }, 1200)
    }
  }

  return (
    <div className="w-full flex justify-center animate-fadeIn">

      <div className="w-full max-w-5xl bg-white p-16 rounded-3xl shadow-xl">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-800">
            Agregar cliente
          </h1>
          <p className="text-gray-500 mt-2">
            Completa la información del nuevo cliente
          </p>
        </div>

        {/* MENSAJES */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-700">
            {errorMsg}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-700">
            Cliente guardado correctamente ✔
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* GRID 2 COLUMNAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="px-5 py-4 rounded-xl border border-gray-300 text-black
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         transition duration-300"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-5 py-4 rounded-xl border border-gray-300 text-black
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         transition duration-300"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="px-5 py-4 rounded-xl border border-gray-300 text-black
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         transition duration-300"
            />

            <div></div> {/* espacio visual balance */}

          </div>

          {/* TEXTAREA COMPLETO */}
          <textarea
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black
                       min-h-[140px]
                       focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                       transition duration-300"
          />

          {/* BOTONES */}
          <div className="flex justify-end gap-4 pt-6">

            <button
              type="button"
              onClick={() => router.push("/home/clientes")}
              className="px-6 py-3 rounded-xl border border-gray-300
                         hover:bg-gray-100 transition duration-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#b89c80] text-white font-medium
                         hover:bg-[#a38366] hover:shadow-md hover:scale-[1.02]
                         active:scale-[0.98]
                         transition duration-300
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar cliente"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}