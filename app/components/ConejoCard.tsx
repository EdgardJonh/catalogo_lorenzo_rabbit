"use client";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import ConejoModal from "@components/ConejoModal";

interface Conejo {
  id: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  fotoPrincipal: string;
  fotosAdicionales: string[];
}

export default function ConejoCard({ conejo }: { conejo: Conejo }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
      <img
        src={conejo.fotoPrincipal}
        alt={`Foto principal de ${conejo.id}`}
        className="w-40 h-40 object-cover rounded-lg mb-4 border"
      />
      <div className="w-full text-center">
        <h2 className="text-xl font-semibold mb-1">{conejo.id}</h2>
        <p className="text-gray-600 mb-1">Raza: <span className="font-medium">{conejo.raza}</span></p>
        <p className="text-gray-600 mb-1">Sexo: <span className="font-medium">{conejo.sexo}</span></p>
        <p className="text-gray-600 mb-2">Nacimiento: <span className="font-medium">{conejo.fechaNacimiento}</span></p>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors mx-auto"
          onClick={() => setModalOpen(true)}
        >
          <FaCamera /> Ver más fotos
        </button>
      </div>
      {modalOpen && (
        <ConejoModal
          fotos={[conejo.fotoPrincipal, ...conejo.fotosAdicionales]}
          onClose={() => setModalOpen(false)}
          id={conejo.id}
        />
      )}
    </div>
  );
} 