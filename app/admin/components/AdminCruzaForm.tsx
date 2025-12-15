"use client";
import { useState, useEffect } from "react";
import { Cruza, Conejo } from "../../../lib/supabase";
import { FaSave, FaTimes } from "react-icons/fa";

interface AdminCruzaFormProps {
  cruza: Cruza | null;
  conejos: Conejo[];
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminCruzaForm({
  cruza,
  conejos,
  onSave,
  onCancel,
}: AdminCruzaFormProps) {
  // Filtrar conejos por categoría y sexo
  const machos = conejos.filter(
    (c) => c.sexo === "Macho" && (c.categoria === "reproductor" || c.categoria === "padre")
  );
  const hembras = conejos.filter(
    (c) => c.sexo === "Hembra" && (c.categoria === "reproductor" || c.categoria === "madre")
  );

  // Función para convertir fecha DD-MM-YYYY a YYYY-MM-DD (formato para input date)
  const convertDMYToYMD = (dmy: string): string => {
    if (!dmy) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dmy)) return dmy;
    const partes = dmy.split("-");
    if (partes.length === 3) {
      const [dd, mm, yyyy] = partes;
      return `${yyyy}-${mm}-${dd}`;
    }
    return dmy;
  };

  // Función para convertir fecha YYYY-MM-DD a DD-MM-YYYY
  const convertYMDToDMY = (ymd: string): string => {
    if (!ymd) return "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(ymd)) return ymd;
    const partes = ymd.split("-");
    if (partes.length === 3) {
      const [yyyy, mm, dd] = partes;
      return `${dd}-${mm}-${yyyy}`;
    }
    return ymd;
  };

  const [formData, setFormData] = useState({
    id: "",
    idPadre: "",
    idMadre: "",
    fechaCruza: "",
    fechaPartoEsperado: "",
    fechaPartoReal: "",
    estado: "programada" as "programada" | "en_proceso" | "completada" | "cancelada",
    notas: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cruza) {
      // Modo edición
      setFormData({
        id: cruza.id,
        idPadre: cruza.idPadre,
        idMadre: cruza.idMadre,
        fechaCruza: convertDMYToYMD(cruza.fechaCruza),
        fechaPartoEsperado: cruza.fechaPartoEsperado
          ? convertDMYToYMD(cruza.fechaPartoEsperado)
          : "",
        fechaPartoReal: cruza.fechaPartoReal
          ? convertDMYToYMD(cruza.fechaPartoReal)
          : "",
        estado: cruza.estado,
        notas: cruza.notas || "",
      });
    } else {
      // Modo creación: generar ID
      const generateId = () => {
        const num = Math.floor(Math.random() * 9000) + 1000;
        return `CRUZA${num}`;
      };
      setFormData({
        id: generateId(),
        idPadre: "",
        idMadre: "",
        fechaCruza: "",
        fechaPartoEsperado: "",
        fechaPartoReal: "",
        estado: "programada",
        notas: "",
      });
    }
  }, [cruza]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validaciones
      if (!formData.idPadre || !formData.idMadre) {
        throw new Error("Debes seleccionar padre y madre");
      }

      if (formData.idPadre === formData.idMadre) {
        throw new Error("El padre y la madre deben ser diferentes");
      }

      if (!formData.fechaCruza) {
        throw new Error("La fecha de cruza es requerida");
      }

      const cruzaData = {
        id: formData.id,
        idPadre: formData.idPadre,
        idMadre: formData.idMadre,
        fechaCruza: formData.fechaCruza,
        fechaPartoEsperado: formData.fechaPartoEsperado || null,
        fechaPartoReal: formData.fechaPartoReal || null,
        estado: formData.estado,
        notas: formData.notas || null,
      };

      const res = await fetch("/api/cruzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cruzaData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error al guardar la cruza");

      onSave();
    } catch (err: any) {
      setError(err.message || "Error al guardar la cruza");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {cruza ? "Editar Cruza" : "Nueva Cruza"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <FaTimes className="text-white text-xl" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ID (solo lectura en edición) */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled={!!cruza}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Padre */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Padre (Macho) <span className="text-red-400">*</span>
          </label>
          <select
            name="idPadre"
            value={formData.idPadre}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Selecciona un macho</option>
            {machos.map((macho) => (
              <option key={macho.id} value={macho.id}>
                {macho.id} - {macho.raza} ({macho.categoria})
              </option>
            ))}
          </select>
          {machos.length === 0 && (
            <p className="text-yellow-400 text-sm mt-1">
              No hay machos disponibles. Asegúrate de tener conejos con categoría "reproductor" o "padre".
            </p>
          )}
        </div>

        {/* Madre */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Madre (Hembra) <span className="text-red-400">*</span>
          </label>
          <select
            name="idMadre"
            value={formData.idMadre}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Selecciona una hembra</option>
            {hembras.map((hembra) => (
              <option key={hembra.id} value={hembra.id}>
                {hembra.id} - {hembra.raza} ({hembra.categoria})
              </option>
            ))}
          </select>
          {hembras.length === 0 && (
            <p className="text-yellow-400 text-sm mt-1">
              No hay hembras disponibles. Asegúrate de tener conejos con categoría "reproductor" o "madre".
            </p>
          )}
        </div>

        {/* Fecha Cruza */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha de Cruza <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="fechaCruza"
            value={formData.fechaCruza}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Fecha Parto Esperado */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha de Parto Esperado
          </label>
          <input
            type="date"
            name="fechaPartoEsperado"
            value={formData.fechaPartoEsperado}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Fecha Parto Real */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha de Parto Real
          </label>
          <input
            type="date"
            name="fechaPartoReal"
            value={formData.fechaPartoReal}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="programada">Programada</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Notas</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Observaciones adicionales sobre esta cruza..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {loading ? "Guardando..." : "Guardar Cruza"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

