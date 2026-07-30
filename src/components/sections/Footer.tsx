import Container from "../layout/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h2 className="text-xl font-bold text-white">
            Stella Celeste
          </h2>

          <p className="text-sm text-zinc-500">
            © 2026 Stella Celeste. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}