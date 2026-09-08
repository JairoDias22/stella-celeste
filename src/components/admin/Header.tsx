"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2, Menu } from "lucide-react";
import { adminLogout } from "@/lib/actions/auth";

export default function Header({
  adminName,
  onOpenSidebar,
}: {
  adminName: string;
  onOpenSidebar?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600 bg-[length:200%_100%] animate-[pulse-glow_4s_ease-in-out_infinite]" />

      <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h2 className="font-title text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Painel Administrativo
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1.5 py-1.5 pr-2 sm:gap-3 sm:pr-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-400 text-sm font-semibold text-white">
              {adminName.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-sm text-zinc-300 sm:inline">{adminName}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-pink-400/30 hover:bg-white/5 hover:text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
