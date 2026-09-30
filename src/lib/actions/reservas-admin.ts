"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { enviarEmailsReservaPaga } from "@/lib/reserva-emails";

export async function getReservasAdmin() {
  const reservas = await prisma.reserva.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      cliente: { select: { name: true, email: true, phone: true } },
      servico: { select: { name: true } },
      horario: { select: { data: true, weekday: true, time: true } },
    },
  });

  return reservas.map((r) => ({ ...r, valor: Number(r.valor) }));
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

  // Marcou como pago à mão (ex.: cliente pagou por fora): manda a confirmação.
  if (status === "pago" && reserva.status !== "pago") {
    after(() => enviarEmailsReservaPaga(id));
  }

  // Se foi cancelada, devolve o horário pra disponível
  if (status === "cancelado" && reserva.status !== "cancelado") {
    await prisma.horario.update({ where: { id: reserva.horarioId }, data: { available: true } });
  }

  revalidatePath("/admin/reservas");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/financeiro");
  revalidatePath("/");
  revalidatePath("/agendar");

  return { success: true };
}
