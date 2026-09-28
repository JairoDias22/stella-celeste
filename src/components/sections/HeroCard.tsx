import { Sparkles, MoonStar, Stars } from "lucide-react";
import Glow from "@/components/layout/Glow";

export default function HeroCard() {
  return (
    <div className="relative animate-float-slow">
      {/* Glow */}
      <Glow rgb="124,58,237" alpha={0.2} className="absolute inset-0" />
      <Glow rgb="236,72,153" alpha={0.1} className="absolute inset-0" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:backdrop-blur-xl">

        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20">
            <Stars className="h-10 w-10 text-pink-300" />
          </div>
        </div>

        <h3 className="text-center text-3xl font-semibold text-white">
          Stella Celeste
        </h3>

        <p className="mt-2 text-center text-zinc-400">
          Cartomancia • Orientação Espiritual
        </p>

        <div className="mt-10 space-y-5">

          <div className="flex items-center gap-3">
            <Sparkles className="text-pink-300" />
            <span>Consultas Personalizadas</span>
          </div>

          <div className="flex items-center gap-3">
            <MoonStar className="text-violet-400" />
            <span>Leitura de Cartas</span>
          </div>

          <div className="flex items-center gap-3">
            <Stars className="text-purple-400" />
            <span>Orientação Espiritual</span>
          </div>

        </div>

        <div className="mt-10 rounded-2xl bg-white/5 p-5 text-center">

          <p className="text-pink-300 text-lg">
            ★★★★★
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Atendimento reservado, acolhedor e personalizado.
          </p>

        </div>

      </div>
    </div>
  );
}
