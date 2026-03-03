import Image from "next/image"
import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#f5f2ed]">
      
      <div className="flex w-[1500px] h-[700px] bg-white rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
        
        {/* Imagen lado izquierdo */}
        <div className="flex-1 flex justify-start items-center p-10">
          <Image
            src="/logociola.jpeg"
            alt="Logo"
            width={800}
            height={800}
            className="object-contain"
            priority
          />
        </div>

        {/* Formulario lado derecho */}
        <div className="flex-1 flex justify-center items-center p-10">
          <div className="w-full max-w-md">
            
            <h1
              className="text-4xl mb-8 text-gray-800"
              style={{ fontFamily: "Times New Roman, serif" }}
            >
              Bienvenido
            </h1>

            <LoginForm />

          </div>
        </div>

      </div>

    </div>
  )
}