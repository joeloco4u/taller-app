"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden mt-4 w-full border border-[#00CFFF] bg-[#000000] py-3 text-sm font-medium uppercase tracking-widest text-[#00CFFF] transition hover:glow-cyan"
    >
      🖨️ Descargar PDF / Imprimir
    </button>
  );
}
