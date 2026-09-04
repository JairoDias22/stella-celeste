"use server";

import { prisma } from "@/lib/prisma";
import { getClienteSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateMeuPerfil(data: {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}) {
  const session = await getClienteSession();
  if (!session) return { success: false, error: "Sessão expirada. Faça login novamente." };

  await prisma.cliente.update({
    where: { id: session.id },
    data,
  });

  revalidatePath("/minha-conta");
  revalidatePath("/");
  return { success: true };
}

export async function getClienteAtual() {
  const session = await getClienteSession();
  if (!session) return null;

  const cliente = await prisma.cliente.findUnique({
    where: { id: session.id },
    select: { name: true, avatarUrl: true },
  });

  return cliente;
}
