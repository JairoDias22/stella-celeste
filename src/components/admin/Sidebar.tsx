import Link from "next/link";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Serviços",
    href: "/admin/servicos",
  },
  {
    name: "Vagas",
    href: "/admin/vagas",
  },
  {
    name: "Clientes",
    href: "/admin/clientes",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 p-6">
      <h1 className="mb-10 text-2xl font-bold text-white">
        Stella Admin
      </h1>

      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-violet-600 hover:text-white"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}