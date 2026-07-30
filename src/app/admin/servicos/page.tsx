import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Consulta Espiritual",
    price: "R$ 120,00",
    duration: "60 min",
    slots: 10,
  },
  {
    id: 2,
    name: "Leitura de Cartas",
    price: "R$ 90,00",
    duration: "40 min",
    slots: 15,
  },
  {
    id: 3,
    name: "Amarração",
    price: "Sob consulta",
    duration: "Variável",
    slots: 5,
  },
];

export default function Servicos() {
  return (
    <div>

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Serviços
          </h1>

          <p className="mt-2 text-zinc-400">
            Gerencie todos os serviços disponíveis.
          </p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>

      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">

        <table className="w-full">

          <thead className="border-b border-white/10">

            <tr>

              <th className="p-5 text-left">Serviço</th>
              <th className="p-5 text-left">Preço</th>
              <th className="p-5 text-left">Duração</th>
              <th className="p-5 text-left">Vagas</th>
              <th className="p-5 text-left">Ações</th>

            </tr>

          </thead>

          <tbody>

            {services.map((service) => (

              <tr
                key={service.id}
                className="border-b border-white/10"
              >

                <td className="p-5">{service.name}</td>

                <td className="p-5">{service.price}</td>

                <td className="p-5">{service.duration}</td>

                <td className="p-5">{service.slots}</td>

                <td className="p-5">

                  <div className="flex gap-3">

                    <Button variant="outline">
                      Editar
                    </Button>

                    <Button variant="destructive">
                      Excluir
                    </Button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}