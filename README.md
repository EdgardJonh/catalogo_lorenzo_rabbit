# 🐰 Catálogo de Conejos - Next.js

Un catálogo web moderno y responsivo para mostrar conejos disponibles, desarrollado con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Características

- **Catálogo interactivo** de conejos con fotos y detalles
- **Diseño responsivo** que se adapta a diferentes dispositivos
- **Modal de detalles** para ver información completa de cada conejo
- **Filtros por raza y sexo** para facilitar la búsqueda
- **Interfaz moderna** con Tailwind CSS
- **Optimización de imágenes** con Next.js Image

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **React Icons** - Iconografía
- **Fontsource Inter** - Tipografía optimizada

## 📦 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/catalogo-conejos.git
cd catalogo-conejos
```

2. **Instala las dependencias:**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecuta el servidor de desarrollo:**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abre [http://localhost:3000](http://localhost:3000)** en tu navegador para ver el resultado.

## 📁 Estructura del Proyecto

```
catalogo-conejos/
├── app/
│   ├── components/          # Componentes React
│   │   ├── CatalogoConejos.tsx
│   │   ├── ConejoCard.tsx
│   │   └── ConejoModal.tsx
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── public/
│   ├── data/
│   │   └── conejos.json    # Datos de los conejos
│   └── images/             # Imágenes de los conejos
└── package.json
```

## 🎨 Personalización

Los datos de los conejos se encuentran en `public/data/conejos.json`. Puedes agregar, modificar o eliminar conejos editando este archivo.

## 🚀 Despliegue

### Vercel (Recomendado)
La forma más fácil de desplegar tu aplicación Next.js es usar [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Otros proveedores
Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request.

---

Desarrollado con ❤️ usando Next.js
