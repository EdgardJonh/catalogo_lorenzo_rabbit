import Image from "next/image";
import CatalogoConejos from "./components/CatalogoConejos";
import conejosData from "../public/data/conejos.json";
import { getConejos } from "../lib/supabase";

// Tipos
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

export default async function Home() {
  // Intentar obtener conejos desde Supabase, si falla usar JSON
  let conejos: Conejo[] = [];
  
  try {
    const conejosFromDB = await getConejos();
    
    // Si hay datos en la DB y está configurada, usarlos
    if (conejosFromDB.length > 0) {
      conejos = conejosFromDB;
      console.log('✅ Usando datos de Supabase');
    } else {
      // Fallback al JSON
      conejos = conejosData as Conejo[];
      console.log('📄 Usando datos del JSON (fallback)');
    }
  } catch (error) {
    // En caso de error, usar JSON
    console.log('⚠️ Error al obtener datos de Supabase, usando JSON:', error);
    conejos = conejosData as Conejo[];
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 p-8">
      <CatalogoConejos conejos={conejos} />
    </main>
  );
}
