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

const WEEKDAY_NOMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Todo cálculo de data usa UTC de propósito — isso evita que o resultado mude
// dependendo de o código estar rodando no seu computador (fuso do Brasil) ou no
// servidor da Vercel (fuso UTC), que geram "meia-noite" em momentos diferentes.
function hojeUTC() {
  const agora = new Date();
  return new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate()));
}

function somarDiasUTC(data: Date, dias: number) {
  const nova = new Date(data);
  nova.setUTCDate(nova.getUTCDate() + dias);
  return nova;
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

  const hoje = hojeUTC();

  for (const disp of disponibilidades) {
    const alvo = WEEKDAY_INDEX[disp.weekday];
    if (alvo === undefined) continue;

    const diasAteAlvo = (alvo - hoje.getUTCDay() + 7) % 7;
    const primeiraOcorrencia = somarDiasUTC(hoje, diasAteAlvo);

    for (let semana = 0; semana < SEMANAS_A_FRENTE; semana++) {
      const data = somarDiasUTC(primeiraOcorrencia, semana * 7);

      // O rótulo do dia da semana é sempre calculado a partir da data real —
      // nunca copiado direto da disponibilidade — pra nunca poder ficar
      // dessincronizado da data de verdade.
      const weekdayReal = WEEKDAY_NOMES[data.getUTCDay()];

      await prisma.horario.upsert({
        where: {
          disponibilidadeId_data: { disponibilidadeId: disp.id, data },
        },
        update: { weekday: weekdayReal, time: disp.time },
        create: {
          data,
          weekday: weekdayReal,
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

  const hoje = hojeUTC();
  const em7Dias = somarDiasUTC(hoje, 7);

  return prisma.horario.findMany({
    where: { data: { gte: hoje, lt: em7Dias } },
    orderBy: [{ data: "asc" }, { time: "asc" }],
  });
}

// Todos os horários disponíveis dentro da janela gerada — usado na tela de Agendar
export async function getHorariosParaAgendamento() {
  await garantirHorariosGerados();

  const hoje = hojeUTC();

  return prisma.horario.findMany({
    where: { available: true, data: { gte: hoje } },
    orderBy: [{ data: "asc" }, { time: "asc" }],
  });
}
