"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { redefinirSenha } from "@/lib/actions/recuperar-senha";
import SiteLogo from "@/components/layout/SiteLogo";
import AuthGlow from "@/components/layout/AuthGlow";

export default function RedefinirSenhaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tipo = searchParams.get("tipo") === "admin" ? "admin" : "cliente";

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Link inválido. Solicite a recuperação de senha novamente.");
      return;
    }
    if (senha.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const result = await redefinirSenha(token, tipo, senha);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Não foi possível redefinir a senha.");
      return;
    }

    setSucesso(true);
    setTimeout(() => {
      router.push(tipo === "admin" ? "/admin/login" : "/login");
    }, 2000);
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
            <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse-glow" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-pink-400/20 bg-gradient-to-br from-violet-500/30 to-pink-500/20">
              <KeyRound className="h-7 w-7 text-pink-300" />
            </div>
          </div>
          <h1 className="font-title text-3xl font-bold text-white">Nova senha</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Escolha uma nova senha para sua conta.
          </p>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-transparent p-[1.5px] shadow-[0_0_50px_-15px_rgba(236,72,153,0.4)]">
          <div className="rounded-[26px] border border-white/10 bg-[#0f0a17]/90 p-8 backdrop-blur-xl">
            {sucesso ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
                <p className="text-white">Senha redefinida! Redirecionando para o login...</p>
              </div>
            ) : !token ? (
              <p className="text-sm text-red-400">
                Link inválido. Volte e solicite a recuperação de senha novamente.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
                )}

                <div>
                  <Label className="text-zinc-300">Nova senha</Label>
                  <PasswordInput
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                <div>
                  <Label className="text-zinc-300">Confirmar nova senha</Label>
                  <PasswordInput
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-500"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Redefinir senha
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href={tipo === "admin" ? "/admin/login" : "/login"} className="hover:text-zinc-300">
            ← Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
