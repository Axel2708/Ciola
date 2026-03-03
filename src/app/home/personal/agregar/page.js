"use client"

import { useRouter } from "next/navigation"

export default function AgregarPersonal() {

  const router = useRouter()

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

      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">
              Nombre
            </label>
            <input
              placeholder="Nombre completo"
              className="px-4 py-3 rounded-xl border border-gray-300
                         text-black focus:ring-2 focus:ring-[#b89c80]
                         outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">
              Email
            </label>
            <input
              placeholder="correo@email.com"
              className="px-4 py-3 rounded-xl border border-gray-300
                         text-black focus:ring-2 focus:ring-[#b89c80]
                         outline-none transition"
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">
              Teléfono
            </label>
            <input
              placeholder="993 000 0000"
              className="px-4 py-3 rounded-xl border border-gray-300
                         text-black focus:ring-2 focus:ring-[#b89c80]
                         outline-none transition"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">
              Rol
            </label>
            <select
              className="px-4 py-3 rounded-xl border border-gray-300
                         text-black focus:ring-2 focus:ring-[#b89c80]
                         outline-none transition"
            >
              <option>Seleccionar rol</option>
              <option>Admin</option>
              <option>Staff</option>
              <option>Marketing</option>
            </select>
          </div>

        </div>

        {/* Dirección */}
        <div className="flex flex-col mt-6">
          <label className="text-sm text-gray-600 mb-2">
            Dirección
          </label>
          <textarea
            placeholder="Dirección completa..."
            className="px-4 py-3 rounded-xl border border-gray-300
                       text-black min-h-[120px]
                       focus:ring-2 focus:ring-[#b89c80]
                       outline-none transition"
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-gray-300
                       text-black hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            className="px-6 py-3 rounded-xl
                       bg-[#b89c80] text-black font-semibold
                       hover:bg-[#a38366] transition"
          >
            Añadir
          </button>

        </div>

      </div>
    </div>
  )
}