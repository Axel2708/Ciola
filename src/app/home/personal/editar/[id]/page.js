"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function EditarPersonalPage() {

  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    direccion: ""
  })

  // 🔥 CARGAR DATOS REALES
  useEffect(() => {
    if (id) obtenerPersona()
  }, [id])

  const obtenerPersona = async () => {

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.log(error)
      return
    }

    setForm({
      nombre: data.nombre || "",
      email: data.email || "",
      telefono: data.telefono || "",
      direccion: data.direccion || "",
      rol: convertirRol(data.id_rol)
    })
  }

  // 🔄 CONVERTIR ID → TEXTO
  const convertirRol = (id) => {
    if (id === 1) return "Admin"
    if (id === 2) return "Staff"
    if (id === 3) return "Marketing"
    return ""
  }

  // 🔄 TEXTO → ID
  const convertirRolId = (rol) => {
    if (rol === "Admin") return 1
    if (rol === "Staff") return 2
    if (rol === "Marketing") return 3
    return null
  }

  // INPUTS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // 💾 GUARDAR
  const guardar = async () => {

    const { error } = await supabase
      .from("perfiles")
      .update({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        id_rol: convertirRolId(form.rol)
      })
      .eq("id", id)

    if (error) {
      console.log(error)
      alert("Error al actualizar")
      return
    }

    alert("Actualizado ✨")
    router.push("/home/personal")
  }

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-black">
            Editar personal
          </h1>
          <p className="text-gray-500 mt-1">
            Modifica la información del miembro del equipo
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#b89c80]" />
      </div>

      {/* CARD */}
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-4xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 text-black"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 text-black"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 text-black"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 text-black"
            >
              <option>Admin</option>
              <option>Staff</option>
              <option>Marketing</option>
            </select>
          </div>

        </div>

        {/* Dirección */}
        <div className="flex flex-col mt-6">
          <label className="text-sm text-gray-600 mb-2">Dirección</label>
          <textarea
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-gray-300 text-black min-h-[120px]"
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={() => router.push("/home/personal")}
            className="px-6 py-3 border border-gray-300 text-black rounded-xl"
          >
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="px-6 py-3 bg-[#b89c80] text-black font-semibold rounded-xl"
          >
            Guardar cambios
          </button>

        </div>

      </div>

    </div>
  )
}