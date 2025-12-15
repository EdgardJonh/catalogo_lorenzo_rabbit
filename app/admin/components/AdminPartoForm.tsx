"use client";
import { useState, useEffect } from "react";
import { Parto, Cruza } from "../../../lib/supabase";
import { FaSave, FaTimes } from "react-icons/fa";

interface AdminPartoFormProps {
  parto: Parto | null;
  cruzas: Cruza[];
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminPartoForm({
  parto,
  cruzas,
  onSave,
  onCancel,
}: AdminPartoFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    idCruza: "",
    fechaParto: "",
    gazaposTotales: "",
    gazaposVivos: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (parto) {
      setFormData({
        id: parto.id,
        idCruza: parto.idCruza,
        fechaParto: convertDMYToYMD(parto.fechaParto),
        gazaposTotales: parto.gazaposTotales?.toString() || "",
        gazaposVivos: parto.gazaposVivos?.toString() || "",
        observaciones: parto.observaciones || "",
      });
    } else {
      const generateId = () => {
        const num = Math.floor(Math.random() * 9000) + 1000;
        return `PARTO${num}`;
      };
      setFormData({
        id: generateId(),
        idCruza: "",
        fechaParto: "",
        gazaposTotales: "",
        gazaposVivos: "",
        observaciones: "",
      });
    }
  }, [parto]);

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
      if (!formData.fechaParto) {
        throw new Error("La fecha de parto es requerida");
      }

      const payload = {
        id: formData.id,
        idCruza: formData.idCruza,
        fechaParto: formData.fechaParto,
        gazaposTotales: formData.gazaposTotales ? parseInt(formData.gazaposTotales, 10) : null,
        gazaposVivos: formData.gazaposVivos ? parseInt(formData.gazaposVivos, 10) : null,
        observaciones: formData.observaciones || null,
      };

      const res = await fetch("/api/partos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error al guardar el parto");

      onSave();
    } catch (err: any) {
      setError(err.message || "Error al guardar el parto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {parto ? "Editar Parto" : "Nuevo Parto"}
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
            disabled={!!parto}
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
              No hay cruzas registradas. Crea una cruza antes de registrar partos.
            </p>
          )}
        </div>

        {/* Fecha parto */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha de parto <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="fechaParto"
            value={formData.fechaParto}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Gazapos totales */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Gazapos totales
          </label>
          <input
            type="number"
            name="gazaposTotales"
            value={formData.gazaposTotales}
            onChange={handleChange}
            min={0}
            className="w-full px-4 py-2 bg.white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Gazapos vivos */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Gazapos vivos
          </label>
          <input
            type="number"
            name="gazaposVivos"
            value={formData.gazaposVivos}
            onChange={handleChange}
            min={0}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
            placeholder="Notas sobre este parto..."
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
            {loading ? "Guardando..." : "Guardar Parto"}
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


