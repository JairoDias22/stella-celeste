import Link from "next/link";
import Container from "../layout/Container";
import { Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Stella Celeste
            </h2>

            <p className="mt-4 text-zinc-400">
              Consultas espirituais com acolhimento, respeito e total sigilo.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Navegação
            </h3>

            <ul className="space-y-2 text-zinc-400">
              <li>Sobre</li>
              <li>Serviços</li>
              <li>FAQ</li>
              <li>Contato</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Contato
            </h3>

            <div className="space-y-3 text-zinc-400">

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>(99) 99999-9999</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>contato@stellaceleste.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Globe size={18} />
                <span>@stellaceleste</span>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
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