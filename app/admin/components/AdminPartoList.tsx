"use client";
import { useState, useMemo, useEffect } from "react";
import { Parto, Cruza } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Trash2, RefreshCw, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AdminPartoListProps {
  partos: Parto[];
  cruzas: Cruza[];
  loading: boolean;
  onEdit: (parto: Parto) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function AdminPartoList({ partos, cruzas, loading, onEdit, onDelete, onRefresh }: AdminPartoListProps) {
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

  const filteredPartos = useMemo(() => {
    if (!searchTerm) return partos;
    const t = searchTerm.toLowerCase();
    return partos.filter((p) =>
      p.id.toLowerCase().includes(t) ||
      getCruzaInfo(p.idCruza).toLowerCase().includes(t) ||
      p.fechaParto.toLowerCase().includes(t)
    );
  }, [partos, searchTerm, cruzasMap]);

  const totalPages = Math.ceil(filteredPartos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPartos = filteredPartos.slice(startIndex, startIndex + itemsPerPage);

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
          <p className="text-muted-foreground">Cargando partos...</p>
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
            <Input placeholder="Buscar por ID, cruza o fecha..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{filteredPartos.length} partos</span>
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
                {["ID", "Cruza", "Fecha Parto", "Gazapos Totales", "Gazapos Vivos", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPartos.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">{searchTerm ? "No se encontraron partos" : "No hay partos registrados"}</td></tr>
              ) : paginatedPartos.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{p.id}</td>
                  <td className="px-4 py-3 text-foreground">{getCruzaInfo(p.idCruza)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.fechaParto}</td>
                  <td className="px-4 py-3 text-center font-semibold text-foreground">{p.gazaposTotales ?? "—"}</td>
                  <td className="px-4 py-3 text-center font-semibold text-primary">{p.gazaposVivos ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="icon" onClick={() => onEdit(p)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(p.id)} title="Eliminar" className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {paginatedPartos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">{searchTerm ? "No se encontraron partos" : "No hay partos registrados"}</div>
          ) : paginatedPartos.map((p) => (
            <div key={p.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-foreground">{p.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{getCruzaInfo(p.idCruza)}</p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <div><span className="text-muted-foreground">Fecha Parto: </span><span className="text-foreground">{p.fechaParto}</span></div>
                <div><span className="text-muted-foreground">Gazapos totales: </span><span className="font-semibold text-foreground">{p.gazaposTotales ?? "—"}</span></div>
                <div><span className="text-muted-foreground">Gazapos vivos: </span><span className="font-semibold text-primary">{p.gazaposVivos ?? "—"}</span></div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredPartos.length)} de {filteredPartos.length}</p>
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
