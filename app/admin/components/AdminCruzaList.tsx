"use client";
import { useState, useMemo, useEffect } from "react";
import { Cruza, Conejo } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Trash2, RefreshCw, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AdminCruzaListProps {
  cruzas: Cruza[];
  conejos: Conejo[];
  loading: boolean;
  onEdit: (cruza: Cruza) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const estadoBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  programada: "secondary",
  en_proceso: "default",
  completada: "outline",
  cancelada: "destructive",
};

export default function AdminCruzaList({ cruzas, conejos, loading, onEdit, onDelete, onRefresh }: AdminCruzaListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const conejosMap = useMemo(() => {
    const map = new Map<string, Conejo>();
    conejos.forEach((c) => map.set(c.id, c));
    return map;
  }, [conejos]);

  const getConejoInfo = (id: string) => {
    const c = conejosMap.get(id);
    return c ? `${c.id} — ${c.raza}` : id;
  };

  const filteredCruzas = useMemo(() => {
    if (!searchTerm) return cruzas;
    const t = searchTerm.toLowerCase();
    return cruzas.filter((c) =>
      c.id.toLowerCase().includes(t) ||
      getConejoInfo(c.idPadre).toLowerCase().includes(t) ||
      getConejoInfo(c.idMadre).toLowerCase().includes(t) ||
      c.estado.toLowerCase().includes(t)
    );
  }, [cruzas, searchTerm, conejosMap]);

  const totalPages = Math.ceil(filteredCruzas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCruzas = filteredCruzas.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(1); }, [totalPages, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando cruzas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por ID, padre, madre o estado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{filteredCruzas.length} cruzas</span>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Actualizar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["ID", "Padre", "Madre", "Fecha Cruza", "Parto Esperado", "Parto Real", "Estado", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCruzas.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">{searchTerm ? "No se encontraron cruzas" : "No hay cruzas registradas"}</td></tr>
              ) : paginatedCruzas.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{c.id}</td>
                  <td className="px-4 py-3 text-foreground">{getConejoInfo(c.idPadre)}</td>
                  <td className="px-4 py-3 text-foreground">{getConejoInfo(c.idMadre)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.fechaCruza}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.fechaPartoEsperado || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.fechaPartoReal || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={estadoBadge[c.estado] ?? "outline"}>
                      {c.estado.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="icon" onClick={() => onEdit(c)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(c.id)} title="Eliminar" className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-border">
          {paginatedCruzas.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">{searchTerm ? "No se encontraron cruzas" : "No hay cruzas registradas"}</div>
          ) : paginatedCruzas.map((c) => (
            <div key={c.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-foreground">{c.id}</p>
                  <Badge variant={estadoBadge[c.estado] ?? "outline"} className="mt-1">{c.estado.replace("_", " ")}</Badge>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div><span className="text-muted-foreground">Padre: </span><span className="text-foreground">{getConejoInfo(c.idPadre)}</span></div>
                <div><span className="text-muted-foreground">Madre: </span><span className="text-foreground">{getConejoInfo(c.idMadre)}</span></div>
                <div><span className="text-muted-foreground">Fecha Cruza: </span><span className="text-foreground">{c.fechaCruza}</span></div>
                {c.fechaPartoEsperado && <div><span className="text-muted-foreground">Parto Esperado: </span><span className="text-foreground">{c.fechaPartoEsperado}</span></div>}
                {c.fechaPartoReal && <div><span className="text-muted-foreground">Parto Real: </span><span className="text-foreground">{c.fechaPartoReal}</span></div>}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredCruzas.length)} de {filteredCruzas.length}</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="px-3 text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
              <Button variant="outline" size="icon" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
