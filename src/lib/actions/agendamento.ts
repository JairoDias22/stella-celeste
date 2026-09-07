"use server";

import { prisma } from "@/lib/prisma";
import { getClienteSession } from "@/lib/auth";
import { parsePrecoParaNumero } from "@/lib/utils/money";
import { revalidatePath } from "next/cache";
import { enviarEmail } from "@/lib/email";
import { templateReservaCliente, templateReservaAdmin } from "@/lib/email-templates";

export async function getServicosParaAgendamento() {
  return prisma.servico.findMany({ orderBy: { name: "asc" } });
}

export async function criarReserva(servicoId: string, horarioId: string) {
  const session = await getClienteSession();
  if (!session) {
    return { success: false, error: "Você precisa entrar na sua conta para agendar." };
  }

  const [servico, horario] = await Promise.all([
    prisma.servico.findUnique({ where: { id: servicoId } }),
    prisma.horario.findUnique({ where: { id: horarioId } }),
  ]);

  if (!servico) return { success: false, error: "Serviço não encontrado." };
  if (!horario) return { success: false, error: "Horário não encontrado." };
  if (!horario.available) return { success: false, error: "Esse horário acabou de ser reservado por outra pessoa." };

  const valor = parsePrecoParaNumero(servico.price);

  // Marca o horário como indisponível e cria a reserva numa transação,
  // pra evitar duas pessoas reservando o mesmo horário ao mesmo tempo.
  const reserva = await prisma.$transaction(async (tx) => {
    const horarioAtual = await tx.horario.findUnique({ where: { id: horarioId } });
    if (!horarioAtual?.available) {
      throw new Error("HORARIO_INDISPONIVEL");
    }

    await tx.horario.update({ where: { id: horarioId }, data: { available: false } });

    return tx.reserva.create({
      data: {
        servicoId,
        horarioId,
        clienteId: session.id,
        valor,
        status: "pendente",
      },
    });
  }).catch((e) => {
    if (e instanceof Error && e.message === "HORARIO_INDISPONIVEL") return null;
    throw e;
  });

  if (!reserva) {
    return { success: false, error: "Esse horário acabou de ser reservado por outra pessoa." };
  }

  const dataFormatada = new Date(horario.data).toLocaleDateString("pt-BR");

  await Promise.all([
    enviarEmail({
      para: session.email,
      assunto: "Agendamento confirmado — Stella Celeste",
      html: templateReservaCliente(servico.name, dataFormatada, horario.time),
    }),
    process.env.ADMIN_EMAIL
      ? enviarEmail({
          para: process.env.ADMIN_EMAIL,
          assunto: "Novo agendamento recebido",
          html: templateReservaAdmin(session.name, servico.name, dataFormatada, horario.time),
        })
      : Promise.resolve(),
  ]);

  revalidatePath("/minha-conta");
  revalidatePath("/");
  revalidatePath("/admin/reservas");

  return { success: true, reservaId: reserva.id };
}

export async function cancelarReserva(reservaId: string) {
  const session = await getClienteSession();
  if (!session) return { success: false, error: "Sessão expirada. Faça login novamente." };

  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  if (!reserva) return { success: false, error: "Reserva não encontrada." };
  if (reserva.clienteId !== session.id) {
    return { success: false, error: "Você não pode cancelar essa reserva." };
  }
  if (reserva.status !== "pendente") {
    return { success: false, error: "Só é possível cancelar reservas pendentes." };
  }

  await prisma.$transaction([
    prisma.reserva.update({ where: { id: reservaId }, data: { status: "cancelado" } }),
    prisma.horario.update({ where: { id: reserva.horarioId }, data: { available: true } }),
  ]);

  revalidatePath("/minha-conta");
  revalidatePath("/");
  revalidatePath("/admin/reservas");

  return { success: true };
}
