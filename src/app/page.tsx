"use client";

import { useState, useEffect } from "react";
import { getAulas, getAgendamentos, cancelarAgendamento, agendarAula } from "@/services/api";
import { useAuth } from "../contexts/AuthContext";
import Header from "@/components/ui/Header";
import toast from "react-hot-toast";
import { useCallback } from "react";
import Calendario from "@/components/ui/Calendar";
import { Aula, Agendamento } from "./types";
import { useRouter } from "next/navigation";
import { handleErrors } from "./handleErrors";

export default function Home() {
  const { token, loading } = useAuth();
  const [classes, setClasses] = useState<Aula[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const router = useRouter();


  const fetchAulas = useCallback(async () => {
    try {
      const data = await getAulas(token!);
      setClasses(data.aulas);
    } catch (err){
      handleErrors(err, router, "Erro ao buscar aulas")
    }
  }, [token]);

  const fetchAgendamentos = useCallback(async () => {
    try {
      const data = await getAgendamentos(token!);
      setAgendamentos(data.aulas);
    } catch (err){
      handleErrors(err, router, "Erro ao buscar agendamentos")
    }
  }, [token]);

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
        await fetchAulas();
        await fetchAgendamentos();
      } catch (err){
        handleErrors(err, router, "Erro ao carregar dados")
      }
    }

    fetchInfo();
  }, [token, loading, fetchAulas, fetchAgendamentos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );
  }

  const handleAgendarAula = async (idAula: string) => {
    try {
      await agendarAula(idAula, token!);
      toast.success("Aula agendada com sucesso!");
      await fetchAulas();
      await fetchAgendamentos();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        handleErrors(err, router, "Erro desconhecido ao agendar aula.");
      }
    }
  };


  const handleCancelarAgendamento = async (idAgendamento: string, idAula: string) => {
    try {
      await cancelarAgendamento(idAgendamento, token!);
      toast.success("Agendamento cancelado!");

      setAgendamentos((prev) =>
        prev.filter((ag) => ag.id !== idAgendamento)
      );
      setClasses((prev) =>
        prev.map((aula) =>
          aula.id === idAula
            ? {
                ...aula,
                vagas_ocupadas: (
                  Number(aula.vagas_ocupadas) - 1
                ).toString(),
              }
            : aula
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
          aulas={classes}
          agendamentos={agendamentos}
          onAgendar={handleAgendarAula}
          onCancelar={handleCancelarAgendamento}
        />
    </div>
  );
}
