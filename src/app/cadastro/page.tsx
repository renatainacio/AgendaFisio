"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [atendimentosSemana, setAtendimentosSemana] = useState(1);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, cpf, senha, atendimentos_semana: atendimentosSemana })
      });

      const data = await res.json();

      if (!res.ok || !data.sucesso) {
        throw new Error(data.mensagem || "Erro ao cadastrar");
      }

      await router.push("/login");
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Cadastro</h1>
      {erro && <p className="text-red-500">{erro}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
          >
            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
              <input
                {...inputProps}
                type="text"
                className="w-full border p-2 rounded"
                placeholder="CPF"
              />
            )}
          </InputMask>
          {/* <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full border p-2 rounded"
          /> */}
        </div>

        <div>
            <label htmlFor="atendimentosSemana" className="block text-sm font-medium text-gray-700 mb-1">
                Atendimentos por semana
            </label>
            <input
                id="atendimentosSemana"
                type="number"
                min="1"
                max="7"
                value={atendimentosSemana}
                onChange={(e) => setAtendimentosSemana(Number(e.target.value))}
                className="w-full border p-2 rounded"
            />
        </div>


        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha
          </label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full flex justify-center items-center gap-2"
        >
          {loading && (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Cadastrar
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Já tem uma conta?{" "}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Entrar
        </a>
      </p>
    </div>
  );
}
