"use client";
import { useState } from "react";
import ConejoCard from "./ConejoCard";
import Image from "next/image";
import { Luckiest_Guy, Roboto } from "next/font/google";
import VisitUs from "./VisitUs";
import styles  from "../styles/home.module.css";
// import Festividad from "./Festividad";
import Direccion from "./Direccion";
import CatalogoMenu from "./CatalogoMenu";

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

type SeccionCatalogo = "todos" | "reproductores" | "nueva-camada" | "otros";

export default function CatalogoConejos({ conejos }: CatalogoConejosProps) {
  const [seccionActiva, setSeccionActiva] = useState<SeccionCatalogo>("todos");

  // Separar conejitos: reproductores, nueva camada y resto
  const reproductores = conejos.filter(conejo => conejo.reproductor === true);
  const conejosVenta = conejos.filter(conejo => conejo.reproductor === false);
  const nuevaCamada = conejosVenta.filter(conejo => conejo.fechaNacimiento === "14-06-2025");
  const restoConejos = conejosVenta.filter(conejo => conejo.fechaNacimiento !== "14-06-2025");

  // Contadores para el menú
  const contadores = {
    todos: conejos.length,
    reproductores: reproductores.length,
    nuevaCamada: nuevaCamada.length,
    otros: restoConejos.length,
  };

  // Determinar qué secciones mostrar según la selección
  const mostrarReproductores = seccionActiva === "todos" || seccionActiva === "reproductores";
  const mostrarNuevaCamada = seccionActiva === "todos" || seccionActiva === "nueva-camada";
  const mostrarOtros = seccionActiva === "todos" || seccionActiva === "otros";

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
        <div className="text-center mb-4">
           <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
        ¡Bienvenidos a <span className={`${luckiestGuy.className} text-4xl text-gray-50`}>LorenZo Rabbit</span>!
      </h1>
        {/* <h1 className={`${luckiestGuy.className} text-5xl text-gray-400 font-bold mb-0`}>LorenZo Rabbit</h1> */}
         <p className="text-gray-400 mb-6  mx-auto">
        Descubre el adorable mundo de nuestros conejitos y vive una experiencia única.
      </p>
      
        </div>
        
        {/* <p className={`${roboto.className} text-2xl text-gray-50 mb-2 mt-2`}>Catálogo de Conejos</p> */}
      </div>
      {/* Titulo de catalogo */}
      <h2 className={`${luckiestGuy.className} text-3xl md:text-4xl font-bold text-gray-50 mb-6 text-center`}>
        Catálogo de <span className={`${luckiestGuy.className} text-3xl md:text-4xl font-bold text-purple-400 mb-6`}>Conejos</span>
      </h2>
      <div >
        {/* <Festividad /> */}
      </div>
      <div className="max-w-6xl mx-auto pb-3  px-4 sm:px-6 lg:px-8">
         <Direccion />
         
         </div>

      {/* Menú de Navegación */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <CatalogoMenu
          seccionActiva={seccionActiva}
          onSeccionChange={setSeccionActiva}
          contadores={contadores}
        />
      </div>
     
      {/* Conejitos Reproductores */}
      {mostrarReproductores && reproductores.length > 0 && (
        <div className="mb-12 bg-gradient-to-r from-purple-900/20 to-indigo-800/20 rounded-xl p-8 border border-purple-500/40">
          <h3 className={`${luckiestGuy.className} text-2xl md:text-3xl font-bold text-purple-400 mb-6 text-center`}>
            🐇 Conejitos Reproductores 🐇
          </h3>
          <p className="text-center text-gray-300 mb-6 text-sm md:text-base">
            Nuestros reproductores de excelente calidad genética
          </p>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {reproductores.map((conejo) => (
              <ConejoCard key={conejo.id} conejo={conejo} />
            ))}
          </div>
        </div>
      )}

      {/* Nueva Camada Disponible */}
      {mostrarNuevaCamada && nuevaCamada.length > 0 && (
        <div className="mb-12 bg-gradient-to-r from-green-900/20 to-emerald-800/20 rounded-xl p-8 border border-green-500/40">
          <h3 className={`${luckiestGuy.className} text-2xl md:text-3xl font-bold text-green-400 mb-6 text-center`}>
            🐰 Nueva Camada Disponible 🐰
          </h3>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {nuevaCamada.map((conejo) => (
              <ConejoCard key={conejo.id} conejo={conejo} />
            ))}
          </div>
        </div>
      )}

      {/* Resto de Conejos */}
      {mostrarOtros && restoConejos.length > 0 && (
        <div>
          <h3 className={`${luckiestGuy.className} text-2xl md:text-3xl font-bold text-gray-50 mb-6 text-center`}>
            Otros Conejitos Disponibles
          </h3>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {restoConejos.map((conejo) => (
              <ConejoCard key={conejo.id} conejo={conejo} />
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center mt-12">
        <VisitUs />
      </div>
      
    </section>
  );
} 