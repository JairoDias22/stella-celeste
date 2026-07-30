"use client";

import { useState } from "react";
import Container from "../layout/Container";
import { ChevronDown } from "lucide-react";

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
      "Basta escolher um serviço e realizar o pagamento para reservar sua vaga.",
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

        <div className="text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            FAQ
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-4xl space-y-5">

          {questions.map((item, index) => (

            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
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
                  className={`transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <p className="mt-5 text-zinc-400 leading-7">
                  {item.answer}
                </p>
              )}

            </div>

          ))}

        </div>

      </Container>
    </section>
  );
}