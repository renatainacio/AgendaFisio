"use client";

import { useState } from "react";

export type Aula = {
  id: string;
  data: string;
  horário: string;
  duracao: string;
  sala?: string;
  modalidade: string;
  professor: string;
  vagas_ocupadas: string;
  maximo_alunos: string;
};

export default function CardAula({
  aula,
  onAgendarAula,
  agendado,
  idAgendamento,
  onCancelarAgendamento
}: {
  aula: Aula;
  onAgendarAula: (idAula: string) => Promise<void>;
  agendado: boolean;
  idAgendamento?: string;
  onCancelarAgendamento: (idAgendamento: string, idAula: string) => Promise<void>;
}) {
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [loadingCancelar, setLoadingCancelar] = useState(false);

  const handleAgendarClick = async () => {
    setLoadingAgendar(true);
    try {
      await onAgendarAula(aula.id);
    } finally {
      setLoadingAgendar(false);
    }
  };

  const handleCancelarClick = async () => {
    setLoadingCancelar(true);
    try {
      await onCancelarAgendamento(idAgendamento!, aula.id);
    } finally {
      setLoadingCancelar(false);
    }
  };

  const vagasRestantes =
    Number(aula.maximo_alunos) - Number(aula.vagas_ocupadas);

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-white">
      <h2 className="text-lg font-semibold text-blue-600">{aula.modalidade}</h2>
      <p className="text-sm text-gray-600"><strong>Data:</strong> {aula.data}</p>
      <p className="text-sm text-gray-600"><strong>Horário:</strong> {aula.horário}</p>
      <p className="text-sm text-gray-600"><strong>Duração:</strong> {aula.duracao}</p>
      <p className="text-sm text-gray-600"><strong>Professor:</strong> {aula.professor}</p>
      <p className="text-sm text-gray-600">
        <strong>Vagas:</strong> {aula.vagas_ocupadas}/{aula.maximo_alunos}{" "}
        ({vagasRestantes > 0 ? `${vagasRestantes} disponíveis` : "Lotado"})
      </p>

      {agendado ? (
        <button
          onClick={handleCancelarClick}
          disabled={loadingCancelar}
          className="mt-2 px-4 py-2 rounded text-sm w-full bg-red-600 text-white hover:bg-red-700 flex justify-center items-center gap-2"
        >
          {loadingCancelar && (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Cancelar agendamento
        </button>
      ) : (
        <button
          onClick={handleAgendarClick}
          disabled={vagasRestantes <= 0 || loadingAgendar}
          className={`mt-2 px-4 py-2 rounded text-white text-sm w-full flex justify-center items-center gap-2 ${
            vagasRestantes > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loadingAgendar && (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Agendar
        </button>
      )}
    </div>
  );
}