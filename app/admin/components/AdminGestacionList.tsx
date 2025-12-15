"use client";
import { Gestacion, Cruza } from "../../../lib/supabase";
import { FaEdit, FaTrash, FaSyncAlt, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";

interface AdminGestacionListProps {
  gestaciones: Gestacion[];
  cruzas: Cruza[];
  loading: boolean;
  onEdit: (gestacion: Gestacion) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function AdminGestacionList({
  gestaciones,
  cruzas,
  loading,
  onEdit,
  onDelete,
  onRefresh,
}: AdminGestacionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cruzasMap = useMemo(() => {
    const map = new Map<string, Cruza>();
    cruzas.forEach((c) => map.set(c.id, c));
    return map;
  }, [cruzas]);

  const getCruzaInfo = (idCruza: string) => {
    const cruza = cruzasMap.get(idCruza);
    if (!cruza) return idCruza;
    return `${cruza.id} (${cruza.fechaCruza})`;
  };

  const filteredGestaciones = useMemo(() => {
    if (!searchTerm) return gestaciones;
    const term = searchTerm.toLowerCase();
    return gestaciones.filter((g) => {
      const cruzaInfo = getCruzaInfo(g.idCruza).toLowerCase();
      return (
        g.id.toLowerCase().includes(term) ||
        cruzaInfo.includes(term) ||
        (g.fechaColocarNidal || "").toLowerCase().includes(term) ||
        (g.fechaEstimadaParto || "").toLowerCase().includes(term)
      );
    });
  }, [gestaciones, searchTerm, cruzasMap]);

  const totalPages = Math.ceil(filteredGestaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGestaciones = filteredGestaciones.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Cargando gestaciones...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      {/* Header con búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, cruza o fechas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaSyncAlt />
          Actualizar
        </button>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/20">
              <th className="pb-3 text-gray-300 font-semibold">ID</th>
              <th className="pb-3 text-gray-300 font-semibold">Cruza</th>
              <th className="pb-3 text-gray-300 font-semibold">Fecha Nidal</th>
              <th className="pb-3 text-gray-300 font-semibold">Fecha Estimada Parto</th>
              <th className="pb-3 text-gray-300 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGestaciones.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  {searchTerm ? "No se encontraron gestaciones" : "No hay gestaciones registradas"}
                </td>
              </tr>
            ) : (
              paginatedGestaciones.map((g) => (
                <tr key={g.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 text-white font-mono">{g.id}</td>
                  <td className="py-3 text-gray-300">{getCruzaInfo(g.idCruza)}</td>
                  <td className="py-3 text-gray-300">{g.fechaColocarNidal || "-"}</td>
                  <td className="py-3 text-gray-300">{g.fechaEstimadaParto || "-"}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(g)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar gestación ${g.id}?`)) {
                            onDelete(g.id);
                          }
                        }}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedGestaciones.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {searchTerm ? "No se encontraron gestaciones" : "No hay gestaciones registradas"}
          </div>
        ) : (
          paginatedGestaciones.map((g) => (
            <div
              key={g.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-mono font-semibold">{g.id}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {getCruzaInfo(g.idCruza)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(g)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar gestación ${g.id}?`)) {
                        onDelete(g.id);
                      }
                    }}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <span className="font-semibold">Fecha Nidal:</span>{" "}
                  {g.fechaColocarNidal || "-"}
                </div>
                <div>
                  <span className="font-semibold">Fecha Estimada Parto:</span>{" "}
                  {g.fechaEstimadaParto || "-"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft />
          </button>
          <span className="text-white px-4">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}


