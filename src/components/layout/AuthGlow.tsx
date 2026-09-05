export default function AuthGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[8%] top-[10%] h-[350px] w-[350px] rounded-full bg-violet-600/20 blur-[130px] animate-float-slow" />
      <div className="absolute right-[10%] bottom-[10%] h-[320px] w-[320px] rounded-full bg-pink-500/15 blur-[130px] animate-float-slower" />
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[140px] animate-pulse-glow" />
    </div>
  );
}
