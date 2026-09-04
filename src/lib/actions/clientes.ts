"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function getClientes() {
  return prisma.cliente.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      reservas: {
        select: { id: true, status: true },
      },
    },
  });
}

export async function createCliente(data: {
  name: string;
  email: string;
  phone?: string;
}) {
  // Cliente cadastrado manualmente pelo admin ainda não tem senha própria —
  // geramos uma temporária; ele pode defini-la de verdade futuramente via "esqueci minha senha".
  const senhaTemporaria = randomBytes(12).toString("hex");
  const passwordHash = await hashPassword(senhaTemporaria);

  await prisma.cliente.create({ data: { ...data, passwordHash } });
  revalidatePath("/admin/clientes");
}

export async function updateCliente(
  id: string,
  data: { name: string; email: string; phone?: string }
) {
  await prisma.cliente.update({ where: { id }, data });
  revalidatePath("/admin/clientes");
}

export async function deleteCliente(id: string) {
  await prisma.cliente.delete({ where: { id } });
  revalidatePath("/admin/clientes");
}
