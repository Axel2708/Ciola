"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function HomeLayout({ children }) {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", path: "/home" },
    { name: "Clientes", path: "/home/clientes" },
    { name: "Productos", path: "/home/productos" },
    { name: "Órdenes", path: "/home/ordenes" },
    { name: "Reportes", path: "/home/reportes" },
    { name: "Personal", path: "/home/personal" },
  ]

  return (
    <div style={styles.container}>

      {/* Sidebar */}
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

          <h2 style={styles.logo}>Dashboard</h2>

          <div style={styles.menu}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path

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

        <Link href="/login" style={styles.logout}>
          Salir
        </Link>

      </div>

      {/* Main */}
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
    backgroundColor: "#b89c80",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
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