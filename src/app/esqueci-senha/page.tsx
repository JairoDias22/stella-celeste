"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { solicitarRecuperacaoSenha } from "@/lib/actions/recuperar-senha";
import SiteLogo from "@/components/layout/SiteLogo";
import AuthGlow from "@/components/layout/AuthGlow";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await solicitarRecuperacaoSenha(email.trim(), "cliente");
    setLoading(false);
    setEnviado(true);
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
              <Mail className="h-7 w-7 text-pink-300" />
            </div>
          </div>
          <h1 className="font-title text-3xl font-bold text-white">Esqueci minha senha</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-transparent p-[1.5px] shadow-[0_0_50px_-15px_rgba(236,72,153,0.4)]">
          <div className="rounded-[26px] border border-white/10 bg-[#0f0a17]/90 p-8 backdrop-blur-xl">
            {enviado ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
                <p className="text-white">
                  Se esse e-mail tiver uma conta, você vai receber um link de recuperação em instantes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-zinc-300">E-mail</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    autoComplete="email"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-500"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Enviar link de recuperação
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/login" className="hover:text-zinc-300">
            ← Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
