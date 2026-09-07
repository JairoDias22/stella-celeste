"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { randomBytes, createHash } from "crypto";
import { enviarEmail } from "@/lib/email";
import { templateRecuperarSenha } from "@/lib/email-templates";
import { SITE_URL } from "@/lib/config/site";

type Tipo = "cliente" | "admin";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function solicitarRecuperacaoSenha(email: string, tipo: Tipo) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiraEm = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  if (tipo === "cliente") {
    const cliente = await prisma.cliente.findUnique({ where: { email } });
    if (cliente) {
      await prisma.cliente.update({
        where: { id: cliente.id },
        data: { resetTokenHash: tokenHash, resetTokenExpiresAt: expiraEm },
      });
      const link = `${SITE_URL}/redefinir-senha?token=${token}&tipo=cliente`;
      await enviarEmail({
        para: cliente.email,
        assunto: "Redefinir sua senha — Stella Celeste",
        html: templateRecuperarSenha(link),
      });
    }
  } else {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { resetTokenHash: tokenHash, resetTokenExpiresAt: expiraEm },
      });
      const link = `${SITE_URL}/redefinir-senha?token=${token}&tipo=admin`;
      await enviarEmail({
        para: admin.email,
        assunto: "Redefinir sua senha — Stella Admin",
        html: templateRecuperarSenha(link),
      });
    }
  }

  // Sempre retorna sucesso, exista ou não o e-mail — evita que alguém descubra
  // quais e-mails têm conta só de tentar recuperar senha.
  return { success: true };
}

export async function redefinirSenha(token: string, tipo: Tipo, novaSenha: string) {
  if (novaSenha.length < 8) {
    return { success: false, error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const tokenHash = hashToken(token);
  const passwordHash = await hashPassword(novaSenha);

  if (tipo === "cliente") {
    const cliente = await prisma.cliente.findFirst({
      where: { resetTokenHash: tokenHash, resetTokenExpiresAt: { gt: new Date() } },
    });
    if (!cliente) {
      return { success: false, error: "Link inválido ou expirado. Solicite a recuperação novamente." };
    }
    await prisma.cliente.update({
      where: { id: cliente.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
    });
  } else {
    const admin = await prisma.admin.findFirst({
      where: { resetTokenHash: tokenHash, resetTokenExpiresAt: { gt: new Date() } },
    });
    if (!admin) {
      return { success: false, error: "Link inválido ou expirado. Solicite a recuperação novamente." };
    }
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
    });
  }

  return { success: true };
}
