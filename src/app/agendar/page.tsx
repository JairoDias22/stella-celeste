import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getClienteSession } from "@/lib/auth";
import { getServicosParaAgendamento } from "@/lib/actions/agendamento";
import { getHorariosParaAgendamento } from "@/lib/actions/horarios";
import AgendarClient from "@/components/cliente/AgendarClient";

export default async function AgendarPage() {
  const session = await getClienteSession();
  if (!session) redirect("/login");

  const [servicos, horarios] = await Promise.all([
    getServicosParaAgendamento(),
    getHorariosParaAgendamento(),
  ]);

  return (
    <Suspense>
      <AgendarClient servicos={servicos} horarios={horarios} />
    </Suspense>
  );
}
