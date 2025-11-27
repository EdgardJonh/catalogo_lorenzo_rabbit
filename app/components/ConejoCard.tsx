"use client";
import { useState, useEffect } from "react";
import { FaCamera, FaTag, FaVenusMars, FaCalendarAlt, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import ConejoModal from "./ConejoModal";

interface Conejo {
  id: string;
  raza: string;
  sexo: string;
  precio: number;
  tieneDescuento: boolean;
  fechaNacimiento: string;
  disponibilidad: string;
  fotoPrincipal: string;
  fotosAdicionales: string[];
  reproductor: boolean;
}

export default function ConejoCard({ conejo }: { conejo: Conejo }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isDisponible = conejo.disponibilidad === "Disponible";

  // Manejo del historial para el modal
  useEffect(() => {
    if (!modalOpen) return;
    // Agrega un estado al historial al abrir el modal
    window.history.pushState({ modal: true }, "");
    const handlePopState = (e: PopStateEvent) => {
      setModalOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Si el modal se cierra por otro medio, retrocede el historial si el estado es modal
      if (window.history.state && window.history.state.modal) {
        window.history.back();
      }
    };
  }, [modalOpen]);

  const openPhotoModal = () => {
    if (isDisponible) {
      setModalOpen(true);
    }
  };

  const handleReservar = () => {
    if (!isDisponible) return;
    
    const confirmacion = `¿Usted a seleccionado el conejito ${conejo.id}? Está seguro de hacer la reserva?

🐰 *Conejito seleccionado:*
• ID: ${conejo.id}
• Raza: ${conejo.raza}
• Precio: ${formatoCLP(precioConDescuento)}
• Fecha de nacimiento: ${conejo.fechaNacimiento}
• Disponibilidad: ${conejo.disponibilidad}

Al confirmar, se abrirá WhatsApp para completar la reserva.`;

    if (window.confirm(confirmacion)) {
      const mensaje = `¡Hola! Me interesa reservar el conejito ${conejo.id} 🐰

📋 *Información del conejito:*
• ID: ${conejo.id}
• Raza: ${conejo.raza}
• Sexo: ${conejo.sexo}
• Fecha de nacimiento: ${conejo.fechaNacimiento}
• Precio: ${formatoCLP(precioConDescuento)}
• Disponibilidad: ${conejo.disponibilidad}

¿Está disponible para reserva? ¡Gracias! 😊`;

      const numeroWhatsApp = "+56992977211"; // Reemplaza con el número real
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(mensaje)}`;
      
      window.open(urlWhatsApp, '_blank');
    }
  };

  const formatoCLP = (valor: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(valor);
  // Precio con decuento
  const precioDes = 0.30 * conejo.precio;
  const precioConDescuento:number  = conejo.tieneDescuento ? (conejo.precio - precioDes): (conejo.precio);

  return (
    <div className={`bg-white rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition-shadow ${
      !isDisponible ? 'opacity-60' : ''
    }`}>
      <div className="relative w-full">
        <div 
          className={`relative w-full h-72 cursor-pointer transition-transform hover:scale-105 ${
            !isDisponible ? 'cursor-not-allowed' : ''
          }`}
          onClick={openPhotoModal}
        >
          <Image
            src={conejo.fotoPrincipal}
            alt={`Foto principal de ${conejo.id}`}
            fill
            className={`object-cover ${
              !isDisponible ? 'grayscale' : ''
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
            loading="lazy"
            unoptimized
          />
        </div>
        {conejo.tieneDescuento && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-xl text-xs">
            -30%
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
          isDisponible 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {conejo.disponibilidad}
        </div>
        {isDisponible && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            Click para ver fotos
          </div>
        )}
      </div>
      <div className="w-full text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 tracking-wide">{conejo.id}</h2>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-center space-x-2">
            <FaMapMarkerAlt className="text-blue-500 text-sm" />
            <p className="text-gray-700 font-medium">Raza: <span className="font-semibold text-gray-900">{conejo.raza}</span></p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <FaVenusMars className="text-pink-500 text-sm" />
            <p className="text-gray-700 font-medium">Sexo: <span className="font-semibold text-gray-900">{conejo.sexo}</span></p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <FaCalendarAlt className="text-green-500 text-sm" />
            <p className="text-gray-700 font-medium">Nacimiento: <span className="font-semibold text-gray-900">{conejo.fechaNacimiento}</span></p>
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center">
          {conejo.tieneDescuento ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <FaTag className="text-orange-500 text-sm" />
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  -30%
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {formatoCLP(conejo.precio)}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatoCLP(precioConDescuento)}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-green-600">
              {formatoCLP(conejo.precio)}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          <button
            className={`px-4 py-2 rounded-4xl flex items-center gap-2 transition-all duration-300 mx-auto font-bold text-base border-b-[8px] border-t-[1px] border-x-[3px] ${
              isDisponible 
                ? 'bg-yellow-400 text-black border-gray-800 hover:bg-yellow-300 hover:shadow-lg transform hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
            }`}
            onClick={() => isDisponible && setModalOpen(true)}
            disabled={!isDisponible}
          >
            <FaCamera className="text-sm" /> {isDisponible ? 'Ver más fotos' : 'No disponible'}
          </button>
          
          <button
            className={`px-4 py-2 rounded-4xl flex items-center gap-2 transition-all duration-300 mx-auto font-bold text-base border-b-[8px] border-t-[1px] border-x-[3px] ${
              isDisponible 
                ? 'bg-violet-500 text-white border-violet-700 hover:bg-violet-600 hover:shadow-lg transform hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
            }`}
            onClick={handleReservar}
            disabled={!isDisponible}
          >
            <FaWhatsapp className="text-sm" /> {isDisponible ? 'Reservar' : 'No disponible'}
          </button>
        </div>
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