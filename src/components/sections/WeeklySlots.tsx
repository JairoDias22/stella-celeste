import Container from "../layout/Container";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "../layout/AnimatedSection";

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
            Reserve sua consulta antes que as vagas sejam preenchidas.
          </p>
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
                      {disponiveis} / {horarios.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {horarios.map((h) => (
                      <span
                        key={h.id}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-transform hover:scale-105 ${
                          h.available
                            ? "bg-green-500/15 text-green-400"
                            : "bg-zinc-700/40 text-zinc-500 line-through"
                        }`}
                      >
                        {h.time}
                      </span>
                    ))}
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
