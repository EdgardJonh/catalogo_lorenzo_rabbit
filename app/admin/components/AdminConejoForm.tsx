"use client";
import { useState, useEffect, useRef } from "react";
import { Conejo } from "../../../lib/supabase";
import { FaSave, FaTimes, FaTrash, FaImage, FaUpload, FaCamera, FaFolder } from "react-icons/fa";
import Image from "next/image";

interface AdminConejoFormProps {
  conejo: Conejo | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminConejoForm({
  conejo,
  onSave,
  onCancel,
}: AdminConejoFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    raza: "",
    sexo: "Macho",
    precio: "",
    tieneDescuento: false,
    fechaNacimiento: "",
    disponibilidad: "Disponible",
    fotoPrincipal: "",
    fotosAdicionales: "",
    reproductor: false,
    visible: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewPrincipal, setPreviewPrincipal] = useState<string | null>(null);
  const [previewAdicionales, setPreviewAdicionales] = useState<string[]>([]);
  const fileInputPrincipalRef = useRef<HTMLInputElement>(null);
  const fileInputPrincipalGalleryRef = useRef<HTMLInputElement>(null);
  const fileInputAdicionalesRef = useRef<HTMLInputElement>(null);
  const fileInputAdicionalesGalleryRef = useRef<HTMLInputElement>(null);
  // Archivos en memoria para subir en Guardar
  const [principalFile, setPrincipalFile] = useState<File | null>(null);
  const [adicionalesFiles, setAdicionalesFiles] = useState<File[]>([]);

  useEffect(() => {
    if (conejo) {
      // Modo edición
      setFormData({
        id: conejo.id,
        raza: conejo.raza,
        sexo: conejo.sexo,
        precio: conejo.precio.toString(),
        tieneDescuento: conejo.tieneDescuento,
        fechaNacimiento: conejo.fechaNacimiento,
        disponibilidad: conejo.disponibilidad,
        fotoPrincipal: conejo.fotoPrincipal,
        fotosAdicionales: conejo.fotosAdicionales.join("\n"),
        reproductor: conejo.reproductor,
        visible: conejo.visible ?? true,
      });
      // Cargar previews de imágenes existentes
      setPreviewPrincipal(conejo.fotoPrincipal || null);
      setPreviewAdicionales(conejo.fotosAdicionales || []);
    } else {
      // Modo creación: resetear formulario y generar ID
      const generateId = () => {
        const num = Math.floor(Math.random() * 9000) + 1000; // C1000 - C9999
        return `C${num}`;
      };
      setFormData({
        id: generateId(),
        raza: "",
        sexo: "Macho",
        precio: "",
        tieneDescuento: false,
        fechaNacimiento: "",
        disponibilidad: "Disponible",
        fotoPrincipal: "",
        fotosAdicionales: "",
        reproductor: false,
        visible: true,
      });
      setPreviewPrincipal(null);
      setPreviewAdicionales([]);
    }
  }, [conejo]);

  // Actualizar preview cuando cambia fotoPrincipal
  useEffect(() => {
    if (formData.fotoPrincipal) {
      setPreviewPrincipal(formData.fotoPrincipal);
    }
  }, [formData.fotoPrincipal]);

