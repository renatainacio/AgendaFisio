"use client";

import { Atendimento } from "@/app/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function ModalAtendimento({
  atendimento,
  isOpen,
  onClose,
  agendado,
  idAgendamento,
  onAgendar,
  onCancelar,
}: {
  atendimento: Atendimento | null;
  isOpen: boolean;
  onClose: () => void;
  agendado: boolean;
  idAgendamento?: string;
  onAgendar: (id: string) => void;
  onCancelar: (id: string, idAtendimento: string) => void;
}) {
  if (!atendimento) return null;

  const vagasRestantes = Number(atendimento.maximo_alunos) - Number(atendimento.vagas_ocupadas);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{atendimento.modalidade}</DialogTitle>
          <DialogDescription> {atendimento.modalidade}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Data:</strong> {atendimento.data}</p>
          <p><strong>Horário:</strong> {atendimento.horário}</p>
          <p><strong>Duração:</strong> {atendimento.duracao}</p>
          <p><strong>Fisio:</strong> {atendimento.fisio}</p>
          <p><strong>Vagas:</strong> {atendimento.vagas_ocupadas}/{atendimento.maximo_alunos} ({vagasRestantes} restantes)</p>
        </div>

        <DialogFooter>
          {agendado ? (
            <button
              onClick={() => onCancelar(idAgendamento!, atendimento.id)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Cancelar Agendamento
            </button>
          ) : (
            <button
              onClick={() => onAgendar(atendimento.id)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Agendar Atendimento
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
