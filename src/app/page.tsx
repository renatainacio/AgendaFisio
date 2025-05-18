"use client";

import { useState, useEffect } from "react";
import { getAtendimentos, getAgendamentos, cancelarAgendamento, agendarAtendimento } from "@/services/api";
import { useAuth } from "../contexts/AuthContext";
import Header from "@/components/ui/Header";
import toast from "react-hot-toast";
import { useCallback } from "react";
import Calendario from "@/components/ui/Calendar";
import { Atendimento, Agendamento } from "./types";
import { useRouter } from "next/navigation";
import { handleErrors } from "./handleErrors";

export default function Home() {
  const { token, loading } = useAuth();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const router = useRouter();


  const fetchAtendimentos = useCallback(async () => {
    try {
      const data = await getAtendimentos(token!);
      setAtendimentos(data.atendimentos);
    } catch (err){
      handleErrors(err, router, "Erro ao buscar atendimentos")
    }
  }, [token, router]);

  const fetchAgendamentos = useCallback(async () => {
    try {
      const data = await getAgendamentos(token!);
      setAgendamentos(data.agendamentos);
    } catch (err){
      handleErrors(err, router, "Erro ao buscar agendamentos")
    }
  }, [token, router]);

  useEffect(() => {
    "verificando auth"
    if (!token && !loading) {
      router.replace("/login");
    }
  }, [token, loading, router]);

  useEffect(() => {
    if (!token || loading) return;

    async function fetchInfo() {
      try {
        await fetchAtendimentos();
        await fetchAgendamentos();
      } catch (err){
        handleErrors(err, router, "Erro ao carregar dados")
      }
    }

    fetchInfo();
  }, [token, loading, fetchAtendimentos, fetchAgendamentos, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );
  }

  const handleAgendarAtendimento = async (idAtendimento: string) => {
    try {
      await agendarAtendimento(idAtendimento, token!);
      toast.success("Atendimento agendado com sucesso!");
      await fetchAtendimentos();
      await fetchAgendamentos();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        handleErrors(err, router, "Erro desconhecido ao agendar atendimento.");
      }
    }
  };


  const handleCancelarAgendamento = async (idAgendamento: string, idAtendimento: string) => {
    try {
      await cancelarAgendamento(idAgendamento, token!);
      toast.success("Agendamento cancelado!");

      setAgendamentos((prev) =>
        prev.filter((ag) => ag.id !== idAgendamento)
      );
      setAtendimentos((prev) =>
        prev.map((atendimento) =>
          atendimento.id === idAtendimento
            ? {
                ...atendimento,
                vagas_ocupadas: (
                  Number(atendimento.vagas_ocupadas) - 1
                ).toString(),
              }
            : atendimento
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        handleErrors(err, router, "Erro desconhecido ao cancelar agendamento.");
      }
    }
  }

  return (
    <div className="p-4 pt-20">
      <Header />
      <Calendario
          atendimentos={atendimentos}
          agendamentos={agendamentos}
          onAgendar={handleAgendarAtendimento}
          onCancelar={handleCancelarAgendamento}
        />
    </div>
  );
}
