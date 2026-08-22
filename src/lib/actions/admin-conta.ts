"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession, hashPassword, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAdminAccount(data: { name: string; email: string }) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Sessão expirada. Faça login novamente." };

  await prisma.admin.update({
    where: { id: session.id },
    data,
  });

  revalidatePath("/admin/configuracoes");
  return { success: true };
}

export async function updateAdminPassword(data: {
  senhaAtual: string;
  novaSenha: string;
}) {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Sessão expirada. Faça login novamente." };

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) return { success: false, error: "Conta não encontrada." };

  const valid = await verifyPassword(data.senhaAtual, admin.passwordHash);
  if (!valid) return { success: false, error: "Senha atual incorreta." };

  const passwordHash = await hashPassword(data.novaSenha);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  return { success: true };
}
