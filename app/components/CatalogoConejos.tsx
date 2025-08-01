"use client";
import ConejoCard from "./ConejoCard";
import Image from "next/image";
import { Luckiest_Guy, Roboto } from "next/font/google";
import VisitUs from "./VisitUs";
import styles  from "../styles/home.module.css";

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
}

interface CatalogoConejosProps {
  conejos: Conejo[];
}
  const luckiestGuy = Luckiest_Guy({
    subsets: ["latin"], 
    weight: "400",
  });
  const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"]
  });

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
        {/* Títulos con fuentes personalizadas */}
        <div className="">
           <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
        ¡Bienvenidos a <span className={`${luckiestGuy.className} text-4xl text-gray-50`}>LorenZo Rabbit</span>!
      </h1>
        {/* <h1 className={`${luckiestGuy.className} text-5xl text-gray-400 font-bold mb-0`}>LorenZo Rabbit</h1> */}
         <p className="text-gray-400 mb-6 w-96 mx-auto">
        Descubre el adorable mundo de nuestros conejitos y vive una experiencia única.
      </p>
      
        </div>
        
        {/* <p className={`${roboto.className} text-2xl text-gray-50 mb-2 mt-2`}>Catálogo de Conejos</p> */}
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {conejos.map((conejo) => (
          <ConejoCard key={conejo.id} conejo={conejo} />
        ))}
        
      </div>
      <div className="text-center mt-12">
        <VisitUs />
      </div>
      
    </section>
  );
} 