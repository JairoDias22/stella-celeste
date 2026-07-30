import Container from "../layout/Container";

const slots = [
  {
    service: "Consulta Espiritual",
    total: 10,
    available: 4,
  },
  {
    service: "Leitura de Cartas",
    total: 15,
    available: 9,
  },
  {
    service: "Amarração",
    total: 5,
    available: 2,
  },
];

export default function WeeklySlots() {
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

        <div className="mt-16 space-y-8">
          {slots.map((slot) => {
            const percentage =
              (slot.available / slot.total) * 100;

            return (
              <div
                key={slot.service}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="mb-4 flex justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {slot.service}
                  </h3>

                  <span className="text-yellow-400 font-semibold">
                    {slot.available} / {slot.total}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}