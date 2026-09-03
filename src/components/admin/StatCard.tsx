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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-violet-500/20 p-3 text-pink-300">
          {icon}
        </div>
      </div>
    </div>
  );
}