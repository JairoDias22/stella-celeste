"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/actions/auth";
import SiteLogo from "@/components/layout/SiteLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(form.email.trim(), form.password);
      if (!result.success) {
        setError(result.error ?? "Não foi possível entrar.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Erro ao conectar. Verifique sua conexão e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#09090B] px-6">
      <div className="fixed left-[-200px] top-[-200px] -z-10 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[140px]" />
      <div className="fixed bottom-[-250px] right-[-150px] -z-10 h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[140px]" />

      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <SiteLogo />
        </div>
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20">
            <Sparkles className="h-7 w-7 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Stella Admin</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Entre com sua conta para acessar o painel.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
          )}

          <div>
            <Label className="text-zinc-300">E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="voce@stellaceleste.com"
              autoComplete="email"
            />
          </div>

          <div>
            <Label className="text-zinc-300">Senha</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
