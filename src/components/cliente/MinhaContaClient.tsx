"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Calendar, LogOut, Loader2, Plus, Camera, Star } from "lucide-react";
import { updateMeuPerfil } from "@/lib/actions/minha-conta";
import { clienteLogout } from "@/lib/actions/auth";
import { cancelarReserva } from "@/lib/actions/agendamento";
import { enviarAvaliacao } from "@/lib/actions/avaliacoes";
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
  avaliacao,
}: {
  cliente: { name: string; email: string; phone: string | null; bio: string | null; avatarUrl: string | null };
  reservas: Reserva[];
  avaliacao: { nota: number; comentario: string; status: string } | null;
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

  const [avaliacaoState, setAvaliacaoState] = useState(avaliacao);
  const [nota, setNota] = useState(avaliacao?.nota ?? 5);
  const [comentario, setComentario] = useState(avaliacao?.comentario ?? "");
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [erroAvaliacao, setErroAvaliacao] = useState<string | null>(null);

  async function handleEnviarAvaliacao(e: React.FormEvent) {
    e.preventDefault();
    setErroAvaliacao(null);
    setEnviandoAvaliacao(true);

    const result = await enviarAvaliacao(nota, comentario);

    setEnviandoAvaliacao(false);
    if (!result.success) {
      setErroAvaliacao(result.error ?? "Não foi possível enviar sua avaliação.");
      return;
    }
    setAvaliacaoState({ nota, comentario, status: "pendente" });
  }

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

        <div className="relative mb-10 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-600/15 via-pink-500/10 to-transparent p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-pink-400/30 bg-violet-500/20">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={form.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-semibold text-pink-200">
                    {form.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-title text-3xl font-bold text-white">{form.name || "Minha Conta"}</h1>
                <p className="mt-1 text-sm text-zinc-400">{form.bio || "Seus dados e histórico de atendimentos."}</p>
              </div>
            </div>

            <Button variant="outline" className="gap-2" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Sair
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-pink-400/10 bg-white/5 p-8 shadow-[0_0_40px_-18px_rgba(236,72,153,0.35)] backdrop-blur-xl lg:col-span-1"
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

          <div className="rounded-3xl border border-violet-400/10 bg-white/5 p-8 shadow-[0_0_40px_-18px_rgba(139,92,246,0.3)] backdrop-blur-xl lg:col-span-2">
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

          <div className="rounded-3xl border border-pink-400/10 bg-white/5 p-8 shadow-[0_0_40px_-18px_rgba(236,72,153,0.3)] backdrop-blur-xl lg:col-span-3">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/20 p-2.5 text-pink-300">
                <Star className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-white">Sua avaliação</h2>
            </div>

            <p className="mb-4 text-sm text-zinc-400">
              Avalie sua experiência com o site e com o atendimento da Stella Celeste.
            </p>

            {avaliacaoState && (
              <p
                className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  avaliacaoState.status === "aprovada"
                    ? "bg-green-500/10 text-green-400"
                    : avaliacaoState.status === "recusada"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {avaliacaoState.status === "aprovada"
                  ? "Publicada no site"
                  : avaliacaoState.status === "recusada"
                    ? "Não aprovada"
                    : "Aguardando aprovação"}
              </p>
            )}

            <form onSubmit={handleEnviarAvaliacao} className="space-y-4">
              {erroAvaliacao && (
                <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{erroAvaliacao}</p>
              )}

              <div>
                <Label className="text-zinc-300">Nota</Label>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNota(n)}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          n <= nota ? "fill-pink-300 text-pink-300" : "text-zinc-700 hover:text-zinc-500"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-zinc-300">Comentário</Label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="O que você achou do site e do atendimento? Conte sua experiência."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-pink-400/40"
                />
              </div>

              <Button type="submit" disabled={enviandoAvaliacao}>
                {enviandoAvaliacao ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {avaliacaoState ? "Atualizar avaliação" : "Enviar avaliação"}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
