"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AgregarPersonal() {

  const router = useRouter()

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    id_rol: "",
    activo: true
  })

  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor })
  }

  const guardar = async () => {

    setErrorMsg("")

    if (!form.nombre || !form.telefono || !form.id_rol) {
      setErrorMsg("⚠️ Completa los campos obligatorios")
      return
    }

    const payload = {
      ...form,
      id_rol: Number(form.id_rol)
    }

    console.log("ENVIANDO:", payload)

    const { data, error } = await supabase
      .from("perfiles")
      .insert([payload])

    console.log("DATA:", data)
    console.log("ERROR:", error)

    if (error) {
      setErrorMsg("❌ " + error.message)
      return
    }

    alert("✅ Personal agregado")
    router.push("/home/personal")
  }

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-black">  
          Agregar personal
        </h1>
        <p className="text-gray-500 mt-1">
          Añade un nuevo miembro al equipo
        </p>
      </div>

      {/* ERROR */}
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className="px-4 py-3 border rounded-xl text-black"
          />

          {/* Email */}
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="px-4 py-3 border rounded-xl text-black"
          />

          {/* Teléfono */}
          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            className="px-4 py-3 border rounded-xl text-black"
          />

          {/* Rol */}
          <select
            value={form.id_rol}
            onChange={(e) => handleChange("id_rol", e.target.value)}
            className="px-4 py-3 border rounded-xl text-black"
          >
            <option value="">Seleccionar rol</option>
            <option value="1">Admin</option>
            <option value="2">Staff</option>
            <option value="3">Marketing</option>
          </select>

        </div>

        {/* Dirección */}
        <textarea
          placeholder="Dirección"
          value={form.direccion}
          onChange={(e) => handleChange("direccion", e.target.value)}
          className="mt-6 px-4 py-3 border rounded-xl text-black w-full"
        />

        {/* BOTONES */}
        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-xl text-black"
          >
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="px-6 py-3 bg-[#b89c80] rounded-xl text-black font-semibold"
          >
            Añadir
          </button>

        </div>

      </div>
    </div>
  )
}
