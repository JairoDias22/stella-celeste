import Container from "../layout/Container";

export default function WeeklySlots() {
  return (
    <section id="vagas" className="py-28">
      <Container>
        <h2 className="text-4xl font-bold text-white">
          Vagas da Semana
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-400">
          Acompanhe a disponibilidade semanal para cada tipo de atendimento.
        </p>
      </Container>
    </section>
  );
}