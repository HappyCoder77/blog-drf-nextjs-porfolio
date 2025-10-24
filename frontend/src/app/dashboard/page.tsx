// frontend/app/dashboard/page.tsx (SOLUCIÓN FINAL DE HYDRATION)
"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // 💥 Importar useState
import PostManager from "../../../components/PostManager";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // 💥 ESTADO CLAVE: Rastreamos si el cliente ha terminado de montar (hidratar)
  const [hasMounted, setHasMounted] = useState(false);

  // 1. useEffect de Montaje: Solo corre en el cliente después de la hidratación
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. useEffect de Redirección: Solo corre cuando el cliente está listo
  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasMounted, isAuthenticated, router]);

  // 3. Renderizado de Carga (para el servidor y el cliente inicial)
  // 💥 Mostramos la pantalla de carga si el componente aún no se ha montado
  // O si isAuthenticated es false (lo que dispara la redirección)
  if (!hasMounted || !isAuthenticated) {
    return (
      // 💥 Usamos la estructura de carga simple
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">
          {hasMounted
            ? "Redirecting to Login..."
            : "Checking authentication..."}
        </p>
      </div>
    );
  }

  // 4. Contenido Principal (Solo si ha montado Y está autenticado)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user!.username}!
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150"
            >
              ← Home
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition duration-150"
            >
              Logout
            </button>
          </div>
        </div>
        <PostManager />
      </div>
    </div>
  );
}
