import Container from "../layout/Container";

export default function Contact() {
  return (
    <section id="contato" className="py-28">
      <Container>
        <h2 className="text-4xl font-bold text-white">
          Contato
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-400">
          Entre em contato para tirar dúvidas ou agendar um atendimento.
        </p>
      </Container>
    </section>
  );
}