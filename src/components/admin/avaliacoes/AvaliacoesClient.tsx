"use client";

import { useState, useTransition } from "react";
import { Star, Check, X, Loader2 } from "lucide-react";
import { atualizarStatusAvaliacao } from "@/lib/actions/avaliacoes";

type Avaliacao = {
  id: string;
  nota: number;
  comentario: string;
  status: string;
  createdAt: Date;
  cliente: { name: string; email: string };
};

const statusStyle: Record<string, string> = {
  pendente: "bg-yellow-500/15 text-yellow-400",
  aprovada: "bg-green-500/15 text-green-400",
  recusada: "bg-red-500/15 text-red-400",
};

export default function AvaliacoesClient({ initialData }: { initialData: Avaliacao[] }) {
  const [avaliacoes, setAvaliacoes] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  function atualizar(id: string, status: "aprovada" | "recusada" | "pendente") {
    startTransition(async () => {
      const result = await atualizarStatusAvaliacao(id, status);
      if (result.success) {
        setAvaliacoes((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      }
    });
  }

  const pendentes = avaliacoes.filter((a) => a.status === "pendente");
  const outras = avaliacoes.filter((a) => a.status !== "pendente");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-title">Avaliações</h1>
        <p className="mt-2 text-zinc-400">
          Aprove os comentários que devem aparecer no site.
        </p>
      </div>

      {pendentes.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-yellow-400">
            Pendentes de aprovação ({pendentes.length})
          </h2>
          <div className="space-y-4">
            {pendentes.map((a) => (
              <div key={a.id} className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{a.cliente.name}</p>
                    <p className="text-xs text-zinc-500">{a.cliente.email}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${idx < a.nota ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-zinc-300">{a.comentario}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => atualizar(a.id, "aprovada")}
                    disabled={isPending}
                    className="flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Aprovar
                  </button>
                  <button
                    onClick={() => atualizar(a.id, "recusada")}
                    disabled={isPending}
                    className="flex items-center gap-1.5 rounded-full bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30"
                  >
                    <X className="h-3.5 w-3.5" />
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold">Todas as avaliações</h2>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="p-5 text-left">Cliente</th>
              <th className="p-5 text-left">Nota</th>
              <th className="p-5 text-left">Comentário</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {outras.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  Nenhuma avaliação aprovada ou recusada ainda.
                </td>
              </tr>
            )}
            {outras.map((a) => (
              <tr key={a.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.03]">
                <td className="p-5">{a.cliente.name}</td>
                <td className="p-5">{a.nota}/5</td>
                <td className="max-w-xs truncate p-5 text-zinc-400">{a.comentario}</td>
                <td className="p-5">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-5">
                  <button
                    onClick={() => atualizar(a.id, a.status === "aprovada" ? "recusada" : "aprovada")}
                    disabled={isPending}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    {a.status === "aprovada" ? "Remover do site" : "Aprovar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
