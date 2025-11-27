# 🐰 Panel de Administración - Catálogo de Conejos

## 📍 Acceso

El panel está disponible en: `/admin`

Ejemplo: `http://localhost:3000/admin`

## 🔐 Autenticación

### Configuración Inicial

Crea o actualiza `.env.local`:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=tu_contraseña_segura_aqui
```

**Nota:** Por defecto, si no configuras la variable, la contraseña es `admin123`

### 🔒 Seguridad

⚠️ **Importante:** Esta es una autenticación básica. Para producción, considera:

1. **Usar Supabase Auth** (recomendado)
2. Implementar JWT tokens
3. Agregar rate limiting
4. Usar HTTPS siempre

---

## 🎯 Funcionalidades

### ✅ CRUD Completo

- **Crear** nuevos conejitos
- **Leer** lista de todos los conejitos
- **Actualizar** información existente
- **Eliminar** conejitos (con confirmación)

### 🔍 Búsqueda

Busca conejitos por:
- ID
- Raza
- Sexo

### 📊 Vista de Tabla

Información visible:
- ID del conejo
- Raza
- Sexo
- Precio (con indicador de descuento)
- Fecha de nacimiento
- Disponibilidad
- Estado reproductor

---

## 📝 Uso del Formulario

### Campos Obligatorios (*)

- **ID**: Identificador único (ej: C102)
- **Raza**: Nombre de la raza
- **Foto Principal**: Ruta a la imagen principal

### Campos Opcionales

- **Sexo**: Macho/Hembra
- **Precio**: Precio en CLP
- **Tiene Descuento**: Checkbox para activar -30%
- **Fecha de Nacimiento**: Fecha en formato DD-MM-YYYY
- **Disponibilidad**: Disponible / No Disponible
- **Es Reproductor**: Checkbox
- **Fotos Adicionales**: Una por línea

### Ejemplo de Fotos Adicionales:

```
/images/conejos/BlackFire/Conejo1/DSC_0256.webp
/images/conejos/BlackFire/Conejo1/DSC_0257.webp
/images/conejos/BlackFire/Conejo1/DSC_0258.webp
```

---

## 🎨 Interfaz

### Diseño Moderno

- Fondo degradado oscuro
- Glassmorphism (efecto vidrio)
- Transiciones suaves
- Responsive (móvil y desktop)

### Navegación

- **+ Nuevo Conejito**: Abre formulario de creación
- **Editar** (ícono azul): Edita un conejo existente
- **Eliminar** (ícono rojo): Elimina un conejo (con confirmación)
- **Actualizar**: Recarga la lista desde la base de datos
- **Salir**: Cierra sesión

---

## 🚀 Próximas Mejoras

- [ ] Upload de imágenes directamente desde el panel
- [ ] Integración con Supabase Storage
- [ ] Autenticación robusta con Supabase Auth
- [ ] Historial de cambios
- [ ] Filtros avanzados
- [ ] Exportar datos (CSV/JSON)
- [ ] Vista previa de imágenes
- [ ] Validación más robusta
- [ ] Modo oscuro/claro

---

## 💡 Tips

1. **ID único**: Asegúrate de usar IDs únicos. El sistema genera uno automáticamente al crear, pero puedes cambiarlo.

2. **Formato de fecha**: Usa formato DD-MM-YYYY (ej: 14-06-2025)

3. **Rutas de imágenes**: Las rutas deben ser relativas desde `/public` (ej: `/images/conejos/...`)

4. **Backup**: Antes de hacer cambios masivos, haz backup de tu base de datos

5. **Validación**: El formulario valida campos obligatorios antes de guardar

---

## 🐛 Solución de Problemas

### "Error al guardar"
- Verifica que todos los campos obligatorios estén completos
- Revisa que el ID sea único
- Verifica la conexión con Supabase

### "No se cargan los conejos"
- Verifica las credenciales de Supabase en `.env.local`
- Revisa que la tabla `conejos` exista
- Verifica los permisos de RLS en Supabase

### "No puedo eliminar"
- Verifica que tengas permisos en Supabase
- Revisa las políticas de RLS

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica los logs de Supabase
3. Revisa la configuración de `.env.local`

