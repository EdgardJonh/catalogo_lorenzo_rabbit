"use client";
import { useState, useEffect } from "react";
import { Cruza, Conejo } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { X, Save, Loader2, AlertCircle } from "lucide-react";

interface AdminCruzaFormProps {
  cruza: Cruza | null;
  conejos: Conejo[];
  onSave: () => void;
  onCancel: () => void;
}

const convertDMYToYMD = (dmy: string): string => {
  if (!dmy) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dmy)) return dmy;
  const p = dmy.split("-");
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : dmy;
};

export default function AdminCruzaForm({ cruza, conejos, onSave, onCancel }: AdminCruzaFormProps) {
  const machos = conejos.filter((c) => c.sexo === "Macho" && (c.categoria === "reproductor" || c.categoria === "padre"));
  const hembras = conejos.filter((c) => c.sexo === "Hembra" && (c.categoria === "reproductor" || c.categoria === "madre"));

  const [formData, setFormData] = useState({
    id: "", idPadre: "", idMadre: "", fechaCruza: "",
    fechaPartoEsperado: "", fechaPartoReal: "",
    estado: "programada" as "programada" | "en_proceso" | "completada" | "cancelada",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cruza) {
      setFormData({
        id: cruza.id, idPadre: cruza.idPadre, idMadre: cruza.idMadre,
        fechaCruza: convertDMYToYMD(cruza.fechaCruza),
        fechaPartoEsperado: cruza.fechaPartoEsperado ? convertDMYToYMD(cruza.fechaPartoEsperado) : "",
        fechaPartoReal: cruza.fechaPartoReal ? convertDMYToYMD(cruza.fechaPartoReal) : "",
        estado: cruza.estado, notas: cruza.notas || "",
      });
    } else {
      setFormData({
        id: `CRUZA${Math.floor(Math.random() * 9000) + 1000}`,
        idPadre: "", idMadre: "", fechaCruza: "", fechaPartoEsperado: "", fechaPartoReal: "",
        estado: "programada", notas: "",
      });
    }
  }, [cruza]);

  const set = (field: string, value: string | null) => setFormData((prev) => ({ ...prev, [field]: value ?? "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.idPadre || !formData.idMadre) { setError("Debes seleccionar padre y madre"); return; }
    if (formData.idPadre === formData.idMadre) { setError("El padre y la madre deben ser diferentes"); return; }
    if (!formData.fechaCruza) { setError("La fecha de cruza es requerida"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/cruzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id, idPadre: formData.idPadre, idMadre: formData.idMadre,
          fechaCruza: formData.fechaCruza,
          fechaPartoEsperado: formData.fechaPartoEsperado || null,
          fechaPartoReal: formData.fechaPartoReal || null,
          estado: formData.estado, notas: formData.notas || null,
        }),
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{cruza ? "Editar Cruza" : "Nueva Cruza"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={formData.id} onChange={(e) => set("id", e.target.value)} disabled={!!cruza} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Padre (Macho) <span className="text-destructive">*</span></Label>
              <Select value={formData.idPadre} onValueChange={(v) => set("idPadre", v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona un macho" /></SelectTrigger>
                <SelectContent>
                  {machos.map((m) => <SelectItem key={m.id} value={m.id}>{m.id} — {m.raza} ({m.categoria})</SelectItem>)}
                </SelectContent>
              </Select>
              {machos.length === 0 && <p className="text-xs text-amber-500">No hay machos disponibles (categoría: reproductor o padre)</p>}
            </div>
            <div className="space-y-2">
              <Label>Madre (Hembra) <span className="text-destructive">*</span></Label>
              <Select value={formData.idMadre} onValueChange={(v) => set("idMadre", v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona una hembra" /></SelectTrigger>
                <SelectContent>
                  {hembras.map((h) => <SelectItem key={h.id} value={h.id}>{h.id} — {h.raza} ({h.categoria})</SelectItem>)}
                </SelectContent>
              </Select>
              {hembras.length === 0 && <p className="text-xs text-amber-500">No hay hembras disponibles (categoría: reproductor o madre)</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaCruza">Fecha de Cruza <span className="text-destructive">*</span></Label>
              <Input id="fechaCruza" type="date" value={formData.fechaCruza} onChange={(e) => set("fechaCruza", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaPartoEsperado">Parto Esperado</Label>
              <Input id="fechaPartoEsperado" type="date" value={formData.fechaPartoEsperado} onChange={(e) => set("fechaPartoEsperado", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaPartoReal">Parto Real</Label>
              <Input id="fechaPartoReal" type="date" value={formData.fechaPartoReal} onChange={(e) => set("fechaPartoReal", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={formData.estado} onValueChange={(v) => set("estado", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="programada">Programada</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => set("notas", e.target.value)}
              rows={3}
              placeholder="Observaciones adicionales..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <Separator />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : <><Save className="h-4 w-4 mr-2" />Guardar Cruza</>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
