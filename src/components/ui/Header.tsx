"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-4">AgendaGym</h1>
      <div className="flex items-center gap-4">
        <span className="text-m text-gray-700">Olá, {user.nome}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
