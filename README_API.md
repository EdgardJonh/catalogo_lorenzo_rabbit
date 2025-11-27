# 🐰 Sistema de API para Catálogo de Conejos

## 📚 Resumen

Este proyecto ahora soporta **dos modos de operación**:

1. **Modo API (Supabase)** - Datos en base de datos, administrable
2. **Modo JSON (Fallback)** - Datos estáticos del archivo JSON

El sistema automáticamente detecta qué modo usar basado en la configuración.

---

## 🚀 Inicio Rápido con Supabase

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta `supabase/schema.sql`
4. Ve a **Settings > API** y copia:
   - Project URL
   - anon public key

### 3. Configurar Variables de Entorno

Crea `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Migrar Datos

```bash
npm run migrate
```

### 5. Verificar

Inicia el servidor:

```bash
npm run dev
```

Si ves "✅ Usando datos de Supabase" en la consola, ¡está funcionando!

---

## 📁 Archivos Importantes

- `lib/supabase.ts` - Cliente y funciones de Supabase
- `app/page.tsx` - Página principal con fallback automático
- `scripts/migrate-to-supabase.ts` - Script de migración
- `supabase/schema.sql` - Schema de la base de datos
- `MIGRACION_API.md` - Guía completa de migración
- `INSTALACION_API.md` - Instrucciones de instalación

---

## 🔄 Cómo Funciona

### Modo API (Supabase configurado):
```typescript
const conejos = await getConejos(); // Desde Supabase
```

### Modo Fallback (Sin Supabase):
```typescript
import conejosData from '../public/data/conejos.json'; // Desde JSON
```

El código automáticamente usa el mejor método disponible.

---

## 🛠️ Operaciones Disponibles

### Obtener todos los conejos
```typescript
import { getConejos } from '@/lib/supabase';
const conejos = await getConejos();
```

### Obtener un conejo por ID
```typescript
import { getConejoById } from '@/lib/supabase';
const conejo = await getConejoById('C102');
```

### Crear/Actualizar (requiere auth)
```typescript
const { data, error } = await supabase
  .from('conejos')
  .upsert({
    id: 'C102',
    raza: 'Mini Lop',
    // ... otros campos
  });
```

---

## 📊 Estructura de la Base de Datos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT | ID único del conejo |
| `raza` | TEXT | Raza del conejo |
| `sexo` | TEXT | Macho/Hembra |
| `precio` | NUMERIC | Precio en CLP |
| `tiene_descuento` | BOOLEAN | Si tiene descuento |
| `fecha_nacimiento` | DATE | Fecha de nacimiento |
| `disponibilidad` | TEXT | Disponible/no Disponible |
| `foto_principal` | TEXT | URL de foto principal |
| `fotos_adicionales` | TEXT[] | Array de URLs |
| `reproductor` | BOOLEAN | Si es reproductor |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

---

## 🔐 Seguridad

Por defecto:
- ✅ **Todos pueden leer** conejos (público)
- ⚠️ **Modificaciones** requieren autenticación (configurable)

Para permitir modificaciones sin auth (solo desarrollo):
Ver `supabase/schema.sql` y descomentar la política "Todos pueden modificar"

---

## 🎯 Próximos Pasos

1. ✅ Configurar Supabase
2. ✅ Migrar datos
3. 🔄 Crear panel de administración (`/app/admin`)
4. 🔄 Implementar autenticación
5. 🔄 CRUD completo para conejos
6. 🔄 Upload de imágenes a Supabase Storage

---

## 💡 Ventajas de Supabase

- ✅ **Gratis** hasta cierto límite
- ✅ **Dashboard visual** para administrar datos
- ✅ **API REST automática**
- ✅ **Tiempo real** (opcional)
- ✅ **Storage** para imágenes
- ✅ **Autenticación** incluida
- ✅ **Escalable** cuando crezcas

---

## 🆘 Solución de Problemas

### Error: "Supabase credentials not found"
- Verifica que `.env.local` existe
- Verifica que las variables están correctas
- Reinicia el servidor después de agregar variables

### No se migran los datos
- Verifica las credenciales de Supabase
- Revisa que la tabla existe (SQL Editor)
- Verifica los permisos de RLS

### Usa JSON en lugar de Supabase
- Normal si no hay credenciales configuradas
- El sistema funciona con ambos métodos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `INSTALACION_API.md`
2. Revisa `MIGRACION_API.md`
3. Verifica la consola del navegador
4. Verifica los logs de Supabase

