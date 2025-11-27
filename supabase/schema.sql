-- Schema SQL para la tabla de conejos en Supabase
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Crear tabla conejos
CREATE TABLE IF NOT EXISTS conejos (
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
CREATE INDEX IF NOT EXISTS idx_reproductor ON conejos(reproductor);
CREATE INDEX IF NOT EXISTS idx_fecha_nacimiento ON conejos(fecha_nacimiento);
CREATE INDEX IF NOT EXISTS idx_disponibilidad ON conejos(disponibilidad);
CREATE INDEX IF NOT EXISTS idx_created_at ON conejos(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_conejos_updated_at ON conejos;
CREATE TRIGGER update_conejos_updated_at 
    BEFORE UPDATE ON conejos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE conejos ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer conejos (público)
DROP POLICY IF EXISTS "Cualquiera puede leer conejos" ON conejos;
CREATE POLICY "Cualquiera puede leer conejos"
ON conejos FOR SELECT
USING (true);

-- Política: Solo usuarios autenticados pueden modificar
-- (Comenta esto si quieres permitir modificaciones sin auth)
DROP POLICY IF EXISTS "Solo admins pueden modificar" ON conejos;
-- CREATE POLICY "Solo admins pueden modificar"
-- ON conejos FOR ALL
-- USING (auth.role() = 'authenticated');

-- Para permitir modificaciones sin autenticación (solo para desarrollo):
-- DROP POLICY IF EXISTS "Todos pueden modificar" ON conejos;
-- CREATE POLICY "Todos pueden modificar"
-- ON conejos FOR ALL
-- USING (true);

