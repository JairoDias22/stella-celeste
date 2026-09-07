"use server";

import { prisma } from "@/lib/prisma";

const SEMANAS_A_FRENTE = 8;

const WEEKDAY_INDEX: Record<string, number> = {
  Domingo: 0,
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
};

function inicioDoDia(data: Date) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Garante que existam horários gerados (com data específica) para as próximas
 * SEMANAS_A_FRENTE semanas, a partir de cada DisponibilidadeSemanal ativa.
 * É seguro chamar isso repetidamente — usa upsert, então nunca duplica.
 */
export async function garantirHorariosGerados() {
  const disponibilidades = await prisma.disponibilidadeSemanal.findMany({
    where: { ativo: true },
  });

  const hoje = inicioDoDia(new Date());

  for (const disp of disponibilidades) {
    const alvo = WEEKDAY_INDEX[disp.weekday];
    if (alvo === undefined) continue;

    for (let semana = 0; semana < SEMANAS_A_FRENTE; semana++) {
      const diasAteAlvo = (alvo - hoje.getDay() + 7) % 7;
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + diasAteAlvo + semana * 7);

      await prisma.horario.upsert({
        where: {
          disponibilidadeId_data: { disponibilidadeId: disp.id, data },
        },
        update: {},
        create: {
          data,
          weekday: disp.weekday,
          time: disp.time,
          disponibilidadeId: disp.id,
        },
      });
    }
  }
}

// Horários disponíveis dentro dos próximos 7 dias — usado na home ("Vagas desta semana")
export async function getHorariosProximos7Dias() {
  await garantirHorariosGerados();

  const hoje = inicioDoDia(new Date());
  const em7Dias = new Date(hoje);
  em7Dias.setDate(hoje.getDate() + 7);

  return prisma.horario.findMany({
    where: { data: { gte: hoje, lt: em7Dias } },
    orderBy: [{ data: "asc" }, { time: "asc" }],
  });
}

// Todos os horários disponíveis dentro da janela gerada — usado na tela de Agendar
export async function getHorariosParaAgendamento() {
  await garantirHorariosGerados();

  const hoje = inicioDoDia(new Date());

  return prisma.horario.findMany({
    where: { available: true, data: { gte: hoje } },
    orderBy: [{ data: "asc" }, { time: "asc" }],
  });
}
