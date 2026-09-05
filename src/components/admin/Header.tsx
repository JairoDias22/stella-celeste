"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { adminLogout } from "@/lib/actions/auth";

export default function Header({ adminName }: { adminName: string }) {
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

      <div className="flex items-center justify-between p-6">
        <h2 className="font-title text-3xl font-bold text-white">
          Painel Administrativo
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 pr-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-400 text-sm font-semibold text-white">
              {adminName.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm text-zinc-300">{adminName}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-pink-400/30 hover:bg-white/5 hover:text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
