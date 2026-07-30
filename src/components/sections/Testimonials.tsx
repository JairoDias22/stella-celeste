import Container from "../layout/Container";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-28">
      <Container>
        <h2 className="text-4xl font-bold text-white">
          Depoimentos
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-400">
          Veja o que os clientes dizem sobre seus atendimentos.
        </p>
      </Container>
    </section>
  );
}