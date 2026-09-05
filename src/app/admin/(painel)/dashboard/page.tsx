import StatCard from "@/components/admin/StatCard";
import { DollarSign, Users, Calendar, Briefcase } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";

const statusStyle: Record<string, string> = {
  pago: "text-green-400",
  pendente: "text-yellow-400",
  cancelado: "text-red-400",
};

const statusLabel: Record<string, string> = {
  pago: "Pago",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold font-title">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Faturamento"
          value={stats.faturamentoTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<DollarSign />}
        />
        <StatCard title="Clientes" value={String(stats.totalClientes)} icon={<Users />} />
        <StatCard title="Consultas" value={String(stats.totalConsultas)} icon={<Calendar />} />
        <StatCard title="Serviços" value={String(stats.totalServicos)} icon={<Briefcase />} />
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
        <h2 className="mb-6 text-2xl font-semibold">Últimos Atendimentos</h2>

        {stats.ultimasReservas.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-700 text-zinc-500">
            Nenhum atendimento registrado ainda.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Serviço</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.ultimasReservas.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="py-5">{r.cliente.name}</td>
                  <td>{r.servico.name}</td>
                  <td className={statusStyle[r.status] ?? "text-zinc-400"}>
                    {statusLabel[r.status] ?? r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
