"use client";
import { Conejo } from "../../../lib/supabase";
import { FaEdit, FaTrash, FaSyncAlt, FaSearch, FaEye, FaEyeSlash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";

interface AdminConejoListProps {
  conejos: Conejo[];
  loading: boolean;
  onEdit: (conejo: Conejo) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onToggleVisible: (id: string, visible: boolean) => void;
}

export default function AdminConejoList({
  conejos,
  loading,
  onEdit,
  onDelete,
  onRefresh,
  onToggleVisible,
}: AdminConejoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingVisible, setUpdatingVisible] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredConejos = useMemo(() => 
    conejos.filter(
      (conejo) =>
        conejo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conejo.raza.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conejo.sexo.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [conejos, searchTerm]
  );

  // Calcular paginación
  const totalPages = Math.ceil(filteredConejos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedConejos = filteredConejos.slice(startIndex, endIndex);

  // Resetear página cuando cambia el filtro o si la página actual es mayor que el total de páginas
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const formatoCLP = (valor: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(valor);

  const handleToggleVisible = async (conejo: Conejo) => {
    const newVisible = !conejo.visible;
    setUpdatingVisible(conejo.id);
    try {
      await onToggleVisible(conejo.id, newVisible);
    } finally {
      setUpdatingVisible(null);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Cargando conejitos...</p>
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
            placeholder="Buscar por ID, raza o sexo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <FaSyncAlt /> Actualizar
        </button>
        <div className="text-white font-semibold text-sm md:text-base">
          Total: {filteredConejos.length} conejitos
          {filteredConejos.length > itemsPerPage && (
            <span className="text-gray-400 ml-2">
              (Página {currentPage} de {totalPages})
            </span>
          )}
        </div>
      </div>

      {/* Lista de conejos - Vista Desktop (Tabla) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="pb-3 text-white font-semibold">ID</th>
              <th className="pb-3 text-white font-semibold">Raza</th>
              <th className="pb-3 text-white font-semibold">Sexo</th>
              <th className="pb-3 text-white font-semibold">Precio</th>
              <th className="pb-3 text-white font-semibold">Nacimiento</th>
              <th className="pb-3 text-white font-semibold">Estado</th>
              <th className="pb-3 text-white font-semibold">Reproductor</th>
              <th className="pb-3 text-white font-semibold">Visible</th>
              <th className="pb-3 text-white font-semibold text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedConejos.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-300">
                  No se encontraron conejitos
                </td>
              </tr>
            ) : (
              paginatedConejos.map((conejo) => (
                <tr
                  key={conejo.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 text-white font-mono">{conejo.id}</td>
                  <td className="py-4 text-gray-300">{conejo.raza}</td>
                  <td className="py-4 text-gray-300">{conejo.sexo}</td>
                  <td className="py-4 text-green-400 font-semibold">
                    {formatoCLP(conejo.precio)}
                    {conejo.tieneDescuento && (
                      <span className="ml-2 text-xs text-red-400">
                        -{((conejo as any).porcentajeDescuento ?? 30)}%
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-gray-300">
                    {conejo.fechaNacimiento}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        conejo.disponibilidad === "Disponible"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {conejo.disponibilidad}
                    </span>
                  </td>
                  <td className="py-4">
                    {conejo.reproductor ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white">
                        Sí
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        conejo.visible
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {conejo.visible ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleVisible(conejo)}
                        disabled={updatingVisible === conejo.id}
                        className={`p-2 rounded-lg transition-colors ${
                          conejo.visible
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={conejo.visible ? "Ocultar del catálogo" : "Mostrar en catálogo"}
                      >
                        {updatingVisible === conejo.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : conejo.visible ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(conejo)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(conejo.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
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

      {/* Lista de conejos - Vista Mobile (Cards) */}
      <div className="md:hidden space-y-4">
        {paginatedConejos.length === 0 ? (
          <div className="py-8 text-center text-gray-300">
            No se encontraron conejitos
          </div>
        ) : (
          paginatedConejos.map((conejo) => (
            <div
              key={conejo.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-mono font-bold text-lg">{conejo.id}</h3>
                  <p className="text-gray-300 text-sm">{conejo.raza}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleVisible(conejo)}
                    disabled={updatingVisible === conejo.id}
                    className={`p-2 rounded-lg transition-colors ${
                      conejo.visible
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={conejo.visible ? "Ocultar" : "Mostrar"}
                  >
                    {updatingVisible === conejo.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : conejo.visible ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(conejo)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(conejo.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Sexo:</span>
                  <span className="text-white ml-2">{conejo.sexo}</span>
                </div>
                <div>
                  <span className="text-gray-400">Nacimiento:</span>
                  <span className="text-white ml-2">{conejo.fechaNacimiento}</span>
                </div>
                <div>
                  <span className="text-gray-400">Precio:</span>
                  <span className="text-green-400 font-semibold ml-2">
                    {formatoCLP(conejo.precio)}
                    {conejo.tieneDescuento && (
                      <span className="ml-1 text-xs text-red-400">
                        -{((conejo as any).porcentajeDescuento ?? 30)}%
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Estado:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      conejo.disponibilidad === "Disponible"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {conejo.disponibilidad}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Reproductor:</span>
                  {conejo.reproductor ? (
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white">
                      Sí
                    </span>
                  ) : (
                    <span className="text-gray-400 ml-2">No</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Visible:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      conejo.visible
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {conejo.visible ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white text-sm">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredConejos.length)} de {filteredConejos.length} conejitos
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Página anterior"
            >
              <FaChevronLeft />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Página siguiente"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

