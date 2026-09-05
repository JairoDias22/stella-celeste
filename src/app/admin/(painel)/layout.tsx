import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen text-white">
      <Sidebar />

      <main className="relative flex-1">
        <div className="pointer-events-none absolute left-1/3 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[160px]" />
        <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[150px]" />

        <Header adminName={session.name} />

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
