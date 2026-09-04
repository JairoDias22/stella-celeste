"use server";

import { prisma } from "@/lib/prisma";
import { getClienteSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ---- Cliente ----

export async function getMinhaAvaliacao() {
  const session = await getClienteSession();
  if (!session) return null;

  return prisma.avaliacao.findUnique({ where: { clienteId: session.id } });
}

export async function enviarAvaliacao(nota: number, comentario: string) {
  const session = await getClienteSession();
  if (!session) return { success: false, error: "Você precisa entrar na sua conta." };

  if (nota < 1 || nota > 5) {
    return { success: false, error: "A nota precisa ser de 1 a 5." };
  }
  if (!comentario.trim()) {
    return { success: false, error: "Escreva um breve comentário." };
  }

  await prisma.avaliacao.upsert({
    where: { clienteId: session.id },
    update: { nota, comentario: comentario.trim(), status: "pendente" },
    create: { nota, comentario: comentario.trim(), clienteId: session.id, status: "pendente" },
  });

  revalidatePath("/minha-conta");
  revalidatePath("/");
  revalidatePath("/admin/avaliacoes");

  return { success: true };
}

// ---- Público (home) ----

export async function getAvaliacoesAprovadas() {
  return prisma.avaliacao.findMany({
    where: { status: "aprovada" },
    orderBy: { updatedAt: "desc" },
    take: 9,
    include: { cliente: { select: { name: true, avatarUrl: true } } },
  });
}

// ---- Admin ----

export async function getAvaliacoesAdmin() {
  return prisma.avaliacao.findMany({
    orderBy: { createdAt: "desc" },
    include: { cliente: { select: { name: true, email: true } } },
  });
}

export async function atualizarStatusAvaliacao(
  id: string,
  status: "pendente" | "aprovada" | "recusada"
) {
  await prisma.avaliacao.update({ where: { id }, data: { status } });

  revalidatePath("/admin/avaliacoes");
  revalidatePath("/");

  return { success: true };
}
