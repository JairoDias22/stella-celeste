import Container from "../layout/Container";

export default function FAQ() {
  return (
    <section id="faq" className="py-28">
      <Container>
        <h2 className="text-4xl font-bold text-white">
          Perguntas Frequentes
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-400">
          Tire suas dúvidas antes de agendar sua consulta.
        </p>
      </Container>
    </section>
  );
}