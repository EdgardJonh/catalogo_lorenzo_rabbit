/**
 * Script para migrar datos del JSON a Supabase
 * 
 * Uso:
 * 1. Configura las variables de entorno en .env.local
 * 2. Ejecuta: npx ts-node scripts/migrate-to-supabase.ts
 * 
 * O usando tsx:
 * npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Preferir service role para migraciones (omite RLS). Si no está, usar anon key.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('💡 Crea un archivo .env.local con estas variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ConejoJSON {
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

function toISODateFromDMY(dmy: string): string {
  // Espera formato DD-MM-YYYY y devuelve YYYY-MM-DD
  // Maneja también DD/MM/YYYY por si acaso
  const norm = dmy.replace(/\//g, "-");
  const [dd, mm, yyyy] = norm.split("-");
  if (!dd || !mm || !yyyy) return dmy; // fallback sin romper
  return `${yyyy}-${mm}-${dd}`;
}

async function migrate() {
  console.log('🚀 Iniciando migración a Supabase...\n');

  // Leer el archivo JSON
  const jsonPath = path.join(process.cwd(), 'public', 'data', 'conejos.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ No se encontró el archivo: ${jsonPath}`);
    process.exit(1);
  }

  const conejosData: ConejoJSON[] = JSON.parse(
    fs.readFileSync(jsonPath, 'utf-8')
  );

  console.log(`📦 Encontrados ${conejosData.length} conejitos para migrar\n`);

  let success = 0;
  let errors = 0;

  // Migrar cada conejo
  for (const conejo of conejosData) {
    try {
      const fechaISO = toISODateFromDMY(conejo.fechaNacimiento);
      const { error } = await supabase.from('conejos').upsert({
        id: conejo.id,
        raza: conejo.raza,
        sexo: conejo.sexo,
        precio: conejo.precio,
        tiene_descuento: conejo.tieneDescuento,
        fecha_nacimiento: fechaISO,
        disponibilidad: conejo.disponibilidad,
        foto_principal: conejo.fotoPrincipal,
        fotos_adicionales: conejo.fotosAdicionales,
        reproductor: conejo.reproductor,
      }, {
        onConflict: 'id' // Si ya existe, actualiza
      });

      if (error) {
        console.error(`❌ Error en ${conejo.id}:`, error.message);
        errors++;
      } else {
        console.log(`✅ Migrado: ${conejo.id}`);
        success++;
      }
    } catch (error: any) {
      console.error(`❌ Error inesperado en ${conejo.id}:`, error.message);
      errors++;
    }
  }

  console.log('\n📊 Resumen de migración:');
  console.log(`✅ Exitosos: ${success}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📝 Total: ${conejosData.length}`);

  if (errors === 0) {
    console.log('\n🎉 ¡Migración completada exitosamente!');
  } else {
    console.log('\n⚠️  Algunos conejitos tuvieron errores. Revisa los mensajes arriba.');
  }
}

migrate().catch(console.error);

