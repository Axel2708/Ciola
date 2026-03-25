"use client"

import { useState, useMemo, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function NuevaOrdenPage() {

  const router = useRouter()

  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [search, setSearch] = useState("")
  const [clientes, setClientes] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [toast, setToast] = useState(null)

  const [pastelPersonalizado, setPastelPersonalizado] = useState({
    descripcion: "",
    sabor: "",
    tamaño: "",
    precio: "",
    imagen: null,
    preview: null
  })

  useEffect(() => {
    obtenerProductos()
    obtenerClientes()
  }, [])

  async function obtenerProductos() {
    const { data } = await supabase.from("productos").select("*")
    setProductos(data || [])
  }

  async function obtenerClientes() {
    const { data } = await supabase.from("clientes").select("*")
    setClientes(data || [])
  }

  const productosFiltrados = useMemo(() => {
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, productos])

  const mostrarToast = (mensaje) => {
    setToast(mensaje)
    setTimeout(() => setToast(null), 1500)
  }

  const agregarProducto = (producto, cantidad = 1) => {

    if (producto.stock <= 0) return

    const existe = carrito.find(p => p.id === producto.id)

    if (existe) {
      setCarrito(
        carrito.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        )
      )
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          nombre: producto.nombre,
          imagen_url: producto.imagen_url || null,
          cantidad
        }
      ])
    }

    mostrarToast("✨ Producto añadido")
  }

  const quitarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id !== id))
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

  const agregarPastelPersonalizado = () => {

    if (
      !pastelPersonalizado.descripcion ||
      !pastelPersonalizado.sabor ||
      !pastelPersonalizado.tamaño ||
      !pastelPersonalizado.precio
    ) {
      alert("Completa todos los campos")
      return
    }

    const nuevo = {
      id: Date.now(),
      nombre: "🎂 Pastel personalizado",
      precio: Number(pastelPersonalizado.precio),
      cantidad: 1,
      personalizado: true,
      descripcion: pastelPersonalizado.descripcion,
      sabor: pastelPersonalizado.sabor,
      tamaño: pastelPersonalizado.tamaño,
      imagen_url: pastelPersonalizado.preview
    }

    setCarrito([...carrito, nuevo])
    mostrarToast("🍰 Pastel añadido")

    setPastelPersonalizado({
      descripcion: "",
      sabor: "",
      tamaño: "",
      precio: "",
      imagen: null,
      preview: null
    })
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  return (
    <div className="w-full space-y-8">

      {toast && (
        <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded-xl shadow-lg animate-bounce z-50">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-4">

        <button
          onClick={() => router.push("/home/ordenes")}
          className="px-4 py-2 bg-[#E6D5C3] text-black rounded-lg font-bold hover:bg-[#D6C6B2]"
        >
          ← Regresar
        </button>

        <h1 className="text-3xl font-bold text-black">
          Agregar pedido
        </h1>

      </div>

      {/* CLIENTE */}
      <select
        value={clienteSeleccionado}
        onChange={(e) => setClienteSeleccionado(e.target.value)}
        className="w-full p-3 border rounded-lg text-black font-bold"
      >
        <option value="">Seleccionar cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* MÉTODO DE PAGO */}
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
        className="w-full p-3 border rounded-lg text-black font-bold"
      >
        <option value="">Seleccionar método de pago</option>
        <option value="Efectivo">💵 Efectivo</option>
        <option value="Tarjeta">💳 Tarjeta</option>
        <option value="Transferencia">🏦 Transferencia</option>
      </select>

      <div className="flex gap-8">

        {/* IZQUIERDA */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg space-y-6">

          <input
            placeholder="Buscar producto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-black"
          />

          {productosFiltrados.map(producto => (
            <div key={producto.id}
              className="flex justify-between items-center bg-[#F7F3EF] p-3 rounded-xl">

              <div>
                <p className="font-extrabold text-black text-lg">
                  {producto.nombre}
                </p>
                <p className="text-green-700 font-bold">
                  Stock: {producto.stock}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  id={`qty-${producto.id}`}
                  className="w-16 px-2 py-1 border rounded-md text-center font-bold text-black"
                />

                <button
                  onClick={() => {
                    const qty = Number(
                      document.getElementById(`qty-${producto.id}`).value
                    )
                    agregarProducto(producto, qty)
                  }}
                  className="bg-[#B88A6B] text-white px-3 py-1 rounded-lg"
                >
                  Agregar
                </button>

                <span className="font-extrabold text-black">
                  ${producto.precio}
                </span>
              </div>
            </div>
          ))}

          {/* PASTEL PERSONALIZADO */}
          <div className="border-t pt-6 space-y-4">

            <h2 className="text-xl font-bold text-black">
              Crear pastel personalizado
            </h2>

            <textarea placeholder="Descripción"
              value={pastelPersonalizado.descripcion}
              onChange={(e)=>setPastelPersonalizado({...pastelPersonalizado,descripcion:e.target.value})}
              className="w-full border rounded-lg text-black" />

            <input placeholder="Sabor"
              value={pastelPersonalizado.sabor}
              onChange={(e)=>setPastelPersonalizado({...pastelPersonalizado,sabor:e.target.value})}
              className="w-full border rounded-lg text-black" />

            <input placeholder="Tamaño"
              value={pastelPersonalizado.tamaño}
              onChange={(e)=>setPastelPersonalizado({...pastelPersonalizado,tamaño:e.target.value})}
              className="w-full border rounded-lg text-black" />

            <input placeholder="Precio" type="number"
              value={pastelPersonalizado.precio}
              onChange={(e)=>setPastelPersonalizado({...pastelPersonalizado,precio:e.target.value})}
              className="w-full border rounded-lg text-black" />

            <div
              onClick={()=>document.getElementById("fileInput").click()}
              className="border-2 border-dashed border-[#B88A6B] rounded-xl p-6 text-center cursor-pointer">
              <p className="font-bold text-black">Subir imagen</p>

              {pastelPersonalizado.preview && (
                <img src={pastelPersonalizado.preview}
                  className="mx-auto mt-3 w-40 rounded-lg" />
              )}
            </div>

            <input id="fileInput" type="file" className="hidden"
              onChange={(e)=>{
                const file=e.target.files[0]
                if(file){
                  setPastelPersonalizado({
                    ...pastelPersonalizado,
                    imagen:file,
                    preview:URL.createObjectURL(file)
                  })
                }
              }}/>

            <button
              onClick={agregarPastelPersonalizado}
              className="bg-[#5F8368] text-white px-6 py-2 rounded-xl">
              Agregar pastel personalizado
            </button>

          </div>
        </div>

        {/* DERECHA */}
        <div className="w-[380px] bg-white p-6 rounded-2xl shadow-lg space-y-4">

          <h3 className="font-extrabold text-black text-lg">Carrito</h3>

          {carrito.map(item => (
            <div key={item.id} className="flex gap-3 items-center bg-[#F7F3EF] p-3 rounded-xl">

              {item.imagen_url && (
                <img src={item.imagen_url} className="w-14 h-14 rounded-lg object-cover"/>
              )}

              <div className="flex-1">
                <p className="font-bold text-black">{item.nombre}</p>
                <p className="text-sm text-gray-600">x{item.cantidad}</p>
              </div>

              <span className="font-extrabold text-black">
                ${item.precio * item.cantidad}
              </span>

              <button onClick={()=>quitarProducto(item.id)}>❌</button>
            </div>
          ))}

          <div className="text-2xl font-extrabold text-black">
            Total: ${total}
          </div>

          <button
            onClick={async () => {
              if (!clienteSeleccionado) return alert("Selecciona un cliente")
              if (!metodoPago) return alert("Selecciona método de pago")
              if (carrito.length === 0) return alert("Carrito vacío")

              const { data: orden } = await supabase
                .from("ordenes")
                .insert([{
                  cliente_id: clienteSeleccionado,
                  total,
                  metodo_pago: metodoPago
                }])
                .select()
                .single()

              const detalles = carrito.map(item => ({
                orden_id: orden.id,
                producto_id: item.personalizado ? null : item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio,
                subtotal: item.precio * item.cantidad,
                descripcion: item.personalizado ? item.descripcion : null,
                imagen_url: item.personalizado ? item.imagen_url : null,
                sabor: item.personalizado ? item.sabor : null,
                tamaño: item.personalizado ? item.tamaño : null
              }))

              await supabase.from("detalle_orden").insert(detalles)

              alert("Pedido creado 🧁🔥")
              setCarrito([])
              obtenerProductos()
            }}
            className="w-full py-3 mt-4 bg-[#B88A6B] text-white rounded-xl font-bold hover:bg-[#9F7559]"
          >
            Realizar pedido
          </button>

        </div>
      </div>
    </div>
  )
}