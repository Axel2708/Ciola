"use client"

export default function AgregarPersonal() {
  return (
    <div style={styles.container}>
      <h1>Agregar personal</h1>

      <div style={styles.card}>
        <input placeholder="Nombre" style={styles.input} />
        <input placeholder="Email" style={styles.input} />

        <div style={{ display: "flex", gap: "10px" }}>
          <input placeholder="Teléfono" style={styles.input} />
          <input placeholder="Rol" style={styles.input} />
        </div>

        <textarea placeholder="Dirección" style={styles.textarea} />

        <div style={styles.buttons}>
          <button style={styles.cancel}>Cancelar</button>
          <button style={styles.add}>Añadir</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: "20px" },
  card: { background: "#d9cbb6", padding: "20px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", borderRadius: "8px", border: "none" },
  textarea: { padding: "10px", borderRadius: "8px", border: "none", minHeight: "100px" },
  buttons: { display: "flex", justifyContent: "space-between" },
  cancel: { padding: "10px 20px", background: "#eee", border: "none", borderRadius: "8px" },
  add: { padding: "10px 20px", background: "#b89c80", border: "none", borderRadius: "8px" }
}