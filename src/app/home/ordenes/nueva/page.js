"use client"

import { useState, useMemo } from "react"

export default function NuevaOrdenPage() {

  const productos = [
    { id: 1, nombre: "Pastel chocolate", precio: 10, stock: 120 },
    { id: 2, nombre: "Rebanada", precio: 5, stock: 10 },
    { id: 3, nombre: "Tres leches", precio: 15, stock: 20 },
    { id: 4, nombre: "Vainilla", precio: 8, stock: 50 },
  ]

  const [carrito, setCarrito] = useState([])
  const [search, setSearch] = useState("")

  const [pastelPersonalizado, setPastelPersonalizado] = useState({
    descripcion: "",
    sabor: "",
    tamaño: "",
    imagen: null,
    preview: null
  })

  // 🔎 FILTRO PRODUCTOS
  const productosFiltrados = useMemo(() => {
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  // 🛒 AGREGAR PRODUCTO NORMAL
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

  // ❌ QUITAR PRODUCTO
  const quitarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id !== id))
  }

  // ➕➖ CAMBIAR CANTIDAD
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

  // 🍰 AGREGAR PASTEL PERSONALIZADO
  const agregarPastelPersonalizado = () => {

    if (
      !pastelPersonalizado.descripcion ||
      !pastelPersonalizado.sabor ||
      !pastelPersonalizado.tamaño
    ) {
      alert("Completa todos los campos del pastel")
      return
    }

    const nuevo = {
      id: Date.now(),
      nombre: "Pastel personalizado",
      precio: 50,
      cantidad: 1,
      personalizado: true,
      ...pastelPersonalizado
    }

    setCarrito([...carrito, nuevo])

    // Reset
    setPastelPersonalizado({
      descripcion: "",
      sabor: "",
      tamaño: "",
      imagen: null,
      preview: null
    })
  }

  // 💰 TOTAL
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  return (
    <div className="w-full space-y-8">

      <h1 className="text-3xl font-semibold text-black">
        Agregar pedido
      </h1>

      <div className="flex gap-8">

        {/* IZQUIERDA */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow space-y-6">

          <input
            placeholder="Buscar producto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-[#b89c80]"
          />

          <div className="space-y-3">
            {productosFiltrados.map(producto => (
              <div
                key={producto.id}
                onClick={() => agregarProducto(producto)}
                className="flex justify-between bg-[#f7f3ef] hover:bg-[#eee7df] px-4 py-3 rounded-xl cursor-pointer transition"
              >
                <div>
                  <p className="font-semibold text-black">{producto.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Stock: {producto.stock}
                  </p>
                </div>
                <span className="font-semibold text-black">
                  ${producto.precio}
                </span>
              </div>
            ))}
          </div>

          {/* 🍰 CREAR PASTEL PERSONALIZADO */}
          <div className="border-t pt-6 space-y-4">

            <h2 className="text-xl font-semibold text-black">
              Crear pastel personalizado
            </h2>

            <textarea
              placeholder="Descripción del diseño..."
              value={pastelPersonalizado.descripcion}
              onChange={(e) =>
                setPastelPersonalizado({
                  ...pastelPersonalizado,
                  descripcion: e.target.value
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black"
            />

            <input
              placeholder="Sabor"
              value={pastelPersonalizado.sabor}
              onChange={(e) =>
                setPastelPersonalizado({
                  ...pastelPersonalizado,
                  sabor: e.target.value
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black"
            />

            <input
              placeholder="Tamaño (ej. 1kg, 2 pisos...)"
              value={pastelPersonalizado.tamaño}
              onChange={(e) =>
                setPastelPersonalizado({
                  ...pastelPersonalizado,
                  tamaño: e.target.value
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black"
            />

            {/* DRAG & DROP */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) {
                  setPastelPersonalizado({
                    ...pastelPersonalizado,
                    imagen: file,
                    preview: URL.createObjectURL(file)
                  })
                }
              }}
              onClick={() => document.getElementById("fileInputPastel").click()}
              className="border-2 border-dashed border-[#b89c80]
                         rounded-xl p-6 text-center cursor-pointer
                         hover:bg-[#f7f3ef] transition"
            >
              <p className="text-black">
                Arrastra la imagen aquí o haz click
              </p>

              {pastelPersonalizado.preview && (
                <img
                  src={pastelPersonalizado.preview}
                  alt="preview"
                  className="mx-auto mt-4 w-40 rounded-lg"
                />
              )}
            </div>

            <input
              id="fileInputPastel"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  setPastelPersonalizado({
                    ...pastelPersonalizado,
                    imagen: file,
                    preview: URL.createObjectURL(file)
                  })
                }
              }}
            />

            <button
              onClick={agregarPastelPersonalizado}
              className="px-6 py-2 bg-[#b89c80] text-black rounded-xl hover:bg-[#a38366] transition font-semibold"
            >
              Agregar pastel personalizado
            </button>

          </div>
        </div>

        {/* DERECHA */}
        <div className="w-[380px] bg-white p-6 rounded-2xl shadow space-y-6">

          <h3 className="text-black font-semibold">
            Resumen del carrito
          </h3>

          {carrito.length === 0 && (
            <p className="text-gray-500 text-sm">
              No hay productos agregados
            </p>
          )}

          {carrito.map(item => (
            <div
              key={item.id}
              className="bg-[#f7f3ef] px-4 py-3 rounded-xl space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-black">
                  {item.nombre}
                </p>

                <button
                  onClick={() => quitarProducto(item.id)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>

              {item.personalizado && (
                <p className="text-sm text-gray-600">
                  {item.descripcion} | {item.sabor} | {item.tamaño}
                </p>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => cambiarCantidad(item.id, "restar")}
                    className="w-7 h-7 bg-[#d9cbb6] rounded-full"
                  >
                    -
                  </button>

                  <span className="text-black">
                    {item.cantidad}
                  </span>

                  <button
                    onClick={() => cambiarCantidad(item.id, "sumar")}
                    className="w-7 h-7 bg-[#d9cbb6] rounded-full"
                  >
                    +
                  </button>
                </div>

                <span className="font-semibold text-black">
                  ${item.precio * item.cantidad}
                </span>
              </div>
            </div>
          ))}

          <div className="flex justify-between text-xl font-bold text-black border-t pt-4">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button className="w-full py-3 bg-[#b89c80] text-black rounded-xl hover:bg-[#a38366] transition font-semibold">
            Realizar pedido
          </button>

        </div>
      </div>
    </div>
  )
}