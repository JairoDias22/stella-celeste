"use client";

import { useEffect, useState, useTransition } from "react";
import { DollarSign, TrendingUp, Calendar, CreditCard, Loader2 } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { getFinanceiroStats } from "@/lib/actions/dashboard";

type Periodo = "dia" | "semana" | "mes";

type Stats = {
  total: number;
  atendimentos: number;
  ticketMedio: number;
  porMetodo: { pix: number; cartao: number };
  barras: { dia: string; valor: number }[];
};

const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FinanceiroClient() {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [stats, setStats] = useState<Stats | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getFinanceiroStats(periodo);
      setStats(data);
    });
  }, [periodo]);

  const maxBarra = stats ? Math.max(1, ...stats.barras.map((b) => b.valor)) : 1;
  const totalMetodos = stats ? stats.porMetodo.pix + stats.porMetodo.cartao : 0;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Financeiro</h1>
          <p className="mt-2 text-zinc-400">
            Acompanhe o faturamento por dia, semana e mês.
          </p>
        </div>

        <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {(["dia", "semana", "mes"] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                periodo === p
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {p === "mes" ? "Mês" : p}
            </button>
          ))}
        </div>
      </div>

      {!stats || isPending ? (
        <div className="flex h-40 items-center justify-center text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Faturamento" value={moeda(stats.total)} icon={<DollarSign />} />
            <StatCard
              title="Atendimentos pagos"
              value={String(stats.atendimentos)}
              icon={<Calendar />}
            />
            <StatCard
              title="Ticket médio"
              value={stats.atendimentos > 0 ? moeda(stats.ticketMedio) : "—"}
              icon={<TrendingUp />}
            />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 lg:col-span-2">
              <h2 className="mb-6 text-2xl font-semibold">Receita dos últimos 7 dias</h2>

              <div className="flex h-64 items-end gap-4">
                {stats.barras.map((b, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-fuchsia-500"
                        style={{ height: `${(b.valor / maxBarra) * 100}%`, minHeight: b.valor > 0 ? "4px" : "0" }}
                        title={moeda(b.valor)}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{b.dia}</span>
                  </div>
                ))}
              </div>

              {stats.barras.every((b) => b.valor === 0) && (
                <p className="mt-4 text-xs text-zinc-600">
                  Nenhum pagamento registrado nos últimos 7 dias ainda.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="mb-6 text-2xl font-semibold">Métodos de pagamento</h2>

              {totalMetodos === 0 ? (
                <p className="text-sm text-zinc-500">Nenhum pagamento neste período ainda.</p>
              ) : (
                <div className="space-y-5">
                  {[
                    { nome: "PIX", valor: stats.porMetodo.pix, cor: "bg-green-500" },
                    { nome: "Cartão", valor: stats.porMetodo.cartao, cor: "bg-violet-500" },
                  ].map((m) => {
                    const pct = Math.round((m.valor / totalMetodos) * 100);
                    return (
                      <div key={m.nome}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-zinc-300">
                            <CreditCard className="h-4 w-4" />
                            {m.nome}
                          </span>
                          <span className="text-zinc-400">{pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full ${m.cor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
