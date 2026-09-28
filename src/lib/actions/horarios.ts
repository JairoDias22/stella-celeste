"use server";

import { prisma } from "@/lib/prisma";

const SEMANAS_A_FRENTE = 4;

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
 * É seguro chamar isso repetidamente — nunca duplica.
 *
 * Feito com poucas consultas de propósito: esta função roda a cada visita à
 * home e à tela de Agendar. Antes eram ~1 upsert por horário (dezenas de idas
 * ao banco); agora é 1 consulta pras disponibilidades, 1 pros horários que já
 * existem e, só se faltar algum, 1 createMany pros novos.
 */
export async function garantirHorariosGerados() {
  const disponibilidades = await prisma.disponibilidadeSemanal.findMany({
    where: { ativo: true },
  });
  if (disponibilidades.length === 0) return;

  const hoje = hojeUTC();

  type Desejado = { disponibilidadeId: string; data: Date; weekday: string; time: string };
  const desejados: Desejado[] = [];

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
      desejados.push({
        disponibilidadeId: disp.id,
        data,
        weekday: WEEKDAY_NOMES[data.getUTCDay()],
        time: disp.time,
      });
    }
  }
  if (desejados.length === 0) return;

  const chave = (disponibilidadeId: string, data: Date) =>
    `${disponibilidadeId}|${data.toISOString().slice(0, 10)}`;

  const existentes = await prisma.horario.findMany({
    where: {
      disponibilidadeId: { in: disponibilidades.map((d) => d.id) },
      data: { gte: hoje },
    },
    select: { id: true, disponibilidadeId: true, data: true, weekday: true, time: true },
  });
  const porChave = new Map(existentes.map((h) => [chave(h.disponibilidadeId, h.data), h]));

  const novos: Desejado[] = [];
  const desatualizados: { id: string; weekday: string; time: string }[] = [];

  for (const d of desejados) {
    const atual = porChave.get(chave(d.disponibilidadeId, d.data));
    if (!atual) {
      novos.push(d);
    } else if (atual.weekday !== d.weekday || atual.time !== d.time) {
      // Caso raro: o admin mudou o horário de uma disponibilidade — sincroniza.
      desatualizados.push({ id: atual.id, weekday: d.weekday, time: d.time });
    }
  }

  if (novos.length > 0) {
    await prisma.horario.createMany({ data: novos, skipDuplicates: true });
  }
  if (desatualizados.length > 0) {
    await Promise.all(
      desatualizados.map((h) =>
        prisma.horario.update({ where: { id: h.id }, data: { weekday: h.weekday, time: h.time } })
      )
    );
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
