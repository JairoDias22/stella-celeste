"use server";

import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  createClienteSession,
  destroyAdminSession,
  destroyClienteSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

// ---- Admin ----

export async function adminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return { success: false, error: "E-mail ou senha inválidos." };

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return { success: false, error: "E-mail ou senha inválidos." };

  await createAdminSession({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: "admin",
  });

  return { success: true };
}

export async function adminLogout() {
  await destroyAdminSession();
}

// ---- Cliente ----

export async function clienteRegister(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const existing = await prisma.cliente.findUnique({ where: { email: data.email } });
  if (existing) return { success: false, error: "Já existe uma conta com esse e-mail." };

  const passwordHash = await hashPassword(data.password);

  const cliente = await prisma.cliente.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
    },
  });

  await createClienteSession({
    id: cliente.id,
    email: cliente.email,
    name: cliente.name,
    role: "cliente",
  });

  return { success: true };
}

export async function clienteLogin(email: string, password: string) {
  const cliente = await prisma.cliente.findUnique({ where: { email } });
  if (!cliente) return { success: false, error: "E-mail ou senha inválidos." };

  const valid = await verifyPassword(password, cliente.passwordHash);
  if (!valid) return { success: false, error: "E-mail ou senha inválidos." };

  await createClienteSession({
    id: cliente.id,
    email: cliente.email,
    name: cliente.name,
    role: "cliente",
  });

  return { success: true };
}

export async function clienteLogout() {
  await destroyClienteSession();
}
