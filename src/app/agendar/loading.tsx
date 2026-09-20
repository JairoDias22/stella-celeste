import { Loader2 } from "lucide-react";

export default function CarregandoAgendar() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
        <p className="text-sm">Carregando horários disponíveis...</p>
      </div>
    </div>
  );
}
