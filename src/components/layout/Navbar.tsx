"use client";

import Link from "next/link";
import Container from "./Container";
import { Button } from "@/components/ui/button";

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
            <a href="#inicio" className="text-sm text-zinc-300 hover:text-white transition">
              Início
            </a>

            <a href="#sobre" className="text-sm text-zinc-300 hover:text-white transition">
              Sobre
            </a>

            <a href="#servicos" className="text-sm text-zinc-300 hover:text-white transition">
              Serviços
            </a>

            <a href="#contato" className="text-sm text-zinc-300 hover:text-white transition">
              Contato
            </a>
          </nav>

          <Button className="hidden md:flex">
            Agendar Consulta
          </Button>
        </div>
      </Container>
    </header>
  );
}