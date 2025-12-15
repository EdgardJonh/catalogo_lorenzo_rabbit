import { createClient } from '@supabase/supabase-js';

// Tipos para la base de datos
export type CategoriaConejo = 'reproductor' | 'ventas' | 'padre' | 'madre';

export interface ConejoDB {
  id: string;
  raza: string;
  sexo: string;
  precio: number;
  tiene_descuento: boolean;
  porcentaje_descuento?: number;
  fecha_nacimiento: string;
  disponibilidad: string;
  foto_principal: string;
  fotos_adicionales: string[];
  reproductor: boolean;
  categoria?: CategoriaConejo;
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
  porcentajeDescuento?: number;
  fechaNacimiento: string;
  disponibilidad: string;
  fotoPrincipal: string;
  fotosAdicionales: string[];
  reproductor: boolean;
  categoria?: CategoriaConejo;
  visible: boolean;
}

// Tipos para cruzas
export type EstadoCruza = 'programada' | 'en_proceso' | 'completada' | 'cancelada';

export interface CruzaDB {
  id: string;
  id_padre: string;
  id_madre: string;
  fecha_cruza: string;
  fecha_parto_esperado?: string;
  fecha_parto_real?: string;
  estado: EstadoCruza;
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Cruza {
  id: string;
  idPadre: string;
  idMadre: string;
  fechaCruza: string;
  fechaPartoEsperado?: string;
  fechaPartoReal?: string;
  estado: EstadoCruza;
  notas?: string;
  // Datos relacionados (opcionales, se cargan cuando se necesitan)
  padre?: Conejo;
  madre?: Conejo;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Función para obtener el cliente de Supabase (lazy initialization)
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
}

// Cliente de Supabase (solo se crea si hay credenciales)
// Puede ser null si las credenciales no están configuradas
export const supabase = getSupabaseClient();

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
    porcentajeDescuento: conejoDB.porcentaje_descuento ?? (conejoDB.tiene_descuento ? 30 : 0),
    fechaNacimiento: fechaDMY,
    disponibilidad: conejoDB.disponibilidad,
    fotoPrincipal: conejoDB.foto_principal,
    fotosAdicionales: conejoDB.fotos_adicionales || [],
    reproductor: conejoDB.reproductor,
    categoria: conejoDB.categoria || 'ventas',
    visible: conejoDB.visible ?? true, // Default true si no existe
  };
}

// Función para mapear datos de DB a formato de la app (cruzas)
export function mapCruzaDBToCruza(cruzaDB: CruzaDB): Cruza {
  // Formatear fechas YYYY-MM-DD -> DD-MM-YYYY
  const formatDate = (iso?: string): string | undefined => {
    if (!iso) return undefined;
    if (/\d{4}-\d{2}-\d{2}/.test(iso)) {
      const [y, m, d] = iso.split('-');
      return `${d}-${m}-${y}`;
    }
    return iso;
  };

  return {
    id: cruzaDB.id,
    idPadre: cruzaDB.id_padre,
    idMadre: cruzaDB.id_madre,
    fechaCruza: formatDate(cruzaDB.fecha_cruza) || cruzaDB.fecha_cruza,
    fechaPartoEsperado: formatDate(cruzaDB.fecha_parto_esperado),
    fechaPartoReal: formatDate(cruzaDB.fecha_parto_real),
    estado: cruzaDB.estado,
    notas: cruzaDB.notas,
  };
}

// Función para obtener todos los conejos desde Supabase
export async function getConejos(): Promise<Conejo[]> {
  // Si no hay credenciales de Supabase, retornar array vacío
  // El código usará el fallback al JSON
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
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
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
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
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
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

// Funciones para obtener conejos por categoría (para selección en cruzas)
export async function getConejosPorCategoria(categoria: CategoriaConejo): Promise<Conejo[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('conejos')
      .select('*')
      .eq('categoria', categoria)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching conejos por categoria:', error);
      return [];
    }

    return (data || []).map(mapConejoDBToConejo);
  } catch (error) {
    console.error('Error in getConejosPorCategoria:', error);
    return [];
  }
}

// Obtener machos para cruzas (padres)
export async function getMachosParaCruza(): Promise<Conejo[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('conejos')
      .select('*')
      .eq('sexo', 'Macho')
      .in('categoria', ['reproductor', 'padre'])
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching machos para cruza:', error);
      return [];
    }

    return (data || []).map(mapConejoDBToConejo);
  } catch (error) {
    console.error('Error in getMachosParaCruza:', error);
    return [];
  }
}

// Obtener hembras para cruzas (madres)
export async function getHembrasParaCruza(): Promise<Conejo[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('conejos')
      .select('*')
      .eq('sexo', 'Hembra')
      .in('categoria', ['reproductor', 'madre'])
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching hembras para cruza:', error);
      return [];
    }

    return (data || []).map(mapConejoDBToConejo);
  } catch (error) {
    console.error('Error in getHembrasParaCruza:', error);
    return [];
  }
}

// Funciones para cruzas
export async function getCruzas(): Promise<Cruza[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('cruzas')
      .select('*')
      .order('fecha_cruza', { ascending: false });

    if (error) {
      console.error('Error fetching cruzas:', error);
      return [];
    }

    return (data || []).map(mapCruzaDBToCruza);
  } catch (error) {
    console.error('Error in getCruzas:', error);
    return [];
  }
}

export async function getCruzaById(id: string): Promise<Cruza | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('cruzas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching cruza:', error);
      return null;
    }

    return data ? mapCruzaDBToCruza(data) : null;
  } catch (error) {
    console.error('Error in getCruzaById:', error);
    return null;
  }
}

