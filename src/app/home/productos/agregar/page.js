"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function AgregarProducto() {

  const router = useRouter()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    nombre: "",
    categoria_id: "",
    precio: "",
    stock: ""
  })

  const [errores, setErrores] = useState({})
  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchCategorias()
  }, [])

  async function fetchCategorias() {
    const { data } = await supabase
      .from("categorias")
      .select("*")
    setCategorias(data || [])
  }

  const validar = () => {
    const nuevosErrores = {}

    if (!form.nombre) nuevosErrores.nombre = "El nombre es obligatorio"
    if (!form.categoria_id) nuevosErrores.categoria_id = "Selecciona una categoría"
    if (!form.precio) nuevosErrores.precio = "Ingresa un precio"
    if (!form.stock) nuevosErrores.stock = "Ingresa el stock"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (file) => {
    if (file) {
      setImagen(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleImage(e.dataTransfer.files[0])
  }

  async function handleSave(e) {
    e.preventDefault()

    if (!validar()) return

    setGuardando(true)

    let imageUrl = null

    if (imagen) {
      const fileExt = imagen.name.split(".").pop()
      const fileName = `producto_${Date.now()}.${fileExt}`

      await supabase.storage
        .from("productos")
        .upload(fileName, imagen)

      const { data } = supabase
        .storage
        .from("productos")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    await supabase
      .from("productos")
      .insert([{
        nombre: form.nombre,
        categoria_id: form.categoria_id,
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagen_url: imageUrl
      }])

    setGuardando(false)
    setToast("Producto guardado correctamente")

    setTimeout(() => {
      router.push("/home/productos")
    }, 1200)
  }

  return (
    <div className="w-full space-y-10">

      <h1 className="text-3xl font-semibold text-black">
        Añadir producto
      </h1>

      <form
        onSubmit={handleSave}
        className="flex gap-16 bg-white p-12 rounded-3xl shadow-xl"
      >

        {/* DRAG & DROP IMAGEN */}
        <div className="flex flex-col items-center gap-5">

          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative w-[260px] h-[260px]
                       rounded-2xl border-2 border-dashed border-gray-300
                       bg-[#f7f3ef] flex items-center justify-center
                       cursor-pointer hover:border-[#b89c80] transition"
            onClick={() => fileInputRef.current.click()}
          >
            <AnimatePresence>
              {previewUrl ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={previewUrl}
                    alt="preview"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              ) : (
                <div className="text-6xl text-gray-400">
                  🖼
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => handleImage(e.target.files[0])}
            className="hidden"
          />

          <p className="text-sm text-gray-600">
            Arrastra o haz clic para subir imagen
          </p>

        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col gap-6">

          {/* INPUTS */}
          {[
            { name: "nombre", label: "Nombre" },
            { name: "precio", label: "Precio", type: "number" },
            { name: "stock", label: "Stock", type: "number" }
          ].map((campo) => (
            <div key={campo.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black">
                {campo.label}
              </label>
              <input
                type={campo.type || "text"}
                name={campo.name}
                value={form[campo.name]}
                onChange={handleChange}
                className={`px-4 py-3 rounded-xl border
                  ${errores[campo.name]
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-white"}
                  text-black focus:outline-none
                  focus:ring-2 focus:ring-[#b89c80] transition`}
              />
              {errores[campo.name] && (
                <span className="text-red-500 text-sm">
                  {errores[campo.name]}
                </span>
              )}
            </div>
          ))}

          {/* SELECT */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black">
              Categoría
            </label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className={`px-4 py-3 rounded-xl border
                ${errores.categoria_id
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"}
                text-black focus:outline-none
                focus:ring-2 focus:ring-[#b89c80] transition`}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errores.categoria_id && (
              <span className="text-red-500 text-sm">
                {errores.categoria_id}
              </span>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex gap-5 pt-4">

            <button
              type="submit"
              disabled={guardando}
              className="px-8 py-3 rounded-xl bg-[#b89c80] text-white font-semibold
                         hover:bg-[#a38366] transition flex items-center gap-2"
            >
              {guardando && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {guardando ? "Guardando..." : "Guardar producto"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/home/productos")}
              className="px-8 py-3 rounded-xl border border-gray-300
                         bg-white text-black hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

          </div>

        </div>

      </form>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6
                       bg-[#b89c80] text-white
                       px-6 py-3 rounded-xl shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}