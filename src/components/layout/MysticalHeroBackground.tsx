export default function MysticalHeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base escura levemente arroxeada */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0f2e,_#0b0710_70%)]" />

      {/* Nebulosa violeta */}
      <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/25 blur-[150px] animate-float-slow" />

      {/* Nebulosa rosa */}
      <div className="absolute right-[-15%] top-[10%] h-[550px] w-[550px] rounded-full bg-pink-500/20 blur-[150px] animate-float-slower" />

      {/* Nebulosa fúcsia central, mais suave */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[160px] animate-pulse-glow" />

      {/* Lua mística */}
      <div className="absolute right-[12%] top-[14%] hidden md:block">
        <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-violet-200/90 via-pink-200/70 to-violet-400/40 shadow-[0_0_60px_20px_rgba(217,180,255,0.25)] animate-float-slow" />
      </div>

      {/* Estrelas */}
      <div className="stars opacity-90" />
      <div className="stars-grandes opacity-90" />

      {/* Véu escuro por cima pra suavizar contraste com o texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0710]" />
    </div>
  );
}
