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
    <header className="flex items-center justify-between border-b border-white/10 p-6">
      <h2 className="text-3xl font-bold text-white">
        Painel Administrativo
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-zinc-400">
          Bem-vinda, {adminName}
        </span>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Sair
        </button>
      </div>
    </header>
  );
}