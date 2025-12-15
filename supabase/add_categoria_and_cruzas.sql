-- Script para agregar campo categoria a conejos y crear tabla cruzas
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Agregar campo categoria a la tabla conejos
ALTER TABLE conejos 
ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'ventas';

-- Actualizar valores existentes basados en el campo reproductor
UPDATE conejos 
SET categoria = CASE 
  WHEN reproductor = true THEN 'reproductor'
  ELSE 'ventas'
END
WHERE categoria IS NULL OR categoria = 'ventas';

-- Agregar constraint para validar valores permitidos
ALTER TABLE conejos 
ADD CONSTRAINT check_categoria 
CHECK (categoria IN ('reproductor', 'ventas', 'padre', 'madre'));

-- Crear índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_categoria ON conejos(categoria);

-- 2. Crear tabla cruzas
CREATE TABLE IF NOT EXISTS cruzas (
  id TEXT PRIMARY KEY,
  id_padre TEXT NOT NULL REFERENCES conejos(id) ON DELETE RESTRICT,
  id_madre TEXT NOT NULL REFERENCES conejos(id) ON DELETE RESTRICT,
  fecha_cruza DATE NOT NULL,
  fecha_parto_esperado DATE,
  fecha_parto_real DATE,
  estado TEXT NOT NULL DEFAULT 'programada',
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_estado CHECK (estado IN ('programada', 'en_proceso', 'completada', 'cancelada')),
  CONSTRAINT check_padre_madre_diferentes CHECK (id_padre != id_madre)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_cruzas_padre ON cruzas(id_padre);
CREATE INDEX IF NOT EXISTS idx_cruzas_madre ON cruzas(id_madre);
CREATE INDEX IF NOT EXISTS idx_cruzas_fecha ON cruzas(fecha_cruza DESC);
CREATE INDEX IF NOT EXISTS idx_cruzas_estado ON cruzas(estado);

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_cruzas_updated_at ON cruzas;
CREATE TRIGGER update_cruzas_updated_at 
    BEFORE UPDATE ON cruzas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE cruzas ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer cruzas (público)
DROP POLICY IF EXISTS "Cualquiera puede leer cruzas" ON cruzas;
CREATE POLICY "Cualquiera puede leer cruzas"
ON cruzas FOR SELECT
USING (true);

-- Política: Solo usuarios autenticados pueden modificar cruzas
-- (Ajusta según tu configuración de RLS)
-- DROP POLICY IF EXISTS "Solo admins pueden modificar cruzas" ON cruzas;
-- CREATE POLICY "Solo admins pueden modificar cruzas"
-- ON cruzas FOR ALL
-- USING (auth.role() = 'authenticated');

