"use client"

export default function LoginForm() {
  return (
    <form style={styles.form}>
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

      <button
        type="submit"
        style={styles.button}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#a68b6f"
          e.target.style.transform = "translateY(-3px)"
          e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#b89c80"
          e.target.style.transform = "translateY(0)"
          e.target.style.boxShadow = "none"
        }}
      >
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
    fontSize: "40px",
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