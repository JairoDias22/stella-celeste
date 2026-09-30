import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, CalendarCheck, Sparkles } from "lucide-react";
import Container from "@/components/layout/Container";
import Glow from "@/components/layout/Glow";
import SiteLogo from "@/components/layout/SiteLogo";
import { prisma } from "@/lib/prisma";

// Página pública do cliente que deixou um depoimento aprovado. O endereço usa
// o id da AVALIAÇÃO (não o do cliente) e só existe enquanto a avaliação estiver
// aprovada. Nunca expor e-mail, telefone ou reservas individuais aqui.
async function getPerfil(id: string) {
  const avaliacao = await prisma.avaliacao.findFirst({
    where: { id, status: "aprovada" },
    select: {
      nota: true,
      comentario: true,
      updatedAt: true,
      cliente: {
        select: { id: true, name: true, avatarUrl: true, bio: true, createdAt: true },
      },
    },
  });
  if (!avaliacao) return null;

  const consultas = await prisma.reserva.count({
    where: { clienteId: avaliacao.cliente.id, status: "pago" },
  });

  return { avaliacao, consultas };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const perfil = await getPerfil(id);
  return {
    title: perfil ? `Depoimento de ${perfil.avaliacao.cliente.name}` : "Perfil",
    // Dados de pessoas reais: não deixa buscadores indexarem essas páginas.
    robots: { index: false, follow: false },
  };
}

function formatarMesAno(data: Date) {
  return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export default async function PerfilPublicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfil = await getPerfil(id);
  if (!perfil) notFound();

  const { avaliacao, consultas } = perfil;
  const { cliente } = avaliacao;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <Container className="max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <SiteLogo />
          <Link
            href="/#depoimentos"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-pink-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos depoimentos
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-600/15 via-pink-500/10 to-transparent p-8">
          <Glow rgb="236,72,153" alpha={0.2} className="pointer-events-none absolute -right-10 -top-10 h-40 w-40" />
          <div className="relative flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-pink-400/30 bg-violet-500/20">
              {cliente.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cliente.avatarUrl} alt={cliente.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-pink-200">
                  {cliente.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-title text-3xl font-bold text-white">{cliente.name}</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Cliente desde {formatarMesAno(cliente.createdAt)}
              </p>
            </div>
          </div>

          {cliente.bio && (
            <p className="relative mt-6 whitespace-pre-line text-zinc-300 leading-7">{cliente.bio}</p>
          )}

          <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-white/5 px-4 py-2 text-sm text-pink-200">
            <CalendarCheck className="h-4 w-4" />
            {consultas === 0
              ? "Ainda sem consultas concluídas pelo site"
              : consultas === 1
                ? "1 consulta realizada pelo site"
                : `${consultas} consultas realizadas pelo site`}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5 text-pink-300" />
            Depoimento
          </h2>
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-5 w-5 ${idx < avaliacao.nota ? "fill-pink-300 text-pink-300" : "text-zinc-700"}`}
              />
            ))}
          </div>
          <p className="whitespace-pre-line text-zinc-300 leading-7">
            &ldquo;{avaliacao.comentario}&rdquo;
          </p>
          <p className="mt-6 text-xs text-zinc-500">
            Avaliação publicada em {formatarMesAno(avaliacao.updatedAt)}
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/agendar"
            className="inline-flex items-center rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Agendar minha consulta
          </Link>
        </div>
      </Container>
    </div>
  );
}
