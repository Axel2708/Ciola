"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function EditarProducto() {

  const router = useRouter()
  const { id } = useParams()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    nombre: "",
    categoria_id: "",
    precio: "",
    stock: "",
    imagen_url: ""
  })

  const [formOriginal, setFormOriginal] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [errores, setErrores] = useState({})
  const [nuevaImagen, setNuevaImagen] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [imagenAnterior, setImagenAnterior] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [mostrarModalSalida, setMostrarModalSalida] = useState(false)

  useEffect(() => {
    fetchProducto()
    fetchCategorias()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  async function fetchProducto() {
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      setForm(data)
      setFormOriginal(data)
      setImagenAnterior(data.imagen_url)
    }

    setLoading(false)
  }

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
    if (!form.precio) nuevosErrores.precio = "Ingresa el precio"
    if (!form.stock) nuevosErrores.stock = "Ingresa el stock"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const hayCambios = () => {
    return JSON.stringify(form) !== JSON.stringify(formOriginal) || nuevaImagen
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (file) => {
    if (file) {
      setNuevaImagen(file)
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

    let imageUrl = form.imagen_url

    if (nuevaImagen) {

      // 🔥 eliminar imagen anterior
      if (imagenAnterior) {
        const nombreArchivoAnterior = imagenAnterior.split("/").pop()

        await supabase.storage
          .from("productos")
          .remove([nombreArchivoAnterior])
      }

      const fileExt = nuevaImagen.name.split(".").pop()
      const fileName = `${id}_${Date.now()}.${fileExt}`

      await supabase.storage
        .from("productos")
        .upload(fileName, nuevaImagen)

      const { data } = supabase
        .storage
        .from("productos")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    await supabase
      .from("productos")
      .update({
        nombre: form.nombre,
        categoria_id: form.categoria_id,
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagen_url: imageUrl
      })
      .eq("id", id)

    setGuardando(false)
    setToast("Producto actualizado correctamente")

    setTimeout(() => {
      router.push("/home/productos")
    }, 1200)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="w-8 h-8 border-4 border-[#b89c80] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-10">

      <h1 className="text-3xl font-semibold text-black">
        Editar producto
      </h1>

      <form
        onSubmit={handleSave}
        className="flex gap-16 bg-white p-12 rounded-3xl shadow-xl"
      >

        {/* IMAGEN */}
        <div className="flex flex-col items-center gap-5">

          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
            className="relative w-[260px] h-[260px]
                       rounded-2xl border-2 border-dashed border-gray-300
                       bg-[#f7f3ef] flex items-center justify-center
                       cursor-pointer hover:border-[#b89c80] transition"
          >
            <AnimatePresence>
              {previewUrl ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={previewUrl}
                    alt="preview"
                    fill
                    className="object-cover rounded-2xl"
                  />
                </motion.div>
              ) : form.imagen_url ? (
                <Image
                  src={form.imagen_url}
                  alt="producto"
                  fill
                  className="object-cover rounded-2xl"
                />
              ) : (
                <div className="text-6xl text-gray-400">🖼</div>
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
            Arrastra o haz clic para cambiar imagen
          </p>

        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col gap-6">

          {["nombre", "precio", "stock"].map((campo) => (
            <div key={campo} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black capitalize">
                {campo}
              </label>
              <input
                type={campo === "precio" || campo === "stock" ? "number" : "text"}
                name={campo}
                value={form[campo]}
                onChange={handleChange}
                className={`px-4 py-3 rounded-xl border
                  ${errores[campo]
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-white"}
                  text-black focus:outline-none
                  focus:ring-2 focus:ring-[#b89c80] transition`}
              />
              {errores[campo] && (
                <span className="text-red-500 text-sm">
                  {errores[campo]}
                </span>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black">
              Categoría
            </label>
            <select
              name="categoria_id"
              value={form.categoria_id || ""}
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
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (hayCambios()) {
                  setMostrarModalSalida(true)
                } else {
                  router.push("/home/productos")
                }
              }}
              className="px-8 py-3 rounded-xl border border-gray-300
                         bg-white text-black hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

          </div>

        </div>

      </form>

      {/* MODAL SALIDA */}
      <AnimatePresence>
        {mostrarModalSalida && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm
                       flex items-center justify-center z-50"
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
              <h2 className="text-xl font-semibold text-black mb-3">
                Hay cambios sin guardar
              </h2>

              <p className="text-gray-600 mb-6">
                Si sales ahora perderás los cambios realizados.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setMostrarModalSalida(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Seguir editando
                </button>

                <button
                  onClick={() => router.push("/home/productos")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Salir sin guardar
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