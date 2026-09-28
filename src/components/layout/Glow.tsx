// Brilho suave decorativo. Usa gradiente radial em vez de `filter: blur(...)`:
// o visual é praticamente o mesmo, mas blur grande (100px+) em camadas enormes
// é o que mais pesa no Safari do iPhone e faz a página travar ao rolar.
export default function Glow({
  rgb,
  alpha,
  className = "",
}: {
  rgb: string; // ex: "124,58,237"
  alpha: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(closest-side, rgba(${rgb},${alpha}) 0%, rgba(${rgb},${(alpha * 0.45).toFixed(3)}) 45%, rgba(${rgb},0) 100%)`,
      }}
    />
  );
}
