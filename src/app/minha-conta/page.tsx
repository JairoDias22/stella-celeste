import { redirect } from "next/navigation";
import { getClienteSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MinhaContaClient from "@/components/cliente/MinhaContaClient";
import { getMinhaAvaliacao } from "@/lib/actions/avaliacoes";

export default async function MinhaContaPage() {
  const session = await getClienteSession();
  if (!session) redirect("/login");

  const [cliente, avaliacao] = await Promise.all([
    prisma.cliente.findUnique({
      where: { id: session.id },
      select: {
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatarUrl: true,
        reservas: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            createdAt: true,
            servico: { select: { name: true } },
            vaga: { select: { weekday: true, time: true } },
          },
        },
      },
    }),
    getMinhaAvaliacao(),
  ]);

  if (!cliente) redirect("/login");

  return (
    <MinhaContaClient
      cliente={cliente}
      reservas={cliente.reservas}
      avaliacao={avaliacao ? { nota: avaliacao.nota, comentario: avaliacao.comentario, status: avaliacao.status } : null}
    />
  );
}
