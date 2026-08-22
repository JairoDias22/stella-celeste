"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { atualizarStatusReserva } from "@/lib/actions/reservas-admin";

type Reserva = {
  id: string;
  status: string;
  valor: number | string; // Decimal do Prisma chega serializado, tratamos os dois casos
  metodoPagamento: string | null;
  createdAt: Date;
  cliente: { name: string; email: string; phone: string | null };
  servico: { name: string };
  vaga: { weekday: string; time: string };
};

const statusStyle: Record<string, string> = {
  pago: "bg-green-500/15 text-green-400",
  pendente: "bg-yellow-500/15 text-yellow-400",
  cancelado: "bg-red-500/15 text-red-400",
};

export default function ReservasClient({ initialData }: { initialData: Reserva[] }) {
  const [reservas, setReservas] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix");

  function marcarComoPago(id: string) {
    startTransition(async () => {
      const result = await atualizarStatusReserva(id, "pago", metodo);
      if (result.success) {
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "pago", metodoPagamento: metodo } : r))
        );
        setEditandoId(null);
      }
    });
  }

  function cancelar(id: string) {
    if (!confirm("Cancelar essa reserva? O horário volta a ficar disponível.")) return;
    startTransition(async () => {
      const result = await atualizarStatusReserva(id, "cancelado");
      if (result.success) {
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "cancelado" } : r))
        );
      }
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Reservas</h1>
        <p className="mt-2 text-zinc-400">
          Acompanhe os agendamentos e confirme os pagamentos recebidos.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="p-5 text-left">Cliente</th>
              <th className="p-5 text-left">Serviço</th>
              <th className="p-5 text-left">Horário</th>
              <th className="p-5 text-left">Valor</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Nenhuma reserva ainda.
                </td>
              </tr>
            )}
            {reservas.map((r) => (
              <tr key={r.id} className="border-b border-white/10">
                <td className="p-5">
                  <p>{r.cliente.name}</p>
                  <p className="text-xs text-zinc-500">{r.cliente.phone || r.cliente.email}</p>
                </td>
                <td className="p-5">{r.servico.name}</td>
                <td className="p-5">
                  {r.vaga.weekday} {r.vaga.time}
                </td>
                <td className="p-5">
                  {Number(r.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="p-5">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle[r.status] ?? ""}`}>
                    {r.status}
                    {r.metodoPagamento ? ` · ${r.metodoPagamento}` : ""}
                  </span>
                </td>
                <td className="p-5">
                  {r.status === "pendente" ? (
                    editandoId === r.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={metodo}
                          onChange={(e) => setMetodo(e.target.value as "pix" | "cartao")}
                          className="h-8 rounded-full border border-white/10 bg-black/30 px-2 text-xs"
                        >
                          <option value="pix">PIX</option>
                          <option value="cartao">Cartão</option>
                        </select>
                        <button
                          onClick={() => marcarComoPago(r.id)}
                          disabled={isPending}
                          className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium hover:bg-green-700"
                        >
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirmar"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditandoId(r.id)}
                          className="rounded-full bg-green-600/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-600/30"
                        >
                          Marcar como pago
                        </button>
                        <button
                          onClick={() => cancelar(r.id)}
                          disabled={isPending}
                          className="rounded-full bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/30"
                        >
                          Cancelar
                        </button>
                      </div>
                    )
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
