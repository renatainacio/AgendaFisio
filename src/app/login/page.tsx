"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cpf, senha })
      });
      setLoading(false);
      const data = await res.json();

      if (!res.ok || !data.sucesso) {
        throw new Error(data.mensagem || "Erro ao fazer login");
      }

      login(data.token, data.cliente);
      router.push("/");
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro("Erro desconhecido");
      }
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {erro && <p className="text-red-500">{erro}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
        </label>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
        </label>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full flex justify-center items-center gap-2"
            disabled={loading}
            >
            {loading && (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Entrar
        </button>
      </form>
        <p className="text-center text-sm text-gray-600 mt-4">
            Ainda não tem cadastro?{" "}
            <Link href="/cadastro" className="text-blue-600 hover:underline font-medium">
            Cadastre-se aqui
            </Link>
        </p>
    </div>
  );
}
