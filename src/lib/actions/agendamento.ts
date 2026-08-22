"use server";

import { prisma } from "@/lib/prisma";
import { getClienteSession } from "@/lib/auth";
import { parsePrecoParaNumero } from "@/lib/utils/money";
import { revalidatePath } from "next/cache";

export async function getServicosParaAgendamento() {
  return prisma.servico.findMany({ orderBy: { name: "asc" } });
}

export async function getVagasDisponiveis() {
  return prisma.vaga.findMany({
    where: { available: true },
    orderBy: [{ weekday: "asc" }, { time: "asc" }],
  });
}

export async function criarReserva(servicoId: string, vagaId: string) {
  const session = await getClienteSession();
  if (!session) {
    return { success: false, error: "Você precisa entrar na sua conta para agendar." };
  }

  const [servico, vaga] = await Promise.all([
    prisma.servico.findUnique({ where: { id: servicoId } }),
    prisma.vaga.findUnique({ where: { id: vagaId } }),
  ]);

  if (!servico) return { success: false, error: "Serviço não encontrado." };
  if (!vaga) return { success: false, error: "Horário não encontrado." };
  if (!vaga.available) return { success: false, error: "Esse horário acabou de ser reservado por outra pessoa." };

  const valor = parsePrecoParaNumero(servico.price);

  // Marca a vaga como indisponível e cria a reserva numa transação,
  // pra evitar duas pessoas reservando o mesmo horário ao mesmo tempo.
  const reserva = await prisma.$transaction(async (tx) => {
    const vagaAtual = await tx.vaga.findUnique({ where: { id: vagaId } });
    if (!vagaAtual?.available) {
      throw new Error("VAGA_INDISPONIVEL");
    }

    await tx.vaga.update({ where: { id: vagaId }, data: { available: false } });

    return tx.reserva.create({
      data: {
        servicoId,
        vagaId,
        clienteId: session.id,
        valor,
        status: "pendente",
      },
    });
  }).catch((e) => {
    if (e instanceof Error && e.message === "VAGA_INDISPONIVEL") return null;
    throw e;
  });

  if (!reserva) {
    return { success: false, error: "Esse horário acabou de ser reservado por outra pessoa." };
  }

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
    prisma.vaga.update({ where: { id: reserva.vagaId }, data: { available: true } }),
  ]);

  revalidatePath("/minha-conta");
  revalidatePath("/");
  revalidatePath("/admin/reservas");

  return { success: true };
}
