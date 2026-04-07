"use client";
import { useEffect, useState } from "react";
import { FaTimes, FaWhatsapp, FaMapMarkerAlt, FaMotorcycle, FaSyringe } from "react-icons/fa";
import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

/** Si quieres cambiar el comportamiento: borra esta clave de sessionStorage o renómbrala para forzar que vuelva a mostrarse. */
const STORAGE_KEY = "lr_bienvenida_vista";

interface BienvenidaModalProps {
  /** Si se pasa, el padre controla la apertura manualmente (botón "¿Cómo reservar?"). */
  open?: boolean;
  onClose?: () => void;
}

export default function BienvenidaModal({ open, onClose }: BienvenidaModalProps) {
  const [visible, setVisible] = useState(false);

  // Auto-apertura solo la primera vez en esta sesión del navegador (misma pestaña hasta cerrarla)
  useEffect(() => {
    if (open === undefined && typeof window !== "undefined" && !sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, [open]);

  // Sincronizar cuando el padre abre/cierra manualmente (botón "¿Cómo reservar?")
  useEffect(() => {
    if (open !== undefined) setVisible(open);
  }, [open]);

  const cerrar = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12 sm:px-6 sm:py-14 md:py-16 min-h-0"
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida y pasos de reserva"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={cerrar}
        aria-hidden="true"
      />

      {/* Panel: altura máxima centrada con aire arriba/abajo; el contenido hace scroll si hace falta */}
      <div className="relative w-full max-w-lg max-h-[min(calc(100dvh-6rem),44rem)] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-purple-500/40 shadow-2xl overflow-hidden my-auto">

        {/* Banda superior decorativa */}
        <div className="h-1.5 w-full flex-shrink-0 bg-gradient-to-r from-purple-500 via-orange-400 to-purple-500" />

        {/* Botón cerrar */}
        <button
          onClick={cerrar}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <FaTimes size={14} />
        </button>

        <div className="overflow-y-auto overscroll-y-contain px-6 sm:px-8 pt-8 pb-10 sm:pt-9 sm:pb-11 space-y-5">

          {/* Encabezado */}
          <div className="text-center space-y-1">
            <p className="text-2xl">🐰</p>
            <h2 className={`${luckiestGuy.className} text-2xl md:text-3xl text-white leading-tight`}>
              Bienvenido a{" "}
              <span className="text-purple-400">LorenZo Rabbit</span>
            </h2>
            <p className="text-gray-300 text-sm">
              Catálogo de Conejitos
            </p>
          </div>

          {/* Bajada */}
          <p className="text-gray-300 text-sm text-center">
            A continuación te explicamos cómo realizar tu reserva de forma fácil y segura 🎉
          </p>

          {/* Pasos */}
          <div className="space-y-3">

            {/* Paso 1 */}
            <div className="flex gap-3 items-start bg-purple-500/10 rounded-xl p-3 border border-purple-500/20">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-white text-sm font-semibold">Elige tu conejito</p>
                <p className="text-gray-400 text-xs mt-0.5">Explora el catálogo y selecciona el que más te guste.</p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex gap-3 items-start bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                  <FaWhatsapp className="text-green-400" /> Reserva por WhatsApp
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Haz clic en <span className="text-white font-medium">Reservar</span> y te llevaremos directo a nuestro WhatsApp para coordinar todo.
                </p>
              </div>
            </div>

            {/* Paso 3 — Pago */}
            <div className="flex gap-3 items-start bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-white text-sm font-semibold">Abona el 50 % para reservar</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Solicita nuestro número de cuenta por WhatsApp y transfiere la mitad del valor. El <span className="text-white font-medium">50 % restante</span> se paga el día de la entrega.
                </p>
              </div>
            </div>

          </div>

          {/* Entrega */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <p className="text-gray-200 text-xs font-semibold uppercase tracking-wide mb-1">📦 Opciones de entrega</p>

            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-purple-400 mt-0.5 flex-shrink-0" size={13} />
              <p className="text-gray-300 text-xs">
                <span className="text-white font-medium">Punto de entrega</span> — Ruta U40 km 4, ruta al mar (sin costo adicional).
              </p>
            </div>

            <div className="flex items-start gap-2">
              <FaMotorcycle className="text-orange-400 mt-0.5 flex-shrink-0" size={13} />
              <p className="text-gray-300 text-xs">
                <span className="text-white font-medium">Despacho a domicilio u otro lugar</span> — $10.000 pesos (coordinar por WhatsApp).
              </p>
            </div>
          </div>

          {/* Garantía */}
          <div className="flex items-center gap-2 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
            <FaSyringe className="text-emerald-400 flex-shrink-0" size={15} />
            <p className="text-gray-300 text-xs">
              Todos nuestros conejitos se entregan <span className="text-white font-medium">desparasitados y vitaminizados</span> ✅
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={cerrar}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
          >
            ¡Entendido, ver conejitos! 🐇
          </button>

        </div>
      </div>
    </div>
  );
}
