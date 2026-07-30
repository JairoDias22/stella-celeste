import Container from "../layout/Container";
import { Mail, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section id="contato" className="py-28">
      <Container>

        <div className="text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            Contato
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Entre em contato
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Ficarei feliz em responder suas dúvidas e ajudar você a escolher o atendimento ideal.
          </p>

        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <Instagram className="text-violet-400" />
                <span>@stellaceleste</span>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-violet-400" />
                <span>(99) 99999-9999</span>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-violet-400" />
                <span>contato@stellaceleste.com</span>
              </div>

            </div>

          </div>

          <form className="space-y-5">

            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              placeholder="Nome"
            />

            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              placeholder="E-mail"
            />

            <textarea
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none"
              placeholder="Mensagem"
            />

            <Button className="w-full rounded-full">
              Enviar mensagem
            </Button>

          </form>

        </div>

      </Container>
    </section>
  );
}