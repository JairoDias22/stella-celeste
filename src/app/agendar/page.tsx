import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getClienteSession } from "@/lib/auth";
import { getServicosParaAgendamento } from "@/lib/actions/agendamento";
import { getHorariosParaAgendamento } from "@/lib/actions/horarios";
import AgendarClient from "@/components/cliente/AgendarClient";
import { comTimeout } from "@/lib/utils/timeout";

export default async function AgendarPage() {
  const session = await getClienteSession();
  if (!session) redirect("/login");

  // Timeout de 15s: se o banco não responder (instabilidade, banco "dormindo"
  // no plano gratuito da Neon, etc.), a página mostra um erro em vez de ficar
  // carregando pra sempre — o error.tsx desta rota cuida da mensagem.
  const [servicos, horarios] = await comTimeout(
    Promise.all([getServicosParaAgendamento(), getHorariosParaAgendamento()]),
    15000,
    "Tempo esgotado ao carregar os dados de agendamento"
  );

  return (
    <Suspense>
      <AgendarClient servicos={servicos} horarios={horarios} />
    </Suspense>
  );
}
