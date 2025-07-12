"use client";
import { useEffect, useState } from "react";
import ConejoCard from "./ConejoCard";

interface Conejo {
  id: string;
  raza: string;
  sexo: string;
  fechaNacimiento: string;
  fotoPrincipal: string;
  fotosAdicionales: string[];
}

export default function CatalogoConejos() {
  const [conejos, setConejos] = useState<Conejo[]>([]);

  useEffect(() => {
    fetch("/data/conejos.json")
      .then((res) => res.json())
      .then(setConejos);
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8 text-center">Catálogo de Conejos</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {conejos.map((conejo) => (
          <ConejoCard key={conejo.id} conejo={conejo} />
        ))}
      </div>
    </section>
  );
} 