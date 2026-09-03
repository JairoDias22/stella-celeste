import Container from "../layout/Container";
import AnimatedSection from "../layout/AnimatedSection";

const testimonials = [
  {
    name: "Maria A.",
    text: "A consulta me trouxe muita clareza. Recomendo de coração.",
  },
  {
    name: "Carlos M.",
    text: "Fui muito bem atendido. Tudo ocorreu com respeito e profissionalismo.",
  },
  {
    name: "Fernanda S.",
    text: "Uma experiência acolhedora e que realmente me ajudou.",
  },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-28">
      <Container>
        <AnimatedSection className="text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Depoimentos
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            O que dizem nossos clientes
          </h2>
        </AnimatedSection>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <AnimatedSection
              key={item.name}
              delay={i * 0.1}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/30"
            >
              <p className="text-zinc-300 leading-7">
                &ldquo;{item.text}&rdquo;
              </p>

              <h4 className="mt-8 font-semibold text-pink-300">
                {item.name}
              </h4>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
