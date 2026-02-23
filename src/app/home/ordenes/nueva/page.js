"use client"

import { useState } from "react"

export default function NuevaOrdenPage() {

  const productos = [
    { id: 1, nombre: "Pastel chocolate", precio: 10, stock: 120 },
    { id: 2, nombre: "Rebanada", precio: 5, stock: 10 },
    { id: 3, nombre: "Tres leches", precio: 15, stock: 20 },
    { id: 4, nombre: "Vainilla", precio: 8, stock: 50 },
  ]

  const [carrito, setCarrito] = useState([])

  const agregarProducto = (producto) => {
    const existe = carrito.find(p => p.id === producto.id)

    if (existe) {
      setCarrito(
        carrito.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      )
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
  }

  const cambiarCantidad = (id, tipo) => {
    setCarrito(
      carrito.map(p => {
        if (p.id === id) {
          const nuevaCantidad =
            tipo === "sumar" ? p.cantidad + 1 : p.cantidad - 1

          return { ...p, cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad }
        }
        return p
      })
    )
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Agregar pedido</h1>

      <div style={styles.content}>

        {/* LADO IZQUIERDO */}
        <div style={styles.left}>

          <input
            placeholder="Buscar producto"
            style={styles.search}
          />

          {productos.map(producto => (
            <div
              key={producto.id}
              style={styles.productCard}
              onClick={() => agregarProducto(producto)}
            >
              <div>
                <strong>{producto.nombre}</strong>
                <p style={styles.stock}>stock : {producto.stock}</p>
              </div>
              <span>${producto.precio}</span>
            </div>
          ))}

        </div>

        {/* LADO DERECHO */}
        <div style={styles.right}>

          <div style={styles.section}>
            <h3>Cliente</h3>
            <select style={styles.input}>
              <option>Seleccionar Cliente</option>
              <option>AXEL</option>
              <option>MIRANDA</option>
            </select>
          </div>

          <div style={styles.section}>
            <h3>Resumen del carrito</h3>

            {carrito.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <div>
                  <strong>{item.nombre}</strong>
                  <p>${item.precio}</p>
                </div>

                <div style={styles.quantity}>
                  <button
                    onClick={() => cambiarCantidad(item.id, "restar")}
                    style={styles.qtyButton}
                  >
                    -
                  </button>

                  {item.cantidad}

                  <button
                    onClick={() => cambiarCantidad(item.id, "sumar")}
                    style={styles.qtyButton}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.section}>
            <h3>Método de pago</h3>
            <select style={styles.input}>
              <option>Efectivo</option>
              <option>Tarjeta</option>
            </select>
          </div>

          <div style={styles.total}>
            <h2>Total</h2>
            <h2>${total}</h2>
          </div>

          <button style={styles.orderButton}>
            Realizar pedido
          </button>

        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f3f1ed",
  },

  title: {
    marginBottom: "20px",
    color: "#3b2f2f",
  },

  content: {
    display: "flex",
    gap: "30px",
  },

  left: {
    flex: 1,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "15px",
  },

  right: {
    width: "350px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "15px",
  },

  search: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  productCard: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#f7f3ef",
    marginBottom: "10px",
    cursor: "pointer",
  },

  stock: {
    fontSize: "12px",
    color: "#777",
    margin: 0,
  },

  section: {
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f3ef",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  quantity: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  qtyButton: {
    border: "none",
    backgroundColor: "#d9cbb6",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "5px 8px",
  },

  total: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },

  orderButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b89c80",
    cursor: "pointer",
    fontWeight: "bold",
  },
}