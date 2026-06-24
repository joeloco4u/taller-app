import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Clock, Wrench, Truck, DollarSign, FileText } from "lucide-react";
import PrintButton from "@/components/PrintButton";

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  recibido: {
    label: "Recibido",
    icon: <Clock size={14} />,
    color: "text-yellow-400",
  },
  en_revision: {
    label: "En revisión",
    icon: <Wrench size={14} />,
    color: "text-blue-400",
  },
  reparado: {
    label: "Reparado",
    icon: <CheckCircle size={14} />,
    color: "text-green-400",
  },
  entregado: {
    label: "Entregado",
    icon: <Truck size={14} />,
    color: "text-[#00CFFF]",
  },
};

export const dynamic = "force-dynamic";

export default async function ReciboPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: equipo } = await supabase
    .from("equipos")
    .select("*, clientes(*)")
    .eq("id", id)
    .single();

  if (!equipo) notFound();

  const isEntregado = equipo.status === "entregado";
  const status = statusConfig[equipo.status] ?? statusConfig.recibido;
  const createdAt = new Date(equipo.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const salidaDate = equipo.fecha_salida
    ? new Date(equipo.fecha_salida).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col px-4 py-8">
      <div
        className={`flex-1 border p-6 ${isEntregado ? "border-[#00CFFF]" : "border-[#1E90FF]"} bg-[#000000]`}
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      >
        <div className="mb-6 text-center">
          <Image
            src="/logo.jpg"
            alt="King PC Electronic"
            width={64}
            height={64}
            className="mx-auto mb-3 rounded-full object-cover print:block"
          />
          <h1 className="text-base font-semibold tracking-tight text-[#f5f5f5]">
            {isEntregado ? "Factura de Salida" : "Comprobante de Recepción"}
          </h1>
          <p className="mt-1 text-[10px] text-[#555]">
            #{equipo.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="mb-6 border-t border-dashed border-[#1E90FF]" />

        <section className="mb-5">
          <h2 className="mb-2 text-[10px] font-medium uppercase tracking-widest text-[#555]">
            Cliente
          </h2>
          <div className="space-y-1 text-sm text-[#f5f5f5]">
            <p>{equipo.clientes.nombre}</p>
            <p className="text-xs text-[#737373]">{equipo.clientes.cedula}</p>
            <p className="text-xs text-[#737373]">{equipo.clientes.telefono}</p>
            {equipo.clientes.correo && (
              <p className="text-xs text-[#737373]">{equipo.clientes.correo}</p>
            )}
            {equipo.clientes.direccion && (
              <p className="text-xs text-[#737373]">{equipo.clientes.direccion}</p>
            )}
          </div>
        </section>

        <div className="mb-5 border-t border-dashed border-[#1E90FF]" />

        <section className="mb-5">
          <h2 className="mb-2 text-[10px] font-medium uppercase tracking-widest text-[#555]">
            Equipo
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <span className="text-xs text-[#737373]">Tipo</span>
            <span className="text-right text-[#f5f5f5]">{equipo.tipo_equipo}</span>
            <span className="text-xs text-[#737373]">Marca</span>
            <span className="text-right text-[#f5f5f5]">{equipo.marca}</span>
            <span className="text-xs text-[#737373]">Modelo</span>
            <span className="text-right text-[#f5f5f5]">{equipo.modelo}</span>
            <span className="text-xs text-[#737373]">Serial</span>
            <span className="text-right text-[#f5f5f5]">{equipo.serial}</span>
          </div>
        </section>

        <div className="mb-5 border-t border-dashed border-[#1E90FF]" />

        <section className="mb-5">
          <h2 className="mb-2 text-[10px] font-medium uppercase tracking-widest text-[#555]">
            Servicio
          </h2>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[#737373]">Falla reportada</p>
              <p className="mt-0.5 text-sm text-[#f5f5f5]">{equipo.falla_reportada}</p>
            </div>
            {equipo.accesorios && (
              <div>
                <p className="text-xs text-[#737373]">Accesorios</p>
                <p className="mt-0.5 text-sm text-[#f5f5f5]">{equipo.accesorios}</p>
              </div>
            )}
          </div>
        </section>

        {isEntregado && equipo.notas_entrega && (
          <>
            <div className="mb-5 border-t border-dashed border-[#1E90FF]" />
            <section className="mb-5">
              <h2 className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-[#FF2D9A]">
                <FileText size={12} />
                Notas / Observaciones
              </h2>
              <p className="whitespace-pre-wrap text-sm text-[#f5f5f5]">{equipo.notas_entrega}</p>
            </section>
          </>
        )}

        {isEntregado && equipo.costo && (
          <section className="mb-5">
            <div className="flex items-center justify-between rounded border border-[#FFE14D] bg-[#0A0A0F] px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-[#FFE14D]">
                <DollarSign size={16} />
                Total
              </span>
              <span className="text-lg font-bold text-[#FFE14D]">${equipo.costo}</span>
            </div>
          </section>
        )}

        <div className="mb-5 border-t border-dashed border-[#1E90FF]" />

        <section className="flex items-center justify-between">
          <span className="text-xs text-[#737373]">Estado</span>
          <span className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </section>

        {isEntregado && salidaDate && (
          <section className="mt-3 flex items-center justify-between">
            <span className="text-xs text-[#737373]">Fecha de salida</span>
            <span className="text-xs text-[#00CFFF]">{salidaDate}</span>
          </section>
        )}

        <div className="mt-3 border-t border-dashed border-[#1E90FF]" />

        <p className="mt-4 text-center text-[10px] text-[#555]">
          {isEntregado ? `Entregado el ${salidaDate}` : `Fecha de ingreso: ${createdAt}`}
        </p>
      </div>

      <PrintButton />

      <p className="print:hidden mt-4 text-center text-[10px] text-[#555]">
        {isEntregado
          ? "Este documento certifica la entrega del equipo."
          : "Este comprobante es válido como constancia de recepción."}
      </p>
    </div>
  );
}
