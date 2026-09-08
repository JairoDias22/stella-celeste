"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const selecionado = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="flex h-9 w-full items-center justify-between rounded-3xl border border-white/10 bg-input/50 px-3 text-left text-sm text-white outline-none transition-colors focus-visible:border-pink-400/40"
      >
        <span>{selecionado?.label ?? "Selecione"}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900/95 py-1.5 shadow-xl backdrop-blur-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setAberto(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-zinc-200 transition hover:bg-white/5"
            >
              {opt.label}
              {opt.value === value && <Check className="h-4 w-4 text-pink-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
