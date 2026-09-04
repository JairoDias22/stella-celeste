import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getClienteSession } from "@/lib/auth";
import { getServicosParaAgendamento, getVagasDisponiveis } from "@/lib/actions/agendamento";
import AgendarClient from "@/components/cliente/AgendarClient";

export default async function AgendarPage() {
  const session = await getClienteSession();
  if (!session) redirect("/login");

  const [servicos, vagas] = await Promise.all([
    getServicosParaAgendamento(),
    getVagasDisponiveis(),
  ]);

  return (
    <Suspense>
      <AgendarClient servicos={servicos} vagas={vagas} />
    </Suspense>
  );
}
