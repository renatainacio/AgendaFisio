"use client";

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

export type Agendamento = {
  id: string;
  id_aula: string;
  data: string;
  horario: string;
  duração: string;
  modalidade: string;
  professor: string;
};
