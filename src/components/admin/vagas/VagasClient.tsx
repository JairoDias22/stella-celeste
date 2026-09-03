"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  createVaga,
  updateVaga,
  deleteVaga,
  toggleVagaDisponibilidade,
} from "@/lib/actions/vagas";
import type { Vaga } from "@/generated/prisma/client";

const WEEKDAYS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export default function VagasClient({ initialData }: { initialData: Vaga[] }) {
  const [vagas, setVagas] = useState<Vaga[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vaga | null>(null);
  const [form, setForm] = useState({ weekday: "Segunda", time: "", available: true });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setError(null);
    setForm({ weekday: "Segunda", time: "", available: true });
    setOpen(true);
  }

  function openEdit(vaga: Vaga) {
    setEditing(vaga);
    setError(null);
    setForm({ weekday: vaga.weekday, time: vaga.time, available: vaga.available });
    setOpen(true);
  }

  function handleSave() {
    if (!form.time.trim()) {
      setError("Informe o horário (ex: 14:00).");
      return;
    }

    const payload = {
      weekday: form.weekday,
      time: form.time.trim(),
      available: form.available,
    };

    startTransition(async () => {
      try {
        if (editing) {
          await updateVaga(editing.id, payload);
          setVagas((prev) =>
            prev.map((v) => (v.id === editing.id ? { ...v, ...payload } : v))
          );
        } else {
          await createVaga(payload);
          setVagas((prev) =>
            [...prev, { id: crypto.randomUUID(), ...payload } as Vaga].sort(
              (a, b) =>
                WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday) ||
                a.time.localeCompare(b.time)
            )
          );
        }
        setOpen(false);
      } catch {
        setError("Não foi possível salvar. Tente novamente.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este horário?")) return;

    startTransition(async () => {
      try {
        await deleteVaga(id);
        setVagas((prev) => prev.filter((v) => v.id !== id));
      } catch {
        alert("Não foi possível excluir este horário.");
      }
    });
  }

  function handleToggle(vaga: Vaga) {
    const novoStatus = !vaga.available;
    setVagas((prev) =>
      prev.map((v) => (v.id === vaga.id ? { ...v, available: novoStatus } : v))
    );
    startTransition(async () => {
      try {
        await toggleVagaDisponibilidade(vaga.id, novoStatus);
      } catch {
        setVagas((prev) =>
          prev.map((v) => (v.id === vaga.id ? { ...v, available: vaga.available } : v))
        );
        alert("Não foi possível atualizar a disponibilidade.");
      }
    });
  }

  const vagasPorDia = WEEKDAYS.map((dia) => ({
    dia,
    horarios: vagas.filter((v) => v.weekday === dia),
  }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Vagas</h1>
          <p className="mt-2 text-zinc-400">
            Gerencie os horários de atendimento da semana.
          </p>
        </div>

        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Horário
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vagasPorDia.map(({ dia, horarios }) => (
          <div
            key={dia}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">{dia}</h2>

            {horarios.length === 0 ? (
              <p className="text-sm text-zinc-500">Sem horários cadastrados.</p>
            ) : (
              <div className="space-y-3">
                {horarios.map((vaga) => (
                  <div
                    key={vaga.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{vaga.time}</span>
                      <button
                        onClick={() => handleToggle(vaga)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          vaga.available
                            ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                            : "bg-zinc-500/15 text-zinc-400 hover:bg-zinc-500/25"
                        }`}
                      >
                        {vaga.available ? "Disponível" : "Ocupado"}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon-sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => openEdit(vaga)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon-sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(vaga.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Horário" : "Novo Horário"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
            )}
            <div>
              <Label>Dia da semana</Label>
              <select
                value={form.weekday}
                onChange={(e) => setForm({ ...form, weekday: e.target.value })}
                className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {WEEKDAYS.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="available"
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-600 bg-transparent"
              />
              <Label htmlFor="available">Disponível para agendamento</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
