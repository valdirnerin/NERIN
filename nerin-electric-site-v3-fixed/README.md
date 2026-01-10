# NERIN Electric · Sitio corporativo y portal operativo

Proyecto completo basado en **Next.js 14 (App Router)** + **TypeScript** para comunicar los servicios eléctricos de NERIN, administrar contenido y operar el portal de clientes. Incluye integraciones con Prisma (SQLite por defecto, compatible con PostgreSQL), NextAuth (magic link), Mercado Pago, RESEND y generación de PDFs para presupuestos.

## Características principales

- **Front público** minimalista (tipo Notion/Apple) con Tailwind y componentes accesibles.
- **Secciones**: Home, Presupuesto, Consorcios, Comercios/Oficinas, Packs eléctricos, Presupuestador, Planes de mantenimiento, Servicios, Obras, Empresa, Blog, FAQ, Contacto, Legales.
- **Presupuestador** en 4 pasos con validaciones, cálculo de mano de obra y generación de PDF (server side con PDFKit).
- **Portal de clientes** con aprobación manual, proyectos, certificados de avance pagables vía Mercado Pago y facturas.
- **Panel admin** para CRUD de packs, adicionales, planes, casos de éxito y emisión de certificados.
- **Autenticación** con NextAuth (magic link por RESEND) y roles `admin`, `cliente`, `tecnico`.
- **Base de datos** Prisma + SQLite (archivo `dev.db` por defecto, seeds realistas) con opción de apuntar a PostgreSQL si se prefiere.
- **DevOps**: Dockerfile listo para Render, scripts de seed, healthcheck y documentación de despliegue.
- **Calidad**: ESLint, Prettier, Vitest (lógica de configurador), Playwright (smoke E2E). Lighthouse objetivo ≥95 (ejecutar manualmente sobre `npm run build && npm run start`).

## Requisitos

- Node.js 20+
- SQLite (se genera `dev.db` automáticamente) o PostgreSQL 15+ (opcional)
- Cuenta RESEND y credenciales Mercado Pago (modo test para sandbox)

## Configuración inicial

```bash
cp .env.example .env
# editar con tus claves: DATABASE_URL, AUTH_SECRET (openssl rand -base64 32), RESEND_API_KEY, MP_ACCESS_TOKEN, etc.
npm install
```

### Base de datos

```bash
npx prisma db push
npm run db:seed
```

> **Nota:** el seed crea un admin (`admin@nerin.com.ar`) y un cliente demo (`cliente@demo.com`). La autenticación es por magic link, por lo que basta con ingresar esos correos para recibir el enlace (en modo mock se loguea en consola si no configuraste RESEND real).

## Scripts principales

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Dev server en `http://127.0.0.1:3000` |
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

- Checkout para mantenimiento: `/api/mantenimiento/checkout?plan=slug` redirige a `/presupuesto` (captura de lead).
- Webhook `/api/mercadopago/webhook` valida firma simple (`MERCADOPAGO_WEBHOOK_SECRET`) y marca certificados/planes como pagados.
- Certificados se crean desde `/admin` y deben actualizarse con `mpInitPointUrl` (se guarda automáticamente en el flow de checkout de mantenimiento; para certificados de obra manuales se debe completar vía panel).

### PDFs

`lib/pdf.ts` genera el PDF del presupuestador. El endpoint `/api/quotes/[id]/pdf` entrega el archivo.

### Emails

`lib/resend.ts` encapsula envío. En modo mock (sin API key) loguea en consola para no fallar.

### Leads

- Endpoint principal: `POST /api/leads` (guarda lead y envía notificación si `RESEND_API_KEY` + `SALES_TO_EMAIL` están configurados).
- Panel mínimo: `/admin/leads` protegido por Basic Auth (`ADMIN_PASSWORD`).

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

## Variables de entorno requeridas (CMS + tracking)

### Core
- `DATABASE_URL` (PostgreSQL recomendado; para Render Disk podés usar `file:/var/data/nerin.db`)
- `AUTH_SECRET` o `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- `CONTENT_STORE` (`postgres` por defecto, o `file`)
- `CONTENT_DIR` (opcional, default `/var/data/content`)

### Tracking
- `GTM_ID`
- `GA4_ID`
- `META_PIXEL_ID`
- `META_CAPI_TOKEN` (solo si activás server-side)

### Email
- `RESEND_API_KEY` (si usás Resend)
- `FROM_EMAIL`
- `SALES_TO_EMAIL`
- `RESEND_CONTACT_TO` (opcional)
- `RESEND_BCC` (opcional)
- **SMTP fallback**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`

### Otros
- `STORAGE_DIR` (si usás Disk para subir archivos en el futuro)
- `NEXT_PUBLIC_SITE_URL` (opcional, útil para entornos con proxy)

## Despliegue en Render (CMS-driven)

1. Crear **Persistent Disk** (20 GB alcanza para SQLite + uploads) o, si preferís, una base **PostgreSQL** gestionada.
2. Crear **Web Service** (Node 20) con este repo.
3. Configurar variables de entorno:
   - **CMS**: `CONTENT_STORE=postgres` (por defecto) o `CONTENT_STORE=file` + `CONTENT_DIR=/var/data/content`.
   - **Admin**: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.
   - **Tracking**: `GTM_ID`, `GA4_ID`, `META_PIXEL_ID` (opcionales).
   - **Email**: `RESEND_API_KEY` o SMTP (`SMTP_HOST`, `SMTP_PORT`, etc.).
   - **Base de datos**: `DATABASE_URL`.
   > Generá `AUTH_SECRET` con `openssl rand -base64 32` y cargalo en el panel de variables del despliegue.
4. Commands:
   - Build: `npm ci && npm run build`
   - Start: `npm run start`
5. Health check: `/`.
6. Ejecutar `npm run db:migrate` (alias de `prisma db push`) y `npm run db:seed` desde un shell del servicio tras el primer despliegue.
7. Entrá a `/admin` con las credenciales de `ADMIN_EMAIL` + `ADMIN_PASSWORD` para editar settings, servicios, trabajos y blog.

### Docker

Se incluye `Dockerfile` multi-stage listo para Render/containers. Montar volumen para almacenamiento si se generan PDFs persistentes.

## Testing manual sugerido

1. `npm run dev`
2. Ejecutar `npm run lint`, `npm test`.
3. En otra terminal `npx playwright test` (requiere server corriendo).
4. `npm run build && npm run start` y correr Lighthouse (Chrome) apuntando a `/` → objetivo ≥95 Performance/SEO/Best Practices/Accessibility.

## Checklist QA mobile + tracking

### Mobile-first
- Header compacto sin overflow en 320 px.
- Botones con padding mínimo de 44px y textos legibles.
- CTA principal visible above-the-fold en Home.
- Espaciado consistente entre secciones y cards.
- Formularios: inputs full-width, labels legibles y submit accesible.
- Performance: imágenes con lazy-load y sin CLS perceptible.

### Tracking & leads
- UTM/fbclid/gclid persisten entre páginas y llegan a `/api/leads`.
- Evento **Lead** se dispara al enviar formulario de presupuesto.
- `/api/tracking/lead` responde `ok: true` cuando hay token; `skipped: true` cuando falta.
- GTM/GA4/Meta scripts cargan solo si existen sus env vars.

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
