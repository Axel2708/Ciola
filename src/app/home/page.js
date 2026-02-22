"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Dashboard</h2>

          <div style={styles.menu}>
            <div style={styles.activeItem}>Dashboard</div>
            <div style={styles.menuItem}>Cliente</div>
            <div style={styles.menuItem}>Productos</div>
            <div style={styles.menuItem}>Órdenes</div>
            <div style={styles.menuItem}>Reportes</div>
            <div style={styles.menuItem}>Administrar personal</div>
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logout}>
          Salir
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        
        {/* Top bar */}
        <div style={styles.topbar}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>

          <div style={styles.searchContainer}>
            <input placeholder="Buscar" style={styles.search} />
            <div style={styles.avatar}></div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.cardsRow}>
          <div style={styles.card}>
            <h3>Órdenes totales</h3>
            <h2>200</h2>
          </div>

          <div style={styles.card}>
            <h3>Ventas</h3>
            <h2>$40</h2>
          </div>

          <div style={styles.card}>
            <h3>Low</h3>
            <h2>5</h2>
          </div>
        </div>

        {/* Content */}
        <div style={styles.contentRow}>
          <div style={styles.largeCard}>
            <h3>Ventas generales</h3>
            <div style={styles.fakeChart}></div>
          </div>

          <div style={styles.largeCard}>
            <h3>Resumen de pedidos</h3>
            <div style={styles.bars}>
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f3f1ed",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: "250px",
    backgroundColor: "#5f8368",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    marginBottom: "40px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  activeItem: {
    backgroundColor: "#b89c80",
    padding: "10px",
    borderRadius: "8px",
  },

  menuItem: {
    opacity: 0.9,
    cursor: "pointer",
  },

  logout: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#b89c80",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  main: {
    flex: 1,
    padding: "40px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  search: {
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ddd",
  },

  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#b89c80",
    borderRadius: "50%",
  },

  cardsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    flex: 1,
    backgroundColor: "#d9cbb6",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  contentRow: {
    display: "flex",
    gap: "20px",
  },

  largeCard: {
    flex: 1,
    backgroundColor: "#d9cbb6",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  fakeChart: {
    height: "150px",
    backgroundColor: "#c9b8a0",
    borderRadius: "10px",
    marginTop: "20px",
  },

  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    marginTop: "20px",
    height: "150px",
  },

  bar: {
    width: "30px",
    height: "80px",
    backgroundColor: "#5f8368",
    borderRadius: "5px",
  },
}