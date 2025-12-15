"use client";
import { Cruza, Conejo } from "../../../lib/supabase";
import { FaEdit, FaTrash, FaSyncAlt, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";

interface AdminCruzaListProps {
  cruzas: Cruza[];
  conejos: Conejo[];
  loading: boolean;
  onEdit: (cruza: Cruza) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function AdminCruzaList({
  cruzas,
  conejos,
  loading,
  onEdit,
  onDelete,
  onRefresh,
}: AdminCruzaListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Crear mapa de conejos para búsqueda rápida
  const conejosMap = useMemo(() => {
    const map = new Map<string, Conejo>();
    conejos.forEach((c) => map.set(c.id, c));
    return map;
  }, [conejos]);

  // Función para obtener nombre del conejo
  const getConejoInfo = (id: string) => {
    const conejo = conejosMap.get(id);
    return conejo ? `${conejo.id} - ${conejo.raza}` : id;
  };

  // Función para obtener color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "en_proceso":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "completada":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "cancelada":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  const filteredCruzas = useMemo(() => {
    if (!searchTerm) return cruzas;
    
    const term = searchTerm.toLowerCase();
    return cruzas.filter((cruza) => {
      const padre = getConejoInfo(cruza.idPadre).toLowerCase();
      const madre = getConejoInfo(cruza.idMadre).toLowerCase();
      return (
        cruza.id.toLowerCase().includes(term) ||
        padre.includes(term) ||
        madre.includes(term) ||
        cruza.estado.toLowerCase().includes(term) ||
        cruza.fechaCruza.toLowerCase().includes(term)
      );
    });
  }, [cruzas, searchTerm, conejosMap]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredCruzas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCruzas = filteredCruzas.slice(startIndex, endIndex);

  // Resetear página cuando cambia el filtro
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
        <p className="text-white">Cargando cruzas...</p>
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
            placeholder="Buscar por ID, padre, madre o estado..."
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
              <th className="pb-3 text-gray-300 font-semibold">Padre</th>
              <th className="pb-3 text-gray-300 font-semibold">Madre</th>
              <th className="pb-3 text-gray-300 font-semibold">Fecha Cruza</th>
              <th className="pb-3 text-gray-300 font-semibold">Parto Esperado</th>
              <th className="pb-3 text-gray-300 font-semibold">Parto Real</th>
              <th className="pb-3 text-gray-300 font-semibold">Estado</th>
              <th className="pb-3 text-gray-300 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCruzas.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  {searchTerm ? "No se encontraron cruzas" : "No hay cruzas registradas"}
                </td>
              </tr>
            ) : (
              paginatedCruzas.map((cruza) => (
                <tr key={cruza.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 text-white font-mono">{cruza.id}</td>
                  <td className="py-3 text-gray-300">{getConejoInfo(cruza.idPadre)}</td>
                  <td className="py-3 text-gray-300">{getConejoInfo(cruza.idMadre)}</td>
                  <td className="py-3 text-gray-300">{cruza.fechaCruza}</td>
                  <td className="py-3 text-gray-300">
                    {cruza.fechaPartoEsperado || "-"}
                  </td>
                  <td className="py-3 text-gray-300">
                    {cruza.fechaPartoReal || "-"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs border ${getEstadoColor(
                        cruza.estado
                      )}`}
                    >
                      {cruza.estado.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(cruza)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar cruza ${cruza.id}?`)) {
                            onDelete(cruza.id);
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
        {paginatedCruzas.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {searchTerm ? "No se encontraron cruzas" : "No hay cruzas registradas"}
          </div>
        ) : (
          paginatedCruzas.map((cruza) => (
            <div
              key={cruza.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-mono font-semibold">{cruza.id}</h3>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs border ${getEstadoColor(
                      cruza.estado
                    )}`}
                  >
                    {cruza.estado.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(cruza)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar cruza ${cruza.id}?`)) {
                        onDelete(cruza.id);
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
                  <span className="font-semibold">Padre:</span> {getConejoInfo(cruza.idPadre)}
                </div>
                <div>
                  <span className="font-semibold">Madre:</span> {getConejoInfo(cruza.idMadre)}
                </div>
                <div>
                  <span className="font-semibold">Fecha Cruza:</span> {cruza.fechaCruza}
                </div>
                {cruza.fechaPartoEsperado && (
                  <div>
                    <span className="font-semibold">Parto Esperado:</span> {cruza.fechaPartoEsperado}
                  </div>
                )}
                {cruza.fechaPartoReal && (
                  <div>
                    <span className="font-semibold">Parto Real:</span> {cruza.fechaPartoReal}
                  </div>
                )}
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

