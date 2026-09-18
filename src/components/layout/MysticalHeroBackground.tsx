"use client";

import { useState } from "react";

export default function MysticalHeroBackground() {
  // Se /public/hero-cartomante.png não existir (ou o link estiver errado), a
  // foto simplesmente não aparece e cai de volta nas nebulosas roxas — nada
  // quebra.
  const [temFoto, setTemFoto] = useState(true);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base escura levemente arroxeada */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0f2e,_#0b0710_70%)]" />

      {temFoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero-cartomante.png"
          alt=""
          onError={() => setTemFoto(false)}
          className="absolute inset-0 h-full w-full object-cover object-[60%_18%] md:object-[44%_30%]"
          style={{
            // A foto vai perdendo opacidade nos últimos 40% de altura,
            // revelando o degradê roxo-escuro por trás em vez de terminar
            // numa borda dura — assim a transição pra próxima seção fica
            // suave.
            maskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          }}
        />
      ) : (
        <>
          {/* Nebulosas (aparecem só se não houver foto) */}
          <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/25 blur-[150px] animate-float-slow" />
          <div className="absolute right-[-15%] top-[10%] h-[550px] w-[550px] rounded-full bg-pink-500/20 blur-[150px] animate-float-slower" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[160px] animate-pulse-glow" />
        </>
      )}

      {/* Véu escuro — no celular o texto fica por cima da foto inteira (não
          lado a lado como no desktop), então aqui é um escurecimento mais
          parelho pra manter a legibilidade em qualquer altura da tela.
          A partir do md, volta a ser só a esquerda, deixando a foto nítida
          do lado direito, onde o card flutua. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0710]/90 via-[#0b0710]/70 to-[#0b0710]/45 md:bg-gradient-to-r md:from-[#0b0710] md:via-[#0b0710]/60 md:to-transparent" />

      {/* Lua mística */}
      <div className="absolute right-[10%] top-[12%] hidden md:block">
        <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-violet-200/90 via-pink-200/70 to-violet-400/40 shadow-[0_0_60px_20px_rgba(217,180,255,0.25)] animate-float-slow" />
      </div>

      {/* Estrelas */}
      <div className="stars opacity-90" />
      <div className="stars-grandes opacity-90" />

      {/* Faixa extra de esmaecimento, com altura fixa (independe da altura
          total da seção) — garante que o final do hero sempre termine numa
          transição suave e previsível, e não numa borda nítida. */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-[#0b0710] md:h-72" />
    </div>
  );
}
