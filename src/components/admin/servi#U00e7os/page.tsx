"use client";

import { useState } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Servico {
  id: number;
  name: string;
  price: string;
  duration: string;
  slots: number;
}

const initialServices: Servico[] = [
  { id: 1, name: "Consulta Espiritual", price: "R$ 120,00", duration: "60 min", slots: 10 },
  { id: 2, name: "Leitura de Cartas", price: "R$ 90,00", duration: "40 min", slots: 15 },
  { id: 3, name: "Amarração", price: "Sob consulta", duration: "Variável", slots: 5 },
];

export default function Servicos() {
  const [services, setServices] = useState<Servico[]>(initialServices);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "", slots: "" });

  function openNew() {
    setEditing(null);
    setForm({ name: "", price: "", duration: "", slots: "" });
    setOpen(true);
  }

  function openEdit(service: Servico) {
    setEditing(service);
    setForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
      slots: String(service.slots),
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (editing) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? { ...s, name: form.name, price: form.price, duration: form.duration, slots: Number(form.slots) || 0 }
            : s
        )
      );
    } else {
      const newService: Servico = {
        id: Date.now(),
        name: form.name,
        price: form.price,
        duration: form.duration,
        slots: Number(form.slots) || 0,
      };
      setServices((prev) => [...prev, newService]);
    }

    setOpen(false);
  }

  function handleDelete(id: number) {
    if (confirm("Excluir este serviço?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Serviços</h1>
          <p className="mt-2 text-zinc-400">Gerencie todos os serviços disponíveis.</p>
        </div>

        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
            {services.map((service) => (
              <tr key={service.id} className="border-b border-white/10">
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
            <div>
              <Label>Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Preço</Label>
              <Input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Duração</Label>
              <Input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}