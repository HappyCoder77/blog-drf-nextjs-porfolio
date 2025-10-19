"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

        <p className="text-lg text-gray-600 mb-6">
          Welcome,{" "}
          <span className="font-semibold text-indigo-600">{user.username}</span>
          ! This is a protected area.
        </p>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition duration-150"
        >
          Logout
        </button>

        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          <p>Protected data from the API will be loaded here.</p>
        </div>
      </div>
    </div>
  );
}
