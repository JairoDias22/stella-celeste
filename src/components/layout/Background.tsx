import Glow from "@/components/layout/Glow";
export default function Background() {
  return (
    <>
      <div className="fixed inset-0 -z-50 bg-[#0b0710]" />

      {/* Glow Roxo */}
      <Glow rgb="109,40,217" alpha={0.15} className="fixed left-[-200px] top-[-200px] -z-40 h-[500px] w-[500px] animate-pulse-glow" />

      {/* Glow Rosa */}
      <Glow rgb="236,72,153" alpha={0.1} className="fixed bottom-[-250px] right-[-150px] -z-40 h-[450px] w-[450px] animate-pulse-glow" />

      {/* Glow Central */}
      <Glow rgb="162,28,175" alpha={0.1} className="fixed left-1/2 top-1/3 -z-40 h-[350px] w-[350px] -translate-x-1/2" />

      {/* Estrelas */}
      <div className="stars" />
      <div className="stars-grandes" />
    </>
  );
}
