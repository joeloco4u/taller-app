"use client";

import { useState } from "react";
import { Cpu, ClipboardList, PackageSearch, LogOut } from "lucide-react";
import FormIngreso from "@/components/FormIngreso";
import ListaEquipos from "@/components/ListaEquipos";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "ingreso" | "lista";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("ingreso");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-6">
      <header className="mb-6 border-b border-[#2a2a2a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-[#333] bg-[#111]">
              <Cpu size={20} className="text-[#f5f5f5]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#f5f5f5]">
                Taller App
              </h1>
              <p className="text-xs text-[#737373]">
                Registro de recepción de equipos
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex h-8 w-8 items-center justify-center border border-[#333] bg-[#111] text-[#555] transition hover:text-[#f5f5f5]"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <nav className="mb-6 flex border-b border-[#2a2a2a]">
        <button
          onClick={() => setTab("ingreso")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-widest transition ${
            tab === "ingreso"
              ? "border-[#f5f5f5] text-[#f5f5f5]"
              : "border-transparent text-[#555] hover:text-[#737373]"
          }`}
        >
          <ClipboardList size={14} />
          Ingreso
        </button>
        <button
          onClick={() => setTab("lista")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-widest transition ${
            tab === "lista"
              ? "border-[#f5f5f5] text-[#f5f5f5]"
              : "border-transparent text-[#555] hover:text-[#737373]"
          }`}
        >
          <PackageSearch size={14} />
          Equipos
        </button>
      </nav>

      <main className="flex-1">
        {tab === "ingreso" ? <FormIngreso /> : <ListaEquipos />}
      </main>

      <footer className="mt-10 border-t border-[#2a2a2a] pt-4 text-center text-xs text-[#555]">
        &copy; {new Date().getFullYear()} Taller App &mdash; Todos los derechos
        reservados
      </footer>
    </div>
  );
}
