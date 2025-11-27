# 📘 Guía Paso a Paso: Crear Cuenta y Configurar Supabase

## ✅ ¿Necesito crear cuenta en Supabase?

**Sí, pero es GRATUITO y fácil.** Puedes:
- Crear cuenta gratis
- O usar el modo JSON mientras decides (el código funciona con ambos)

---

## 🚀 Paso a Paso: Crear Cuenta en Supabase

### Paso 1: Crear Cuenta
1. Ve a [https://supabase.com](https://supabase.com)
2. Click en **"Start your project"** o **"Sign up"**
3. Elige registrarte con:
   - GitHub (recomendado si tienes cuenta)
   - Email
   - Google

### Paso 2: Crear Proyecto
1. Click en **"New Project"**
2. Completa el formulario:
   - **Name**: `catalogo-conejos` (o el nombre que quieras)
   - **Database Password**: Crea una contraseña fuerte (guárdala, la necesitarás)
   - **Region**: Elige la más cercana (ej: South America si estás en Chile)
   - **Pricing Plan**: Selecciona **Free**
3. Click en **"Create new project"**
4. ⏳ Espera 1-2 minutos mientras se crea el proyecto

### Paso 3: Obtener Credenciales
1. Una vez creado, ve a **Settings** (ícono de engranaje) en el menú lateral
2. Click en **API**
3. Copia estos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

### Paso 4: Configurar Variables de Entorno
1. En tu proyecto, crea el archivo `.env.local` (si no existe)
2. Agrega estas líneas:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
NEXT_PUBLIC_ADMIN_PASSWORD=tu_contraseña_admin
```

### Paso 5: Crear la Base de Datos
1. En Supabase, ve a **SQL Editor** (ícono de terminal en el menú)
2. Click en **New Query**
3. Copia TODO el contenido de `supabase/schema.sql`
4. Pégalo en el editor
5. Click en **Run** (o presiona Ctrl+Enter)
6. Deberías ver: "Success. No rows returned"

### Paso 6: Migrar Datos
1. En tu terminal, ejecuta:
```bash
npm install
npm run migrate
```
2. Si todo va bien, verás: `✅ Migrado: C102`, etc.

### Paso 7: Verificar
1. En Supabase, ve a **Table Editor** (ícono de tabla)
2. Click en la tabla `conejos`
3. Deberías ver todos tus conejitos

### Paso 8: Probar el Panel Admin
1. Ejecuta: `npm run dev`
2. Ve a: `http://localhost:3000/admin`
3. Ingresa la contraseña que configuraste en `NEXT_PUBLIC_ADMIN_PASSWORD`

---

## 🆓 Plan Gratuito de Supabase

**Incluye:**
- ✅ 500 MB de base de datos
- ✅ 1 GB de almacenamiento de archivos
- ✅ 2 GB de ancho de banda
- ✅ 50,000 usuarios activos al mes
- ✅ APIs ilimitadas

**Suficiente para:**
- Miles de conejitos
- Muchas fotos
- Muchos usuarios

---

## ❓ ¿Puedo usar el proyecto SIN Supabase?

**¡Sí!** El código tiene **fallback automático**:

- Si **NO configuras** Supabase → Usa el archivo JSON
- Si **configuras** Supabase → Usa la base de datos

**El panel de admin NO funcionará sin Supabase**, pero el catálogo público sí.

---

## 🆘 Problemas Comunes

### "No puedo crear cuenta"
- Prueba con otro método (GitHub, Google, Email)
- Verifica que no tengas cuenta existente con ese email

### "No veo el botón Create Project"
- Asegúrate de estar logueado
- Revisa que hayas verificado tu email

### "Error al ejecutar SQL"
- Verifica que copiaste TODO el archivo `schema.sql`
- Asegúrate de que no haya errores de sintaxis
- Intenta ejecutarlo línea por línea si es necesario

### "Error al migrar datos"
- Verifica que `.env.local` tenga las credenciales correctas
- Asegúrate de que la tabla `conejos` exista
- Revisa que las políticas RLS permitan inserción

---

## 💡 Recomendaciones

1. **Guarda tus credenciales** en un lugar seguro
2. **No compartas** tu `anon key` públicamente
3. **Usa contraseñas fuertes** para el proyecto y el admin
4. **Prueba primero** con datos de prueba antes de migrar todo

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la documentación de Supabase
2. Revisa los logs en la consola del navegador
3. Verifica que todos los pasos se completaron correctamente

---

## ✨ Una vez configurado

Podrás:
- ✅ Administrar conejitos desde el panel web
- ✅ Los cambios se reflejan automáticamente en el catálogo
- ✅ Tener backup automático en la nube
- ✅ Escalar cuando crezcas

¡Es gratis empezar y muy fácil de usar! 🎉


