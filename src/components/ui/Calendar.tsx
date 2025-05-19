"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalAtendimento from "./ModalAtendimento";
import { Agendamento, Atendimento } from "@/app/types";

type Props = {
  atendimentos: Atendimento[];
  agendamentos: Agendamento[];
  onAgendar: (idAtendimento: string) => void;
  onCancelar: (idAgendamento: string, idAtendimento: string) => void;
};

function formatarData(dataBR: string) {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

export default function Calendario({
  atendimentos,
  agendamentos,
  onAgendar,
  onCancelar,
}: Props) {
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState<Atendimento | null>(null);
  const [open, setOpen] = useState(false);

  const eventos = atendimentos.map((atendimento: Atendimento) => {
    const vagasRestantes = Number(atendimento.maximo_clientes) - Number(atendimento.vagas_ocupadas);
    const agendado = agendamentos.some((ag) => ag.id_atendimento === atendimento.id);

    let classe = "evento-normal";
    if (vagasRestantes <= 0) classe = "evento-lotado";
    else if (agendado) classe = "evento-agendado";

    return {
      id: atendimento.id,
      title: "",
      start: formatarData(atendimento.data),
      extendedProps: atendimento,
      className: classe,
    };
  });


  return (
    <div className="p-4 pt-20">
      <h2 className="text-2xl font-bold mb-4">Calendário de Atendimentos</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        locale="pt-br"
        events={eventos}
        eventClick={(info) => {
          setAtendimentoSelecionado(info.event.extendedProps as Atendimento);
          setOpen(true);
        }}
        eventContent={(arg) => {
          const atendimento = arg.event.extendedProps as Atendimento;
          const vagasRestantes =
            Number(atendimento.maximo_clientes) - Number(atendimento.vagas_ocupadas);
          const agendado = agendamentos.some((ag) => ag.id_atendimento === atendimento.id);

          const labelColor = vagasRestantes <= 0
            ? "bg-gray-400"
            : agendado
            ? "bg-green-600"
            : "bg-blue-500";

          return {
            domNodes: [
              (() => {
                const container = document.createElement("div");
                container.className =
                  "flex min-h-[60px] h-full text-sm px-2 py-1";

                const barra = document.createElement("div");
                barra.className = `w-1 mr-2 rounded-sm ${labelColor}`;
                container.appendChild(barra);

                const texto = document.createElement("div");
                texto.className = "flex flex-col text-left";
                texto.innerHTML = `
                  <div class="flex justify-between items-center">
                    <strong class="text-blue-900">${atendimento.modalidade}</strong>
                  </div>
                  <span class="text-xs text-gray-700">${atendimento.horário} - ${atendimento.fisio}</span>
                  <span class="text-xs ${
                    vagasRestantes > 0 ? "text-gray-500" : "text-red-500"
                  }">${vagasRestantes > 0 ? `${vagasRestantes} vaga(s)` : "Sem vagas"}</span>
                  ${agendado ? '<span class="text-green-600 text-xs">Agendado</span>' : ""}
                `;
                container.appendChild(texto);

                return container;
              })(),
            ],
          };
        }}

        eventClassNames={(arg) => {
          const atendimento = arg.event.extendedProps as Atendimento;
          const vagasRestantes = Number(atendimento.maximo_clientes) - Number(atendimento.vagas_ocupadas);
          const agendado = agendamentos.some((ag) => ag.id_atendimento === atendimento.id);

          if (vagasRestantes <= 0) return ["evento-lotado"];
          if (agendado) return ["evento-agendado"];
          return ["evento-normal"];
        }}
        height="auto"
      />


    <ModalAtendimento
      atendimento={atendimentoSelecionado}
      isOpen={open}
      onClose={() => setOpen(false)}
      agendado={agendamentos.some((ag) => ag.id_atendimento === atendimentoSelecionado?.id)}
      idAgendamento={
        agendamentos.find((ag) => ag.id_atendimento === atendimentoSelecionado?.id)?.id
      }
      onAgendar={onAgendar}
      onCancelar={onCancelar}
    />
    </div>
  );
}
