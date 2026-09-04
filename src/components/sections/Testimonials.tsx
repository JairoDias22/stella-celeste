import Container from "../layout/Container";
import AnimatedSection from "../layout/AnimatedSection";
import { getAvaliacoesAprovadas } from "@/lib/actions/avaliacoes";
import { Star } from "lucide-react";

export default async function Testimonials() {
  const avaliacoes = await getAvaliacoesAprovadas();

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

        {avaliacoes.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500">
            Em breve as primeiras avaliações de clientes aparecerão aqui.
          </p>
        ) : (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {avaliacoes.map((item, i) => (
              <AnimatedSection
                key={item.id}
                delay={i * 0.1}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/30"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${idx < item.nota ? "fill-pink-300 text-pink-300" : "text-zinc-700"}`}
                    />
                  ))}
                </div>

                <p className="text-zinc-300 leading-7">
                  &ldquo;{item.comentario}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-3">
                  {item.cliente.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cliente.avatarUrl}
                      alt={item.cliente.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/30 text-sm font-semibold text-pink-200">
                      {item.cliente.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <h4 className="font-semibold text-white">{item.cliente.name}</h4>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
