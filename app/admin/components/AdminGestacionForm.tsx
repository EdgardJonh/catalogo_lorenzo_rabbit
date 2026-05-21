"use client";
import { useState, useEffect } from "react";
import { Gestacion, Cruza } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { X, Save, Loader2, AlertCircle } from "lucide-react";

interface AdminGestacionFormProps {
  gestacion: Gestacion | null;
  cruzas: Cruza[];
  onSave: () => void;
  onCancel: () => void;
}

const convertDMYToYMD = (dmy: string): string => {
  if (!dmy) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dmy)) return dmy;
  const p = dmy.split("-");
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : dmy;
};

export default function AdminGestacionForm({ gestacion, cruzas, onSave, onCancel }: AdminGestacionFormProps) {
  const [formData, setFormData] = useState({ id: "", idCruza: "", fechaColocarNidal: "", fechaEstimadaParto: "", observaciones: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gestacion) {
      setFormData({
        id: gestacion.id, idCruza: gestacion.idCruza,
        fechaColocarNidal: gestacion.fechaColocarNidal ? convertDMYToYMD(gestacion.fechaColocarNidal) : "",
        fechaEstimadaParto: gestacion.fechaEstimadaParto ? convertDMYToYMD(gestacion.fechaEstimadaParto) : "",
        observaciones: gestacion.observaciones || "",
      });
    } else {
      setFormData({ id: `GEST${Math.floor(Math.random() * 9000) + 1000}`, idCruza: "", fechaColocarNidal: "", fechaEstimadaParto: "", observaciones: "" });
    }
  }, [gestacion]);

  const set = (field: string, value: string | null) => setFormData((prev) => ({ ...prev, [field]: value ?? "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.idCruza) { setError("Debes seleccionar una cruza"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/gestaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id, idCruza: formData.idCruza,
          fechaColocarNidal: formData.fechaColocarNidal || null,
          fechaEstimadaParto: formData.fechaEstimadaParto || null,
          observaciones: formData.observaciones || null,
        }),
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{gestacion ? "Editar Gestación" : "Nueva Gestación"}</CardTitle>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={formData.id} onChange={(e) => set("id", e.target.value)} disabled={!!gestacion} required />
            </div>
            <div className="space-y-2">
              <Label>Cruza <span className="text-destructive">*</span></Label>
              <Select value={formData.idCruza} onValueChange={(v) => set("idCruza", v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona una cruza" /></SelectTrigger>
                <SelectContent>
                  {cruzas.map((c) => <SelectItem key={c.id} value={c.id}>{c.id} — {c.fechaCruza}</SelectItem>)}
                </SelectContent>
              </Select>
              {cruzas.length === 0 && <p className="text-xs text-amber-500">No hay cruzas registradas</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaColocarNidal">Fecha para colocar nidal</Label>
              <Input id="fechaColocarNidal" type="date" value={formData.fechaColocarNidal} onChange={(e) => set("fechaColocarNidal", e.target.value)} />
              <p className="text-xs text-muted-foreground">Se calcula automáticamente si tienes el trigger de Supabase activo</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaEstimadaParto">Fecha estimada de parto</Label>
              <Input id="fechaEstimadaParto" type="date" value={formData.fechaEstimadaParto} onChange={(e) => set("fechaEstimadaParto", e.target.value)} />
              <p className="text-xs text-muted-foreground">Se calcula automáticamente si tienes el trigger de Supabase activo</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => set("observaciones", e.target.value)}
              rows={3}
              placeholder="Notas sobre esta gestación..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <Separator />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : <><Save className="h-4 w-4 mr-2" />Guardar Gestación</>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
