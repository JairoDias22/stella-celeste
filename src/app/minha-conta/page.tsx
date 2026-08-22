import { redirect } from "next/navigation";
import { getClienteSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MinhaContaClient from "@/components/cliente/MinhaContaClient";

export default async function MinhaContaPage() {
  const session = await getClienteSession();
  if (!session) redirect("/login");

  const cliente = await prisma.cliente.findUnique({
    where: { id: session.id },
    include: {
      reservas: {
        orderBy: { createdAt: "desc" },
        include: {
          servico: { select: { name: true } },
          vaga: { select: { weekday: true, time: true } },
        },
      },
    },
  });

  if (!cliente) redirect("/login");

  return <MinhaContaClient cliente={cliente} reservas={cliente.reservas} />;
}
