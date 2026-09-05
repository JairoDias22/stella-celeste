"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  Wallet,
  Settings,
  ClipboardList,
  Star,
  Sparkles,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Serviços",
    href: "/admin/servicos",
    icon: Briefcase,
  },
  {
    name: "Vagas",
    href: "/admin/vagas",
    icon: Calendar,
  },
  {
    name: "Reservas",
    href: "/admin/reservas",
    icon: ClipboardList,
  },
  {
    name: "Avaliações",
    href: "/admin/avaliacoes",
    icon: Star,
  },
  {
    name: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    name: "Financeiro",
    href: "/admin/financeiro",
    icon: Wallet,
  },
  {
    name: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <Link href="/" className="group mb-10 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 shadow-[0_0_20px_-2px_rgba(236,72,153,0.6)] transition-transform group-hover:scale-110">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        <span className="font-title text-xl font-bold bg-gradient-to-r from-white via-pink-200 to-violet-200 bg-clip-text text-transparent">
          Stella Admin
        </span>
      </Link>

      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const ativo = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                ativo
                  ? "bg-gradient-to-r from-violet-600/90 to-pink-500/80 text-white shadow-[0_0_25px_-8px_rgba(236,72,153,0.6)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${ativo ? "text-white" : "text-zinc-500 group-hover:text-pink-300"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/10 to-pink-500/10 p-4 text-center">
        <p className="text-xs text-zinc-500">Stella Celeste ✦ Painel</p>
      </div>
    </aside>
  );
}
