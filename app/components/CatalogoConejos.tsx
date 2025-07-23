"use client";
import ConejoCard from "./ConejoCard";
import Image from "next/image";
import { Luckiest_Guy, Roboto } from "next/font/google";
import styles  from "../styles/home.module.css";

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
        <h1 className={`${luckiestGuy.className} ${styles.tituloGrande}`}>Catálogo de Conejos</h1>
        <p className={`${roboto.className} ${styles.tituloPequeno}`}>Criadero Lorenzo Rabbit</p>
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {conejos.map((conejo) => (
          <ConejoCard key={conejo.id} conejo={conejo} />
        ))}
      </div>
    </section>
  );
} 