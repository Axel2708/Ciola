"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export default function ProductosPage() {

  const router = useRouter()

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // 🔥 Filtros nuevos
  const [categoriaFiltro, setCategoriaFiltro] = useState("")
  const [soloStockBajo, setSoloStockBajo] = useState(false)
  const [mostrarFiltros, setMostrarFiltos] = useState(false)

  useEffect(() => {
    fetchProductos()
  }, [])

  async function fetchProductos() {

    const { data, error } = await supabase
      .from("productos")
      .select(`
        id,
        nombre,
        precio,
        stock,
        imagen_url,
        categorias (
          nombre
        )
      `)
      .order("created_at", { ascending: false })

    if (!error) {
      setProductos(data || [])
    }

    setLoading(false)
  }

  async function eliminarProducto(id) {

    const confirmar = confirm("¿Seguro que deseas eliminar este producto?")
    if (!confirmar) return

    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id)

    if (!error) {
      fetchProductos()
    }
  }

  // 🔥 FILTRADO INTELIGENTE
  const productosFiltrados = productos.filter(producto => {

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(search.toLowerCase())

    const coincideCategoria =
      categoriaFiltro === "" ||
      producto.categorias?.nombre === categoriaFiltro

    const coincideStock =
      !soloStockBajo || producto.stock <= 5

    return coincideBusqueda && coincideCategoria && coincideStock
  })

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Productos</h1>
        <div style={styles.avatar}></div>
      </div>

      <div style={styles.actions}>
        <div style={styles.leftActions}>
          <input
            placeholder="Buscar producto"
            style={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            style={styles.filterButton}
            onClick={() => setMostrarFiltos(prev => !prev)}
          >
            Filtro
          </button>
        </div>

        <button
          style={styles.addButton}
          onClick={() => router.push("/home/productos/agregar")}
        >
          Añadir producto
        </button>
      </div>

      {/* 🔥 PANEL FILTROS */}
      {mostrarFiltros && (
        <div style={styles.filtroPanel}>
          
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={styles.search}
          >
            <option value="">Todas las categorías</option>
            {[...new Set(productos.map(p => p.categorias?.nombre))]
              .filter(Boolean)
              .map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))
            }
          </select>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={soloStockBajo}
              onChange={() => setSoloStockBajo(!soloStockBajo)}
            />
            Solo stock bajo (≤5)
          </label>

        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Imagen</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={styles.td}>Cargando...</td>
              </tr>
            ) : productosFiltrados.length === 0 ? (
              <tr>
                <td style={styles.td}>No hay productos</td>
              </tr>
            ) : (
              productosFiltrados.map((producto) => (
                <tr key={producto.id} style={styles.tr}>
                  
                  <td style={styles.td}>
                    {producto.imagen_url ? (
                      <Image
                        src={producto.imagen_url}
                        alt="producto"
                        width={50}
                        height={50}
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    ) : "—"}
                  </td>

                  <td style={styles.td}>{producto.nombre}</td>
                  <td style={styles.td}>${producto.precio}</td>
                  <td style={styles.td}>{producto.stock}</td>
                  <td style={styles.td}>
                    {producto.categorias?.nombre || "Sin categoría"}
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.editButton}
                        onClick={() =>
                          router.push(`/home/productos/editar/${producto.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: "#f3f1ed",
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#3b2f2f",
    fontWeight: "600",
  },
  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#b89c80",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  leftActions: {
    display: "flex",
    gap: "15px",
  },
  search: {
    width: "320px",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#d9cbb6",
    outline: "none",
    fontSize: "14px",
  },
  filterButton: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#d9cbb6",
    cursor: "pointer",
    fontWeight: "500",
  },
  filtroPanel: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  addButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#e7dccb",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "18px",
    backgroundColor: "#f5f2ed",
    fontWeight: "600",
    fontSize: "14px",
  },
  tr: {
    borderTop: "1px solid #f0f0f0",
  },
  td: {
    padding: "18px",
    fontSize: "14px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#f4b183",
    cursor: "pointer",
    fontWeight: "500",
  },
  deleteButton: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#e76f51",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },
}