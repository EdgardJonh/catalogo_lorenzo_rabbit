# 📦 Instalación y Configuración de API con Supabase

## Paso 1: Instalar Dependencias

```bash
npm install @supabase/supabase-js dotenv
npm install -D @types/node ts-node tsx
```

## Paso 2: Configurar Supabase

1. **Crear cuenta en Supabase:**
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener credenciales:**
   - En tu proyecto de Supabase, ve a Settings > API
   - Copia:
     - Project URL
     - anon public key

3. **Crear archivo de variables de entorno:**
   
   Crea `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

## Paso 3: Crear la Tabla en Supabase

1. Ve a SQL Editor en tu dashboard de Supabase
2. Ejecuta este SQL:

```sql
-- Crear tabla conejos
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

-- Habilitar Row Level Security (RLS)
ALTER TABLE conejos ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer conejos
CREATE POLICY "Cualquiera puede leer conejos"
ON conejos FOR SELECT
USING (true);
```

## Paso 4: Migrar Datos del JSON

Ejecuta el script de migración:

```bash
# Opción 1: Con ts-node
npx ts-node scripts/migrate-to-supabase.ts

# Opción 2: Con tsx (recomendado)
npx tsx scripts/migrate-to-supabase.ts
```

## Paso 5: Verificar

1. En el dashboard de Supabase, ve a Table Editor
2. Deberías ver todos tus conejitos en la tabla `conejos`

## ✅ Listo!

Ahora tu aplicación está configurada para usar Supabase. El código automáticamente:
- Usará Supabase si está configurado
- Usará el JSON como fallback si no hay credenciales

## 🔒 Configuración de Autenticación (Opcional)

Si quieres que solo usuarios autenticados puedan modificar datos:

```sql
-- Política: Solo usuarios autenticados pueden modificar
CREATE POLICY "Solo admins pueden modificar"
ON conejos FOR ALL
USING (auth.role() = 'authenticated');
```

## 📱 Próximos Pasos

1. Crear panel de administración en `/app/admin/page.tsx`
2. Configurar autenticación para el admin
3. Crear formularios CRUD para gestionar conejos
4. Implementar upload de imágenes a Supabase Storage

