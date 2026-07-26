export default function Background() {
  return (
    <>
      <div className="fixed inset-0 -z-50 bg-[#09090B]" />

      {/* Glow Roxo */}
      <div className="fixed left-[-200px] top-[-200px] -z-40 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[140px]" />

      {/* Glow Dourado */}
      <div className="fixed bottom-[-250px] right-[-150px] -z-40 h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[140px]" />

      {/* Glow Central */}
      <div className="fixed left-1/2 top-1/3 -z-40 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-fuchsia-700/10 blur-[120px]" />

      {/* Estrelas */}
      <div className="stars" />
    </>
  );
}