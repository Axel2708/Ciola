"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function EditarClientePage() {

  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchCliente()
  }, [])

  async function fetchCliente() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      setToast("No se pudo cargar el cliente")
      setTimeout(() => router.push("/home/clientes"), 1500)
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
      setToast("Nombre y email son obligatorios")
      setTimeout(() => setToast(null), 2500)
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from("clientes")
      .update({ nombre, email, telefono, direccion })
      .eq("id", id)

    setSaving(false)

    if (error) {
      setToast("No se pudo actualizar")
    } else {
      setToast("Cliente actualizado correctamente ✔")
      setTimeout(() => router.push("/home/clientes"), 1200)
    }

    setTimeout(() => setToast(null), 3000)
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-[#b89c80] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full flex justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <div className="w-full max-w-4xl bg-white p-14 rounded-3xl shadow-xl space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">
            Editar cliente
          </h1>
          <p className="text-gray-500 mt-2">
            Modifica la información del cliente
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="px-5 py-4 rounded-xl border border-gray-300 text-black
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         transition"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-5 py-4 rounded-xl border border-gray-300 text-black
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         transition"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="px-5 py-4 rounded-xl border border-gray-300 text-black
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         transition"
            />

            <div></div>

          </div>

          <textarea
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black
                       min-h-[140px]
                       focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                       transition"
          />

          {/* BOTONES */}
          <div className="flex justify-end gap-4 pt-6">

            <button
              type="button"
              onClick={() => router.push("/home/clientes")}
              className="px-6 py-3 rounded-xl border border-gray-300
                         hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-[#b89c80] text-white
                         hover:bg-[#a38366] hover:shadow-md hover:scale-[1.02]
                         active:scale-[0.98]
                         transition duration-300
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

          </div>

        </form>

      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-6 bg-[#b89c80] text-white
                       px-6 py-3 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}