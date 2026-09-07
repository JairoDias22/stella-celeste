"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDisponibilidades() {
  return prisma.disponibilidadeSemanal.findMany({
    orderBy: [{ weekday: "asc" }, { time: "asc" }],
  });
}

export async function createDisponibilidade(data: {
  weekday: string;
  time: string;
}) {
  await prisma.disponibilidadeSemanal.create({ data: { ...data, ativo: true } });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
  revalidatePath("/agendar");
}

export async function updateDisponibilidade(
  id: string,
  data: { weekday: string; time: string }
) {
  await prisma.disponibilidadeSemanal.update({ where: { id }, data });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
  revalidatePath("/agendar");
}

export async function toggleDisponibilidadeAtiva(id: string, ativo: boolean) {
  await prisma.disponibilidadeSemanal.update({ where: { id }, data: { ativo } });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
  revalidatePath("/agendar");
}

export async function deleteDisponibilidade(id: string) {
  // Não deixa excluir se já existe algum horário gerado com reserva de verdade —
  // isso apagaria histórico de agendamentos de clientes. Nesse caso, pede pra desativar.
  const horarioComReserva = await prisma.horario.findFirst({
    where: { disponibilidadeId: id, reservas: { some: {} } },
  });

  if (horarioComReserva) {
    return {
      success: false,
      error: "Esse horário já tem reservas associadas. Desative em vez de excluir, para não perder o histórico.",
    };
  }

  await prisma.disponibilidadeSemanal.delete({ where: { id } });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
  revalidatePath("/agendar");

  return { success: true };
}
