# NERIN Electric · Next.js (Render-ready)

Este proyecto arma el esqueleto que faltaba (package.json, Tailwind, tsconfig, components y lib) alrededor de tu carpeta `app/` original para que **buildée e inicie** en Render.

## Correr local
```bash
npm i
npm run dev
```
http://localhost:3000

## Deploy en Render (Web Service, no Static Site)
- **Runtime:** Node 18+
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm run start`
- **Health check:** `/` (opcional)
- **Env Vars (opcional):**
  - `ADMIN_USER` y `ADMIN_PASS` (para /admin/login)
  - `STORAGE_DIR` (ej: `/var/data` si montás un **Disk**)

Si usás rutas que escriben archivos (por ejemplo presupuestos o uploads), en Render agregá un **Disk** y seteá `STORAGE_DIR` a la ruta montada. Sino, el FS es efímero.

## Notas
- `lib/auth.ts` es un login **simple** por cookie (`nerin_admin=1`). Para producción, migrá a NextAuth/JWT.
- `lib/content.ts` persiste `site.json` en `STORAGE_DIR` (o `.data/` local) y crea carpetas si no existen.
- Tailwind está configurado para escanear `app/**` y `components/**`.

Ajustá el contenido real de `/components`, `/lib` y las páginas según tu necesidad.
