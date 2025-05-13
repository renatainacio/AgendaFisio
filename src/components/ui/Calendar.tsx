"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Aula } from "./CardAula";
import ModalAula from "./ModalAula";
import { Agendamento } from "@/app/page";

type Props = {
  aulas: Aula[];
  agendamentos: Agendamento[];
  onAgendar: (idAula: string) => void;
  onCancelar: (idAgendamento: string, idAula: string) => void;
};

function formatarData(dataBR: string) {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

export default function Calendario({
  aulas,
  agendamentos,
  onAgendar,
  onCancelar,
}: Props) {
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);
  const [open, setOpen] = useState(false);

  const eventos = aulas.map((aula: Aula) => {
    const vagasRestantes = Number(aula.maximo_alunos) - Number(aula.vagas_ocupadas);
    const agendado = agendamentos.some((ag) => ag.id_aula === aula.id);

    let classe = "evento-normal";
    if (vagasRestantes <= 0) classe = "evento-lotado";
    else if (agendado) classe = "evento-agendado";

    return {
      id: aula.id,
      title: "",
      start: formatarData(aula.data),
      extendedProps: aula,
      className: classe,
    };
  });


  return (
    <div className="p-4 pt-20">
      <h2 className="text-2xl font-bold mb-4">Calendário de Aulas</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        locale="pt-br"
        events={eventos}
        eventClick={(info) => {
          setAulaSelecionada(info.event.extendedProps as Aula);
          setOpen(true);
        }}
        eventContent={(arg) => {
          const aula = arg.event.extendedProps as Aula;
          const vagasRestantes =
            Number(aula.maximo_alunos) - Number(aula.vagas_ocupadas);
          const agendado = agendamentos.some((ag) => ag.id_aula === aula.id);

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
                    <strong class="text-blue-900">${aula.modalidade}</strong>
                  </div>
                  <span class="text-xs text-gray-700">${aula.horário} - Prof. ${aula.professor}</span>
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
          const aula = arg.event.extendedProps as Aula;
          const vagasRestantes = Number(aula.maximo_alunos) - Number(aula.vagas_ocupadas);
          const agendado = agendamentos.some((ag) => ag.id_aula === aula.id);

          if (vagasRestantes <= 0) return ["evento-lotado"];
          if (agendado) return ["evento-agendado"];
          return ["evento-normal"];
        }}
        height="auto"
      />


    <ModalAula
      aula={aulaSelecionada}
      isOpen={open}
      onClose={() => setOpen(false)}
      agendado={agendamentos.some((ag) => ag.id_aula === aulaSelecionada?.id)}
      idAgendamento={
        agendamentos.find((ag) => ag.id_aula === aulaSelecionada?.id)?.id
      }
      onAgendar={onAgendar}
      onCancelar={onCancelar}
    />
    </div>
  );
}
