"use client"

import Link from "next/link"
import { useState } from "react"

export default function PersonalPage() {

  const [search, setSearch] = useState("")

  const personal = [
    { id: 1, nombre: "Persona 1", email: "persona1@gmail.com", rol: "Admin", status: "Activo" },
    { id: 2, nombre: "Persona 2", email: "persona2@gmail.com", rol: "Staff", status: "Activo" },
    { id: 3, nombre: "Persona 3", email: "persona3@gmail.com", rol: "Staff", status: "Desactivado" },
    { id: 4, nombre: "Persona 4", email: "persona4@gmail.com", rol: "Staff", status: "Activo" },
  ]

  const filtrado = personal.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusStyle = (status) => {
    if (status === "Activo")
      return "bg-green-100 text-green-700"
    return "bg-red-100 text-red-700"
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

            {filtrado.map((persona) => (
              <tr
                key={persona.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 text-black">{persona.nombre}</td>
                <td className="p-4 text-black">{persona.email}</td>
                <td className="p-4 text-black">{persona.rol}</td>

                <td className="p-4">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusStyle(persona.status)}`}
                  >
                    {persona.status}
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