"use client";
import { useState, useMemo, useEffect } from "react";
import { Gestacion, Cruza } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Trash2, RefreshCw, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AdminGestacionListProps {
  gestaciones: Gestacion[];
  cruzas: Cruza[];
  loading: boolean;
  onEdit: (gestacion: Gestacion) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function AdminGestacionList({ gestaciones, cruzas, loading, onEdit, onDelete, onRefresh }: AdminGestacionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cruzasMap = useMemo(() => {
    const map = new Map<string, Cruza>();
    cruzas.forEach((c) => map.set(c.id, c));
    return map;
  }, [cruzas]);

  const getCruzaInfo = (id: string) => {
    const c = cruzasMap.get(id);
    return c ? `${c.id} (${c.fechaCruza})` : id;
  };

  const filteredGestaciones = useMemo(() => {
    if (!searchTerm) return gestaciones;
    const t = searchTerm.toLowerCase();
    return gestaciones.filter((g) =>
      g.id.toLowerCase().includes(t) ||
      getCruzaInfo(g.idCruza).toLowerCase().includes(t) ||
      (g.fechaColocarNidal || "").includes(t) ||
      (g.fechaEstimadaParto || "").includes(t)
    );
  }, [gestaciones, searchTerm, cruzasMap]);

  const totalPages = Math.ceil(filteredGestaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGestaciones = filteredGestaciones.slice(startIndex, startIndex + itemsPerPage);

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
          <p className="text-muted-foreground">Cargando gestaciones...</p>
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
            <Input placeholder="Buscar por ID, cruza o fechas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{filteredGestaciones.length} gestaciones</span>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Actualizar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["ID", "Cruza", "Fecha Nidal", "Fecha Estimada Parto", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedGestaciones.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">{searchTerm ? "No se encontraron gestaciones" : "No hay gestaciones registradas"}</td></tr>
              ) : paginatedGestaciones.map((g) => (
                <tr key={g.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{g.id}</td>
                  <td className="px-4 py-3 text-foreground">{getCruzaInfo(g.idCruza)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.fechaColocarNidal || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.fechaEstimadaParto || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="icon" onClick={() => onEdit(g)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(g.id)} title="Eliminar" className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {paginatedGestaciones.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">{searchTerm ? "No se encontraron gestaciones" : "No hay gestaciones registradas"}</div>
          ) : paginatedGestaciones.map((g) => (
            <div key={g.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-foreground">{g.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{getCruzaInfo(g.idCruza)}</p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(g)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(g.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="text-muted-foreground">Nidal: </span><span className="text-foreground">{g.fechaColocarNidal || "—"}</span></div>
                <div><span className="text-muted-foreground">Parto estimado: </span><span className="text-foreground">{g.fechaEstimadaParto || "—"}</span></div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredGestaciones.length)} de {filteredGestaciones.length}</p>
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
