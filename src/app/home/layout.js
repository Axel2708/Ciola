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
      <div style={{ padding: "40px", fontSize: "18px" }}>
        Cargando permisos...
      </div>
    )
  }

  return (
    <div style={styles.container}>

      <div style={styles.sidebar}>

        <div>
          <div style={styles.imageContainer}>
            <Image
              src="/cv.png"
              alt="Sidebar"
              width={150}
              height={150}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <h2 style={styles.logo}>Menú</h2>

          <div style={styles.menu}>
            {menuItems.map((item) => {

              // 🔥 CORRECCIÓN IMPORTANTE AQUÍ
              const isActive =
                item.path === "/home"
                  ? pathname === "/home"
                  : pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{
                    ...styles.menuItem,
                    ...(isActive && styles.activeItem),
                  }}
                >
                  {isActive && <span style={styles.activeBar}></span>}
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logout}>
          Salir
        </button>

      </div>

      <div style={styles.main}>
        <div style={styles.dashboardContainer}>
          {children}
        </div>
      </div>

    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#f3f1ed",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: "260px",
    backgroundColor: "#5f8368",
    color: "white",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexShrink: 0,
  },

  imageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },

  logo: {
    marginBottom: "30px",
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  menuItem: {
    position: "relative",
    padding: "12px 15px 12px 25px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "white",
    transition: "all 0.3s ease",
  },

  activeItem: {
    backgroundColor: "#b89c80",
  },

  activeBar: {
    position: "absolute",
    left: "0",
    top: "50%",
    transform: "translateY(-50%)",
    width: "6px",
    height: "60%",
    backgroundColor: "white",
    borderRadius: "0 4px 4px 0",
  },

  logout: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#b89c80",
    color: "white",
    textAlign: "center",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "40px",
    display: "flex",
  },

  dashboardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "25px",
    padding: "40px",
    width: "100%",
    height: "calc(100vh - 80px)",
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  },
}