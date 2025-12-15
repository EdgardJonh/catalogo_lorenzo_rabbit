# Configuración de Variables de Entorno en Vercel

Para que el panel de administración funcione correctamente en producción, necesitas configurar las siguientes variables de entorno en Vercel:

## Variables Requeridas

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Tu URL de Supabase (ejemplo: `https://xxxxx.supabase.co`)

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Tu clave pública (anon) de Supabase
   - Se encuentra en: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Tu clave de servicio (service_role) de Supabase
   - ⚠️ **IMPORTANTE**: Esta clave es muy sensible, nunca la expongas en el cliente
   - Se encuentra en: Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`

## Pasos para Configurar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto `catalogo-lorenzo-rabbit`
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable:
   - Click en **Add New**
   - Ingresa el **Name** (ej: `NEXT_PUBLIC_SUPABASE_URL`)
   - Ingresa el **Value** (tu valor de Supabase)
   - Selecciona los **Environments** donde aplicará:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (opcional)
   - Click en **Save**
5. Repite para las 3 variables

### Opción 2: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Configurar las variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## Después de Configurar

1. **Redesplegar la aplicación** para que los cambios surtan efecto:
   - Ve a tu proyecto en Vercel
   - Click en **Deployments**
   - Click en los 3 puntos (⋯) del último deployment
   - Selecciona **Redeploy**

   O simplemente haz un nuevo push a tu repositorio.

2. **Verificar que funcionen**:
   - Visita: https://catalogo-lorenzo-rabbit.vercel.app/admin
   - Deberías ver la pantalla de login
   - Ingresa con tus credenciales de Supabase

## Dónde Encontrar tus Credenciales de Supabase

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️) → **API**
4. Ahí encontrarás:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## Notas Importantes

- ⚠️ Las variables que empiezan con `NEXT_PUBLIC_` son públicas y se exponen al cliente
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` es privada y solo se usa en el servidor (API routes)
- 🔄 Después de agregar variables, siempre necesitas redesplegar
- ✅ Puedes verificar que las variables estén configuradas en: Settings → Environment Variables

