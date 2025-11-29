-- Agregar columna porcentaje_descuento a la tabla conejos
ALTER TABLE conejos 
ADD COLUMN IF NOT EXISTS porcentaje_descuento NUMERIC(5,2) DEFAULT 0;

-- Actualizar registros existentes: si tiene_descuento es true, establecer porcentaje_descuento a 30
UPDATE conejos 
SET porcentaje_descuento = 30 
WHERE tiene_descuento = true AND (porcentaje_descuento IS NULL OR porcentaje_descuento = 0);

-- Crear índice si es necesario (opcional)
CREATE INDEX IF NOT EXISTS idx_porcentaje_descuento ON conejos(porcentaje_descuento);

