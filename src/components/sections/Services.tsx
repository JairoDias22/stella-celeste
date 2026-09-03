import Link from "next/link";
import Container from "../layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles, Clock3, HeartHandshake, Stars, Moon, Flame } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "../layout/AnimatedSection";

const ICONES = [Sparkles, Clock3, HeartHandshake, Stars, Moon, Flame];

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
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico, i) => {
              const Icon = ICONES[i % ICONES.length];

              return (
                <AnimatedSection
                  key={servico.id}
                  delay={i * 0.08}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-pink-400/40 hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.35)]"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20">
                    <Icon className="h-7 w-7 text-pink-300" />
                  </div>

                  <h3 className="text-2xl font-semibold text-white">
                    {servico.name}
                  </h3>

                  {servico.description && (
                    <p className="mt-4 text-zinc-400">{servico.description}</p>
                  )}

                  <p className="mt-4 text-sm text-zinc-500">{servico.duration}</p>

                  <p className="mt-4 text-3xl font-bold text-pink-300">
                    {servico.price}
                  </p>

                  <Link
                    href="/agendar"
                    className={buttonVariants({ className: "mt-8 w-full rounded-full transition-transform hover:scale-105" })}
                  >
                    Agendar
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
