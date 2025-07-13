"use client";
import { useState } from "react";
import { FaCamera, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ConejoModal from "./ConejoModal";

interface Conejo {
  id: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  disponibilidad: string;
  fotoPrincipal: string;
  fotosAdicionales: string[];
}

export default function ConejoCard({ conejo }: { conejo: Conejo }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isDisponible = conejo.disponibilidad === "Disponible";
  
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all duration-300 cursor-pointer ${
        !isDisponible ? 'opacity-60' : ''
      } ${isExpanded ? 'scale-105 shadow-xl' : ''}`}
      onClick={toggleExpansion}
    >
      <div className="relative w-full">
        <img
          src={conejo.fotoPrincipal}
          alt={`Foto principal de ${conejo.id}`}
          className={`w-40 h-40 object-cover rounded-lg mb-4 border mx-auto ${
            !isDisponible ? 'grayscale' : ''
          }`}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
          isDisponible 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {conejo.disponibilidad}
        </div>
        <button 
          className="absolute top-2 left-2 p-1 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
      </div>
      
      <div className="w-full text-center">
        <h2 className="text-xl font-semibold mb-1">{conejo.id}</h2>
        <p className="text-gray-600 mb-1">Raza: <span className="font-medium">{conejo.raza}</span></p>
        <p className="text-gray-600 mb-1">Sexo: <span className="font-medium">{conejo.sexo}</span></p>
        <p className="text-gray-600 mb-2">Nacimiento: <span className="font-medium">{conejo.fechaNacimiento}</span></p>
        
        {/* Información expandida */}
        {isExpanded && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 mb-2">Información Detallada</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {conejo.id}</p>
              <p><strong>Raza:</strong> {conejo.raza}</p>
              <p><strong>Sexo:</strong> {conejo.sexo}</p>
              <p><strong>Fecha de Nacimiento:</strong> {conejo.fechaNacimiento}</p>
              <p><strong>Estado:</strong> {conejo.disponibilidad}</p>
              <p><strong>Fotos disponibles:</strong> {conejo.fotosAdicionales.length + 1}</p>
            </div>
          </div>
        )}
        
        <button
          className={`mt-2 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto ${
            isDisponible 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isDisponible) {
              setModalOpen(true);
            }
          }}
          disabled={!isDisponible}
        >
          <FaCamera /> {isDisponible ? 'Ver más fotos' : 'No disponible'}
        </button>
      </div>
      
      {modalOpen && isDisponible && (
        <ConejoModal
          fotos={[conejo.fotoPrincipal, ...conejo.fotosAdicionales]}
          onClose={() => setModalOpen(false)}
          id={conejo.id}
        />
      )}
    </div>
  );
} 