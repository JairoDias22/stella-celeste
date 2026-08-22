import Container from "../layout/Container";
import { prisma } from "@/lib/prisma";

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
        <div className="text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Disponibilidade
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Vagas desta semana
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            Reserve sua consulta antes que as vagas sejam preenchidas.
          </p>
        </div>

        {porDia.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500">
            Nenhum horário disponível no momento. Volte em breve.
          </p>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {porDia.map(({ dia, horarios }) => {
              const disponiveis = horarios.filter((h) => h.available).length;

              return (
                <div
                  key={dia}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{dia}</h3>
                    <span className="font-semibold text-yellow-400">
                      {disponiveis} / {horarios.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {horarios.map((h) => (
                      <span
                        key={h.id}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                          h.available
                            ? "bg-green-500/15 text-green-400"
                            : "bg-zinc-700/40 text-zinc-500 line-through"
                        }`}
                      >
                        {h.time}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
