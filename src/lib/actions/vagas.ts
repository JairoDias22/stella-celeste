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
  try {
    await prisma.disponibilidadeSemanal.create({ data: { ...data, ativo: true } });
  } catch {
    return { success: false, error: "Já existe um horário cadastrado nesse dia e hora." };
  }
  revalidatePath("/admin/vagas");
  revalidatePath("/");
  revalidatePath("/agendar");
  return { success: true };
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

  const hoje = new Date();
  hoje.setUTCHours(0, 0, 0, 0);

  if (!ativo) {
    // Pausar não pode só impedir gerar horários novos — também precisa esconder
    // os que já tinham sido gerados antes pra semanas futuras, senão eles
    // continuam aparecendo como disponíveis pro cliente mesmo pausados.
    // Horários que já têm reserva não são tocados (eles já estão indisponíveis
    // por causa da reserva, e alterar isso bagunçaria o histórico).
    await prisma.horario.updateMany({
      where: {
        disponibilidadeId: id,
        data: { gte: hoje },
        reservas: { none: {} },
      },
      data: { available: false },
    });
  } else {
    // Reativar traz de volta a disponibilidade dos horários futuros que não
    // tinham reserva nenhuma.
    await prisma.horario.updateMany({
      where: {
        disponibilidadeId: id,
        data: { gte: hoje },
        reservas: { none: {} },
      },
      data: { available: true },
    });
  }

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
