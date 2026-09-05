"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/actions/auth";
import SiteLogo from "@/components/layout/SiteLogo";
import AuthGlow from "@/components/layout/AuthGlow";

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
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0710] px-6">
      <AuthGlow />
      <div className="stars" />
      <div className="stars-grandes" />

      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <SiteLogo />
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse-glow" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-pink-400/20 bg-gradient-to-br from-violet-500/30 to-pink-500/20">
              <Sparkles className="h-7 w-7 text-yellow-300" />
            </div>
          </div>
          <h1 className="font-title text-2xl font-bold text-white">Stella Admin</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Entre com sua conta para acessar o painel.
          </p>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-transparent p-[1.5px] shadow-[0_0_50px_-15px_rgba(236,72,153,0.4)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-[26px] border border-white/10 bg-[#0f0a17]/90 p-8 backdrop-blur-xl"
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
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-pink-500 shadow-[0_0_25px_-5px_rgba(236,72,153,0.6)] transition-transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
