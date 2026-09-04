"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Calendar, LogOut, Loader2, Plus, Camera } from "lucide-react";
import { updateMeuPerfil } from "@/lib/actions/minha-conta";
import { clienteLogout } from "@/lib/actions/auth";
import { cancelarReserva } from "@/lib/actions/agendamento";
import { comprimirImagem } from "@/lib/utils/imagem";
import SiteLogo from "@/components/layout/SiteLogo";

type Reserva = {
  id: string;
  status: string;
  createdAt: Date;
  servico: { name: string };
  vaga: { weekday: string; time: string };
};

const statusStyle: Record<string, string> = {
  pago: "text-green-400 bg-green-500/10",
  pendente: "text-yellow-400 bg-yellow-500/10",
  cancelado: "text-red-400 bg-red-500/10",
};

export default function MinhaContaClient({
  cliente,
  reservas,
}: {
  cliente: { name: string; email: string; phone: string | null; bio: string | null; avatarUrl: string | null };
  reservas: Reserva[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reservasState, setReservasState] = useState(reservas);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: cliente.name,
    email: cliente.email,
    phone: cliente.phone ?? "",
    bio: cliente.bio ?? "",
  });
  const [avatarUrl, setAvatarUrl] = useState(cliente.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Escolha um arquivo de imagem.");
      return;
    }

    setUploadingAvatar(true);
    setError(null);
    try {
      const dataUrl = await comprimirImagem(file);
      setAvatarUrl(dataUrl);
      const result = await updateMeuPerfil({ ...form, avatarUrl: dataUrl });
      if (!result.success) {
        setError(result.error ?? "Não foi possível salvar a foto.");
      } else {
        setMsg("Foto de perfil atualizada.");
        router.refresh();
      }
    } catch {
      setError("Não foi possível processar essa imagem.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);

    const result = await updateMeuPerfil({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      bio: form.bio.trim() || undefined,
      avatarUrl: avatarUrl ?? undefined,
    });

    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Não foi possível salvar.");
      return;
    }
    setMsg("Dados atualizados com sucesso.");
    router.refresh();
  }

  async function handleLogout() {
    setLoggingOut(true);
    await clienteLogout();
    router.push("/");
    router.refresh();
  }

  function handleCancelar(id: string) {
    if (!confirm("Cancelar esse agendamento?")) return;
    startTransition(async () => {
      const result = await cancelarReserva(id);
      if (result.success) {
        setReservasState((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "cancelado" } : r))
        );
      }
    });
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Container>
        <div className="mb-6">
          <SiteLogo />
        </div>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-title text-4xl font-bold text-white">Minha Conta</h1>
            <p className="mt-2 text-zinc-400">Seus dados e histórico de atendimentos.</p>
          </div>

          <Button variant="outline" className="gap-2" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sair
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-1"
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-pink-400/30 bg-violet-500/20"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={form.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold text-pink-200">
                      {form.name.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploadingAvatar ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="mt-3 text-xs text-zinc-500">Clique na foto para alterar</p>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/20 p-2.5 text-pink-300">
                <UserRound className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-white">Meus dados</h2>
            </div>

            {msg && (
              <p className="mb-4 rounded-lg bg-violet-500/10 p-3 text-sm text-violet-300">
                {msg}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
            )}

            <div className="space-y-4">
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
                />
              </div>
              <div>
                <Label className="text-zinc-300">Sobre você</Label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Uma breve descrição sobre você (opcional)"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-pink-400/40"
                />
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar alterações
            </Button>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/20 p-2.5 text-pink-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Histórico de atendimentos</h2>
              </div>
              <Link
                href="/agendar"
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                Agendar
              </Link>
            </div>

            {reservasState.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Você ainda não tem atendimentos. Clique em &quot;Agendar&quot; para marcar o primeiro.
              </p>
            ) : (
              <div className="space-y-3">
                {reservasState.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-white">{item.servico.name}</p>
                      <p className="text-sm text-zinc-500">
                        {item.vaga.weekday} às {item.vaga.time} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle[item.status] ?? "text-zinc-400 bg-zinc-500/10"}`}
                      >
                        {item.status}
                      </span>
                      {item.status === "pendente" && (
                        <button
                          onClick={() => handleCancelar(item.id)}
                          disabled={isPending}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
