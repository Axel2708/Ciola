"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function PersonalPage() {

  const [search, setSearch] = useState("")
  const [personal, setPersonal] = useState([])

  useEffect(() => {
    obtenerPersonal()
  }, [])

  async function obtenerPersonal() {
    const { data, error } = await supabase
      .from("perfiles")
      .select("*")

    if (error) {
      console.error(error)
      return
    }

    setPersonal(data || [])
  }

  // 🔍 FILTRO MEJORADO
  const filtrado = useMemo(() => {
    return personal.filter(p =>
      (p.nombre || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    )
  }, [search, personal])

  // 🎨 STATUS
  const getStatusStyle = (activo) => {
    return activo
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }

  // 🎭 ROL BONITO
  const getRol = (id) => {
    if (id === 1) return "Admin"
    if (id === 2) return "Staff"
    if (id === 3) return "Marketing"
    return "Sin rol"
  }

  // 🗑️ ELIMINAR (INSTANTÁNEO 🔥)
  const eliminar = async (id) => {

    const confirm = window.confirm("¿Eliminar usuario?")
    if (!confirm) return

    const { error } = await supabase
      .from("perfiles")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar")
      return
    }

    // 💥 ACTUALIZAR UI SIN RECARGAR
    setPersonal(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="w-full space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-black">
          Lista de personal
        </h1>
        <p className="text-gray-500 mt-1">
          Gestiona roles y estados del equipo
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex flex-wrap gap-4 items-center">

        <input
          placeholder="Buscar personal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300
                     focus:ring-2 focus:ring-[#b89c80]
                     text-black w-64"
        />

        <button
          className="px-5 py-2 rounded-xl
                     bg-[#d9cbb6] text-black font-medium
                     hover:bg-[#cbbba5] transition"
        >
          Filtrar por rol
        </button>

        <Link
          href="/home/personal/agregar"
          className="ml-auto px-5 py-2 rounded-xl
                     bg-[#b89c80] text-black font-semibold
                     hover:bg-[#a38366] transition"
        >
          + Añadir personal
        </Link>

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#f5f2ed]">
            <tr>
              <th className="text-left p-4 text-black font-semibold">Nombre</th>
              <th className="text-left p-4 text-black font-semibold">Email</th>
              <th className="text-left p-4 text-black font-semibold">Rol</th>
              <th className="text-left p-4 text-black font-semibold">Status</th>
              <th className="text-left p-4 text-black font-semibold">Acción</th>
            </tr>
          </thead>

          <tbody>

            {filtrado.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No se encontraron resultados 😢
                </td>
              </tr>
            )}

            {filtrado.map((persona) => (
              <tr
                key={persona.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 text-black">{persona.nombre}</td>
                <td className="p-4 text-black">{persona.email}</td>

                <td className="p-4 text-black">
                  {getRol(persona.id_rol)}
                </td>

                <td className="p-4">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusStyle(persona.activo)}`}
                  >
                    {persona.activo ? "Activo" : "Desactivado"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-3">

                    <Link
                      href={`/home/personal/editar/${persona.id}`}
                      className="px-3 py-1 rounded-lg
                                 bg-[#f4b183] hover:bg-[#e39a63]
                                 transition"
                    >
                      ✏️
                    </Link>

                    <button
                      onClick={() => eliminar(persona.id)}
                      className="px-3 py-1 rounded-lg
                                 bg-[#e76f51] text-white
                                 hover:bg-[#d65b3f] transition"
                    >
                      🗑️
                    </button>

                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  )
}