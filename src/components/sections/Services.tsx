import Container from "../layout/Container";
import { Button } from "@/components/ui/button";
import { Clock3, Sparkles, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Consulta Espiritual",
    description:
      "Receba orientações para compreender melhor os desafios e oportunidades da sua vida.",
    price: "R$ 120",
  },
  {
    icon: Clock3,
    title: "Leitura de Cartas",
    description:
      "Uma leitura detalhada para trazer clareza sobre amor, trabalho, família e decisões importantes.",
    price: "R$ 90",
  },
  {
    icon: HeartHandshake,
    title: "Amarração",
    description:
      "Atendimento personalizado para casos específicos, sempre realizado com responsabilidade.",
    price: "Sob consulta",
  },
];

export default function Services() {
  return (
    <section id="servicos" className="py-28">
      <Container>
        <div className="text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Serviços
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Escolha o atendimento ideal
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Cada atendimento foi pensado para oferecer acolhimento, orientação e
            uma experiência personalizada.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20">
                  <Icon className="h-7 w-7 text-yellow-400" />
                </div>

                <h3 className="text-2xl font-semibold text-white">
                  {service.title}
                </h3>

                <p className="mt-4 text-zinc-400">
                  {service.description}
                </p>

                <p className="mt-8 text-3xl font-bold text-yellow-400">
                  {service.price}
                </p>

                <Button className="mt-8 w-full rounded-full">
                  Agendar
                </Button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}