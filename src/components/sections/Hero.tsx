"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import Container from "../layout/Container";
import HeroCard from "./HeroCard";
import MysticalHeroBackground from "../layout/MysticalHeroBackground";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <MysticalHeroBackground />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-1 text-sm text-pink-200"
            >
              ✦ Consultas Espirituais
            </motion.span>

            <h1 className="mt-6 font-title text-5xl font-bold leading-tight text-white md:text-7xl">
              Stella
              <br />
              Celeste
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Descubra caminhos, respostas e direcionamentos através da leitura
              das cartas. Um atendimento acolhedor, sigiloso e totalmente
              personalizado.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/agendar"
                className={buttonVariants({ size: "lg", className: "transition-transform hover:scale-105" })}
              >
                Agendar Consulta
              </Link>

              <a
                href="#servicos"
                className={buttonVariants({ variant: "outline", size: "lg", className: "transition-transform hover:scale-105" })}
              >
                Conhecer Serviços
              </a>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block"
          >
            <HeroCard />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
