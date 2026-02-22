"use client"

import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push("/home")
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Bienvenido</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Contraseña"
        style={styles.input}
      />

      <button type="submit" style={styles.button}>
        Iniciar sesión
      </button>
    </form>
  )
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "350px",
    gap: "20px",
  },
  title: {
    marginBottom: "10px",
    fontSize: "28px",
    color: "#333",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b89c80",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
}