import { redirect } from "next/navigation";
import ConfiguracoesClient from "@/components/admin/configuracoes/ConfiguracoesClient";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ConfiguracoesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({
    where: { id: session.id },
    select: { name: true, email: true },
  });

  if (!admin) redirect("/admin/login");

  return <ConfiguracoesClient admin={admin} />;
}
