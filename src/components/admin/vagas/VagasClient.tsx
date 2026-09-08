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
  createDisponibilidade,
  updateDisponibilidade,
  deleteDisponibilidade,
  toggleDisponibilidadeAtiva,
} from "@/lib/actions/vagas";
import type { DisponibilidadeSemanal } from "@/generated/prisma/client";
import CustomSelect from "@/components/ui/CustomSelect";

const WEEKDAYS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export default function VagasClient({ initialData }: { initialData: DisponibilidadeSemanal[] }) {
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeSemanal[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DisponibilidadeSemanal | null>(null);
  const [form, setForm] = useState({ weekday: "Segunda", time: "" });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setError(null);
    setForm({ weekday: "Segunda", time: "" });
    setOpen(true);
  }

  function openEdit(disp: DisponibilidadeSemanal) {
    setEditing(disp);
    setError(null);
    setForm({ weekday: disp.weekday, time: disp.time });
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
    };

    startTransition(async () => {
      try {
        if (editing) {
          await updateDisponibilidade(editing.id, payload);
          setDisponibilidades((prev) =>
            prev.map((d) => (d.id === editing.id ? { ...d, ...payload } : d))
          );
        } else {
          await createDisponibilidade(payload);
          setDisponibilidades((prev) =>
            [...prev, { id: crypto.randomUUID(), ...payload, ativo: true, createdAt: new Date() } as DisponibilidadeSemanal].sort(
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
    if (!confirm("Excluir este horário semanal?")) return;

    startTransition(async () => {
      const result = await deleteDisponibilidade(id);
      if (!result.success) {
        alert(result.error);
        return;
      }
      setDisponibilidades((prev) => prev.filter((d) => d.id !== id));
    });
  }

  function handleToggle(disp: DisponibilidadeSemanal) {
    const novoStatus = !disp.ativo;
    setDisponibilidades((prev) =>
      prev.map((d) => (d.id === disp.id ? { ...d, ativo: novoStatus } : d))
    );
    startTransition(async () => {
      try {
        await toggleDisponibilidadeAtiva(disp.id, novoStatus);
      } catch {
        setDisponibilidades((prev) =>
          prev.map((d) => (d.id === disp.id ? { ...d, ativo: disp.ativo } : d))
        );
        alert("Não foi possível atualizar.");
      }
    });
  }

  const porDia = WEEKDAYS.map((dia) => ({
    dia,
    horarios: disponibilidades.filter((d) => d.weekday === dia),
  }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-title">Vagas</h1>
          <p className="mt-2 text-zinc-400">
            Configure sua disponibilidade semanal recorrente — o site gera automaticamente
            os horários das próximas semanas a partir daqui.
          </p>
        </div>

        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Horário
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {porDia.map(({ dia, horarios }) => (
          <div
            key={dia}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">{dia}</h2>

            {horarios.length === 0 ? (
              <p className="text-sm text-zinc-500">Sem horários cadastrados.</p>
            ) : (
              <div className="space-y-3">
                {horarios.map((disp) => (
                  <div
                    key={disp.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{disp.time}</span>
                      <button
                        onClick={() => handleToggle(disp)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          disp.ativo
                            ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                            : "bg-zinc-500/15 text-zinc-400 hover:bg-zinc-500/25"
                        }`}
                      >
                        {disp.ativo ? "Ativo" : "Pausado"}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon-sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => openEdit(disp)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon-sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(disp.id)}
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
              <CustomSelect
                value={form.weekday}
                onChange={(weekday) => setForm({ ...form, weekday })}
                options={WEEKDAYS.map((dia) => ({ value: dia, label: dia }))}
              />
            </div>
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <p className="text-xs text-zinc-500">
              Isso gera automaticamente os horários das próximas 8 semanas, toda vez que
              alguém acessar a tela de agendamento.
            </p>
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
