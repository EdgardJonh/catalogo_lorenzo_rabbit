"use client";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import Image from "next/image";
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
  const isDisponible = conejo.disponibilidad === "Disponible";
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow ${
      !isDisponible ? 'opacity-60' : ''
    }`}>
      <div className="relative">
        <div className="relative w-40 h-40 mb-4">
          <Image
            src={conejo.fotoPrincipal}
            alt={`Foto principal de ${conejo.id}`}
            fill
            className={`object-cover rounded-lg border ${
              !isDisponible ? 'grayscale' : ''
            }`}
            sizes="160px"
            priority={false}
            loading="lazy"
          />
        </div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
          isDisponible 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {conejo.disponibilidad}
        </div>
      </div>
      <div className="w-full text-center">
        <h2 className="text-xl font-semibold mb-1">{conejo.id}</h2>
        <p className="text-gray-600 mb-1">Raza: <span className="font-medium">{conejo.raza}</span></p>
        <p className="text-gray-600 mb-1">Sexo: <span className="font-medium">{conejo.sexo}</span></p>
        <p className="text-gray-600 mb-2">Nacimiento: <span className="font-medium">{conejo.fechaNacimiento}</span></p>
        <button
          className={`mt-2 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto ${
            isDisponible 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          onClick={() => isDisponible && setModalOpen(true)}
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