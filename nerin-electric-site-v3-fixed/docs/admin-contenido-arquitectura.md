# Admin madre de contenido NERIN

## Auditoría anterior

| Lugar | Qué editaba/mostraba | Fuente | Consumo público | Problema |
| --- | --- | --- | --- | --- |
| `/admin/trabajos-electricos` | Servicios rápidos, guías visuales, diagnóstico y JSON comercial | `WebsiteContent` key `electrical_services_admin_v1` con fallback `data/electricalServices.ts` y `data/electricalServiceVisualGuides.ts` | `/trabajos-electricos` por `getElectricalAdminContent()` | Correcto como fuente, pero aislado del admin madre. |
| `/admin/trabajos-chicos` | Vista operativa de trabajos chicos y catálogo vendible | `SmallJob` y `ServiceCatalogItem` | No alimentaba directamente `/trabajos-electricos` | Duplicaba concepto comercial con otro modelo. Redirigido. |
| `/admin/refacciones` | Admin separado de refacciones | Página propia | Contenido público mayormente estático/fallback | Desconectado del admin madre. Redirigido para consolidación. |
| `/admin/obras` | Admin separado de obras | Página propia | Contenido público mayormente estático/fallback | Desconectado del admin madre. Redirigido para consolidación. |
| `/admin/contenido-comercial` | Home y contenido comercial general | Site/content JSON | Home y secciones comerciales | Queda como módulo legacy enlazado desde admin madre hasta migrar campos finos. |
| `data/electricalServices.ts` | Fallback estático de servicios y diagnóstico | TypeScript | `/trabajos-electricos` solo si no hay DB | No debe ser CMS; queda como respaldo explícito. |
| `data/electricalServiceVisualGuides.ts` | Fallback estático de guías | TypeScript | `/trabajos-electricos` solo si no hay DB | No debe ser CMS; queda como respaldo explícito. |
| `ContentPage` / `ContentService` | CMS genérico histórico | Prisma | Parcial/legacy | Potencial duplicación; no se usa como fuente madre nueva. |
| `Service` / `ServiceCategory` / `ServiceCatalogItem` | Catálogo operativo/cotizador | Prisma | Solicitudes/catálogo operativo | No debe competir con contenido público editable. |
| Upload admin | Archivos subidos por `/api/admin/upload` | Storage local o Cloudinary | Campos admin/media | Antes no registraba biblioteca madre; ahora registra en `WebsiteContent`. |

## Nueva arquitectura

- Ruta madre: `/admin/contenido`.
- Ruta de trabajos eléctricos consolidada: `/admin/contenido/trabajos-electricos`.
- Media library: `/admin/contenido/media`.
- Fuente única para contenido público editable: `WebsiteContent`.
  - `electrical_services_admin_v1`: contenido editable de `/trabajos-electricos`.
  - `site_media_library_v1`: índice de medios subidos.
- Fallback estático: permitido solo como respaldo cuando no existe contenido guardado o la DB falla. El admin muestra advertencias técnicas.
- Storage de imágenes: `STORAGE_PROVIDER=cloudinary` preferido. Alternativa local solo si `STORAGE_DIR` apunta a Render Disk persistente.

## Rutas redirigidas

- `/admin/trabajos-chicos` → `/admin/contenido/trabajos-electricos`.
- `/admin/trabajos-electricos` → `/admin/contenido/trabajos-electricos`.
- `/admin/refacciones` → `/admin/contenido`.
- `/admin/obras` → `/admin/contenido`.

## Endpoints admin relevantes

- `GET/PUT /api/admin/electrical-content`: protegido por `requireAdmin`, lee/escribe `WebsiteContent`.
- `POST /api/admin/upload`: protegido por `requireAdmin`, valida formato/tamaño, guarda en storage y registra en media library.

## Variables de entorno Render

- `DATABASE_URL`: debe apuntar a PostgreSQL o DB persistente. Crítico: no usar `/tmp`.
- `STORAGE_PROVIDER`: `cloudinary` recomendado o `local` con Render Disk.
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET`.
- Local con Render Disk: `STORAGE_DIR=/var/data/...` o ruta montada persistente. No usar `/tmp` ni `/public`.

## Prueba manual

1. Entrar a `/admin/contenido` y revisar estado técnico.
2. Abrir `/admin/contenido/trabajos-electricos`, editar un título y guardar.
3. Refrescar el admin y confirmar que el texto persiste.
4. Abrir `/trabajos-electricos` y confirmar que consume el mismo contenido.
5. Abrir `/admin/contenido/media`, subir una imagen válida y copiar su URL.
6. Pegar la URL en una guía visual, guardar y verificar preview/admin y web pública.
7. Reiniciar/redeployar y confirmar persistencia si `DATABASE_URL` y storage son persistentes.
