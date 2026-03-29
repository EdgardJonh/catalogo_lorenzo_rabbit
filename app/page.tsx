import Image from "next/image";
import CatalogoConejos from "./components/CatalogoConejos";
import conejosData from "../public/data/conejos.json";
import { getConejos } from "../lib/supabase";

// Forzar renderizado dinámico (sin caché) para que siempre muestre datos frescos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  // Supabase configurado: solo datos de la API (sin red / error → lista vacía, nunca JSON embebido).
  // Sin Supabase (p. ej. desarrollo local): fallback a public/data/conejos.json.
  let conejos: Conejo[] = [];
  let usandoSupabase = false;

  try {
    const conejosFromDB = await getConejos();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    usandoSupabase = !!(supabaseUrl && supabaseAnonKey);

    if (usandoSupabase) {
      conejos = conejosFromDB;
      console.log('✅ Usando datos de Supabase', conejos.length > 0 ? `(${conejos.length} conejos)` : '(todos ocultos)');
    } else {
      // Si Supabase no está configurado, usar JSON como fallback
      conejos = conejosData as Conejo[];
      console.log('📄 Usando datos del JSON (Supabase no configurado)');
    }
  } catch (error) {
    // En caso de error, verificar si Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    usandoSupabase = !!(supabaseUrl && supabaseAnonKey);
    
    if (usandoSupabase) {
      // Si hay error pero Supabase está configurado, usar array vacío (mostrar mensaje)
      conejos = [];
      console.log('⚠️ Error al obtener datos de Supabase, mostrando mensaje de no disponibles');
    } else {
      // Si Supabase no está configurado, usar JSON
      conejos = conejosData as Conejo[];
      console.log('📄 Usando datos del JSON (fallback por error)');
    }
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 p-8">
      <CatalogoConejos conejos={conejos} />
    </main>
  );
}
