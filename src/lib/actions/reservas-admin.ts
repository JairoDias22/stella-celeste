"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReservasAdmin() {
  return prisma.reserva.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      cliente: { select: { name: true, email: true, phone: true } },
      servico: { select: { name: true } },
      vaga: { select: { weekday: true, time: true } },
    },
  });
}

export async function atualizarStatusReserva(
  id: string,
  status: "pendente" | "pago" | "cancelado",
  metodoPagamento?: "pix" | "cartao"
) {
  const reserva = await prisma.reserva.findUnique({ where: { id } });
  if (!reserva) return { success: false, error: "Reserva não encontrada." };

  await prisma.reserva.update({
    where: { id },
    data: {
      status,
      metodoPagamento: status === "pago" ? metodoPagamento ?? null : null,
    },
  });

  // Se foi cancelada, devolve a vaga pra disponível
  if (status === "cancelado" && reserva.status !== "cancelado") {
    await prisma.vaga.update({ where: { id: reserva.vagaId }, data: { available: true } });
  }

  revalidatePath("/admin/reservas");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/financeiro");
  revalidatePath("/");

  return { success: true };
}
