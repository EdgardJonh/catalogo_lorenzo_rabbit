"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from "react-icons/fa";
import Image from "next/image";

export default function ConejoModal({ fotos, onClose, id }: { fotos: string[]; onClose: () => void; id: string }) {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  
  const prev = () => setIndex((i) => (i === 0 ? fotos.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === fotos.length - 1 ? 0 : i + 1));
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };



  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          prev();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 't':
        case 'T':
          setShowThumbnails(!showThumbnails);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showThumbnails]);

  // Reset loading state when image changes
  useEffect(() => {
    setIsLoading(true);
  }, [index]);

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (index + 1) % fotos.length;
      const prevIndex = index === 0 ? fotos.length - 1 : index - 1;
      
      // Preload next image
      const nextImg = new window.Image();
      nextImg.src = fotos[nextIndex];
      
      // Preload previous image
      const prevImg = new window.Image();
      prevImg.src = fotos[prevIndex];
    };

    preloadImages();
  }, [index, fotos]);
  
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isFullscreen 
          ? 'bg-black' 
          : 'bg-black bg-opacity-80 backdrop-blur-sm'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`relative transition-all duration-300 ${
        isFullscreen 
          ? 'w-full h-full max-w-none max-h-none' 
          : 'max-w-6xl w-full mx-4 max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 transition-all duration-300 ${
          isFullscreen ? 'bg-black bg-opacity-50' : 'bg-white rounded-t-xl shadow-lg'
        }`}>
          <div className="flex items-center gap-4">
            <h3 className={`text-lg font-bold ${isFullscreen ? 'text-white' : 'text-gray-800'}`}>
              {id} - Foto {index + 1} de {fotos.length}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-2 rounded-full transition-colors ${
                isFullscreen 
                  ? 'hover:bg-white hover:bg-opacity-20 text-white' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle thumbnails"
            >
              <span className="text-xs font-medium">T</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-full transition-colors ${
                isFullscreen 
                  ? 'hover:bg-white hover:bg-opacity-20 text-white' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
            </button>
            <button
              className={`p-2 rounded-full transition-colors ${
                isFullscreen 
                  ? 'hover:bg-white hover:bg-opacity-20 text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
              }`}
              onClick={onClose}
              aria-label="Cerrar"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>
        
        {/* Main Image Container */}
        <div className={`relative transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full pt-16 pb-20' 
            : 'bg-white rounded-xl shadow-2xl mt-16 mb-20'
        }`}>
          <div className={`relative w-full transition-all duration-300 ${
            isFullscreen ? 'h-full' : 'h-[70vh]'
          }`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
            <Image
              src={fotos[index]}
              alt={`Foto ${index + 1} de ${id}`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes={isFullscreen ? "100vw" : "(max-width: 768px) 100vw, 600px"}
              priority
              onLoad={() => setIsLoading(false)}
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
          
          {/* Navigation Buttons */}
          {fotos.length > 1 && (
            <>
              <button 
                onClick={prev} 
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-200 ${
                  isFullscreen
                    ? 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
                    : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 hover:text-blue-600'
                } shadow-lg hover:shadow-xl`}
                aria-label="Foto anterior"
              >
                <FaChevronLeft size={20} />
              </button>
              <button 
                onClick={next} 
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-200 ${
                  isFullscreen
                    ? 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
                    : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 hover:text-blue-600'
                } shadow-lg hover:shadow-xl`}
                aria-label="Foto siguiente"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnail Navigation */}
        {showThumbnails && fotos.length > 1 && (
          <div className={`absolute bottom-0 left-0 right-0 z-10 p-4 transition-all duration-300 ${
            isFullscreen 
              ? 'bg-black bg-opacity-50' 
              : 'bg-white rounded-b-xl shadow-lg'
          }`}>
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
              {fotos.map((foto, i) => (
                <button
                  key={i}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === index 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-300 hover:border-blue-300 hover:scale-105'
                  }`}
                  onClick={() => setIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <Image
                    src={foto}
                    alt={`Miniatura ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    quality={50}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        {!isFullscreen && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div>← → Navegar</div>
            <div>F Pantalla completa</div>
            <div>T Thumbnails</div>
            <div>ESC Cerrar</div>
          </div>
        )}
      </div>
    </div>
  );
} 