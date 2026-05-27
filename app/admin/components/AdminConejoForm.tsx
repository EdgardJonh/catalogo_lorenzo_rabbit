"use client";
import { useState, useEffect, useRef } from "react";
import { Conejo } from "../../../lib/supabase";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X, Save, Camera, FolderOpen, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface AdminConejoFormProps {
  conejo: Conejo | null;
  onSave: () => void;
  onCancel: () => void;
}

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

export default function AdminConejoForm({ conejo, onSave, onCancel }: AdminConejoFormProps) {
  const [formData, setFormData] = useState({
    id: "", raza: "", sexo: "Macho", precio: "",
    tieneDescuento: false, porcentajeDescuento: 0,
    fechaNacimiento: "", disponibilidad: "Disponible",
    fotoPrincipal: "", fotosAdicionales: "",
    reproductor: false,
    categoria: "ventas" as "reproductor" | "ventas" | "padre" | "madre",
    visible: true,
  });
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(false);
  const [previewPrincipal, setPreviewPrincipal] = useState<string | null>(null);
  const [previewAdicionales, setPreviewAdicionales] = useState<string[]>([]);
  const fileInputPrincipalRef = useRef<HTMLInputElement>(null);
  const fileInputPrincipalGalleryRef = useRef<HTMLInputElement>(null);
  const fileInputAdicionalesRef = useRef<HTMLInputElement>(null);
  const fileInputAdicionalesGalleryRef = useRef<HTMLInputElement>(null);
  const [principalFile, setPrincipalFile] = useState<File | null>(null);
  const [adicionalesFiles, setAdicionalesFiles] = useState<File[]>([]);

  useEffect(() => {
    setPrincipalFile(null);
    setAdicionalesFiles([]);
    if (conejo) {
      setFormData({
        id: conejo.id, raza: conejo.raza, sexo: conejo.sexo,
        precio: conejo.precio.toString(), tieneDescuento: conejo.tieneDescuento,
        porcentajeDescuento: (conejo as any).porcentajeDescuento || (conejo.tieneDescuento ? 30 : 0),
        fechaNacimiento: convertDMYToYMD(conejo.fechaNacimiento),
        disponibilidad: conejo.disponibilidad, fotoPrincipal: conejo.fotoPrincipal,
        fotosAdicionales: conejo.fotosAdicionales.join("\n"),
        reproductor: conejo.reproductor,
        categoria: conejo.categoria || (conejo.reproductor ? "reproductor" : "ventas"),
        visible: conejo.visible ?? true,
      });
      setPreviewPrincipal(conejo.fotoPrincipal || null);
      setPreviewAdicionales(conejo.fotosAdicionales || []);
    } else {
      setFormData({ id: "", raza: "", sexo: "Macho", precio: "", tieneDescuento: false, porcentajeDescuento: 0, fechaNacimiento: "", disponibilidad: "Disponible", fotoPrincipal: "", fotosAdicionales: "", reproductor: false, categoria: "ventas", visible: true });
      setPreviewPrincipal(null);
      setPreviewAdicionales([]);
      setLoadingId(true);
      fetch("/api/conejos?nextId=true")
        .then((r) => r.json())
        .then((json) => setFormData((prev) => ({ ...prev, id: json.nextId ?? "C1" })))
        .catch(() => setFormData((prev) => ({ ...prev, id: "C1" })))
        .finally(() => setLoadingId(false));
    }
  }, [conejo]);

  useEffect(() => {
    if (formData.fotoPrincipal) setPreviewPrincipal(formData.fotoPrincipal);
  }, [formData.fotoPrincipal]);

  useEffect(() => {
    const fotos = formData.fotosAdicionales.split("\n").map((f) => f.trim()).filter(Boolean);
    setPreviewAdicionales(fotos);
  }, [formData.fotosAdicionales]);

  const set = (field: string, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.raza) { toast.error("ID y Raza son obligatorios."); return; }
    if (!formData.fotoPrincipal.trim() && !principalFile) { toast.error("La foto principal es obligatoria."); return; }

    setLoading(true);
    const toastId = toast.loading(principalFile || adicionalesFiles.length > 0 ? "Subiendo imágenes..." : "Guardando conejito...");

    try {
      let finalFotoPrincipal = formData.fotoPrincipal.trim();
      const finalFotosAdicionales: string[] = formData.fotosAdicionales.split("\n").map((f) => f.trim()).filter(Boolean);

      if (principalFile) {
        const safeId = (formData.id || "nuevo").replace(/[^A-Za-z0-9_-]/g, "");
        const ext = principalFile.name.split(".").pop() || "jpg";
        const body = new FormData();
        body.append("file", principalFile);
        body.append("path", `principal/${safeId}-${Date.now()}.${ext}`);
        const res = await fetch("/api/upload", { method: "POST", body });
        const text = await res.text();
        if (!res.ok) throw new Error(JSON.parse(text)?.error || "Error al subir la foto principal");
        const json = JSON.parse(text);
        if (!json.url) throw new Error("No se recibió URL de la foto principal");
        finalFotoPrincipal = json.url;
      }

      if (adicionalesFiles.length > 0) {
        toast.loading("Subiendo fotos adicionales...", { id: toastId });
        const safeId = (formData.id || "nuevo").replace(/[^A-Za-z0-9_-]/g, "");
        for (let i = 0; i < adicionalesFiles.length; i++) {
          const file = adicionalesFiles[i];
          const ext = file.name.split(".").pop() || "jpg";
          const body = new FormData();
          body.append("file", file);
          body.append("path", `adicionales/${safeId}-${Date.now()}-${i}.${ext}`);
          const res = await fetch("/api/upload", { method: "POST", body });
          const text = await res.text();
          if (!res.ok) throw new Error(JSON.parse(text)?.error || `Error al subir foto adicional`);
          const json = JSON.parse(text);
          if (!json.url) throw new Error(`No se recibió URL para ${file.name}`);
          finalFotosAdicionales.push(json.url);
        }
      }

      toast.loading("Guardando en base de datos...", { id: toastId });
      const porcentajeDescuento = parseFloat(formData.porcentajeDescuento.toString()) || 0;

      const res = await fetch("/api/conejos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id, raza: formData.raza, sexo: formData.sexo,
          precio: parseFloat(formData.precio), tiene_descuento: porcentajeDescuento > 0,
          porcentaje_descuento: porcentajeDescuento, fechaNacimiento: formData.fechaNacimiento,
          disponibilidad: formData.disponibilidad, fotoPrincipal: finalFotoPrincipal,
          fotosAdicionales: finalFotosAdicionales, reproductor: formData.categoria !== "ventas",
          categoria: formData.categoria, visible: formData.visible,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error al guardar");

      setPrincipalFile(null);
      setAdicionalesFiles([]);
      toast.success(conejo ? `Conejito ${formData.id} actualizado` : `Conejito ${formData.id} creado`, { id: toastId });
      onSave();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar el conejito", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPrincipal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewPrincipal(reader.result as string);
    reader.readAsDataURL(file);
    setPrincipalFile(file);
  };

  const handlePreviewAdicionales = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newPreviews: string[] = [];
    const newFiles: File[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) setPreviewAdicionales((prev) => [...prev, ...newPreviews]);
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });
    setAdicionalesFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveAdicional = (index: number) => {
    const fotos = formData.fotosAdicionales.split("\n").map((f) => f.trim()).filter(Boolean);
    fotos.splice(index, 1);
    setFormData((prev) => ({ ...prev, fotosAdicionales: fotos.join("\n") }));
    setAdicionalesFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{conejo ? "Editar Conejito" : "Nuevo Conejito"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  id="id"
                  value={loadingId ? "" : formData.id}
                  readOnly
                  placeholder={loadingId ? "Generando..." : ""}
                  className="bg-muted text-foreground cursor-default"
                />
                {loadingId && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Raza <span className="text-destructive">*</span></Label>
              <Select value={formData.raza} onValueChange={(v) => set("raza", v)} required>
                <SelectTrigger><SelectValue placeholder="Selecciona una raza" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mini Lop">Mini Lop</SelectItem>
                  <SelectItem value="Fuzzy Lop">Fuzzy Lop</SelectItem>
                  <SelectItem value="Holland Lop">Holland Lop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={formData.sexo} onValueChange={(v) => set("sexo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (CLP) <span className="text-destructive">*</span></Label>
              <Input id="precio" type="number" min="0" value={formData.precio} onChange={(e) => set("precio", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento <span className="text-destructive">*</span></Label>
              <Input id="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Disponibilidad</Label>
              <Select value={formData.disponibilidad} onValueChange={(v) => set("disponibilidad", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="no Disponible">No Disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="porcentajeDescuento">Descuento (%)</Label>
              <Input
                id="porcentajeDescuento" type="number" min="0" max="100" step="0.1"
                value={formData.porcentajeDescuento}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setFormData((prev) => ({ ...prev, porcentajeDescuento: v, tieneDescuento: v > 0 }));
                }}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">0 = sin descuento</p>
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-3">
            <Label>Categoría <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { value: "ventas",      label: "Ventas",      emoji: "🛒", active: "bg-blue-500 text-white border-blue-600 shadow-md" },
                  { value: "reproductor", label: "Reproductor", emoji: "🐇", active: "bg-violet-500 text-white border-violet-600 shadow-md" },
                  { value: "padre",       label: "Padre",       emoji: "♂️", active: "bg-emerald-500 text-white border-emerald-600 shadow-md" },
                  { value: "madre",       label: "Madre",       emoji: "♀️", active: "bg-rose-500 text-white border-rose-600 shadow-md" },
                ] as const
              ).map(({ value, label, emoji, active }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("categoria", value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 px-2 text-sm font-semibold transition-all duration-150",
                    formData.categoria === value
                      ? active
                      : "border-border bg-muted text-muted-foreground hover:border-primary hover:text-foreground"
                  )}
                >
                  <span className="text-xl">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Switch id="visible" checked={formData.visible} onCheckedChange={(v) => set("visible", v)} />
              <Label htmlFor="visible">Visible en Catálogo</Label>
            </div>
          </div>

          <Separator />

          {/* Foto Principal */}
          <div className="space-y-3">
            <Label>Foto Principal <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap items-start gap-4">
              {previewPrincipal && (
                <div className="relative">
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-primary">
                    <Image src={previewPrincipal} alt="Preview principal" fill className="object-cover" sizes="160px" unoptimized />
                  </div>
                  <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7" onClick={() => { set("fotoPrincipal", ""); setPreviewPrincipal(null); setPrincipalFile(null); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}>
                  <Camera className="h-4 w-4 mr-1.5" />Cámara
                  <input ref={fileInputPrincipalRef} type="file" accept="image/*" capture="environment" onChange={handlePreviewPrincipal} className="hidden" />
                </label>
                <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}>
                  <FolderOpen className="h-4 w-4 mr-1.5" />Galería
                  <input ref={fileInputPrincipalGalleryRef} type="file" accept="image/*" onChange={handlePreviewPrincipal} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Fotos Adicionales */}
          <div className="space-y-3">
            <Label>Fotos Adicionales</Label>
            {previewAdicionales.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {previewAdicionales.map((foto, i) => (
                  <div key={i} className="relative group">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
                      <Image src={foto} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="120px" unoptimized />
                    </div>
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-1.5 -right-1.5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveAdicional(i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}>
                <Camera className="h-4 w-4 mr-1.5" />Cámara (Múltiples)
                <input ref={fileInputAdicionalesRef} type="file" accept="image/*" capture="environment" multiple onChange={handlePreviewAdicionales} className="hidden" />
              </label>
              <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}>
                <FolderOpen className="h-4 w-4 mr-1.5" />Galería (Múltiples)
                <input ref={fileInputAdicionalesGalleryRef} type="file" accept="image/*" multiple onChange={handlePreviewAdicionales} className="hidden" />
              </label>
            </div>
          </div>

          <Separator />

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : <><Save className="h-4 w-4 mr-2" />Guardar</>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
