"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stars, Loader2 } from "lucide-react";
import { clienteLogin } from "@/lib/actions/auth";

export default function LoginPage() {
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
      const result = await clienteLogin(form.email.trim(), form.password);
      if (!result.success) {
        setError(result.error ?? "Não foi possível entrar.");
        setLoading(false);
        return;
      }
      router.push("/minha-conta");
      router.refresh();
    } catch {
      setError("Erro ao conectar. Verifique sua conexão e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
            <Stars className="h-8 w-8 text-pink-300" />
          </div>
          <h1 className="font-title text-3xl font-bold text-white">Entrar</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Acesse sua conta para ver seus atendimentos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
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
              placeholder="voce@email.com"
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

          <Button type="submit" className="w-full transition-transform hover:scale-[1.02]" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-pink-300 hover:text-pink-200">
            Criar conta
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
