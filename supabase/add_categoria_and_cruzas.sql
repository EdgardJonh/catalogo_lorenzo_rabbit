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

-- 3. Crear tabla gestaciones
CREATE TABLE IF NOT EXISTS gestaciones (
  id TEXT PRIMARY KEY,
  id_cruza TEXT NOT NULL REFERENCES cruzas(id) ON DELETE CASCADE,
  fecha_colocar_nidal DATE,
  fecha_estimada_parto DATE,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas rápidas por cruza
CREATE INDEX IF NOT EXISTS idx_gestaciones_cruza ON gestaciones(id_cruza);

-- 4. Crear tabla partos
CREATE TABLE IF NOT EXISTS partos (
  id TEXT PRIMARY KEY,
  id_cruza TEXT NOT NULL REFERENCES cruzas(id) ON DELETE CASCADE,
  fecha_parto DATE NOT NULL,
  gazapos_totales INT,
  gazapos_vivos INT,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas rápidas por cruza
CREATE INDEX IF NOT EXISTS idx_partos_cruza ON partos(id_cruza);

-- 5. Triggers OPCIONALES para calcular fechas en gestaciones
-- Estos triggers rellenan automáticamente:
--   - fecha_estimada_parto = fecha_cruza + 30 días
--   - fecha_colocar_nidal  = fecha_cruza + 26 días
-- si esos campos vienen NULL al insertar/actualizar una gestación.

-- Función para calcular fechas de gestación basadas en la cruza
CREATE OR REPLACE FUNCTION calcular_fechas_gestacion()
RETURNS TRIGGER AS $$
DECLARE
  v_fecha_cruza DATE;
BEGIN
  -- Obtener fecha_cruza de la tabla cruzas
  SELECT fecha_cruza INTO v_fecha_cruza
  FROM cruzas
  WHERE id = NEW.id_cruza;

  -- Si no se encuentra la cruza, no modificar
  IF v_fecha_cruza IS NULL THEN
    RETURN NEW;
  END IF;

  -- Calcular fechas solo si vienen nulas
  IF NEW.fecha_estimada_parto IS NULL THEN
    NEW.fecha_estimada_parto = v_fecha_cruza + INTERVAL '30 days';
  END IF;

  IF NEW.fecha_colocar_nidal IS NULL THEN
    NEW.fecha_colocar_nidal = v_fecha_cruza + INTERVAL '26 days';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger OPCIONAL: descomenta estas líneas si quieres que se apliquen automáticamente
-- DROP TRIGGER IF EXISTS trg_calcular_fechas_gestacion ON gestaciones;
-- CREATE TRIGGER trg_calcular_fechas_gestacion
--   BEFORE INSERT OR UPDATE ON gestaciones
--   FOR EACH ROW
--   EXECUTE FUNCTION calcular_fechas_gestacion();


