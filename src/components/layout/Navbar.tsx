"use client";

import Link from "next/link";
import Container from "./Container";
import { buttonVariants } from "@/components/ui/button";
import { UserRound } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-wide text-white">
            Stella Celeste
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#inicio" className="text-sm text-zinc-300 hover:text-pink-300 transition">
              Início
            </a>

            <a href="#sobre" className="text-sm text-zinc-300 hover:text-pink-300 transition">
              Sobre
            </a>

            <a href="#servicos" className="text-sm text-zinc-300 hover:text-pink-300 transition">
              Serviços
            </a>

            <a href="#contato" className="text-sm text-zinc-300 hover:text-pink-300 transition">
              Contato
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
            >
              <UserRound className="h-4 w-4" />
              Entrar
            </Link>
            <Link href="/agendar" className={buttonVariants({ className: "transition-transform hover:scale-105" })}>
              Agendar Consulta
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
