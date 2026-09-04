import Link from "next/link";
import Container from "../layout/Container";
import { Globe, Mail, Phone, Sparkles, AtSign, MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/lib/config/contato";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-20 pb-10">
      {/* Glow decorativo */}
      <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

      <Container>
        {/* CTA de destaque */}
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-pink-400/20 bg-gradient-to-br from-violet-600/20 via-pink-500/10 to-transparent p-10 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-pink-300 animate-pulse-glow" />
          <h3 className="font-title text-3xl font-bold text-white md:text-4xl">
            Pronta para descobrir seu caminho?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Agende sua consulta com a Stella Celeste e receba orientação, acolhimento e clareza.
          </p>
          <Link
            href="/agendar"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-8 py-3 font-semibold text-white shadow-[0_0_30px_-5px_rgba(236,72,153,0.7)] transition-transform hover:scale-105"
          >
            Agendar Consulta
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <h2 className="font-title text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Stella Celeste
              </h2>
            </div>

            <p className="mt-4 text-zinc-400">
              Consultas espirituais com acolhimento, respeito e total sigilo.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-pink-300 transition-all hover:scale-110 hover:border-pink-400/40 hover:bg-pink-500/10"
              >
                <AtSign className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-violet-300 transition-all hover:scale-110 hover:border-violet-400/40 hover:bg-violet-500/10"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold uppercase tracking-wide text-pink-300">
              Navegação
            </h3>

            <ul className="space-y-3 text-zinc-400">
              <li><a href="#sobre" className="transition hover:text-white">Sobre</a></li>
              <li><a href="#servicos" className="transition hover:text-white">Serviços</a></li>
              <li><a href="#faq" className="transition hover:text-white">FAQ</a></li>
              <li><a href="#contato" className="transition hover:text-white">Contato</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold uppercase tracking-wide text-pink-300">
              Contato
            </h3>

            <div className="space-y-3 text-zinc-400">
              <a
                href={linkWhatsApp("Olá! Gostaria de saber mais sobre os atendimentos da Stella Celeste.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-green-400"
              >
                <Phone size={18} className="text-violet-400" />
                <span>Chamar no WhatsApp</span>
              </a>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-violet-400" />
                <span>contato@stellaceleste.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Globe size={18} className="text-violet-400" />
                <span>@stellaceleste</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
          <p>© 2026 Stella Celeste. Todos os direitos reservados.</p>
          <Link
            href="/admin/login"
            className="mt-2 inline-block text-xs text-zinc-700 transition hover:text-zinc-500"
          >
            Acesso administrativo
          </Link>
        </div>
      </Container>
    </footer>
  );
}
