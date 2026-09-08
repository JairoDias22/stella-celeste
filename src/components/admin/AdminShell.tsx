"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="flex min-h-screen text-white">
      <Sidebar open={sidebarAberta} onClose={() => setSidebarAberta(false)} />

      <main className="relative w-full flex-1 lg:w-auto">
        <div className="pointer-events-none absolute left-1/3 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[160px]" />
        <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[150px]" />

        <Header adminName={adminName} onOpenSidebar={() => setSidebarAberta(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
