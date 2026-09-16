import Container from "../layout/Container";
import { Sparkles, ShieldCheck, MoonStar } from "lucide-react";
import AnimatedSection from "../layout/AnimatedSection";

export default function About() {
  return (
    <section id="sobre" className="py-28">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Foto */}
          <AnimatedSection className="relative mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-violet-600/20 blur-3xl animate-pulse-glow" />
            <div className="absolute inset-0 rounded-3xl bg-pink-500/10 blur-3xl" />

            <div className="relative h-[440px] w-[350px] overflow-hidden rounded-3xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sobre-cartomante.jpg"
                alt="Cleopatra Stella, cartomante"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 18%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0710]/50 via-transparent to-transparent" />
            </div>
          </AnimatedSection>

          {/* Conteúdo */}
          <AnimatedSection delay={0.15}>

            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              Sobre
            </span>

            <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
              Olá, seja muito bem-vindo(a)!
            </h2>

            <div className="mt-6 space-y-4 text-lg leading-8 text-zinc-400">
              <p>
                Muito prazer, me chamo Cleopatra Stella. Sou cartomante e
                apaixonada por decifrar os caminhos que a espiritualidade nos
                reserva.
              </p>
              <p>
                Além do meu trabalho com as cartas, levo uma rotina dinâmica:
                estudo Administração Pública na Universidade Estadual do
                Maranhão (UEMA) e atuo profissionalmente. Na vida pessoal e
                nos atendimentos, procuro ser sempre uma pessoa simpática,
                gentil e alegre, mantendo um ambiente leve e de muita
                confiança.
              </p>
              <p>
                Estou aqui para te ajudar a compreender melhor seus momentos
                de dúvida, renovar suas perspectivas e melhorar a sua energia
                para que você possa caminhar com mais clareza e paz. Será uma
                honra guiar você nessa jornada!
              </p>
            </div>

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
