import { Button } from "@/components/ui/button";
import Container from "../layout/Container";
import HeroCard from "./HeroCard";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="flex min-h-screen items-center pt-20"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Conteúdo */}
          <div>
            <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-sm text-violet-300">
              ✦ Consultas Espirituais
            </span>

            <h1 className="mt-6 font-title text-5xl font-bold leading-tight text-white md:text-7xl">
              Stella
              <br />
              Celeste
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Descubra caminhos, respostas e direcionamentos através da leitura
              das cartas. Um atendimento acolhedor, sigiloso e totalmente
              personalizado.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg">
                Agendar Consulta
              </Button>

              <Button variant="outline" size="lg">
                Conhecer Serviços
              </Button>
            </div>
          </div>

          {/* Placeholder da imagem */}
         <div className="hidden lg:block">
  <HeroCard />
</div>
        </div>
      </Container>
    </section>
  );
}