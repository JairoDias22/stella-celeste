"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Search } from "lucide-react";
import { criarReserva } from "@/lib/actions/agendamento";
import { formatarMoeda, parsePrecoParaNumero } from "@/lib/utils/money";
import SiteLogo from "@/components/layout/SiteLogo";

type Servico = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: string;
};

type Horario = {
  id: string;
  data: Date;
  weekday: string;
  time: string;
};

function formatarData(data: Date) {
  return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AgendarClient({
  servicos,
  horarios,
}: {
  servicos: Servico[];
  horarios: Horario[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [servicoId, setServicoId] = useState<string | null>(() => {
    const servicoDaUrl = searchParams.get("servico");
    return servicoDaUrl && servicos.some((s) => s.id === servicoDaUrl) ? servicoDaUrl : null;
  });
  const [horarioId, setHorarioId] = useState<string | null>(() => {
    const horarioDaUrl = searchParams.get("horario");
    return horarioDaUrl && horarios.some((h) => h.id === horarioDaUrl) ? horarioDaUrl : null;
  });
  const [busca, setBusca] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const servicoEscolhido = servicos.find((s) => s.id === servicoId) ?? null;
  const horarioEscolhido = horarios.find((h) => h.id === horarioId) ?? null;

  const servicosFiltrados = servicos.filter((s) => {
    const termo = busca.toLowerCase();
    return (
      s.name.toLowerCase().includes(termo) ||
      (s.description ?? "").toLowerCase().includes(termo)
    );
  });

  const horariosPorData = Array.from(
    horarios
      .slice()
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .reduce((mapa, h) => {
        const chave = new Date(h.data).toDateString();
        if (!mapa.has(chave)) mapa.set(chave, { data: h.data, weekday: h.weekday, horarios: [] as Horario[] });
        mapa.get(chave)!.horarios.push(h);
        return mapa;
      }, new Map<string, { data: Date; weekday: string; horarios: Horario[] }>())
      .values()
  );

  function handleConfirmar() {
    if (!servicoId || !horarioId) return;
    setError(null);

    startTransition(async () => {
      const result = await criarReserva(servicoId, horarioId);
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
        <div className="mb-6">
          <SiteLogo />
        </div>
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

              <div className="relative mb-6 max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar um serviço..."
                  className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors focus:border-pink-400/40"
                />
              </div>

              {servicosFiltrados.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Nenhum serviço encontrado para &quot;{busca}&quot;.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {servicosFiltrados.map((s) => (
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
              )}
            </div>

            {horariosPorData.length === 0 ? (
              <p className="text-zinc-500">Nenhum horário disponível no momento.</p>
            ) : (
              <div className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-white">2. Escolha o horário</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {horariosPorData.map(({ data, weekday, horarios: horariosDoDia }) => (
                    <div key={data.toString()} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="font-semibold text-white">{weekday}</p>
                      <p className="mb-3 text-xs text-zinc-500">{formatarData(data)}</p>
                      <div className="flex flex-wrap gap-2">
                        {horariosDoDia.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => setHorarioId(h.id)}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                              horarioId === h.id
                                ? "bg-violet-600 text-white scale-105"
                                : "bg-black/20 text-zinc-300 hover:bg-black/30"
                            }`}
                          >
                            {h.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={`rounded-2xl border p-6 transition-colors ${
                servicoEscolhido && horarioEscolhido
                  ? "border-pink-400/30 bg-pink-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {servicoEscolhido && horarioEscolhido ? (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-pink-300" />
                    <p className="text-white">
                      <strong>{servicoEscolhido.name}</strong> — {horarioEscolhido.weekday},{" "}
                      {formatarData(horarioEscolhido.data)} às {horarioEscolhido.time}
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
                </>
              ) : (
                <p className="text-sm text-zinc-500">
                  {!servicoEscolhido && !horarioEscolhido
                    ? "Selecione um serviço e um horário acima para continuar."
                    : !servicoEscolhido
                      ? "Falta escolher o serviço acima."
                      : "Falta escolher o horário acima."}
                </p>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
