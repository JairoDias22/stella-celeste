import Link from "next/link";

export default function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-title text-xl font-bold tracking-wide text-white transition hover:text-pink-200 ${className ?? ""}`}
    >
      Stella Celeste
    </Link>
  );
}
