"use client";
import { useState, useEffect } from "react";
import { Gestacion, Cruza } from "../../../lib/supabase";
import { FaSave, FaTimes } from "react-icons/fa";

interface AdminGestacionFormProps {
  gestacion: Gestacion | null;
  cruzas: Cruza[];
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminGestacionForm({
  gestacion,
  cruzas,
  onSave,
  onCancel,
}: AdminGestacionFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    idCruza: "",
    fechaColocarNidal: "",
    fechaEstimadaParto: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convertir DD-MM-YYYY -> YYYY-MM-DD para input date
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

  useEffect(() => {
    if (gestacion) {
      setFormData({
        id: gestacion.id,
        idCruza: gestacion.idCruza,
        fechaColocarNidal: gestacion.fechaColocarNidal
          ? convertDMYToYMD(gestacion.fechaColocarNidal)
          : "",
        fechaEstimadaParto: gestacion.fechaEstimadaParto
          ? convertDMYToYMD(gestacion.fechaEstimadaParto)
          : "",
        observaciones: gestacion.observaciones || "",
      });
    } else {
      const generateId = () => {
        const num = Math.floor(Math.random() * 9000) + 1000;
        return `GEST${num}`;
      };
      setFormData({
        id: generateId(),
        idCruza: "",
        fechaColocarNidal: "",
        fechaEstimadaParto: "",
        observaciones: "",
      });
    }
  }, [gestacion]);

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
      if (!formData.idCruza) {
        throw new Error("Debes seleccionar una cruza");
      }

      const payload = {
        id: formData.id,
        idCruza: formData.idCruza,
        fechaColocarNidal: formData.fechaColocarNidal || null,
        fechaEstimadaParto: formData.fechaEstimadaParto || null,
        observaciones: formData.observaciones || null,
      };

      const res = await fetch("/api/gestaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error al guardar la gestación");

      onSave();
    } catch (err: any) {
      setError(err.message || "Error al guardar la gestación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {gestacion ? "Editar Gestación" : "Nueva Gestación"}
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
        {/* ID */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled={!!gestacion}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Cruza */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Cruza <span className="text-red-400">*</span>
          </label>
          <select
            name="idCruza"
            value={formData.idCruza}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Selecciona una cruza</option>
            {cruzas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.fechaCruza}
              </option>
            ))}
          </select>
          {cruzas.length === 0 && (
            <p className="text-yellow-400 text-sm mt-1">
              No hay cruzas registradas. Crea una cruza antes de registrar gestaciones.
            </p>
          )}
        </div>

        {/* Fecha colocar nidal */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha para colocar nidal
          </label>
          <input
            type="date"
            name="fechaColocarNidal"
            value={formData.fechaColocarNidal}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-400 text-sm mt-1">
            Si lo dejas vacío y tienes el trigger activo en Supabase, se calculará
            automáticamente desde la fecha de cruza.
          </p>
        </div>

        {/* Fecha estimada parto */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha estimada de parto
          </label>
          <input
            type="date"
            name="fechaEstimadaParto"
            value={formData.fechaEstimadaParto}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-400 text-sm mt-1">
            Si lo dejas vacío y tienes el trigger activo en Supabase, se calculará
            automáticamente desde la fecha de cruza.
          </p>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Notas sobre esta gestación..."
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
            {loading ? "Guardando..." : "Guardar Gestación"}
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


