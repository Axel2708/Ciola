"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ProductosPage() {

  const router = useRouter()

  const [productos, setProductos] = useState([
    {
      id: 1,
      imagen: "/prod1.png",
      nombre: "producto",
      precio: 20,
      stock: 25,
      categoria: "Pastel"
    },
    {
      id: 2,
      imagen: "/prod2.png",
      nombre: "producto",
      precio: 5,
      stock: 25,
      categoria: "Pastel"
    },
    {
      id: 3,
      imagen: "/prod3.png",
      nombre: "producto",
      precio: 15,
      stock: 25,
      categoria: "Pastel"
    },
    {
      id: 4,
      imagen: "/prod4.png",
      nombre: "producto",
      precio: 15,
      stock: 25,
      categoria: "Pastel"
    },
  ])

  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter(p => p.id !== id)
    setProductos(nuevosProductos)
  }

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Productos</h1>
        <div style={styles.avatar}></div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <div style={styles.leftActions}>
          <input
            placeholder="Buscar producto"
            style={styles.search}
          />

          <button style={styles.filterButton}>
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

      {/* Tabla */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>stock</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} style={styles.tr}>
                
                <td style={styles.td}>
                  <Image
                    src={producto.imagen}
                    alt="producto"
                    width={50}
                    height={50}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                </td>

                <td style={styles.td}>{producto.nombre}</td>
                <td style={styles.td}>${producto.precio}</td>
                <td style={styles.td}>{producto.stock}</td>
                <td style={styles.td}>{producto.categoria}</td>

                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.editButton}
                      onClick={() => router.push(`/home/productos/editar/${producto.id}`)}
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
            ))}
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