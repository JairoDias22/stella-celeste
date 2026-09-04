import Container from "../layout/Container";
import { Phone, Globe, MessageCircle } from "lucide-react";
import AnimatedSection from "../layout/AnimatedSection";
import { linkWhatsApp } from "@/lib/config/contato";

export default function Contact() {
  return (
    <section id="contato" className="py-28">
      <Container>

        <AnimatedSection className="text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Contato
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Fale comigo agora
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            A forma mais rápida de tirar dúvidas ou agendar é direto pelo WhatsApp.
          </p>

        </AnimatedSection>

        <AnimatedSection className="mx-auto mt-16 max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-green-400/20 bg-gradient-to-br from-green-500/10 via-white/5 to-transparent p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>

            <h3 className="text-2xl font-semibold text-white">
              Conversar no WhatsApp
            </h3>

            <p className="mt-3 text-zinc-400">
              Clique no botão abaixo e sua conversa já abre com a mensagem pronta.
            </p>

            <a
              href={linkWhatsApp("Olá! Gostaria de saber mais sobre os atendimentos da Stella Celeste.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3 font-semibold text-black shadow-[0_0_30px_-5px_rgba(34,197,94,0.6)] transition-transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-zinc-400 sm:flex-row sm:justify-center sm:gap-8">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                <span>(99) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-green-400" />
                <span>@stellaceleste</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </Container>
    </section>
  );
}
