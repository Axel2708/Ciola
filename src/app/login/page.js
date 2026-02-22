import Image from "next/image"
import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Imagen lado izquierdo */}
        <div style={styles.imageSection}>
          <Image
            src="/logociola.jpeg"
            alt="Logo"
            width={400}
            height={400}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Formulario lado derecho */}
        <div style={styles.formSection}>
          <LoginForm />
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f2ed",
  },
  card: {
    display: "flex",
    width: "1100px",
    height: "600px",
    backgroundColor: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  },
  imageSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "40px",
  },
  formSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
}