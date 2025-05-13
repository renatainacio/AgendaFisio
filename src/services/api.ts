export async function getAulas(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aulas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar aulas");
  }

  return await res.json();
}

export async function agendarAula(idAula: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ id_aula: idAula })
  });

  const data = await res.json();

  if (!res.ok || !data.sucesso) {
    throw new Error(data.mensagem || "Erro ao agendar aula");
  }

  return data;
}

export async function getAgendamentos(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.sucesso) {
    throw new Error(data.mensagem || "Erro ao buscar agendamentos");
  }

  return data;
}

export async function cancelarAgendamento(idAgendamento: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/${idAgendamento}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok || !data.sucesso) {
    throw new Error(data.mensagem || "Erro ao cancelar agendamento");
  }

  return data;
}
