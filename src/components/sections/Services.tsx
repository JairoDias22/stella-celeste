import Container from "../layout/Container";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "../layout/AnimatedSection";
import ServicosGrid from "./ServicosGrid";

export default async function Services() {
  const servicos = await prisma.servico.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <section id="servicos" className="py-28">
      <Container>
        <AnimatedSection className="text-center">
          <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-200">
            Serviços
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Escolha o atendimento ideal
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Cada atendimento foi pensado para oferecer acolhimento, orientação e
            uma experiência personalizada.
          </p>
        </AnimatedSection>

        {servicos.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500">
            Em breve novos atendimentos serão publicados aqui.
          </p>
        ) : (
          <ServicosGrid servicos={servicos} />
        )}
      </Container>
    </section>
  );
}
