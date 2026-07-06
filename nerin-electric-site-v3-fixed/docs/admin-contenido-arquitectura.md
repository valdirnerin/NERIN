# Admin madre de contenido NERIN

## Decisión de arquitectura

- Ruta madre: `/admin/contenido`.
- Ruta canónica para trabajos eléctricos: `/admin/contenido/trabajos-electricos`.
- Ruta canónica para imágenes dinámicas: `/admin/contenido/media`.
- Fuente única para trabajos eléctricos: tabla `WebsiteContent`, key `electrical_services_admin_v1`.
- Fuente única para la biblioteca de medios: tabla `WebsiteContent`, key `site_media_library_v1`.
- Fallback TypeScript permitido solo como respaldo explícito, nunca como CMS silencioso.
- Upload dinámico permitido solo con storage persistente configurado.

## Auditoría de rutas y fuentes

| Lugar | Qué toca | Fuente actual | Consumo público | Estado |
| --- | --- | --- | --- | --- |
| `/admin/contenido` | Entrada madre, estado DB/storage/fallback | `WebsiteContent` + status técnico | No renderiza público; coordina editores | Canónico |
| `/admin/contenido/trabajos-electricos` | Servicios rápidos, guías, diagnóstico, comercial | `WebsiteContent/electrical_services_admin_v1` | `/trabajos-electricos` por `getElectricalAdminContent()` | Canónico |
| `/admin/trabajos-electricos` | Legacy | Redirección | No aplica | Redirigido |
| `/admin/trabajos-chicos` | Legacy | Redirección | No aplica | Redirigido |
| `/admin/refacciones` | Legacy | Redirección a madre | No aplica | Redirigido |
| `/admin/obras` | Legacy | Redirección a madre | No aplica | Redirigido |
| `/admin/contacto` | Legacy | Redirección a contenido comercial | No aplica | Redirigido |
| `/admin/contenido/media` | Biblioteca de imágenes | `WebsiteContent/site_media_library_v1` + storage externo/local persistente | Campos de imágenes en admin y web pública | Canónico |
| `/admin/contenido-comercial` | Home/refacciones/obras/contacto comercial | `SiteSetting.siteExperience` vía `/api/admin/site` | Home, contacto, obras, refacciones y secciones comerciales | Módulo legacy conectado |
| `data/electricalServices.ts` | Seed/fallback de servicios | TypeScript | Solo si no hay contenido guardado o falla DB | Respaldo explícito |
| `data/electricalServiceVisualGuides.ts` | Seed/fallback de guías | TypeScript | Solo si no hay contenido guardado o falla DB | Respaldo explícito |
| `Service/ServiceCategory/ServiceCatalogItem` | Catálogo operativo/cotizador | Prisma normalizado | Operación y solicitudes | No es fuente madre pública |
| `ContentPage/ContentService` | CMS histórico | Prisma | Parcial/legacy | No usar para trabajos eléctricos |

## Reglas implementadas

- El endpoint `GET /api/admin/electrical-content` devuelve contenido y estado técnico: DB, storage, fallback y warnings.
- El endpoint `PUT /api/admin/electrical-content` bloquea el guardado si la DB no es persistente.
- El endpoint `POST /api/admin/upload` bloquea uploads si el storage no es persistente.
- Los uploads admin aceptan solo `png`, `jpg`, `jpeg`, `webp` y `svg`.
- La web pública recibe solo items activos y ordenados.
- El admin conserva items inactivos para reactivarlos o editarlos.
- El admin muestra “falta guardar cambios”, errores reales y advertencias si se está usando fallback.

## Variables necesarias en Render

### DB persistente

Configurar `DATABASE_URL` para una base persistente. Si se usa SQLite con Render Disk, debe apuntar al disco montado, por ejemplo:

```bash
DATABASE_URL=file:/var/data/nerin.db
STORAGE_DIR=/var/data
```

No usar `file:/tmp/nerin.db`.

### Storage de imágenes recomendado

Preferido:

```bash
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_UPLOAD_PRESET=...
```

Alternativas aceptables: S3, Cloudflare R2, Supabase Storage o UploadThing si se implementa el provider. Render Disk local solo es aceptable si se decide explícitamente y `STORAGE_DIR` apunta al disco persistente.

## Criterios de aceptación cubiertos

- Existe una entrada madre de contenido público.
- Las rutas legacy de trabajos chicos/eléctricos no quedan como admins separados.
- Trabajos eléctricos lee y escribe una sola fuente: `WebsiteContent/electrical_services_admin_v1`.
- La web pública lee desde esa misma fuente.
- Los cambios no se guardan si la DB no es persistente.
- Los uploads no se aceptan si el storage no es persistente.
- Las imágenes no se suben dinámicamente a `/public`.
- Los endpoints admin revisados están protegidos por `requireAdmin`.
- El fallback existe solo como respaldo visible.

## Pendiente recomendado

- Migrar progresivamente `/admin/contenido-comercial` dentro de subrutas de `/admin/contenido` para que Home, Refacciones, Obras y Contacto dejen de vivir en un módulo legacy.
- Si se elige S3/R2/Supabase/UploadThing, agregar provider real en `lib/media.ts` y mantener el bloqueo cuando falten credenciales.
