"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles, Clock3, HeartHandshake, Stars, Moon, Flame, Search } from "lucide-react";
import AnimatedSection from "../layout/AnimatedSection";

const ICONES = [Sparkles, Clock3, HeartHandshake, Stars, Moon, Flame];

type Servico = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: string;
};

export default function ServicosGrid({ servicos }: { servicos: Servico[] }) {
  const [busca, setBusca] = useState("");

  const filtrados = servicos.filter((s) => {
    const termo = busca.toLowerCase();
    return (
      s.name.toLowerCase().includes(termo) ||
      (s.description ?? "").toLowerCase().includes(termo)
    );
  });

  return (
    <>
      <div className="mx-auto mt-10 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar um serviço..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors focus:border-pink-400/40"
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500">
          Nenhum serviço encontrado para &quot;{busca}&quot;.
        </p>
      ) : (
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((servico, i) => {
            const Icon = ICONES[i % ICONES.length];

            return (
              <AnimatedSection
                key={servico.id}
                delay={i * 0.08}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-pink-400/40 hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.35)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20">
                  <Icon className="h-7 w-7 text-pink-300" />
                </div>

                <h3 className="text-2xl font-semibold text-white">
                  {servico.name}
                </h3>

                {servico.description && (
                  <p className="mt-4 text-zinc-400">{servico.description}</p>
                )}

                <p className="mt-4 text-sm text-zinc-500">{servico.duration}</p>

                <p className="mt-4 text-3xl font-bold text-pink-300">
                  {servico.price}
                </p>

                <Link
                  href="/agendar"
                  className={buttonVariants({ className: "mt-8 w-full rounded-full transition-transform hover:scale-105" })}
                >
                  Agendar
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      )}
    </>
  );
}
