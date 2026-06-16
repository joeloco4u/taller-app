"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  User, Hash, Phone, Mail, Monitor, Wrench, Package, ClipboardList, CheckCircle, Loader,
} from "lucide-react";

type FormData = {
  nombre: string;
  cedula: string;
  telefono: string;
  correo: string;
  tipo_equipo: string;
  marca: string;
  modelo: string;
  serial: string;
  falla_reportada: string;
  accesorios: string;
};

const emptyForm: FormData = {
  nombre: "", cedula: "", telefono: "", correo: "",
  tipo_equipo: "", marca: "", modelo: "", serial: "",
  falla_reportada: "", accesorios: "",
};

export default function FormIngreso() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  function update(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: existing } = await supabase
        .from("clientes")
        .select("id")
        .eq("cedula", form.cedula)
        .maybeSingle();

      let clienteId: string;

      if (existing) {
        clienteId = existing.id;
      } else {
        const { data: newCliente, error: cErr } = await supabase
          .from("clientes")
          .insert({
            nombre: form.nombre,
            cedula: form.cedula,
            telefono: form.telefono,
            correo: form.correo || null,
          })
          .select("id")
          .single();

        if (cErr) throw new Error("Error al registrar cliente: " + cErr.message);
        clienteId = newCliente!.id;
      }

      const { data: equipo, error: eErr } = await supabase
        .from("equipos")
        .insert({
          cliente_id: clienteId,
          tipo_equipo: form.tipo_equipo,
          marca: form.marca,
          modelo: form.modelo,
          serial: form.serial,
          falla_reportada: form.falla_reportada,
          accesorios: form.accesorios || null,
        })
        .select("id")
        .single();

      if (eErr) throw new Error("Error al registrar equipo: " + eErr.message);

      const equipoId = equipo!.id;
      setSuccess(equipoId);
      setForm(emptyForm);

      const telefono = form.telefono.replace(/[\s+\-()]/g, "");
      const numero = telefono.startsWith("0") ? "58" + telefono.slice(1) : telefono;
      const reciboUrl = `${window.location.origin}/recibo/${equipoId}`;
      const mensaje = encodeURIComponent(
        `✅ *Equipo registrado en Taller App*\n\n` +
        `Cliente: ${form.nombre}\n` +
        `Equipo: ${form.tipo_equipo} ${form.marca} ${form.modelo}\n` +
        `Serial: ${form.serial}\n` +
        `Falla: ${form.falla_reportada}\n\n` +
        `📄 *Recibo digital:* ${reciboUrl}\n\n` +
        `Gracias por confiar en nosotros.`
      );

      window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  function handleNew() {
    setSuccess(null);
  }

  if (success) {
    return (
      <div className="border border-[#00CFFF] bg-[#000000] p-8 text-center">
        <CheckCircle size={32} className="mx-auto mb-3 text-[#00CFFF]" />
        <p className="mb-1 text-sm font-medium text-[#f5f5f5]">
          Equipo registrado exitosamente
        </p>
        <p className="mb-4 text-[10px] text-[#555]">
          #{success.slice(0, 8).toUpperCase()}
        </p>
        <button
          onClick={handleNew}
          className="border border-[#00CFFF] bg-[#0A0A0F] px-6 py-2 text-xs font-medium uppercase tracking-widest text-[#00CFFF] transition hover:glow-cyan"
        >
          Nuevo ingreso
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList size={16} className="text-[#00CFFF]" />
        <h2 className="text-sm font-medium uppercase tracking-widest text-[#00CFFF]">
          Nuevo ingreso
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="mb-1 text-xs font-medium uppercase tracking-widest text-[#555]">
            Datos del cliente
          </legend>
          <div className="space-y-3">
            <InputRow
              icon={<User size={14} />} label="Nombre completo"
              placeholder="Ej: Juan Pérez" value={form.nombre}
              onChange={(v) => update("nombre", v)} required
            />
            <InputRow
              icon={<Hash size={14} />} label="Cédula / RIF"
              placeholder="Ej: V-12345678" value={form.cedula}
              onChange={(v) => update("cedula", v)} required
            />
            <InputRow
              icon={<Phone size={14} />} label="Teléfono" type="tel"
              placeholder="Ej: +584121234567" value={form.telefono}
              onChange={(v) => update("telefono", v)} required
            />
            <InputRow
              icon={<Mail size={14} />} label="Correo electrónico" type="email"
              placeholder="Ej: juan@correo.com" value={form.correo}
              onChange={(v) => update("correo", v)}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-1 text-xs font-medium uppercase tracking-widest text-[#555]">
            Datos del equipo
          </legend>
          <div className="space-y-3">
            <InputRow
              icon={<Monitor size={14} />} label="Tipo de equipo"
              placeholder="Ej: Laptop, PC, Impresora" value={form.tipo_equipo}
              onChange={(v) => update("tipo_equipo", v)} required
            />
            <InputRow
              icon={<Wrench size={14} />} label="Marca"
              placeholder="Ej: HP, Dell, Lenovo" value={form.marca}
              onChange={(v) => update("marca", v)} required
            />
            <InputRow
              icon={<Hash size={14} />} label="Modelo"
              placeholder="Ej: Pavilion 15" value={form.modelo}
              onChange={(v) => update("modelo", v)} required
            />
            <InputRow
              icon={<Hash size={14} />} label="N° de serie"
              placeholder="Ej: ABC123XYZ" value={form.serial}
              onChange={(v) => update("serial", v)} required
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-1 text-xs font-medium uppercase tracking-widest text-[#555]">
            Detalles del servicio
          </legend>
          <div className="space-y-3">
            <TextareaRow
              icon={<Wrench size={14} />} label="Falla reportada"
              placeholder="Describe el problema que presenta el equipo..."
              value={form.falla_reportada}
              onChange={(v) => update("falla_reportada", v)} required
            />
            <TextareaRow
              icon={<Package size={14} />} label="Accesorios incluidos"
              placeholder="Ej: Cargador, mouse, funda, cable HDMI..."
              value={form.accesorios}
              onChange={(v) => update("accesorios", v)}
            />
          </div>
        </fieldset>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-8 flex w-full items-center justify-center gap-2 border border-[#FFE14D] bg-[#FFE14D] py-3 text-sm font-bold uppercase tracking-widest text-[#000000] transition hover:glow-yellow active:brightness-90 disabled:opacity-50"
        >
          {saving && <Loader size={14} className="animate-spin" />}
          {saving ? "Registrando..." : "Registrar ingreso"}
        </button>
      </form>
    </>
  );
}

function InputRow({
  icon, label, type = "text", placeholder, value, onChange, required,
}: {
  icon: React.ReactNode; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <label className="group block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs text-[#FF2D9A]">
        {icon}{label}
      </span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#555] focus:border-[#00CFFF]"
      />
    </label>
  );
}

function TextareaRow({
  icon, label, placeholder, value, onChange, required,
}: {
  icon: React.ReactNode; label: string; placeholder: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <label className="group block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs text-[#FF2D9A]">
        {icon}{label}
      </span>
      <textarea
        rows={3} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full resize-none border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm text-[#f5f5f5] transition-colors placeholder:text-[#555] focus:border-[#00CFFF]"
      />
    </label>
  );
}
