"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function ClientesPage() {

  const router = useRouter()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [clienteAEliminar, setClienteAEliminar] = useState(null)
  const [toast, setToast] = useState(null)
  const [page, setPage] = useState(1)

  const itemsPerPage = 5

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    setLoading(true)

    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false })

    setClientes(data || [])
    setLoading(false)
  }

  async function confirmarEliminar() {
    await supabase
      .from("clientes")
      .delete()
      .eq("id", clienteAEliminar)

    setClienteAEliminar(null)
    setToast("Cliente eliminado correctamente")

    fetchClientes()

    setTimeout(() => setToast(null), 3000)
  }

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)

  const paginatedClientes = filteredClientes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          Clientes
        </h1>

        <button
          onClick={() => router.push("/home/clientes/agregar")}
          className="px-6 py-3 rounded-xl bg-[#b89c80] text-white
                     hover:bg-[#a38366] transition duration-300"
        >
          Añadir cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <input
        placeholder="Buscar cliente"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[300px] px-4 py-3 rounded-xl border border-gray-300
                   bg-white text-black
                   focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                   transition duration-300"
      />

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden relative">

        {/* SKELETON LOADING */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-[#b89c80] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <table className={`w-full text-left transition duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>

          <thead className="bg-[#d6c6b2] text-gray-900">
            <tr>
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Teléfono</th>
              <th className="p-4 font-semibold">Dirección</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-800">

            {!loading && paginatedClientes.length === 0 && (
              <tr>
                <td className="p-6">No hay clientes</td>
              </tr>
            )}

            {!loading && paginatedClientes.map((cliente) => (
              <motion.tr
                key={cliente.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-4">{cliente.nombre}</td>
                <td className="p-4">{cliente.email}</td>
                <td className="p-4">{cliente.telefono}</td>
                <td className="p-4">{cliente.direccion}</td>

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() =>
                      router.push(`/home/clientes/editar/${cliente.id}`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#f4b183]
                               hover:bg-[#e3a36f] transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setClienteAEliminar(cliente.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white
                               hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>

                </td>

              </motion.tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg transition ${
                page === i + 1
                  ? "bg-[#b89c80] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {clienteAEliminar && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl w-[400px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Confirmar eliminación
              </h2>

              <p className="text-gray-600 mb-6">
                Esta acción no se puede deshacer.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setClienteAEliminar(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg
                             hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmarEliminar}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg
                             hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

    </div>
  )
}