"use client";
import ConejoCard from "./ConejoCard";
import Image from "next/image";

interface Conejo {
  id: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  disponibilidad: string;
  fotoPrincipal: string;
  fotosAdicionales: string[];
}

interface CatalogoConejosProps {
  conejos: Conejo[];
}

export default function CatalogoConejos({ conejos }: CatalogoConejosProps) {
  return (
    <section>
      {/* Header con Logo */}
      <div className="text-center mb-8">
        {/* Logo del Criadero con fondo circular naranja */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center rounded-full bg-orange-500 w-28 h-28">
            <Image
              src="/logos/logo.png"
              alt="Logo del Criadero"
              width={90}
              height={90}
              className="h-20 w-20"
              priority
            />
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">Catálogo de Conejos</h1>
        <p className="text-gray-300 text-lg">Criadero Lorenzo Rabbit</p>
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {conejos.map((conejo) => (
          <ConejoCard key={conejo.id} conejo={conejo} />
        ))}
      </div>
    </section>
  );
} 