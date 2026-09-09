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
  // O banco de dados protege contra excluir um horário que qualquer reserva ainda
  // referencia — mesmo reservas já canceladas continuam existindo como histórico,
  // e apagar o horário embaixo delas quebraria essa referência. Por isso, se
  // existir qualquer reserva (de qualquer status) ligada a essa disponibilidade,
  // pedimos pra desativar em vez de excluir.
  const horarioComReserva = await prisma.horario.findFirst({
    where: { disponibilidadeId: id, reservas: { some: {} } },
  });

  if (horarioComReserva) {
    return {
      success: false,
      error: "Esse horário já tem reservas no histórico (mesmo canceladas). Clique no botão \"Ativo\" ao lado do horário para pausá-lo em vez de excluir — assim o histórico não se perde.",
    };
  }

  try {
    await prisma.disponibilidadeSemanal.delete({ where: { id } });
  } catch {
    return {
      success: false,
      error: "Não foi possível excluir — esse horário ainda tem reservas associadas. Desative em vez de excluir.",
    };
  }

  revalidatePath("/admin/vagas");
  revalidatePath("/");
  revalidatePath("/agendar");

  return { success: true };
}