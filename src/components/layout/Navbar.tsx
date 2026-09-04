"use client";

import Link from "next/link";
import Container from "./Container";
import { buttonVariants } from "@/components/ui/button";
import { UserRound, Sparkles } from "lucide-react";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(236,72,153,0.25)]">
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600 bg-[length:200%_100%] animate-[pulse-glow_4s_ease-in-out_infinite]" />

      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 shadow-[0_0_20px_-2px_rgba(236,72,153,0.6)] transition-transform group-hover:scale-110">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-title text-2xl font-bold tracking-wide bg-gradient-to-r from-white via-pink-200 to-violet-200 bg-clip-text text-transparent">
              Stella Celeste
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden items-center gap-10 md:flex">
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

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
            >
              <UserRound className="h-4 w-4" />
              Entrar
            </Link>
            <Link
              href="/agendar"
              className={buttonVariants({
                className:
                  "bg-gradient-to-r from-violet-600 to-pink-500 shadow-[0_0_25px_-5px_rgba(236,72,153,0.7)] transition-transform hover:scale-105 hover:shadow-[0_0_35px_-5px_rgba(236,72,153,0.9)]",
              })}
            >
              Agendar Consulta
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
