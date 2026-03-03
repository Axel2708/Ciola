"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function ProductosPage() {

  const router = useRouter()

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const [soloStockBajo, setSoloStockBajo] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchProductos()
  }, [])

  async function fetchProductos() {
    setLoading(true)

    const { data } = await supabase
      .from("productos")
      .select(`
        id,
        nombre,
        precio,
        stock,
        imagen_url,
        categorias (
          nombre
        )
      `)
      .order("created_at", { ascending: false })

    setProductos(data || [])
    setLoading(false)
  }

  async function confirmarEliminar() {
    await supabase
      .from("productos")
      .delete()
      .eq("id", productoAEliminar)

    setProductoAEliminar(null)
    setToast("Producto eliminado correctamente")
    fetchProductos()

    setTimeout(() => setToast(null), 3000)
  }

  const productosFiltrados = productos.filter(producto => {

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(search.toLowerCase())

    const coincideCategoria =
      categoriaFiltro === "" ||
      producto.categorias?.nombre === categoriaFiltro

    const coincideStock =
      !soloStockBajo || producto.stock <= 5

    return coincideBusqueda && coincideCategoria && coincideStock
  })

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          Productos
        </h1>

        <button
          onClick={() => router.push("/home/productos/agregar")}
          className="px-6 py-3 rounded-xl bg-[#b89c80] text-white
                     hover:bg-[#a38366] transition"
        >
          Añadir producto
        </button>
      </div>

      {/* BUSCADOR + FILTRO */}
      <div className="flex justify-between items-center">

        <div className="flex gap-4 items-center">

          <input
            placeholder="Buscar producto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[320px] px-4 py-3 rounded-xl
                       bg-white text-black
                       border border-gray-300
                       shadow-sm
                       placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                       transition duration-300"
          />

          <button
            onClick={() => setMostrarFiltros(prev => !prev)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl
                        font-medium shadow-sm transition duration-300
                        ${mostrarFiltros
                          ? "bg-[#b89c80] text-white"
                          : "bg-[#d6c6b2] text-gray-900 hover:bg-[#c8b79f]"}
                        `}
          >
            🎛 Filtros
          </button>

        </div>

      </div>

      {/* PANEL FILTROS */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-6 rounded-2xl
                       bg-[#ece3d6]
                       border border-[#d6c6b2]
                       shadow-md flex flex-wrap gap-6 items-center"
          >

            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-3 rounded-xl
                         bg-white text-gray-800
                         border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#b89c80]
                         shadow-sm transition"
            >
              <option value="">Todas las categorías</option>
              {[...new Set(productos.map(p => p.categorias?.nombre))]
                .filter(Boolean)
                .map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <label className="flex items-center gap-3 text-gray-800 font-medium">
              <input
                type="checkbox"
                checked={soloStockBajo}
                onChange={() => setSoloStockBajo(!soloStockBajo)}
                className="w-4 h-4 accent-[#b89c80]"
              />
              Solo stock bajo (≤5)
            </label>

          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden relative">

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#b89c80] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <table className="w-full text-left">

          <thead className="bg-[#d6c6b2] text-gray-900">
            <tr>
              <th className="p-4">Imagen</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-800">

            {!loading && productosFiltrados.map(producto => (
              <motion.tr
                key={producto.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 transition"
              >

                <td className="p-4">
                  {producto.imagen_url ? (
                    <Image
                      src={producto.imagen_url}
                      alt="producto"
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                  ) : "—"}
                </td>

                <td className="p-4 font-medium">
                  {producto.nombre}
                </td>

                <td className="p-4">
                  ${producto.precio}
                </td>

                <td className={`p-4 font-semibold ${
                  producto.stock <= 5
                    ? "text-red-500"
                    : "text-green-600"
                }`}>
                  {producto.stock}
                </td>

                <td className="p-4">
                  {producto.categorias?.nombre || "Sin categoría"}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    onClick={() =>
                      router.push(`/home/productos/editar/${producto.id}`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#f4b183]
                               hover:bg-[#e3a36f] transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setProductoAEliminar(producto.id)}
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

      {/* MODAL */}
      <AnimatePresence>
        {productoAEliminar && (
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
              <h2 className="text-xl font-semibold mb-4">
                Confirmar eliminación
              </h2>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setProductoAEliminar(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmarEliminar}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
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