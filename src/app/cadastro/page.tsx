"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import { Stars, Loader2, Sparkles } from "lucide-react";
import { clienteRegister } from "@/lib/actions/auth";
import SiteLogo from "@/components/layout/SiteLogo";
import AuthGlow from "@/components/layout/AuthGlow";

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Preencha nome, e-mail e senha.");
      return;
    }
    if (form.password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const result = await clienteRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });
      if (!result.success) {
        setError(result.error ?? "Não foi possível criar a conta.");
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
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <AuthGlow />

      <div className="fixed left-1/2 top-6 -translate-x-1/2">
        <SiteLogo />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse-glow" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-pink-400/20 bg-gradient-to-br from-violet-500/30 to-pink-500/20">
              <Stars className="h-8 w-8 text-pink-300" />
            </div>
          </div>
          <h1 className="font-title text-3xl font-bold text-white">Criar conta</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-pink-300" />
            Cadastre-se para acompanhar seus atendimentos
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
              <Label className="text-zinc-300">Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-zinc-300">E-mail</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-zinc-300">Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(85) 99999-9999"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Senha</Label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-pink-500 shadow-[0_0_25px_-5px_rgba(236,72,153,0.6)] transition-transform hover:scale-[1.02] hover:shadow-[0_0_35px_-5px_rgba(236,72,153,0.8)]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar conta
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-pink-300 hover:text-pink-200">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
