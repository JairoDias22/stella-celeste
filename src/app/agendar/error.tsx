"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErroAgendar({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro ao carregar página de agendamento:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20 text-center">
      <AlertTriangle className="h-10 w-10 text-pink-400" />
      <h1 className="font-title text-2xl font-bold text-white">
        Não foi possível carregar o agendamento
      </h1>
      <p className="max-w-sm text-sm text-zinc-400">
        O servidor demorou demais pra responder. Isso pode acontecer se o
        banco de dados estiver instável no momento — tenta de novo em alguns
        segundos.
      </p>
      <Button
        className="mt-2 bg-gradient-to-r from-violet-600 to-pink-500"
        onClick={() => reset()}
      >
        Tentar novamente
      </Button>
    </div>
  );
}
