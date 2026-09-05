import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/30 hover:shadow-[0_0_35px_-10px_rgba(236,72,153,0.35)]">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-600/20 to-pink-500/10 blur-2xl transition-opacity group-hover:opacity-80" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-violet-500/25 to-pink-500/20 p-3 text-pink-300">
          {icon}
        </div>
      </div>
    </div>
  );
}
