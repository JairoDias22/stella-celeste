"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "./Container";
import { buttonVariants } from "@/components/ui/button";
import { UserRound, Sparkles, Search } from "lucide-react";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contato", label: "Contato" },
];

type ServicoBusca = { id: string; name: string; price: string };
type ClienteAtual = { name: string; avatarUrl: string | null } | null;

export default function Navbar({
  servicos = [],
  cliente = null,
}: {
  servicos?: ServicoBusca[];
  cliente?: ClienteAtual;
}) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [sugestoesAbertas, setSugestõesAbertas] = useState(false);
  const buscaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (buscaRef.current && !buscaRef.current.contains(e.target as Node)) {
        setSugestõesAbertas(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const sugestoes =
    busca.trim().length > 0
      ? servicos.filter((s) => s.name.toLowerCase().includes(busca.toLowerCase())).slice(0, 5)
      : [];

  function irParaServico(id: string) {
    setSugestõesAbertas(false);
    setBusca("");
    router.push(`/agendar?servico=${id}`);
  }

  function handleSubmitBusca(e: React.FormEvent) {
    e.preventDefault();
    if (sugestoes[0]) {
      irParaServico(sugestoes[0].id);
    }
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(236,72,153,0.25)]">
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600 bg-[length:200%_100%] animate-[pulse-glow_4s_ease-in-out_infinite]" />

      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 shadow-[0_0_20px_-2px_rgba(236,72,153,0.6)] transition-transform group-hover:scale-110">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="hidden font-title text-2xl font-bold tracking-wide bg-gradient-to-r from-white via-pink-200 to-violet-200 bg-clip-text text-transparent sm:inline">
              Stella Celeste
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-gradient-to-r from-pink-400 to-violet-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Busca */}
          <div ref={buscaRef} className="relative hidden max-w-xs flex-1 md:block">
            <form onSubmit={handleSubmitBusca}>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setSugestõesAbertas(true);
                }}
                onFocus={() => setSugestõesAbertas(true)}
                placeholder="Buscar serviço..."
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-pink-400/40"
              />
            </form>

            {sugestoesAbertas && busca.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-xl backdrop-blur-xl">
                {sugestoes.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-zinc-500">
                    Nenhum serviço encontrado.
                  </p>
                ) : (
                  sugestoes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => irParaServico(s.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-zinc-200 transition hover:bg-white/5"
                    >
                      <span>{s.name}</span>
                      <span className="text-pink-300">{s.price}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            {cliente ? (
              <Link
                href="/minha-conta"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 transition hover:border-pink-400/30"
              >
                {cliente.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cliente.avatarUrl}
                    alt={cliente.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/30 text-xs font-semibold text-pink-200">
                    {cliente.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden text-sm text-zinc-200 sm:inline">{cliente.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 text-sm text-zinc-300 transition hover:text-white md:flex"
              >
                <UserRound className="h-4 w-4" />
                Entrar
              </Link>
            )}

            <Link
              href="/agendar"
              className={buttonVariants({
                className:
                  "bg-gradient-to-r from-violet-600 to-pink-500 shadow-[0_0_25px_-5px_rgba(236,72,153,0.7)] transition-transform hover:scale-105 hover:shadow-[0_0_35px_-5px_rgba(236,72,153,0.9)]",
              })}
            >
              Agendar
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
