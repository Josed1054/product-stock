Prueba Técnica – Frontend React (Productos con JWT)

Este proyecto implementa un frontend en Next.js (React + TypeScript) que consume un microservicio de productos protegido con JWT (con opción de API mock en desarrollo). Incluye autenticación (Bearer), CRUD básico, validaciones y pruebas.

Características clave
- Autenticación por token (JWT) pegado/ingresado manualmente, con botón para generar un token de demostración.
- Axios con interceptores: agrega Authorization y maneja 401 (redirige a `/login`).
- Listado de productos, creación y actualización de stock.
- Validación con React Hook Form + Zod.
- Estado y fetching con TanStack Query.
- Pruebas con Jest + React Testing Library.
- UI en modo oscuro y textos en español.

Requisitos
- Node 18+
- Variables de entorno en `.env`

Variables de entorno (.env / .env.example)
- `NEXT_PUBLIC_USE_MOCK_API` (1/0): usa endpoints mock de Next.js en `/api/*`. Por defecto 1 en desarrollo.
- `NEXT_PUBLIC_API_BASE_URL`: URL base del backend real (ej. `http://localhost:3001`).
- `VITE_API_BASE_URL`: alternativa compatible si prefieres prefijo `VITE_`.
- `MOCK_JWT_SECRET`: secreto para firmar/verificar tokens del API mock (solo server-side).

Cómo corre la API (mock vs real)
- Mock (recomendado para desarrollo):
  - `NEXT_PUBLIC_USE_MOCK_API=1` → las rutas `/api/products` y `/api/auth/*` son servidas por Next.js.
  - Endpoints mock: `app/api/products/*`, `app/api/auth/token`, `app/api/auth/verify`.
- Backend real:
  - `NEXT_PUBLIC_USE_MOCK_API=0`, configura `NEXT_PUBLIC_API_BASE_URL` (o `VITE_API_BASE_URL`).
  - Next.js reescribe `/api/*` → `${BASE_URL}/api/*` (ver `next.config.ts`).

Instalación
1) Copiar `.env.example` a `.env` y definir variables según tu escenario (mock o real).
2) Instalar dependencias: `npm install`
3) Ejecutar en desarrollo: `npm run dev`

Uso
- Abrir `http://localhost:3000/login`.
  - Opción token de demo: botón “Generar” para obtener un JWT válido del mock API y “Usar” para pegarlo.
  - También puedes pegar tu propio JWT (sin el prefijo `Bearer`).
- Ir a `Productos` para:
  - Ver el listado (nombre, precio, stock).
  - Crear productos (validaciones: nombre obligatorio, precio > 0, stock >= 0, enteros por defecto).
  - Actualizar stock desde la lista (diálogo dedicado).
  - Ver feedback de éxito/error (los banners se ocultan solos tras unos segundos).

Endpoints
- Base configurable: `NEXT_PUBLIC_API_BASE_URL` o `VITE_API_BASE_URL` (si usas backend real).
- `GET /api/products` – listar productos.
- `POST /api/products` – crear producto. Body: `{ name, price, stock }`.
- `PUT /api/products/{id}/stock?stock={n}` – actualizar stock.
- Mock extra: `GET /api/auth/token` devuelve un JWT de demostración.

Scripts
- `npm run dev` – servidor de desarrollo.
- `npm run build` – build de producción.
- `npm start` – iniciar build.
- `npm test` – ejecutar pruebas.

Pruebas incluidas
- Unit: `ProductForm` (submit correcto, validaciones y reset del formulario).
- Integration-like: `ProductList` con mock de Axios (carga y render de filas).
- Errores: banner de error en `ProductList` y auto-cierre tras 4s.

Estructura relevante
- API cliente: `src/api/client.ts`, `src/api/products.ts`
- Auth: `src/auth/authStore.ts`, `src/auth/LoginPage.tsx`
- Productos (UI): `src/features/products/*`
- Mock store: `src/mocks/productsStore.ts`
- Proveedor React Query: `src/providers/QueryProvider.tsx`
- Rutas mock Next API: `app/api/products/*`, `app/api/auth/*`

Detalles técnicos
- Interceptor Axios añade `Authorization: Bearer <token>` si existe en `localStorage`.
- Si hay 401 se limpia el token y se redirige a `/login`.
- En el navegador, Axios usa base relativa y Next.js hace proxy vía `rewrites`.
- Formularios con RHF + Zod; `noValidate` para evitar validación nativa del navegador.
- Textareas no son redimensionables y los inputs deshabilitan `autocomplete`.

Notas
- El token se guarda en `localStorage` como `token`.
- Para cambiar entre mock y backend real, modifica `NEXT_PUBLIC_USE_MOCK_API` y reinicia `npm run dev`.
