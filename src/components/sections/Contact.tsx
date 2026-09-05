import Container from "../layout/Container";
import { Phone, Globe, MessageCircle, Sparkles, Clock, ShieldCheck, Heart } from "lucide-react";
import AnimatedSection from "../layout/AnimatedSection";
import { linkWhatsApp } from "@/lib/config/contato";

const destaques = [
  { icon: Clock, texto: "Resposta rápida, direto no seu WhatsApp" },
  { icon: ShieldCheck, texto: "Conversa sigilosa, sem compromisso" },
  { icon: Heart, texto: "Atendimento acolhedor e humano" },
];

export default function Contact() {
  return (
    <section id="contato" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[160px]" />

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

        <div className="mx-auto mt-16 grid max-w-5xl items-center gap-10 lg:grid-cols-5">
          <AnimatedSection className="lg:col-span-2">
            <div className="space-y-6">
              {destaques.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-pink-500/20 text-pink-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-2.5 text-zinc-300">{item.texto}</p>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="lg:col-span-3">
            <div className="rounded-[28px] bg-gradient-to-br from-green-400/30 via-emerald-500/15 to-transparent p-[1.5px] shadow-[0_0_60px_-15px_rgba(34,197,94,0.35)]">
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0f0a17]/90 p-10 text-center backdrop-blur-xl">
                <Sparkles className="absolute right-6 top-6 h-5 w-5 text-pink-300/60 animate-pulse-glow" />

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <MessageCircle className="h-8 w-8 text-green-400" />
                </div>

                <h3 className="font-title text-2xl font-semibold text-white">
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
            </div>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
