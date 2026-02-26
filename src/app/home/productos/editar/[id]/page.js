"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

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

  const [categorias, setCategorias] = useState([])
  const [nuevaImagen, setNuevaImagen] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducto()
    fetchCategorias()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function fetchProducto() {
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single()

    if (data) setForm(data)
    setLoading(false)
  }

  async function fetchCategorias() {
    const { data } = await supabase
      .from("categorias")
      .select("*")

    setCategorias(data || [])
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNuevaImagen(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setGuardando(true)

    let imageUrl = form.imagen_url

    if (nuevaImagen) {
      const fileExt = nuevaImagen.name.split(".").pop()
      const fileName = `${id}_${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from("productos")
        .upload(fileName, nuevaImagen)

      if (!error) {
        const { data } = supabase
          .storage
          .from("productos")
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }
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
    router.push("/home/productos")
  }

  if (loading) return <div style={{ padding: 40 }}>Cargando...</div>

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Editar producto</h1>

      <form style={styles.card} onSubmit={handleSave}>

        {/* Imagen */}
        <div style={styles.imageSection}>
          <div style={styles.imageWrapper}>

            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                fill
                style={{ objectFit: "cover", transition: "0.3s ease" }}
              />
            ) : form.imagen_url ? (
              <Image
                src={form.imagen_url}
                alt="producto"
                fill
                style={{ objectFit: "cover", transition: "0.3s ease" }}
              />
            ) : (
              <div style={styles.imagePlaceholder}>🖼</div>
            )}

          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            style={styles.imageButton}
            onClick={() => fileInputRef.current.click()}
          >
            Cambiar imagen
          </button>
        </div>

        {/* Formulario */}
        <div style={styles.formSection}>

          <div style={styles.field}>
            <label style={styles.label}>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Categoría</label>
            <select
              name="categoria_id"
              value={form.categoria_id || ""}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Precio</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.buttons}>
            <button type="submit" style={styles.saveButton}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => router.push("/home/productos")}
            >
              Cancelar
            </button>
          </div>

        </div>

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
    fontSize: "32px",
    marginBottom: "30px",
    color: "#3b2f2f",
  },
  card: {
    display: "flex",
    gap: "60px",
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "25px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  imageWrapper: {
    position: "relative",
    width: "250px",
    height: "250px",
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "#f0ede9",
  },
  imagePlaceholder: {
    fontSize: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  imageButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#5f8368",
    color: "white",
    cursor: "pointer",
  },
  formSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#5f5f5f",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e2d8cc",
    backgroundColor: "#f7f3ef",
    fontSize: "14px",
  },
  select: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e2d8cc",
    backgroundColor: "#f7f3ef",
    fontSize: "14px",
  },
  row: {
    display: "flex",
    gap: "20px",
  },
  buttons: {
    display: "flex",
    gap: "20px",
    marginTop: "10px",
  },
  saveButton: {
    padding: "12px 30px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#a5a078",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "12px 30px",
    borderRadius: "12px",
    border: "1px solid #d1c7bb",
    backgroundColor: "#f7f3ef",
    cursor: "pointer",
  },
}