  // Actualizar preview cuando cambian fotosAdicionales
  useEffect(() => {
    const fotos = formData.fotosAdicionales
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    setPreviewAdicionales(fotos);
  }, [formData.fotosAdicionales]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploading(true);

    try {
      const confirmacion = `¿Está seguro de guardar el conejito ${formData.id}?`;
      if (!window.confirm(confirmacion)) {
        setUploading(false);
        setLoading(false);
        return;
      }

      // Validación básica
      if (!formData.id || !formData.raza) {
        setError("Por favor completa todos los campos obligatorios");
        setLoading(false);
        setUploading(false);
        return;
      }

      // Validación de foto principal (obligatoria)
      if (!formData.fotoPrincipal.trim() && !principalFile) {
        setError("La foto principal es obligatoria. Por favor carga una imagen.");
        setLoading(false);
        setUploading(false);
        return;
      }

      // 1) Subir imágenes si hay archivos seleccionados (deferred upload)
      let finalFotoPrincipal = formData.fotoPrincipal.trim();
      const finalFotosAdicionales: string[] = formData.fotosAdicionales
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      // Subir principal si hay archivo pendiente
      if (principalFile) {
        const safeId = (formData.id || "nuevo").replace(/[^A-Za-z0-9_-]/g, "");
        const ext = principalFile.name.split(".").pop() || "jpg";
        const path = `principal/${safeId}.${ext}`;
        const body = new FormData();
        body.append("file", principalFile);
        body.append("path", path);
        const res = await fetch("/api/upload", { method: "POST", body });
        const text = await res.text();
        if (!res.ok) {
          let msg = "Error al subir imagen principal";
          try { msg = JSON.parse(text)?.error || msg; } catch {}
          throw new Error(msg);
        }
        const json = text ? JSON.parse(text) : {};
        if (!json.url) throw new Error("No se recibió URL de la imagen principal");
        finalFotoPrincipal = json.url;
      }

      // Subir adicionales si hay archivos pendientes
      if (adicionalesFiles.length > 0) {
        const safeId = (formData.id || "nuevo").replace(/[^A-Za-z0-9_-]/g, "");
        for (let i = 0; i < adicionalesFiles.length; i++) {
          const file = adicionalesFiles[i];
          const ext = file.name.split(".").pop() || "jpg";
          const path = `adicionales/${safeId}-${Date.now()}-${i}.${ext}`;
          const body = new FormData();
          body.append("file", file);
          body.append("path", path);
          const res = await fetch("/api/upload", { method: "POST", body });
          const text = await res.text();
          if (!res.ok) {
            let msg = `Error al subir imagen adicional (${file.name})`;
            try { msg = JSON.parse(text)?.error || msg; } catch {}
            throw new Error(msg);
          }
          const json = text ? JSON.parse(text) : {};
          if (!json.url) throw new Error(`No se recibió URL para ${file.name}`);
          finalFotosAdicionales.push(json.url);
        }
      }

      if (!finalFotoPrincipal) {
        throw new Error("Debes cargar una foto principal");
      }

      const conejoData = {
        id: formData.id,
        raza: formData.raza,
        sexo: formData.sexo,
        precio: parseFloat(formData.precio),
        tiene_descuento: formData.tieneDescuento,
        // Enviamos en formato DMY; el endpoint convierte a ISO
        fechaNacimiento: formData.fechaNacimiento,
        disponibilidad: formData.disponibilidad,
        fotoPrincipal: finalFotoPrincipal,
        fotosAdicionales: finalFotosAdicionales,
        reproductor: formData.reproductor,
        visible: formData.visible,
      };

      const res = await fetch('/api/conejos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conejoData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error al guardar');

      // Limpiar archivos en memoria y mantener previews actualizadas
      setPrincipalFile(null);
      setAdicionalesFiles([]);
      setFormData(prev => ({
        ...prev,
        fotoPrincipal: finalFotoPrincipal,
        fotosAdicionales: finalFotosAdicionales.join("\n"),
      }));
      setPreviewPrincipal(finalFotoPrincipal || null);
      setPreviewAdicionales(finalFotosAdicionales);

      onSave();
    } catch (err: any) {
      setError(err.message || "Error al guardar el conejo");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  // Vista previa (deferred upload: no sube aquí)
  const handlePreviewPrincipal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Crear preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPrincipal(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Guardar archivo en memoria para subir en Guardar
    setPrincipalFile(file);
  };

  // Eliminar foto principal
  const handleRemovePrincipal = () => {
    setFormData(prev => ({ ...prev, fotoPrincipal: '' }));
    setPreviewPrincipal(null);
    setPrincipalFile(null);
  };

  // Vista previa antes de subir fotos adicionales
  const handlePreviewAdicionales = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Crear previews locales
    const newPreviews: string[] = [];
    const newFiles: File[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviewAdicionales(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });
    
    // Guardar archivos en memoria para subir en Guardar
    setAdicionalesFiles(prev => [...prev, ...newFiles]);
  };

  // Eliminar foto adicional
  const handleRemoveAdicional = (index: number) => {
    const fotos = formData.fotosAdicionales
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);
    fotos.splice(index, 1);
    setFormData(prev => ({ ...prev, fotosAdicionales: fotos.join('\n') }));
    // Quitar también de la cola local si existía
    setAdicionalesFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {conejo ? "Editar Conejito" : "Nuevo Conejito"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Raza */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Raza <span className="text-red-400">*</span>
            </label>
            <select
              name="raza"
              value={formData.raza}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecciona una raza</option>
              <option value="Mini Lop">Mini Lop</option>
              <option value="Fuzzy Lop">Fuzzy Lop</option>
              <option value="Holland Lop">Holland Lop</option>
            </select>
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Sexo</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option className="text-gray-700" value="Macho">Macho</option>
              <option className="text-gray-700" value="Hembra">Hembra</option>
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Disponibilidad
            </label>
            <select
              name="disponibilidad"
              value={formData.disponibilidad}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Disponible">Disponible</option>
              <option value="no Disponible">No Disponible</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="tieneDescuento"
              checked={formData.tieneDescuento}
              onChange={handleChange}
              className="w-5 h-5 rounded"
            />
            <span>Tiene Descuento (-30%)</span>
          </label>

          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="reproductor"
              checked={formData.reproductor}
              onChange={handleChange}
              className="w-5 h-5 rounded"
            />
            <span>Es Reproductor</span>
          </label>

          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              className="w-5 h-5 rounded"
            />
            <span>Visible en Catálogo</span>
          </label>
        </div>

        {/* Foto Principal */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Foto Principal <span className="text-red-400">*</span>
          </label>

          <div className="flex flex-wrap items-start gap-4">
            {/* Vista Previa */}
            {previewPrincipal && (
              <div className="relative inline-block">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-purple-500">
                  <Image
                    src={previewPrincipal}
                    alt="Preview principal"
                    fill
                    className="object-cover"
                    sizes="192px"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemovePrincipal}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                  title="Eliminar imagen"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}

            {/* Botones de carga: Cámara y Galería */}
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                <FaCamera /> Cámara
                <input
                  ref={fileInputPrincipalRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePreviewPrincipal}
                  className="hidden"
                />
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                <FaFolder /> Galería
                <input
                  ref={fileInputPrincipalGalleryRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePreviewPrincipal}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Fotos Adicionales */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Fotos Adicionales
          </label>

          {/* Galería de Preview */}
          {previewAdicionales.length > 0 && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewAdicionales.map((foto, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-purple-500">
                    <Image
                      src={foto}
                      alt={`Preview adicional ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdicional(index)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botones de carga múltiple: Cámara y Galería */}
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-colors">
              <FaCamera /> Cámara (Múltiples)
              <input
                ref={fileInputAdicionalesRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePreviewAdicionales}
                className="hidden"
              />
            </label>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg cursor-pointer transition-colors">
              <FaFolder /> Galería (Múltiples)
              <input
                ref={fileInputAdicionalesGalleryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePreviewAdicionales}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave /> {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

