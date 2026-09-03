"use client";

import { useState } from "react";
import Container from "../layout/Container";
import { ChevronDown } from "lucide-react";
import AnimatedSection from "../layout/AnimatedSection";

const questions = [
  {
    question: "Como funciona uma consulta?",
    answer:
      "A consulta é realizada de forma individual, com total sigilo e foco nas suas dúvidas.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos PIX, cartão de crédito e cartão de débito.",
  },
  {
    question: "Como faço para agendar?",
    answer:
      "Basta criar sua conta, escolher um serviço e um horário disponível para reservar sua vaga.",
  },
  {
    question: "As vagas são limitadas?",
    answer:
      "Sim. Cada serviço possui uma quantidade limitada de vagas por semana.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28">
      <Container>

        <AnimatedSection className="text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            FAQ
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Perguntas Frequentes
          </h2>
        </AnimatedSection>

        <div className="mx-auto mt-16 max-w-4xl space-y-5">

          {questions.map((item, index) => (

            <AnimatedSection
              key={index}
              delay={index * 0.07}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-pink-400/20"
            >

              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="text-lg font-semibold text-white">
                  {item.question}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-pink-300" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  openIndex === index ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <p className="overflow-hidden text-zinc-400 leading-7">
                  {item.answer}
                </p>
              </div>

            </AnimatedSection>

          ))}

        </div>

      </Container>
    </section>
  );
}
