"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Eye, Sparkles } from "lucide-react";
import Container from "../layout/Container";
import MysticalHeroBackground from "../layout/MysticalHeroBackground";

const DESTAQUES = [
  "Atendimento com intuição e verdade",
  "Sigilo absoluto",
  "Orientação espiritual",
  "Energia e proteção",
];

function CardDestaques() {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-[#150c22]/80 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-amber-400/15">
        <Sparkles className="size-5 text-amber-300" />
      </div>

      <ul className="space-y-3.5">
        {DESTAQUES.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-zinc-200">
            <span className="mt-0.5 text-amber-300" aria-hidden>
              ✦
            </span>
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <MysticalHeroBackground />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          {/* Olho d'água dourado */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-amber-300/90 md:text-sm"
          >
            Intuição
            <Sparkles className="size-3.5 text-amber-300" />
            que ilumina
          </motion.p>

          <h1 className="mt-6 font-title text-5xl font-bold uppercase leading-[1.05] tracking-wide md:text-7xl">
            <span className="block text-white">O caminho</span>
            <span className="block bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Que você procura
            </span>
          </h1>

          {/* Divisória ornamental */}
          <div className="mt-8 flex items-center gap-3" aria-hidden>
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/70" />
            <span className="text-xs text-amber-300">✦</span>
            <span className="h-px w-28 bg-gradient-to-l from-transparent to-amber-400/70" />
          </div>

          <p className="mt-8 max-w-xl text-base leading-8 text-zinc-300/90 md:text-lg">
            Através das cartas, da espiritualidade e da intuição, trago
            clareza, orientação e transformação para a sua vida. Permita-se
            encontrar as respostas que o seu coração busca.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#2a1a05] shadow-[0_0_30px_rgba(251,191,36,0.25)] transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]"
            >
              <CalendarDays className="size-4" />
              Agendar consulta
            </Link>

            <a
              href="#servicos"
              className="inline-flex items-center gap-2.5 rounded-lg border border-amber-400/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-amber-100 transition-all hover:scale-[1.03] hover:border-amber-300/70 hover:bg-amber-400/10"
            >
              <Eye className="size-4" />
              Conhecer serviços
            </a>
          </div>

          {/* No mobile/tablet o card entra aqui, no fluxo normal do texto,
              já que ali não tem espaço pra flutuar por cima da foto sem
              cobrir o conteúdo. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="mt-10 max-w-sm lg:hidden"
          >
            <CardDestaques />
          </motion.div>
        </motion.div>
      </Container>

      {/* No desktop, o card flutua sobre a foto, do lado direito — igual no
          mockup original. */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="absolute inset-y-0 right-6 z-10 hidden w-64 items-center lg:flex xl:right-16"
      >
        <CardDestaques />
      </motion.div>
    </section>
  );
}
