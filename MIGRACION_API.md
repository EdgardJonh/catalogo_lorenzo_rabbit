# 🚀 Guía de Migración: JSON a API para Administración de Conejos

## 📋 Opciones Recomendadas

### 1. **Supabase** ⭐ (RECOMENDADO)
**Ventajas:**
- ✅ Gratis para empezar (500MB base de datos, 1GB storage)
- ✅ Fácil integración con Next.js
- ✅ Incluye autenticación lista para usar
- ✅ API REST automática
- ✅ Storage para imágenes
- ✅ Dashboard visual para administración
- ✅ Cliente TypeScript incluido

**Ideal para:** Proyectos que necesitan una solución completa y rápida

### 2. **Next.js API Routes + Prisma + PostgreSQL**
**Ventajas:**
- ✅ Control total sobre la API
- ✅ Type-safe con Prisma
- ✅ Puedes usar PostgreSQL gratis (Neon, Supabase, Railway)
- ✅ Sin dependencias externas

**Ideal para:** Desarrolladores que quieren más control y flexibilidad

### 3. **MongoDB Atlas + Mongoose**
**Ventajas:**
- ✅ Base de datos NoSQL flexible
- ✅ Gratis hasta 512MB
- ✅ Fácil integración
- ✅ Bueno para datos no estructurados

**Ideal para:** Proyectos que prefieren NoSQL

### 4. **Firebase/Firestore**
**Ventajas:**
- ✅ Muy popular
- ✅ Tiempo real
- ✅ Buena documentación
- ⚠️ Puede ser más costoso a largo plazo

**Ideal para:** Proyectos que necesitan tiempo real

---

## 🎯 Implementación Recomendada: Supabase

### Paso 1: Instalación

```bash
npm install @supabase/supabase-js
npm install @supabase/ssr  # Para Next.js
```

### Paso 2: Configuración

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Obtener las credenciales (URL y anon key)

### Paso 3: Estructura de Base de Datos

```sql
-- Tabla conejos
CREATE TABLE conejos (
  id TEXT PRIMARY KEY,
  raza TEXT NOT NULL,
  sexo TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  tiene_descuento BOOLEAN DEFAULT false,
  fecha_nacimiento DATE NOT NULL,
  disponibilidad TEXT NOT NULL,
  foto_principal TEXT NOT NULL,
  fotos_adicionales TEXT[] DEFAULT '{}',
  reproductor BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_reproductor ON conejos(reproductor);
CREATE INDEX idx_fecha_nacimiento ON conejos(fecha_nacimiento);
CREATE INDEX idx_disponibilidad ON conejos(disponibilidad);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conejos_updated_at BEFORE UPDATE
    ON conejos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Paso 4: Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE conejos ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer conejos
CREATE POLICY "Cualquiera puede leer conejos"
ON conejos FOR SELECT
USING (true);

-- Política: Solo usuarios autenticados pueden escribir
CREATE POLICY "Solo admins pueden modificar"
ON conejos FOR ALL
USING (auth.role() = 'authenticated');
```

---

## 📁 Estructura de Archivos Sugerida

```
app/
├── api/
│   └── conejos/
│       └── route.ts          # API routes (si usas Next.js API)
├── lib/
│   └── supabase.ts          # Cliente de Supabase
├── admin/                    # Panel de administración (futuro)
│   └── page.tsx
└── components/
    └── ...
```

---

## 🔄 Migración de Datos

Script para migrar datos del JSON a Supabase:

```typescript
// scripts/migrate-to-supabase.ts
import { createClient } from '@supabase/supabase-js';
import conejosData from '../public/data/conejos.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function migrate() {
  for (const conejo of conejosData) {
    const { error } = await supabase.from('conejos').insert({
      id: conejo.id,
      raza: conejo.raza,
      sexo: conejo.sexo,
      precio: conejo.precio,
      tiene_descuento: conejo.tieneDescuento,
      fecha_nacimiento: conejo.fechaNacimiento,
      disponibilidad: conejo.disponibilidad,
      foto_principal: conejo.fotoPrincipal,
      fotos_adicionales: conejo.fotosAdicionales,
      reproductor: conejo.reproductor,
    });

    if (error) {
      console.error(`Error insertando ${conejo.id}:`, error);
    } else {
      console.log(`✅ Migrado: ${conejo.id}`);
    }
  }
}

migrate();
```

---

## 🎨 Panel de Administración (Futuro)

Con Supabase puedes crear fácilmente:
- Dashboard en `/admin` para CRUD de conejos
- Autenticación con email/password o OAuth
- Upload de imágenes directamente a Supabase Storage
- Gestión de disponibilidad en tiempo real

---

## 💡 Próximos Pasos

1. ✅ Configurar Supabase (esta guía)
2. 🔄 Crear client de Supabase
3. 🔄 Migrar datos del JSON
4. 🔄 Actualizar componentes para usar API
5. 🔄 Crear panel de administración

---

¿Quieres que implemente la solución con Supabase ahora?

