import Container from "../layout/Container";
import { Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "../layout/AnimatedSection";

export default function Contact() {
  return (
    <section id="contato" className="py-28">
      <Container>

        <AnimatedSection className="text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Contato
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Entre em contato
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Ficarei feliz em responder suas dúvidas e ajudar você a escolher o atendimento ideal.
          </p>

        </AnimatedSection>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-2">

          <AnimatedSection className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <Globe className="text-pink-300" />
                <span>@stellaceleste</span>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-pink-300" />
                <span>(99) 99999-9999</span>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-pink-300" />
                <span>contato@stellaceleste.com</span>
              </div>

            </div>

          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <form className="space-y-5">

              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none transition-colors focus:border-pink-400/40"
                placeholder="Nome"
              />

              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none transition-colors focus:border-pink-400/40"
                placeholder="E-mail"
              />

              <textarea
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none transition-colors focus:border-pink-400/40"
                placeholder="Mensagem"
              />

              <Button className="w-full rounded-full transition-transform hover:scale-105">
                Enviar mensagem
              </Button>

            </form>
          </AnimatedSection>

        </div>

      </Container>
    </section>
  );
}
