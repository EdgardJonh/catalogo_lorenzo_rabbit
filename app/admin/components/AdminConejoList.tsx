"use client";
import { useState, useMemo, useEffect } from "react";
import { Conejo } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pencil, Trash2, RefreshCw, Search, Eye, EyeOff,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminConejoListProps {
  conejos: Conejo[];
  loading: boolean;
  onEdit: (conejo: Conejo) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onToggleVisible: (id: string, visible: boolean) => void;
  onToggleDisponibilidad: (id: string, disponibilidad: string) => Promise<void>;
}

export default function AdminConejoList({
  conejos, loading, onEdit, onDelete, onRefresh, onToggleVisible, onToggleDisponibilidad,
}: AdminConejoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [updatingVisible, setUpdatingVisible] = useState<string | null>(null);
  const [updatingDisponibilidad, setUpdatingDisponibilidad] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredConejos = useMemo(() =>
    conejos.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        c.id.toLowerCase().includes(term) ||
        c.raza.toLowerCase().includes(term) ||
        c.sexo.toLowerCase().includes(term) ||
        ((c as any).nombre || "").toLowerCase().includes(term);
      const cat = c.categoria || (c.reproductor ? "reproductor" : "ventas");
      const matchesCat = !selectedCategoria || cat === selectedCategoria;
      return matchesSearch && matchesCat;
    }), [conejos, searchTerm, selectedCategoria]);

  const totalPages = Math.ceil(filteredConejos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConejos = filteredConejos.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategoria]);
  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(1); }, [totalPages, currentPage]);

  const formatoCLP = (v: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);

  const FILTER_CATS = [
    { value: null,          label: "Todos",      emoji: "🐰", activeClass: "bg-gray-700 text-white border-gray-800" },
    { value: "ventas",      label: "Ventas",     emoji: "🛒", activeClass: "bg-blue-500 text-white border-blue-600" },
    { value: "reproductor", label: "Reproductor",emoji: "🐇", activeClass: "bg-violet-500 text-white border-violet-600" },
    { value: "padre",       label: "Padre",      emoji: "♂️", activeClass: "bg-emerald-500 text-white border-emerald-600" },
    { value: "madre",       label: "Madre",      emoji: "♀️", activeClass: "bg-rose-500 text-white border-rose-600" },
  ] as const;

  const CAT_BADGE: Record<string, { label: string; cls: string }> = {
    ventas:      { label: "Ventas",      cls: "bg-blue-100 text-blue-700 border-blue-200" },
    reproductor: { label: "Reproductor", cls: "bg-violet-100 text-violet-700 border-violet-200" },
    padre:       { label: "Padre",       cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    madre:       { label: "Madre",       cls: "bg-rose-100 text-rose-700 border-rose-200" },
  };

  const handleToggleVisible = async (c: Conejo) => {
    setUpdatingVisible(c.id);
    try { await onToggleVisible(c.id, !c.visible); } finally { setUpdatingVisible(null); }
  };

  const handleToggleDisponibilidad = async (c: Conejo) => {
    const nueva = c.disponibilidad === "Disponible" ? "no Disponible" : "Disponible";
    setUpdatingDisponibilidad(c.id);
    try { await onToggleDisponibilidad(c.id, nueva); } finally { setUpdatingDisponibilidad(null); }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando conejitos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, nombre, raza o sexo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{filteredConejos.length} conejos</span>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Actualizar
            </Button>
          </div>
        </div>

        {/* Filtro por categoría */}
        <div className="flex flex-wrap gap-2">
          {FILTER_CATS.map(({ value, label, emoji, activeClass }) => {
            const isActive = selectedCategoria === value;
            const count = value === null
              ? conejos.length
              : conejos.filter((c) => (c.categoria || (c.reproductor ? "reproductor" : "ventas")) === value).length;
            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => setSelectedCategoria(value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150",
                  isActive ? activeClass : "border-border bg-muted text-muted-foreground hover:border-primary hover:text-foreground"
                )}
              >
                <span>{emoji}</span>
                {label}
                <span className={cn("ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]", isActive ? "bg-white/20" : "bg-muted-foreground/15")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Vista Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["ID", "Raza", "Sexo", "Precio", "Nacimiento", "Estado", "Tipo", "Visible", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedConejos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">No se encontraron conejitos</td>
                </tr>
              ) : paginatedConejos.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{c.id}</td>
                  <td className="px-4 py-3 text-foreground">{c.raza}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.sexo}</td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {formatoCLP(c.precio)}
                    {c.tieneDescuento && (
                      <span className="ml-1.5 text-xs text-destructive">-{(c as any).porcentajeDescuento ?? 30}%</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.fechaNacimiento}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.disponibilidad === "Disponible" ? "default" : "destructive"}>
                      {c.disponibilidad}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const cat = c.categoria || (c.reproductor ? "reproductor" : "ventas");
                      const b = CAT_BADGE[cat] ?? CAT_BADGE["ventas"];
                      return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border", b.cls)}>{b.label}</span>;
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.visible ? "default" : "outline"} className={!c.visible ? "text-muted-foreground" : ""}>
                      {c.visible ? "Sí" : "No"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline" size="icon"
                        onClick={() => handleToggleDisponibilidad(c)}
                        disabled={updatingDisponibilidad === c.id}
                        title={c.disponibilidad === "Disponible" ? "Marcar no disponible" : "Marcar disponible"}
                        className={c.disponibilidad === "Disponible" ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"}
                      >
                        {updatingDisponibilidad === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : c.disponibilidad === "Disponible" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline" size="icon"
                        onClick={() => handleToggleVisible(c)}
                        disabled={updatingVisible === c.id}
                        title={c.visible ? "Ocultar del catálogo" : "Mostrar en catálogo"}
                        className={c.visible ? "text-amber-500 hover:bg-amber-500/10" : "text-primary hover:bg-primary/10"}
                      >
                        {updatingVisible === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : c.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onEdit(c)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(c.id)} title="Eliminar" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Mobile */}
        <div className="md:hidden divide-y divide-border">
          {paginatedConejos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No se encontraron conejitos</div>
          ) : paginatedConejos.map((c) => (
            <div key={c.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-foreground">{c.id}</p>
                  <p className="text-sm text-muted-foreground">{c.raza} · {c.sexo}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleToggleDisponibilidad(c)} disabled={updatingDisponibilidad === c.id} title={c.disponibilidad === "Disponible" ? "Marcar no disponible" : "Marcar disponible"}>
                    {updatingDisponibilidad === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : c.disponibilidad === "Disponible" ? <XCircle className="h-3.5 w-3.5 text-destructive" /> : <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleToggleVisible(c)} disabled={updatingVisible === c.id} title={c.visible ? "Ocultar" : "Mostrar"}>
                    {updatingVisible === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : c.visible ? <EyeOff className="h-3.5 w-3.5 text-amber-500" /> : <Eye className="h-3.5 w-3.5 text-primary" />}
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Precio: </span><span className="font-semibold text-primary">{formatoCLP(c.precio)}</span></div>
                <div><span className="text-muted-foreground">Nacimiento: </span><span className="text-foreground">{c.fechaNacimiento}</span></div>
                <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Estado:</span><Badge variant={c.disponibilidad === "Disponible" ? "default" : "destructive"} className="text-xs">{c.disponibilidad}</Badge></div>
                <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Visible:</span><Badge variant={c.visible ? "default" : "outline"} className="text-xs">{c.visible ? "Sí" : "No"}</Badge></div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="text-muted-foreground">Categoría:</span>
                  {(() => {
                    const cat = c.categoria || (c.reproductor ? "reproductor" : "ventas");
                    const b = CAT_BADGE[cat] ?? CAT_BADGE["ventas"];
                    return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border", b.cls)}>{b.label}</span>;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredConejos.length)} de {filteredConejos.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return (
                  <Button key={p} variant={currentPage === p ? "default" : "outline"} size="icon" onClick={() => goToPage(p)}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="icon" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
