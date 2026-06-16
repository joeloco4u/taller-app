"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Package, Clock, Wrench, CheckCircle, Truck, ExternalLink, FileText, Search, Filter } from "lucide-react";
import Link from "next/link";

type Equipo = {
  id: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  serial: string;
  status: string;
  created_at: string;
  clientes: { nombre: string; cedula: string } | null;
};

const statusList = [
  { value: "recibido", label: "Recibido" },
  { value: "en_revision", label: "En revisión" },
  { value: "reparado", label: "Reparado" },
  { value: "entregado", label: "Entregado" },
];

const statusIcons: Record<string, React.ReactNode> = {
  recibido: <Clock size={12} />,
  en_revision: <Wrench size={12} />,
  reparado: <CheckCircle size={12} />,
  entregado: <Truck size={12} />,
};

export default function ListaEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase
      .from("equipos")
      .select("*, clientes!inner(*)")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) setEquipos(data as unknown as Equipo[]);
        setLoading(false);
      });
  }, [supabase]);

  const filtered = equipos.filter((eq) => {
    if (statusFilter && eq.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const c = eq.clientes;
    return (
      eq.serial.toLowerCase().includes(q) ||
      eq.marca.toLowerCase().includes(q) ||
      eq.modelo.toLowerCase().includes(q) ||
      eq.tipo_equipo.toLowerCase().includes(q) ||
      c?.nombre.toLowerCase().includes(q) ||
      c?.cedula.toLowerCase().includes(q)
    );
  });

  async function handleStatusChange(equipoId: string, newStatus: string) {
    const { error } = await supabase
      .from("equipos")
      .update({ status: newStatus })
      .eq("id", equipoId);

    if (!error) {
      setEquipos((prev) =>
        prev.map((eq) =>
          eq.id === equipoId ? { ...eq, status: newStatus } : eq,
        ),
      );
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse border border-[#1E90FF] bg-[#000000] p-4">
            <div className="mb-2 h-3 w-3/4 rounded bg-[#1E90FF]" />
            <div className="h-2 w-1/2 rounded bg-[#1E90FF]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por serial, marca, cliente..."
            className="w-full border border-[#1E90FF] bg-[#000000] py-2 pl-8 pr-3 text-sm text-[#f5f5f5] placeholder:text-[#555] focus:border-[#00CFFF]"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#1E90FF] bg-[#000000] py-2 pl-8 pr-8 text-sm text-[#f5f5f5] focus:border-[#00CFFF]"
          >
            <option value="">Todos</option>
            {statusList.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#1E90FF] bg-[#000000] p-8 text-center">
          <Package size={24} className="mx-auto mb-2 text-[#FF2D9A]" />
          <p className="text-sm text-[#737373]">
            {search || statusFilter ? "No hay resultados con esos filtros" : "No hay equipos registrados"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((eq) => (
            <div
              key={eq.id}
              className="border border-[#1E90FF] bg-[#000000] p-4 transition hover:border-[#00CFFF] hover:glow-cyan"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#f5f5f5]">
                    {eq.tipo_equipo} — {eq.marca} {eq.modelo}
                  </p>
                  <p className="truncate text-xs text-[#737373]">
                    {eq.clientes?.nombre ?? "—"} · {eq.serial}
                  </p>
                </div>
                <div className="mt-0.5 flex shrink-0 gap-1">
                  <Link
                    href={`/editar/${eq.id}`}
                    className="flex h-7 w-7 items-center justify-center border border-[#1E90FF] text-[#00CFFF] transition hover:glow-cyan"
                  >
                    <FileText size={12} />
                  </Link>
                  <a
                    href={`/recibo/${eq.id}`}
                    target="_blank"
                    className="flex h-7 w-7 items-center justify-center border border-[#1E90FF] text-[#555] transition hover:text-[#f5f5f5]"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={eq.status}
                  onChange={(e) => handleStatusChange(eq.id, e.target.value)}
                  className="flex-1 border border-[#1E90FF] bg-[#000000] px-2 py-1.5 text-xs text-[#f5f5f5] focus:border-[#00CFFF]"
                >
                  {statusList.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <span className="flex items-center gap-1 text-[10px] text-[#555]">
                  {statusIcons[eq.status]}
                  {new Date(eq.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
