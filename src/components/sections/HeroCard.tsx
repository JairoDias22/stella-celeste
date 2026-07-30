import { Sparkles, MoonStar, Stars } from "lucide-react";

export default function HeroCard() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-violet-600/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20">
            <Stars className="h-10 w-10 text-yellow-400" />
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
            <Sparkles className="text-yellow-400" />
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

          <p className="text-yellow-400 text-lg">
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