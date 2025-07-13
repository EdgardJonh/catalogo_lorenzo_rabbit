"use client";
import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

export default function ConejoModal({ fotos, onClose, id }: { fotos: string[]; onClose: () => void; id: string }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? fotos.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === fotos.length - 1 ? 0 : i + 1));
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 relative max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Fotos de {id}</h3>
          <button
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        {/* Main Image */}
        <div className="relative mb-4">
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <Image
              src={fotos[index]}
              alt={`Foto ${index + 1} de ${id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={prev} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-blue-600 shadow-md transition-colors"
            aria-label="Foto anterior"
          >
            <FaChevronLeft size={16} />
          </button>
          <button 
            onClick={next} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-blue-600 shadow-md transition-colors"
            aria-label="Foto siguiente"
          >
            <FaChevronRight size={16} />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
            {index + 1} de {fotos.length}
          </div>
        </div>
        
        {/* Thumbnail Navigation */}
        <div className="flex gap-2 justify-center">
          {fotos.map((foto, i) => (
            <button
              key={i}
              className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                i === index 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={foto}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 