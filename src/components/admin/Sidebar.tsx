import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  Wallet,
  Settings,
  ClipboardList,
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
  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 p-6">
      <h1 className="mb-10 text-2xl font-bold text-white">
        Stella Admin
      </h1>

      <nav className="space-y-3">
        {links.map((link) => {
  const Icon = link.icon;

  return (
    <Link
      key={link.href}
      href={link.href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-violet-600 hover:text-white"
    >
      <Icon className="h-5 w-5" />
      {link.name}
    </Link>
  );
})}
      </nav>
    </aside>
  );
}