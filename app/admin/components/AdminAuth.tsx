"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, Mail, Lock, Rabbit, Sun, Moon } from "lucide-react";

interface AdminAuthProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function AdminAuth({ onLogin }: AdminAuthProps) {
  const { theme, setTheme } = useTheme();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">

      {/* ══════════════════════════════════════
          PANEL IZQUIERDO — Imagen / Ilustración
      ══════════════════════════════════════ */}
      <div
        className={`
          hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col
          transition-colors duration-500
          ${isDark
            ? "bg-[#030d07]"
            : "bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-400"
          }
        `}
      >
        {/* ── Capa de gradiente base ── */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-[#071209] to-black" />
        )}

        {/* ── Círculos decorativos (glow) ── */}
        <div
          className={`
            absolute top-16 left-1/2 -translate-x-1/2
            w-72 h-72 rounded-full blur-3xl
            ${isDark ? "bg-emerald-500/10" : "bg-white/20"}
          `}
        />
        <div
          className={`
            absolute bottom-24 right-8
            w-48 h-48 rounded-full blur-2xl
            ${isDark ? "bg-teal-400/8" : "bg-white/15"}
          `}
        />
        <div
          className={`
            absolute top-1/2 -left-12
            w-40 h-40 rounded-full blur-2xl
            ${isDark ? "bg-emerald-700/20" : "bg-emerald-300/30"}
          `}
        />

        {/* ── Patrón de puntos ── */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "#10b981" : "#ffffff"} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* ── Elemento central ── */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-8">

            {/* Anillos concéntricos */}
            <div className="relative flex items-center justify-center">
              {/* Anillo exterior */}
              <div
                className={`
                  absolute w-64 h-64 rounded-full border
                  ${isDark ? "border-emerald-500/10" : "border-white/20"}
                `}
              />
              {/* Anillo medio */}
              <div
                className={`
                  absolute w-48 h-48 rounded-full border
                  ${isDark ? "border-emerald-500/15" : "border-white/30"}
                `}
              />
              {/* Icono central */}
              <div
                className={`
                  relative w-28 h-28 rounded-3xl flex items-center justify-center
                  backdrop-blur-sm border shadow-2xl
                  ${isDark
                    ? "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10"
                    : "bg-white/25 border-white/40 shadow-white/20"
                  }
                `}
              >
                {/* Glow del icono */}
                <div
                  className={`
                    absolute inset-0 rounded-3xl blur-xl scale-150
                    ${isDark ? "bg-emerald-400/15" : "bg-white/30"}
                  `}
                />
                <Rabbit
                  className={`w-14 h-14 relative z-10 drop-shadow-lg ${isDark ? "text-emerald-400" : "text-white"}`}
                />
              </div>
            </div>

            {/* Texto ilustración */}
            <div className="text-center space-y-1.5">
              <h2
                className={`text-xl font-bold tracking-tight ${isDark ? "text-white/80" : "text-white"}`}
              >
                LorenZo Rabbit
              </h2>
              <p
                className={`text-sm ${isDark ? "text-white/30" : "text-white/70"}`}
              >
                Gestiona tu criadero desde un solo lugar
              </p>
            </div>

            {/* Stats decorativos */}
            <div className="flex gap-6">
              {[
                { label: "Conejos", value: "∞" },
                { label: "Cruzas",  value: "🐇" },
                { label: "Partos",  value: "♾️" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p
                    className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-white"}`}
                  >
                    {value}
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-white/30" : "text-white/60"}`}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Branding inferior ── */}
        <div className="relative z-10 p-8 border-t border-white/5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <Rabbit className="w-4 h-4 text-white" />
            </div>
            <span
              className={`font-bold text-sm ${isDark ? "text-white/70" : "text-white"}`}
            >
              LorenZo Rabbit
            </span>
          </div>
          <p
            className={`text-xs ${isDark ? "text-white/25" : "text-white/50"}`}
          >
            Panel de administración del criadero.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PANEL DERECHO — Formulario de login
      ══════════════════════════════════════ */}
      <div
        className={`
          flex-1 min-h-screen flex flex-col
          transition-colors duration-500
          ${isDark ? "bg-[#111111]" : "bg-white"}
        `}
      >
        {/* Toggle día/noche — esquina superior derecha */}
        <div className="flex justify-end p-5">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center transition-all
              ${isDark
                ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                : "bg-black/5 text-black/40 hover:bg-black/10 hover:text-black"
              }
            `}
          >
            {isDark
              ? <Sun  className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </button>
        </div>

        {/* Formulario — centrado verticalmente */}
        <div className="flex-1 flex items-center justify-center px-8 pb-12">
          <div className="w-full max-w-sm space-y-7">

            {/* Logo mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Rabbit className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                LorenZo Rabbit
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-1.5">
              <h1
                className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Welcome back
              </h1>
              <p className={`text-sm ${isDark ? "text-[#555]" : "text-gray-400"}`}>
                Ingresa tus credenciales de administrador
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Email */}
              <div className="relative">
                <Mail
                  className={`
                    absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none
                    ${isDark ? "text-[#444]" : "text-gray-400"}
                  `}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoFocus
                  required
                  className={`
                    w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-colors
                    ${isDark
                      ? "bg-[#1c1c1c] border border-[#2a2a2a] text-white placeholder-[#444] focus:border-[#3d3d3d]"
                      : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:bg-white"
                    }
                  `}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  className={`
                    absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none
                    ${isDark ? "text-[#444]" : "text-gray-400"}
                  `}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className={`
                    w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-colors
                    ${isDark
                      ? "bg-[#1c1c1c] border border-[#2a2a2a] text-white placeholder-[#444] focus:border-[#3d3d3d]"
                      : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:bg-white"
                    }
                  `}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs px-1">{error}</p>
              )}

              {/* Botón principal */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 rounded-xl bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Continue with Email"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className={`text-center text-xs ${isDark ? "text-[#333]" : "text-gray-300"}`}>
              ¿Problemas para ingresar?{" "}
              <span className="text-[#e74c3c]/70 cursor-default">
                Contacta al administrador
              </span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
