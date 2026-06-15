"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Package, Clock, Wrench, CheckCircle, Truck, ExternalLink } from "lucide-react";

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
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase
      .from("equipos")
      .select("*, clientes!inner(*)")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setEquipos(data as unknown as Equipo[]);
        setLoading(false);
      });
  }, [supabase]);

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
          <div key={i} className="animate-pulse border border-[#2a2a2a] bg-[#111] p-4">
            <div className="mb-2 h-3 w-3/4 rounded bg-[#2a2a2a]" />
            <div className="h-2 w-1/2 rounded bg-[#2a2a2a]" />
          </div>
        ))}
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div className="border border-[#2a2a2a] bg-[#111] p-8 text-center">
        <Package size={24} className="mx-auto mb-2 text-[#555]" />
        <p className="text-sm text-[#737373]">No hay equipos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {equipos.map((eq) => (
        <div
          key={eq.id}
          className="border border-[#2a2a2a] bg-[#111] p-4 transition hover:border-[#444]"
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
            <a
              href={`/recibo/${eq.id}`}
              target="_blank"
              className="mt-0.5 shrink-0 text-[#555] hover:text-[#f5f5f5]"
            >
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={eq.status}
              onChange={(e) => handleStatusChange(eq.id, e.target.value)}
              className="flex-1 border border-[#2a2a2a] bg-[#0a0a0a] px-2 py-1.5 text-xs text-[#f5f5f5] focus:border-[#555]"
            >
              {statusList.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
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
  );
}
