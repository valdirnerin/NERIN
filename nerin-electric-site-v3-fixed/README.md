# NERIN Electric · Sitio corporativo y portal operativo

Proyecto completo basado en **Next.js 14 (App Router)** + **TypeScript** para comunicar los servicios eléctricos de NERIN, administrar contenido y operar el portal de clientes. Incluye integraciones con Prisma/PostgreSQL, NextAuth (magic link), Mercado Pago, RESEND y generación de PDFs para presupuestos.

## Características principales

- **Front público** minimalista (tipo Notion/Apple) con Tailwind y componentes accesibles.
- **Secciones**: Home, Packs eléctricos, Presupuestador, Planes de mantenimiento, Servicios, Obras, Empresa, Blog, FAQ, Contacto, Legales.
- **Presupuestador** en 4 pasos con validaciones, cálculo de mano de obra y generación de PDF (server side con PDFKit).
- **Portal de clientes** con aprobación manual, proyectos, certificados de avance pagables vía Mercado Pago y facturas.
- **Panel admin** para CRUD de packs, adicionales, planes, casos de éxito y emisión de certificados.
- **Autenticación** con NextAuth (magic link por RESEND) y roles `admin`, `cliente`, `tecnico`.
- **Base de datos** Prisma + PostgreSQL con seeds realistas (packs, adicionales, planes, casos, proyecto demo, admin/cliente).
- **DevOps**: Dockerfile listo para Render, scripts de seed, healthcheck y documentación de despliegue.
- **Calidad**: ESLint, Prettier, Vitest (lógica de configurador), Playwright (smoke E2E). Lighthouse objetivo ≥95 (ejecutar manualmente sobre `npm run build && npm run start`).

## Requisitos

- Node.js 20+
- PostgreSQL 15+ (local o gestionado)
- Cuenta RESEND y credenciales Mercado Pago (modo test para sandbox)

## Configuración inicial

```bash
cp .env.example .env
# editar con tus claves: DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY, MP_ACCESS_TOKEN, etc.
npm install
```

### Base de datos

```bash
npx prisma migrate dev --name init
npm run db:seed
```

> **Nota:** el seed crea un admin (`admin@nerin.com.ar`) y un cliente demo (`cliente@demo.com`). La autenticación es por magic link, por lo que basta con ingresar esos correos para recibir el enlace (en modo mock se loguea en consola si no configuraste RESEND real).

## Scripts principales

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Dev server en `http://localhost:3000` |
| `npm run build` | Build de producción (incluye `prisma generate`) |
| `npm run start` | Inicia servidor productivo (`next start`) |
| `npm run lint` | ESLint con reglas de Next |
| `npm test` | Vitest (unitarios) |
| `npx playwright test` | Pruebas E2E (requiere app corriendo en otra terminal) |
| `npm run db:seed` | Ejecuta `prisma/seed.ts` |
| `npm run format` | Prettier |

> Durante `npm install` se reportan vulnerabilidades conocidas de dependencias transitivas. Evaluá `npm audit` y planes de mitigación antes de producción.

## Arquitectura

- `/app` rutas App Router. Marketing y portal conviven, con protección mediante middleware + NextAuth.
- `/components` UI reutilizable (botones, cards, acordeones, etc.) y configurador.
- `/lib` utilidades (Prisma singleton, auth, seguridad, Mercado Pago, Resend, PDF, storage).
- `/prisma` schema, migraciones y seed.
- `/tests` unitarios (Vitest) + E2E (Playwright).
- `/content` blog semilla en archivos.

### Tokens de diseño (Tailwind)

- Colores expuestos como CSS vars `--color-*` en `app/globals.css`.
- Container centrado con padding fluido, sombras sutiles (`shadow-subtle`) y tipografía Inter/Sora.

## Integraciones

### NextAuth + RESEND

`lib/auth.ts` configura proveedor Email. En modo desarrollo sin `RESEND_API_KEY` válido se hace log vía consola (mock) para continuar.

### Mercado Pago

- Checkout para mantenimiento: `/api/mantenimiento/checkout?plan=slug` crea preferencia y redirige.
- Webhook `/api/mercadopago/webhook` valida firma simple (`MERCADOPAGO_WEBHOOK_SECRET`) y marca certificados/planes como pagados.
- Certificados se crean desde `/admin` y deben actualizarse con `mpInitPointUrl` (se guarda automáticamente en el flow de checkout de mantenimiento; para certificados de obra manuales se debe completar vía panel).

### PDFs

`lib/pdf.ts` genera el PDF del presupuestador. El endpoint `/api/quotes/[id]/pdf` entrega el archivo.

### Emails

`lib/resend.ts` encapsula envío. En modo mock (sin API key) loguea en consola para no fallar.

## Portal de clientes

- Acceso por magic link (`/clientes/login`).
- Cliente no aprobado ve mensaje informativo sin valores sensibles.
- Certificados muestran botón de pago si están pendientes y cuentan con `mpInitPointUrl`.
- Facturas listan estado y enlace de descarga cuando existe.

## Panel admin

Disponible en `/admin` (rol admin). Permite:
- Crear packs, adicionales, planes de mantenimiento y casos de éxito.
- Emitir certificados de avance asociados a proyectos existentes.
- Exportar CSV de proyectos (`/api/admin/export?resource=proyectos`).

## Despliegue en Render

1. Crear **PostgreSQL** gestionado y obtener `DATABASE_URL`.
2. Crear **Web Service** (Node 20) con este repo.
3. Variables de entorno mínimas:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `RESEND_API_KEY`
   - `EMAIL_SERVER_FROM`
   - `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`
   - `STORAGE_DIR` (si usás Disk, ej. `/var/data`)
4. Commands:
   - Build: `npm ci && npm run build`
   - Start: `npm run start`
5. Health check: `/`.
6. Ejecutar `npm run db:migrate` y `npm run db:seed` (Render supports deploy hooks o run shell).

### Docker

Se incluye `Dockerfile` multi-stage listo para Render/containers. Montar volumen para almacenamiento si se generan PDFs persistentes.

## Testing manual sugerido

1. `npm run dev`
2. Ejecutar `npm run lint`, `npm test`.
3. En otra terminal `npx playwright test` (requiere server corriendo).
4. `npm run build && npm run start` y correr Lighthouse (Chrome) apuntando a `/` → objetivo ≥95 Performance/SEO/Best Practices/Accessibility.

## Datos de ejemplo

- Admin: `admin@nerin.com.ar`
- Cliente demo: `cliente@demo.com`
- Packs: Vivienda Estándar, Casa Country 1, Casa Country 2.
- Adicionales: artefactos, tableros, CCTV, datos, bombas, AA, audio, zanjeo, puesta a tierra.
- Planes: BASIC (10 lámparas LED), PRO, ENTERPRISE.
- Casos: Edificio 4.000 m², Smart Fit.
- Proyecto demo con certificados (30% pendiente, 60% pagado) y factura emitida.

## Notas adicionales

- Floating button de WhatsApp configurable vía `siteSettings` o variables públicas.
- Formularios públicos rate limited y con validación server-side via Zod.
- Los archivos binarios (imágenes) son placeholders remotos para cumplir la consigna de no subir binarios.
- Para almacenamiento S3, implementar en `lib/storage.ts` donde se dejó el hook correspondiente.

¡Listo para iterar y desplegar! 💡
