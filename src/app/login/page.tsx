"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Credenciales inválidas"
        : authError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/logo.jpg"
              alt="King PC Electronic"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-[#f5f5f5]">
            Taller App
          </h1>
          <p className="mt-1 text-xs text-[#737373]">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="group block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs text-[#737373]">
              Correo electrónico
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#1E90FF] bg-[#000000] px-3 py-2.5 text-sm text-[#f5f5f5] focus:border-[#00CFFF]"
            />
          </label>

          <label className="group block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs text-[#737373]">
              Contraseña
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[#1E90FF] bg-[#000000] px-3 py-2.5 pr-10 text-sm text-[#f5f5f5] focus:border-[#00CFFF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#f5f5f5]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#FFE14D] bg-[#FFE14D] py-2.5 text-sm font-bold uppercase tracking-widest text-[#000000] transition hover:glow-yellow active:brightness-90 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
