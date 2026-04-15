import { redirect } from "next/navigation"

export default function Home() {
  const isLoggedIn = false // aquí luego pones tu lógica real

  if (!isLoggedIn) {
    redirect("/login")
  }

  return (
    <div style={{ padding: "40px", fontSize: "24px" }}>
      Home funcionando ✅
    </div>
  )
}