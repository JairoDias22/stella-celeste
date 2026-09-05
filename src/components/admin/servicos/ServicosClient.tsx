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
  createServico,
  updateServico,
  deleteServico,
} from "@/lib/actions/servicos";
import type { Servico } from "@/generated/prisma/client";

export default function ServicosClient({
  initialData,
}: {
  initialData: Servico[];
}) {
  const [services, setServices] = useState<Servico[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "", slots: "" });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setError(null);
    setForm({ name: "", description: "", price: "", duration: "", slots: "" });
    setOpen(true);
  }

  function openEdit(service: Servico) {
    setEditing(service);
    setError(null);
    setForm({
      name: service.name,
      description: service.description ?? "",
      price: service.price,
      duration: service.duration,
      slots: String(service.slots),
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) {
      setError("Informe o nome do serviço.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: form.price.trim(),
      duration: form.duration.trim(),
      slots: Number(form.slots) || 0,
    };

    startTransition(async () => {
      try {
        if (editing) {
          await updateServico(editing.id, payload);
          setServices((prev) =>
            prev.map((s) => (s.id === editing.id ? { ...s, ...payload, description: payload.description ?? null } : s))
          );
        } else {
          await createServico(payload);
          setServices((prev) => [
            { id: crypto.randomUUID(), createdAt: new Date(), ...payload, description: payload.description ?? null } as Servico,
            ...prev,
          ]);
        }
        setOpen(false);
      } catch {
        setError("Não foi possível salvar. Tente novamente.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este serviço?")) return;

    startTransition(async () => {
      try {
        await deleteServico(id);
        setServices((prev) => prev.filter((s) => s.id !== id));
      } catch {
        alert("Não foi possível excluir este serviço.");
      }
    });
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-title">Serviços</h1>
          <p className="mt-2 text-zinc-400">Gerencie todos os serviços disponíveis.</p>
        </div>

        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="p-5 text-left">Serviço</th>
              <th className="p-5 text-left">Preço</th>
              <th className="p-5 text-left">Duração</th>
              <th className="p-5 text-left">Vagas</th>
              <th className="p-5 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  Nenhum serviço cadastrado ainda.
                </td>
              </tr>
            )}
            {services.map((service) => (
              <tr key={service.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.03]">
                <td className="p-5">{service.name}</td>
                <td className="p-5">{service.price}</td>
                <td className="p-5">{service.duration}</td>
                <td className="p-5">{service.slots}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={() => openEdit(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
            )}
            <div>
              <Label>Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Leitura de Tarot"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Uma frase curta explicando o que a cliente vai receber neste serviço"
                rows={3}
                className="w-full rounded-2xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              />
            </div>
            <div>
              <Label>Preço</Label>
              <Input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Ex: R$ 90,00"
              />
            </div>
            <div>
              <Label>Duração</Label>
              <Input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="Ex: 40 min"
              />
            </div>
            <div>
              <Label>Vagas</Label>
              <Input
                type="number"
                value={form.slots}
                onChange={(e) => setForm({ ...form, slots: e.target.value })}
              />
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
