"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Aula } from "./CardAula";

export default function ModalAula({
  aula,
  isOpen,
  onClose,
  agendado,
  idAgendamento,
  onAgendar,
  onCancelar,
}: {
  aula: Aula | null;
  isOpen: boolean;
  onClose: () => void;
  agendado: boolean;
  idAgendamento?: string;
  onAgendar: (id: string) => void;
  onCancelar: (id: string, idAula: string) => void;
}) {
  if (!aula) return null;

  const vagasRestantes = Number(aula.maximo_alunos) - Number(aula.vagas_ocupadas);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{aula.modalidade}</DialogTitle>
          <DialogDescription> {aula.modalidade}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Data:</strong> {aula.data}</p>
          <p><strong>Horário:</strong> {aula.horário}</p>
          <p><strong>Duração:</strong> {aula.duracao}</p>
          <p><strong>Professor:</strong> {aula.professor}</p>
          <p><strong>Vagas:</strong> {aula.vagas_ocupadas}/{aula.maximo_alunos} ({vagasRestantes} restantes)</p>
        </div>

        <DialogFooter>
          {agendado ? (
            <button
              onClick={() => onCancelar(idAgendamento!, aula.id)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Cancelar Agendamento
            </button>
          ) : (
            <button
              onClick={() => onAgendar(aula.id)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Agendar Aula
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
