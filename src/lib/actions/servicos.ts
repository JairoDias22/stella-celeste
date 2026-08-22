"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getServicos() {
  return prisma.servico.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createServico(data: {
  name: string;
  description?: string;
  price: string;
  duration: string;
  slots: number;
}) {
  await prisma.servico.create({ data });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
}

export async function updateServico(
  id: string,
  data: { name: string; description?: string; price: string; duration: string; slots: number }
) {
  await prisma.servico.update({ where: { id }, data });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
}

export async function deleteServico(id: string) {
  await prisma.servico.delete({ where: { id } });
  revalidatePath("/admin/servicos");
  revalidatePath("/");
}