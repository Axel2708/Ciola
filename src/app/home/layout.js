"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export default function HomeLayout({ children }) {

  const pathname = usePathname()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [rol, setRol] = useState(null)

  useEffect(() => {
    checkUser()
  }, [pathname])

  function tienePermiso(ruta, rol) {
    const permisos = {
      Admin: [
        "/home",
        "/home/clientes",
        "/home/productos",
        "/home/ordenes",
        "/home/reportes",
        "/home/personal"
      ],
      Vendedor: [
        "/home",
        "/home/clientes",
        "/home/ordenes"
      ],
      Marketing: [
        "/home",
        "/home/clientes",
        "/home/reportes"
      ],
    }

    return permisos[rol]?.some(baseRuta =>
      ruta.startsWith(baseRuta)
    )
  }

  async function checkUser() {

    setLoading(true)

    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      router.replace("/login")
      return
    }

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select(`
        id,
        rol:rol (
          nombre
        )
      `)
      .eq("id", authData.user.id)
      .single()

    if (error || !perfil) {
      router.replace("/login")
      return
    }

    const rolUsuario = perfil.rol?.nombre

    if (!rolUsuario) {
      router.replace("/login")
      return
    }

    if (!tienePermiso(pathname, rolUsuario)) {
      router.replace("/home")
      return
    }

    setRol(rolUsuario)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  const allMenuItems = [
    { name: "Dashboard", path: "/home", roles: ["Admin", "Vendedor", "Marketing"] },
    { name: "Clientes", path: "/home/clientes", roles: ["Admin", "Vendedor", "Marketing"] },
    { name: "Productos", path: "/home/productos", roles: ["Admin"] },
    { name: "Órdenes", path: "/home/ordenes", roles: ["Admin", "Vendedor"] },
    { name: "Reportes", path: "/home/reportes", roles: ["Admin", "Marketing"] },
    { name: "Personal", path: "/home/personal", roles: ["Admin"] },
  ]

  const menuItems = allMenuItems.filter(item =>
    rol && item.roles.includes(rol)
  )

  if (loading) {
    return (
      <div className="p-10 text-lg">
        Cargando permisos...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#f3f1ed]">

      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#5f8368] text-white px-5 py-10 flex flex-col justify-between shrink-0">

        <div>
          <div className="flex justify-center mb-3">
            <Image
              src="/cv.png"
              alt="Sidebar"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-center text-xl font-bold mb-8">
            Menú
          </h2>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {

              const isActive =
                item.path === "/home"
                  ? pathname === "/home"
                  : pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative pl-6 pr-4 py-3 rounded-lg transition-all duration-300
                    ${isActive ? "bg-[#b89c80]" : "hover:bg-[#4f705a]"}`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-[60%] bg-white rounded-r-md"></span>
                  )}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="py-3 rounded-lg bg-[#b89c80] hover:bg-[#a38366] transition duration-300"
        >
          Salir
        </button>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 flex">
        <div className="bg-white rounded-[25px] p-10 w-full h-[calc(100vh-80px)] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      </main>

    </div>
  )
}