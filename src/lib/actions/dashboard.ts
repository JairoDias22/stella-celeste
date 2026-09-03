"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [faturamentoAgg, totalClientes, totalConsultas, totalServicos, ultimasReservas] =
    await Promise.all([
      prisma.reserva.aggregate({
        where: { status: "pago" },
        _sum: { valor: true },
      }),
      prisma.cliente.count(),
      prisma.reserva.count(),
      prisma.servico.count(),
      prisma.reserva.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          cliente: { select: { name: true } },
          servico: { select: { name: true } },
        },
      }),
    ]);

  return {
    faturamentoTotal: Number(faturamentoAgg._sum.valor ?? 0),
    totalClientes,
    totalConsultas,
    totalServicos,
    ultimasReservas,
  };
}

function getRangeInicio(periodo: "dia" | "semana" | "mes") {
  const agora = new Date();
  const inicio = new Date(agora);

  if (periodo === "dia") {
    inicio.setHours(0, 0, 0, 0);
  } else if (periodo === "semana") {
    const diaSemana = inicio.getDay(); // 0 = domingo
    const diffParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
    inicio.setDate(inicio.getDate() - diffParaSegunda);
    inicio.setHours(0, 0, 0, 0);
  } else {
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
  }

  return inicio;
}

export async function getFinanceiroStats(periodo: "dia" | "semana" | "mes") {
  const inicio = getRangeInicio(periodo);

  const reservasPagas = await prisma.reserva.findMany({
    where: { status: "pago", createdAt: { gte: inicio } },
    select: { valor: true, metodoPagamento: true, createdAt: true },
  });

  const total = reservasPagas.reduce((acc, r) => acc + Number(r.valor), 0);
  const atendimentos = reservasPagas.length;
  const ticketMedio = atendimentos > 0 ? total / atendimentos : 0;

  const porMetodo = { pix: 0, cartao: 0 };
  for (const r of reservasPagas) {
    if (r.metodoPagamento === "pix") porMetodo.pix += Number(r.valor);
    else if (r.metodoPagamento === "cartao") porMetodo.cartao += Number(r.valor);
  }

  // Receita dos últimos 7 dias (independente do período selecionado acima), pro gráfico semanal
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
  seteDiasAtras.setHours(0, 0, 0, 0);

  const reservasSemana = await prisma.reserva.findMany({
    where: { status: "pago", createdAt: { gte: seteDiasAtras } },
    select: { valor: true, createdAt: true },
  });

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const barras = Array.from({ length: 7 }, (_, i) => {
    const data = new Date(seteDiasAtras);
    data.setDate(data.getDate() + i);
    const total = reservasSemana
      .filter((r) => new Date(r.createdAt).toDateString() === data.toDateString())
      .reduce((acc, r) => acc + Number(r.valor), 0);
    return { dia: dias[data.getDay()], valor: total };
  });

  return { total, atendimentos, ticketMedio, porMetodo, barras };
}

export async function getReservasParaExportacao(periodo: "dia" | "semana" | "mes") {
  const inicio = getRangeInicio(periodo);

  const reservas = await prisma.reserva.findMany({
    where: { status: "pago", createdAt: { gte: inicio } },
    orderBy: { createdAt: "desc" },
    include: {
      cliente: { select: { name: true, email: true } },
      servico: { select: { name: true } },
    },
  });

  return reservas.map((r) => ({
    data: r.createdAt.toISOString(),
    cliente: r.cliente.name,
    email: r.cliente.email,
    servico: r.servico.name,
    valor: Number(r.valor),
    metodoPagamento: r.metodoPagamento ?? "—",
  }));
}
