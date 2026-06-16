"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft, CheckCircle, Loader, ExternalLink, Hash, Monitor, Wrench, Package, Clock, DollarSign, FileText,
} from "lucide-react";
import Link from "next/link";

type EquipoConCliente = {
  id: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  serial: string;
  falla_reportada: string;
  accesorios: string | null;
  status: string;
  notas_entrega: string | null;
  costo: string | null;
  fecha_salida: string | null;
  created_at: string;
  clientes: { nombre: string; cedula: string; telefono: string; correo: string | null } | null;
};

export default function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const [equipo, setEquipo] = useState<EquipoConCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      const { data: eq, error: eqErr } = await supabase
        .from("equipos")
        .select("*, clientes(*)")
        .eq("id", id)
        .single();

      if (eqErr || !eq) {
        router.push("/");
        return;
      }

      setEquipo(eq as unknown as EquipoConCliente);
      setLoading(false);
    })();
  }, [params, supabase, router]);

  function update(field: string, value: string) {
    setEquipo((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!equipo) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: upErr } = await supabase
      .from("equipos")
      .update({
        tipo_equipo: equipo.tipo_equipo,
        marca: equipo.marca,
        modelo: equipo.modelo,
        serial: equipo.serial,
        falla_reportada: equipo.falla_reportada,
        accesorios: equipo.accesorios,
        status: equipo.status,
        notas_entrega: equipo.notas_entrega,
        costo: equipo.costo,
      })
      .eq("id", equipo.id);

    if (upErr) {
      setError(upErr.message);
    } else {
      setSuccess(true);
    }

    setSaving(false);
  }

  async function handleCerrarOrden() {
    if (!equipo) return;
    setSaving(true);
    setError(null);

    const { error: upErr } = await supabase
      .from("equipos")
      .update({
        status: "entregado",
        notas_entrega: equipo.notas_entrega,
        costo: equipo.costo,
        fecha_salida: new Date().toISOString(),
      })
      .eq("id", equipo.id);

    if (upErr) {
      setError(upErr.message);
    } else {
      setEquipo((prev) =>
        prev ? { ...prev, status: "entregado", fecha_salida: new Date().toISOString() } : prev,
      );
      setSuccess(true);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader size={24} className="animate-spin text-[#00CFFF]" />
      </div>
    );
  }

  if (!equipo) return null;

  const isEntregado = equipo.status === "entregado";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex h-8 w-8 items-center justify-center border border-[#1E90FF] bg-[#000000] text-[#00CFFF] transition hover:glow-cyan"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-[#f5f5f5]">
            Cierre de Orden
          </h1>
          <p className="text-[10px] text-[#555]">
            #{equipo.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-xs font-medium uppercase tracking-widest text-[#555]">
            Cliente
          </legend>
          {equipo.clientes && (
            <div className="space-y-1 rounded border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm">
              <p className="text-[#f5f5f5]">{equipo.clientes.nombre}</p>
              <p className="text-xs text-[#737373]">{equipo.clientes.cedula}</p>
              <p className="text-xs text-[#737373]">{equipo.clientes.telefono}</p>
              {equipo.clientes.correo && (
                <p className="text-xs text-[#737373]">{equipo.clientes.correo}</p>
              )}
            </div>
          )}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-xs font-medium uppercase tracking-widest text-[#555]">
            Equipo
          </legend>
          <div className="space-y-3">
            <InputRow icon={<Monitor size={14} />} label="Tipo de equipo" value={equipo.tipo_equipo} onChange={(v) => update("tipo_equipo", v)} />
            <InputRow icon={<Wrench size={14} />} label="Marca" value={equipo.marca} onChange={(v) => update("marca", v)} />
            <InputRow icon={<Hash size={14} />} label="Modelo" value={equipo.modelo} onChange={(v) => update("modelo", v)} />
            <InputRow icon={<Hash size={14} />} label="N° de serie" value={equipo.serial} onChange={(v) => update("serial", v)} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-xs font-medium uppercase tracking-widest text-[#555]">
            Servicio
          </legend>
          <div className="space-y-3">
            <TextareaRow icon={<Wrench size={14} />} label="Falla reportada" value={equipo.falla_reportada} onChange={(v) => update("falla_reportada", v)} />
            <TextareaRow icon={<Package size={14} />} label="Accesorios" value={equipo.accesorios ?? ""} onChange={(v) => update("accesorios", v)} />
          </div>
        </fieldset>

        {!isEntregado && (
          <fieldset className="space-y-4 rounded border border-[#FF2D9A] p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-widest text-[#FF2D9A]">
              Cierre de Orden
            </legend>
            <div className="space-y-3">
              <TextareaRow icon={<FileText size={14} />} label="Notas / Observaciones" value={equipo.notas_entrega ?? ""} onChange={(v) => update("notas_entrega", v)} />
              <InputRow icon={<DollarSign size={14} />} label="Costo de reparación ($)" value={equipo.costo ?? ""} onChange={(v) => update("costo", v)} />
            </div>
          </fieldset>
        )}

        <div>
          <label className="group block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs text-[#FF2D9A]">
              <Clock size={14} />
              Estado
            </span>
            <select
              value={equipo.status}
              onChange={(e) => update("status", e.target.value)}
              disabled={isEntregado}
              className="w-full border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm text-[#f5f5f5] focus:border-[#00CFFF] disabled:opacity-50"
            >
              <option value="recibido">Recibido</option>
              <option value="en_revision">En revisión</option>
              <option value="reparado">Reparado</option>
              <option value="entregado">Entregado</option>
            </select>
          </label>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && (
          <p className="text-xs text-[#22FF66]">Cambios guardados correctamente</p>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={saving || isEntregado}
            className="flex w-full items-center justify-center gap-2 border border-[#00CFFF] bg-[#000000] py-3 text-sm font-medium uppercase tracking-widest text-[#00CFFF] transition hover:glow-cyan disabled:opacity-50"
          >
            {saving && <Loader size={14} className="animate-spin" />}
            Guardar cambios
          </button>

          {!isEntregado && (
            <button
              type="button"
              onClick={handleCerrarOrden}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 border border-[#FFE14D] bg-[#FFE14D] py-4 text-sm font-bold uppercase tracking-widest text-[#000000] transition hover:glow-yellow active:brightness-90 disabled:opacity-50"
            >
              <CheckCircle size={18} />
              Generar Factura y Marcar Entregado
            </button>
          )}

          {isEntregado && (
            <Link
              href={`/recibo/${equipo.id}`}
              target="_blank"
              className="flex w-full items-center justify-center gap-2 border border-[#00CFFF] bg-[#000000] py-3 text-sm font-medium uppercase tracking-widest text-[#00CFFF] transition hover:glow-cyan"
            >
              <ExternalLink size={14} />
              Ver Factura de Salida
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

function InputRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  const fieldId = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="group block">
      <label htmlFor={fieldId} className="mb-1.5 flex items-center gap-1.5 text-xs text-[#FF2D9A]">{icon}{label}</label>
      <input id={fieldId} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#555] focus:border-[#00CFFF]" />
    </div>
  );
}

function TextareaRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  const fieldId = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="group block">
      <label htmlFor={fieldId} className="mb-1.5 flex items-center gap-1.5 text-xs text-[#FF2D9A]">{icon}{label}</label>
      <textarea id={fieldId} rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="w-full resize-none border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#555] focus:border-[#00CFFF]" />
    </div>
  );
}
