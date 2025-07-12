"use client";
import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ConejoModal({ fotos, onClose, id }: { fotos: string[]; onClose: () => void; id: string }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? fotos.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === fotos.length - 1 ? 0 : i + 1));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-bg">
      <div className="bg-white rounded-xl shadow-lg p-6 relative max-w-md w-full flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>
        <h3 className="text-lg font-bold mb-4">Fotos de {id}</h3>
        <div className="flex items-center gap-4">
          <button onClick={prev} className="text-2xl text-gray-400 hover:text-blue-500"><FaChevronLeft /></button>
          <img
            src={fotos[index]}
            alt={`Foto ${index + 1} de ${id}`}
            className="w-64 h-64 object-cover rounded-lg border"
          />
          <button onClick={next} className="text-2xl text-gray-400 hover:text-blue-500"><FaChevronRight /></button>
        </div>
        <div className="flex gap-2 mt-4">
          {fotos.map((foto, i) => (
            <button
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${i === index ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'}`}
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 