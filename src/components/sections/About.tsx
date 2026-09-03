import Container from "../layout/Container";
import { Sparkles, ShieldCheck, MoonStar } from "lucide-react";
import AnimatedSection from "../layout/AnimatedSection";

export default function About() {
  return (
    <section id="sobre" className="py-28">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Card */}
          <AnimatedSection className="relative mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-violet-600/20 blur-3xl animate-pulse-glow" />
            <div className="absolute inset-0 rounded-3xl bg-pink-500/10 blur-3xl" />

            <div className="relative flex h-[420px] w-[350px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <MoonStar className="h-28 w-28 text-pink-300 animate-float-slow" />
            </div>
          </AnimatedSection>

          {/* Conteúdo */}
          <AnimatedSection delay={0.15}>

            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              Sobre
            </span>

            <h2 className="mt-6 text-5xl font-bold text-white">
              Um atendimento pensado para trazer clareza e direção.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Através da cartomancia, cada consulta busca oferecer uma visão mais
              clara sobre momentos importantes da vida, sempre com respeito,
              acolhimento e total sigilo.
            </p>

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <Sparkles className="text-pink-300" />
                <span>Consultas personalizadas</span>
              </div>

              <div className="flex items-center gap-4">
                <ShieldCheck className="text-violet-400" />
                <span>Total confidencialidade</span>
              </div>

              <div className="flex items-center gap-4">
                <MoonStar className="text-purple-400" />
                <span>Orientação espiritual</span>
              </div>

            </div>

          </AnimatedSection>

        </div>
      </Container>
    </section>
  );
}
