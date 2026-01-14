# Ads tracking & catálogos

## 1) Dónde pegar IDs (env vars)
Configurar estos valores en el entorno (ver `.env.example`):

- `SITE_URL` (por defecto `https://nerin-1.onrender.com`)
- `META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN`
- `META_CAPI_TEST_EVENT_CODE` (solo para pruebas de Events Manager)
- `GTM_ID`
- `GA4_MEASUREMENT_ID`
- `GOOGLE_ADS_CONVERSION_ID`
- `GOOGLE_ADS_CONVERSION_LABEL_LEAD`
- `GOOGLE_ADS_CONVERSION_LABEL_SCHEDULE`
- `GOOGLE_ADS_CONVERSION_LABEL_WHATSAPP`
- `CURRENCY` (ej. `ARS`)

> Tip: usar también las mismas claves en tu proveedor (Render) para producción.

## 2) Cómo testear Meta Pixel y CAPI

1. **Pixel (browser):**
   - Abrir el sitio con la extensión *Meta Pixel Helper*.
   - Disparar eventos (ver lista abajo) y validar `event_id` en consola/Events Manager.
2. **CAPI (server):**
   - En Meta Events Manager usar **Test Events**.
   - Cargar `META_CAPI_TEST_EVENT_CODE` y repetir el evento.
   - Verificar deduplicación (Pixel + CAPI) con el mismo `event_id`.

## 3) Cómo testear GA4 y Google Ads

- **GA4**: abrir **DebugView** en GA4, navegar y disparar eventos.
- **Google Ads**: usar Tag Assistant o revisar **Diagnóstico** de conversiones.
- Las conversiones se envían por `gtag('event', 'conversion', { send_to })`.

## 4) Lista de eventos implementados

| Acción / CTA | Evento Meta | Evento GA4 | Notas |
|---|---|---|---|
| Ver pack / Ver alcance completo / Configurar pack | `ViewContent` | `view_item` | Incluye `content_name` y `value` (cuando aplica). |
| Click WhatsApp | `Lead` | `generate_lead` | `channel="whatsapp"`. |
| Enviar formulario (Presupuesto / Contacto) | `Lead` | `generate_lead` | Solo en submit exitoso. |
| Agendar visita técnica | `Schedule` | `book_appointment` | CTA y formulario `tipo=visita`. |
| Solicitar alta del plan | `Lead` | `generate_lead` | Incluye `plan_tier`. |
| Checkout (si existiese) | `InitiateCheckout` / `Purchase` | `begin_checkout` / `purchase` | Eventos listos en `trackEvent`. |

### Ubicaciones principales

- Home: “Pedir presupuesto”, “Agendar visita técnica”, “Configurar pack”, “Ver alcance completo”, CTA final.
- Packs: “Configurar pack online” y “Elegir este pack”.
- Mantenimiento: “Solicitar alta del plan” y “Hablar con un asesor”.
- Contacto y Presupuesto: envío exitoso del formulario + WhatsApp de seguimiento.
- Header/Footer/WhatsApp flotante: click directo a WhatsApp.

## 5) Feed Meta Catalog

- Endpoint: `/feeds/meta-catalog.csv`
- Fuente editable: `data/offers.ts`

## 6) Comandos útiles

```bash
# Desarrollo
npm run dev

# Validar feed CSV
curl -s http://localhost:3000/feeds/meta-catalog.csv

# Probar CAPI (requiere envs seteadas)
curl -s -X POST http://localhost:3000/api/meta/capi \
  -H "Content-Type: application/json" \
  -d '{"event_name":"Lead","event_time":1710000000,"event_id":"test-123","page_url":"http://localhost:3000","currency":"ARS"}'
```
