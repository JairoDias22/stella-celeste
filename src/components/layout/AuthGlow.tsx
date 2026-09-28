import Glow from "@/components/layout/Glow";
export default function AuthGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Glow rgb="124,58,237" alpha={0.2} className="absolute left-[8%] top-[10%] h-[350px] w-[350px] animate-float-slow" />
      <Glow rgb="236,72,153" alpha={0.15} className="absolute right-[10%] bottom-[10%] h-[320px] w-[320px] animate-float-slower" />
      <Glow rgb="192,38,211" alpha={0.1} className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
    </div>
  );
}
