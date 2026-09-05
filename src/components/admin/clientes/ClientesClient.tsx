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
  createCliente,
  updateCliente,
  deleteCliente,
} from "@/lib/actions/clientes";
import type { Reserva } from "@/generated/prisma/client";

type ClienteComReservas = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  reservas: Pick<Reserva, "id" | "status">[];
};

export default function ClientesClient({
  initialData,
}: {
  initialData: ClienteComReservas[];
}) {
  const [clientes, setClientes] = useState<ClienteComReservas[]>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClienteComReservas | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  function openNew() {
    setEditing(null);
    setError(null);
    setForm({ name: "", email: "", phone: "" });
    setOpen(true);
  }

  function openEdit(cliente: ClienteComReservas) {
    setEditing(cliente);
    setError(null);
    setForm({ name: cliente.name, email: cliente.email, phone: cliente.phone ?? "" });
    setOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nome e e-mail são obrigatórios.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
    };

    startTransition(async () => {
      try {
        if (editing) {
          await updateCliente(editing.id, payload);
          setClientes((prev) =>
            prev.map((c) =>
              c.id === editing.id ? { ...c, ...payload, phone: payload.phone ?? null } : c
            )
          );
        } else {
          await createCliente(payload);
          setClientes((prev) => [
            {
              id: crypto.randomUUID(),
              createdAt: new Date(),
              phone: payload.phone ?? null,
              name: payload.name,
              email: payload.email,
              reservas: [],
            } as ClienteComReservas,
            ...prev,
          ]);
        }
        setOpen(false);
      } catch (e) {
        const message = e instanceof Error ? e.message : "";
        setError(
          message.includes("Unique")
            ? "Já existe um cliente com esse e-mail."
            : "Não foi possível salvar. Tente novamente."
        );
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este cliente?")) return;

    startTransition(async () => {
      try {
        await deleteCliente(id);
        setClientes((prev) => prev.filter((c) => c.id !== id));
      } catch {
        alert("Não foi possível excluir este cliente.");
      }
    });
  }

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.name.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-title">Clientes</h1>
          <p className="mt-2 text-zinc-400">Gerencie os clientes cadastrados.</p>
        </div>

        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="p-5 text-left">Nome</th>
              <th className="p-5 text-left">E-mail</th>
              <th className="p-5 text-left">Telefone</th>
              <th className="p-5 text-left">Atendimentos</th>
              <th className="p-5 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.03]">
                <td className="p-5">{cliente.name}</td>
                <td className="p-5 text-zinc-400">{cliente.email}</td>
                <td className="p-5 text-zinc-400">{cliente.phone || "—"}</td>
                <td className="p-5">{cliente.reservas.length}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={() => openEdit(cliente)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDelete(cliente.id)}
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
            <DialogTitle>{editing ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
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
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(85) 99999-9999"
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
