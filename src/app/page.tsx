"use client";

import { useState } from "react";
import Image from "next/image";
import { ClipboardList, PackageSearch, LogOut } from "lucide-react";
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
      <header className="relative mb-6 pb-4">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-[#00CFFF] via-[#FF2D9A] to-[#00CFFF]" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="King PC Electronic"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
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
            className="flex h-8 w-8 items-center justify-center border border-[#1E90FF] bg-[#000000] text-[#555] transition hover:text-[#f5f5f5] hover:glow-cyan"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <nav className="mb-6 flex border-b border-[#1E90FF]">
        <button
          onClick={() => setTab("ingreso")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-widest transition ${
            tab === "ingreso"
              ? "border-[#00CFFF] text-[#00CFFF]"
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
              ? "border-[#00CFFF] text-[#00CFFF]"
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

      <footer className="mt-10 border-t border-[#1E90FF] pt-4 text-center text-xs text-[#555]">
        &copy; {new Date().getFullYear()} King PC Electronic &mdash; Todos los derechos
        reservados
      </footer>
    </div>
  );
}
