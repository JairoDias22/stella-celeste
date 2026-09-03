"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { criarReserva } from "@/lib/actions/agendamento";
import { formatarMoeda, parsePrecoParaNumero } from "@/lib/utils/money";

type Servico = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: string;
};

type Vaga = {
  id: string;
  weekday: string;
  time: string;
};

const ORDEM_DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function AgendarClient({
  servicos,
  vagas,
}: {
  servicos: Servico[];
  vagas: Vaga[];
}) {
  const router = useRouter();
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [vagaId, setVagaId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const servicoEscolhido = servicos.find((s) => s.id === servicoId) ?? null;
  const vagaEscolhida = vagas.find((v) => v.id === vagaId) ?? null;

  const vagasPorDia = ORDEM_DIAS.map((dia) => ({
    dia,
    horarios: vagas.filter((v) => v.weekday === dia),
  })).filter((d) => d.horarios.length > 0);

  function handleConfirmar() {
    if (!servicoId || !vagaId) return;
    setError(null);

    startTransition(async () => {
      const result = await criarReserva(servicoId, vagaId);
      if (!result.success) {
        setError(result.error ?? "Não foi possível concluir o agendamento.");
        return;
      }
      router.push("/minha-conta");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Container>
        <div className="mb-10 text-center">
          <h1 className="font-title text-4xl font-bold text-white">Agendar Consulta</h1>
          <p className="mt-3 text-zinc-400">
            Escolha o serviço e o horário que preferir.
          </p>
        </div>

        {servicos.length === 0 ? (
          <p className="text-center text-zinc-500">
            Nenhum serviço disponível para agendamento no momento.
          </p>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-white">1. Escolha o serviço</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {servicos.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServicoId(s.id)}
                    className={`rounded-2xl border p-6 text-left transition-all duration-200 ${
                      servicoId === s.id
                        ? "border-pink-400/60 bg-pink-500/10 scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className="font-semibold text-white">{s.name}</p>
                    {s.description && (
                      <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{s.description}</p>
                    )}
                    <p className="mt-3 text-sm text-zinc-500">{s.duration}</p>
                    <p className="mt-1 font-semibold text-pink-300">{s.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {vagasPorDia.length === 0 ? (
              <p className="text-zinc-500">Nenhum horário disponível no momento.</p>
            ) : (
              <div className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-white">2. Escolha o horário</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {vagasPorDia.map(({ dia, horarios }) => (
                    <div key={dia} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="mb-3 font-semibold text-white">{dia}</p>
                      <div className="flex flex-wrap gap-2">
                        {horarios.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setVagaId(v.id)}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                              vagaId === v.id
                                ? "bg-violet-600 text-white scale-105"
                                : "bg-black/20 text-zinc-300 hover:bg-black/30"
                            }`}
                          >
                            {v.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {servicoEscolhido && vagaEscolhida && (
              <div className="rounded-2xl border border-pink-400/30 bg-pink-500/10 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-pink-300" />
                  <p className="text-white">
                    <strong>{servicoEscolhido.name}</strong> — {vagaEscolhida.weekday} às{" "}
                    {vagaEscolhida.time}
                  </p>
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  Valor: {formatarMoeda(parsePrecoParaNumero(servicoEscolhido.price))} — pagamento
                  combinado diretamente com a Stella Celeste (por enquanto, o pagamento online
                  ainda não está disponível).
                </p>

                {error && (
                  <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
                )}

                <Button className="mt-4 transition-transform hover:scale-105" onClick={handleConfirmar} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirmar agendamento
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
