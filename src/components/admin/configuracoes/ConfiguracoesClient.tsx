"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import { Loader2, Bell, Lock, UserRound } from "lucide-react";
import { updateAdminAccount, updateAdminPassword } from "@/lib/actions/admin-conta";

export default function ConfiguracoesClient({
  admin,
}: {
  admin: { name: string; email: string };
}) {
  const [conta, setConta] = useState({ name: admin.name, email: admin.email });
  const [senha, setSenha] = useState({ atual: "", nova: "", confirmar: "" });
  const [notif, setNotif] = useState({
    novaReserva: true,
    pagamentoConfirmado: true,
    lembreteDiario: false,
  });
  const [savingConta, setSavingConta] = useState(false);
  const [savingSenha, setSavingSenha] = useState(false);
  const [erroConta, setErroConta] = useState<string | null>(null);
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function salvarConta(e: React.FormEvent) {
    e.preventDefault();
    setSavingConta(true);
    setErroConta(null);
    setMsg(null);

    const result = await updateAdminAccount({
      name: conta.name.trim(),
      email: conta.email.trim(),
    });

    setSavingConta(false);
    if (!result.success) {
      setErroConta(result.error ?? "Não foi possível salvar.");
      return;
    }
    setMsg("Dados da conta atualizados.");
  }

  async function salvarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(null);

    if (!senha.atual || !senha.nova || !senha.confirmar) {
      setErroSenha("Preencha todos os campos de senha.");
      return;
    }
    if (senha.nova.length < 8) {
      setErroSenha("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (senha.nova !== senha.confirmar) {
      setErroSenha("A confirmação não bate com a nova senha.");
      return;
    }

    setSavingSenha(true);
    const result = await updateAdminPassword({
      senhaAtual: senha.atual,
      novaSenha: senha.nova,
    });
    setSavingSenha(false);

    if (!result.success) {
      setErroSenha(result.error ?? "Não foi possível atualizar a senha.");
      return;
    }
    setSenha({ atual: "", nova: "", confirmar: "" });
    setMsg("Senha atualizada com sucesso.");
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-title">Configurações</h1>
        <p className="mt-2 text-zinc-400">Gerencie sua conta de administrador.</p>
      </div>

      {msg && (
        <p className="mb-6 rounded-lg bg-violet-500/10 p-4 text-sm text-violet-300">{msg}</p>
      )}

      <form
        onSubmit={salvarConta}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/20 p-2.5 text-yellow-400">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Dados da conta</h2>
        </div>

        {erroConta && (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{erroConta}</p>
        )}

        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={conta.name}
              onChange={(e) => setConta({ ...conta, name: e.target.value })}
            />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input
              type="email"
              value={conta.email}
              onChange={(e) => setConta({ ...conta, email: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" className="mt-6" disabled={savingConta}>
          {savingConta ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar dados
        </Button>
      </form>

      <form
        onSubmit={salvarSenha}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/20 p-2.5 text-yellow-400">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Alterar senha</h2>
        </div>

        {erroSenha && (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{erroSenha}</p>
        )}

        <div className="space-y-4">
          <div>
            <Label>Senha atual</Label>
            <PasswordInput
              value={senha.atual}
              onChange={(e) => setSenha({ ...senha, atual: e.target.value })}
            />
          </div>
          <div>
            <Label>Nova senha</Label>
            <PasswordInput
              value={senha.nova}
              onChange={(e) => setSenha({ ...senha, nova: e.target.value })}
            />
          </div>
          <div>
            <Label>Confirmar nova senha</Label>
            <PasswordInput
              value={senha.confirmar}
              onChange={(e) => setSenha({ ...senha, confirmar: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" className="mt-6" disabled={savingSenha}>
          {savingSenha ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Atualizar senha
        </Button>
      </form>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/20 p-2.5 text-yellow-400">
            <Bell className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold">Notificações</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "novaReserva" as const, label: "Avisar quando uma nova reserva for feita" },
            { key: "pagamentoConfirmado" as const, label: "Avisar quando um pagamento for confirmado" },
            { key: "lembreteDiario" as const, label: "Resumo diário dos atendimentos" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <span className="text-sm text-zinc-300">{item.label}</span>
              <input
                type="checkbox"
                checked={notif[item.key]}
                onChange={(e) => setNotif({ ...notif, [item.key]: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-600 bg-transparent"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
