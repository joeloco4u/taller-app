"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Search, ChevronDown, ChevronRight, Clock, Wrench, CheckCircle, Truck, Package, ExternalLink, Loader } from "lucide-react";
import Link from "next/link";

type Cliente = {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  correo: string | null;
  direccion: string | null;
  created_at: string;
};

type EquipoHist = {
  id: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  serial: string;
  status: string;
  created_at: string;
};

const statusIcons: Record<string, React.ReactNode> = {
  recibido: <Clock size={12} />,
  en_revision: <Wrench size={12} />,
  reparado: <CheckCircle size={12} />,
  entregado: <Truck size={12} />,
};

const statusColors: Record<string, string> = {
  recibido: "text-yellow-400",
  en_revision: "text-blue-400",
  reparado: "text-green-400",
  entregado: "text-[#00CFFF]",
};

export default function DirectorioClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [historial, setHistorial] = useState<Record<string, EquipoHist[]>>({});
  const [loadingHist, setLoadingHist] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase
      .from("clientes")
      .select("*")
      .order("nombre", { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (data) setClientes(data as Cliente[]);
        setLoading(false);
      });
  }, [supabase]);

  const filtered = clientes.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.nombre.toLowerCase().includes(q) || c.cedula.toLowerCase().includes(q);
  });

  async function toggleExpand(clienteId: string) {
    if (expandedId === clienteId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(clienteId);

    if (!historial[clienteId]) {
      setLoadingHist(clienteId);
      const { data } = await supabase
        .from("equipos")
        .select("id, tipo_equipo, marca, modelo, serial, status, created_at")
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false })
        .limit(50);

      setHistorial((prev) => ({ ...prev, [clienteId]: (data ?? []) as EquipoHist[] }));
      setLoadingHist(null);
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
      <div className="mb-4 flex items-center gap-2">
        <Users size={16} className="text-[#00CFFF]" />
        <h2 className="text-sm font-medium uppercase tracking-widest text-[#00CFFF]">
          Directorio de Clientes
        </h2>
      </div>

      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#1E90FF] bg-[#000000] py-2.5 pl-8 pr-3 text-sm text-[#f5f5f5] focus:border-[#00CFFF]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#1E90FF] bg-[#000000] p-8 text-center">
          <Users size={24} className="mx-auto mb-2 text-[#FF2D9A]" />
          <p className="text-sm text-[#737373]">
            {search ? "No hay clientes con ese criterio" : "No hay clientes registrados"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((cliente) => {
            const isOpen = expandedId === cliente.id;
            return (
              <div key={cliente.id} className="border border-[#1E90FF] bg-[#000000] transition hover:border-[#00CFFF]">
                <button
                  onClick={() => toggleExpand(cliente.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="shrink-0 text-[#00CFFF]">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#f5f5f5]">{cliente.nombre}</p>
                    <p className="truncate text-xs text-[#737373]">{cliente.cedula} · {cliente.telefono}</p>
                    {cliente.direccion && (
                      <p className="truncate text-[10px] text-[#555]">{cliente.direccion}</p>
                    )}
                  </div>
                  {cliente.correo && (
                    <span className="hidden text-[10px] text-[#555] sm:block">{cliente.correo}</span>
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-dashed border-[#1E90FF]">
                    {loadingHist === cliente.id ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader size={16} className="animate-spin text-[#00CFFF]" />
                      </div>
                    ) : historial[cliente.id]?.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#555]">
                        <Package size={16} className="mx-auto mb-1 text-[#555]" />
                        Sin equipos registrados
                      </div>
                    ) : (
                      <div className="divide-y divide-dashed divide-[#1E90FF]/50">
                        {historial[cliente.id]?.map((eq) => (
                          <div key={eq.id} className="flex items-center gap-3 px-4 py-2.5 pl-10">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-[#f5f5f5]">
                                {eq.tipo_equipo} — {eq.marca} {eq.modelo}
                              </p>
                              <p className="truncate text-[10px] text-[#555]">
                                {eq.serial}
                              </p>
                            </div>
                            <span className={`flex items-center gap-1 text-[10px] ${statusColors[eq.status] ?? "text-[#555]"}`}>
                              {statusIcons[eq.status]}
                              {eq.status === "en_revision" ? "Revisión" : eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                            </span>
                            <span className="text-[10px] text-[#555]">
                              {new Date(eq.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })}
                            </span>
                            <Link
                              href={`/editar/${eq.id}`}
                              className="flex h-6 w-6 shrink-0 items-center justify-center border border-[#1E90FF] text-[#00CFFF] transition hover:glow-cyan"
                            >
                              <ExternalLink size={10} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
