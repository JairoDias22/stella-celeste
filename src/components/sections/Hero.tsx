import Container from "../layout/Container";
import SectionTitle from "../ui/SectionTitle";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center">
      <Container>
        <SectionTitle
          badge="✦ Consultas Espirituais"
          title="Stella Celeste"
          subtitle="Descubra caminhos, respostas e direcionamentos através da leitura das cartas. Um atendimento acolhedor, sigiloso e personalizado."
        />

        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg">
            Agendar Consulta
          </Button>

          <Button variant="outline" size="lg">
            Conhecer Serviços
          </Button>
        </div>
      </Container>
    </section>
  );
}