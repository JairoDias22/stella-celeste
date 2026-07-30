import StatCard from "@/components/admin/StatCard";
import {
  DollarSign,
  Users,
  Calendar,
  Briefcase,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div>

      <h1 className="mb-10 text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Faturamento"
          value="R$ 4.580"
          icon={<DollarSign />}
        />

        <StatCard
          title="Clientes"
          value="82"
          icon={<Users />}
        />

        <StatCard
          title="Consultas"
          value="31"
          icon={<Calendar />}
        />

        <StatCard
          title="Serviços"
          value="3"
          icon={<Briefcase />}
        />

      </div>

    </div>
  );
}
<><div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">

    <h2 className="mb-6 text-2xl font-semibold">
        Receita Mensal
    </h2>

    <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-zinc-700 text-zinc-500">
        Gráfico será implementado na próxima etapa.
    </div>

</div><div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">

        <h2 className="mb-6 text-2xl font-semibold">
            Últimos Atendimentos
        </h2>

        <table className="w-full text-left">

            <thead>

                <tr className="border-b border-white/10">

                    <th className="pb-4">Cliente</th>

                    <th className="pb-4">Serviço</th>

                    <th className="pb-4">Status</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td className="py-5">Maria Silva</td>

                    <td>Consulta</td>

                    <td className="text-green-400">
                        Pago
                    </td>

                </tr>

                <tr>

                    <td className="py-5">João Pedro</td>

                    <td>Leitura</td>

                    <td className="text-yellow-400">
                        Pendente
                    </td>

                </tr>

            </tbody>

        </table>

    </div></>



