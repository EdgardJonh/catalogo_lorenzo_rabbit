-- Agregar campo visible a la tabla conejos
-- Ejecuta este SQL en el SQL Editor de Supabase

ALTER TABLE conejos 
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_visible ON conejos(visible);

-- Comentario: Este campo controla si el conejo aparece en el catálogo público
-- true = visible en el catálogo
-- false = oculto del catálogo (solo visible en admin)

