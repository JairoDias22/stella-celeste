import Link from "next/link";
import Container from "../layout/Container";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "../layout/AnimatedSection";
import { CheckCircle2, XCircle } from "lucide-react";

const ORDEM_DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default async function WeeklySlots() {
  const vagas = await prisma.vaga.findMany({
    orderBy: [{ weekday: "asc" }, { time: "asc" }],
  });

  const porDia = ORDEM_DIAS.map((dia) => ({
    dia,
    horarios: vagas.filter((v) => v.weekday === dia),
  })).filter((d) => d.horarios.length > 0);

  return (
    <section id="vagas" className="py-28">
      <Container>
        <AnimatedSection className="text-center">
          <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-200">
            Disponibilidade
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Vagas desta semana
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Clique em um horário disponível abaixo para ir direto pro agendamento.
          </p>

          {/* Legenda */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-4 w-4" /> Disponível
            </span>
            <span className="flex items-center gap-2 text-zinc-500">
              <XCircle className="h-4 w-4" /> Ocupado
            </span>
          </div>
        </AnimatedSection>

        {porDia.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500">
            Nenhum horário disponível no momento. Volte em breve.
          </p>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {porDia.map(({ dia, horarios }, i) => {
              const disponiveis = horarios.filter((h) => h.available).length;

              return (
                <AnimatedSection
                  key={dia}
                  delay={i * 0.08}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-violet-400/40"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{dia}</h3>
                    <span className="font-semibold text-pink-300">
                      {disponiveis} / {horarios.length} livres
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {horarios.map((h) =>
                      h.available ? (
                        <Link
                          key={h.id}
                          href={`/agendar?vaga=${h.id}`}
                          className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-sm font-medium text-green-400 transition-all hover:scale-105 hover:bg-green-500/25"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {h.time}
                        </Link>
                      ) : (
                        <span
                          key={h.id}
                          className="flex items-center gap-1.5 rounded-full bg-zinc-700/30 px-3 py-1.5 text-sm font-medium text-zinc-500"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span className="line-through">{h.time}</span>
                        </span>
                      )
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
