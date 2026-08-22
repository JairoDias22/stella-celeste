"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVagas() {
  return prisma.vaga.findMany({
    orderBy: [{ weekday: "asc" }, { time: "asc" }],
  });
}

export async function createVaga(data: {
  weekday: string;
  time: string;
  available: boolean;
}) {
  await prisma.vaga.create({ data });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
}

export async function updateVaga(
  id: string,
  data: { weekday: string; time: string; available: boolean }
) {
  await prisma.vaga.update({ where: { id }, data });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
}

export async function deleteVaga(id: string) {
  await prisma.vaga.delete({ where: { id } });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
}

export async function toggleVagaDisponibilidade(id: string, available: boolean) {
  await prisma.vaga.update({ where: { id }, data: { available } });
  revalidatePath("/admin/vagas");
  revalidatePath("/");
}
