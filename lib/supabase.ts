import { createClient } from '@supabase/supabase-js';

// Tipos para la base de datos
export interface ConejoDB {
  id: string;
  raza: string;
  sexo: string;
  precio: number;
  tiene_descuento: boolean;
  fecha_nacimiento: string;
  disponibilidad: string;
  foto_principal: string;
  fotos_adicionales: string[];
  reproductor: boolean;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mapeo de DB a formato de la app
export interface Conejo {
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
  visible: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using fallback to JSON file.');
}

// Cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

// Función para mapear datos de DB a formato de la app
export function mapConejoDBToConejo(conejoDB: ConejoDB): Conejo {
  // Formatear fecha YYYY-MM-DD -> DD-MM-YYYY para mantener la UI consistente
  const iso = conejoDB.fecha_nacimiento;
  let fechaDMY = iso;
  if (iso && /\d{4}-\d{2}-\d{2}/.test(iso)) {
    const [y, m, d] = iso.split('-');
    fechaDMY = `${d}-${m}-${y}`;
  }

  return {
    id: conejoDB.id,
    raza: conejoDB.raza,
    sexo: conejoDB.sexo,
    precio: conejoDB.precio,
    tieneDescuento: conejoDB.tiene_descuento,
    fechaNacimiento: fechaDMY,
    disponibilidad: conejoDB.disponibilidad,
    fotoPrincipal: conejoDB.foto_principal,
    fotosAdicionales: conejoDB.fotos_adicionales || [],
    reproductor: conejoDB.reproductor,
    visible: conejoDB.visible ?? true, // Default true si no existe
  };
}

// Función para obtener todos los conejos desde Supabase
export async function getConejos(): Promise<Conejo[]> {
  // Si no hay credenciales de Supabase, retornar array vacío
  // El código usará el fallback al JSON
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('conejos')
      .select('*')
      .eq('visible', true) // Solo conejos visibles en el catálogo público
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conejos:', error);
      return [];
    }

    return (data || []).map(mapConejoDBToConejo);
  } catch (error) {
    console.error('Error in getConejos:', error);
    return [];
  }
}

// Función para obtener todos los conejos (incluyendo no visibles) - para admin
export async function getConejosAdmin(): Promise<Conejo[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('conejos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conejos:', error);
      return [];
    }

    return (data || []).map(mapConejoDBToConejo);
  } catch (error) {
    console.error('Error in getConejosAdmin:', error);
    return [];
  }
}

// Función para obtener un conejo por ID
export async function getConejoById(id: string): Promise<Conejo | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('conejos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching conejo:', error);
      return null;
    }

    return data ? mapConejoDBToConejo(data) : null;
  } catch (error) {
    console.error('Error in getConejoById:', error);
    return null;
  }
}

