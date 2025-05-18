"use client";

export type Atendimento = {
  id: string;
  data: string;
  horário: string;
  duracao: string;
  sala?: string;
  modalidade: string;
  fisio: string;
  vagas_ocupadas: string;
  maximo_alunos: string;
};

export type Agendamento = {
  id: string;
  id_atendimento: string;
  data: string;
  horario: string;
  duração: string;
  modalidade: string;
  fisio: string;
};
