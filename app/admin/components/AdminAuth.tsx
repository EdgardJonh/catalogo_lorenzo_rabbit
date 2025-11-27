"use client";

import { useState } from "react";
import { FaLock } from "react-icons/fa";

interface AdminAuthProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function AdminAuth({ onLogin }: AdminAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500 rounded-full mb-4">
            <FaLock className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Acceso de Administración
          </h1>
          <p className="text-gray-300">
            Inicia sesión con tu cuenta de Supabase
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@lorenzorabbit.com"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Ingresa con las credenciales asignadas en Supabase Auth. 
          Si tienes problemas para acceder, contacta al administrador del sitio.
        </p>
      </div>
    </div>
  );
}

