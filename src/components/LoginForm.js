"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function LoginForm() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Completa todos los campos")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      console.log(error)
      alert("Correo o contraseña incorrectos")
    } else {
      router.push("/home")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-[350px] gap-5"
    >
      <h2
  className="text-2xl text-gray-800"
  style={{ fontFamily: "Times New Roman, serif" }}
>
  Inicia Sesion
</h2>

    <input
  type="email"
  placeholder="Correo electrónico"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="px-4 py-3 rounded-lg border border-gray-300 text-base text-black
             placeholder:text-gray-500
             focus:outline-none focus:ring-2 focus:ring-[#b89c80]
             transition duration-300"
/>

<input
  type="password"
  placeholder="Contraseña"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="px-4 py-3 rounded-lg border border-gray-300 text-base text-black
             placeholder:text-gray-500
             focus:outline-none focus:ring-2 focus:ring-[#b89c80]
             transition duration-300"
/>
      <button
        type="submit"
        disabled={loading}
        className="py-3 rounded-lg bg-[#b89c80] text-white text-base
                   transition duration-300
                   hover:bg-[#a38366] hover:shadow-md hover:scale-[1.02]
                   active:scale-[0.98]
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  )
}