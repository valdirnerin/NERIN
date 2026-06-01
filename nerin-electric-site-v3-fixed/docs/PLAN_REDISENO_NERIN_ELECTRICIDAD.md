# Plan de rediseno NERIN Electricidad

## 1. Diagnostico actual
- Framework: Next.js 14 App Router con TypeScript, Tailwind, Prisma, SQLite, NextAuth, Resend, Mercado Pago, Vitest y Playwright.
- Root real para Render: `nerin-electric-site-v3-fixed`.
- Rutas publicas existentes: home, servicios, packs, mantenimiento, obras, empresa, contacto, presupuestador, clientes, blog, terminos, privacidad y FAQ.
- Admin existente: login, dashboard modular, leads, packs, operativo, proyectos, certificados, clientes, noticias y ajustes.
- Datos: Prisma ya incluye usuarios, clientes, proyectos, packs, adicionales, planes de mantenimiento, leads, adjuntos, certificados, contenido CMS, posts y modelos operativos.
- Integraciones: Resend para emails, Mercado Pago para checkout/webhook, NextAuth/admin credentials, almacenamiento local de medios y tracking.

## 2. Problemas UX, comerciales y de conversion
- La home comunica servicio electrico, pero no tiene suficiente claridad de precio, urgencia ni diferenciacion premium.
- La navegacion mezcla "casos", "obras", "presupuestador" y rutas tecnicas, lo que reduce decision rapida.
- El presupuestador parece mas configurador tecnico que captador comercial liviano.
- El admin esta orientado a modulos existentes, pero no se siente como centro de control comercial/operativo de una empresa de servicios.
- Hay placeholders beta visibles en defaults de configuracion; deben quedar preparados sin mostrarse como datos oficiales falsos.

## 3. Nueva arquitectura propuesta
- Publico: landing comercial + catalogo de servicios + packs + mantenimiento + obras/experiencia + empresa + contacto + captador simple.
- Conversion: WhatsApp persistente, CTA principal visible, precios "desde", formulario corto y copy de urgencia profesional.
- Admin: sidebar unico con dashboard, pipeline de leads, clientes, presupuestos, obras, certificados, mantenimiento, visitas, ingresos, gastos, servicios/packs, contenido web y configuracion.
- Datos: extender Prisma con entidades de CRM/ERP de servicios sin romper los modelos actuales.

## 4. Nueva estructura publica
- Inicio: hero premium, urgencia, servicios, packs, mantenimiento, experiencia, confianza y formulario final.
- Servicios: catalogo claro por problema, precio desde y CTA.
- Packs: tres packs de mano de obra con aclaracion de materiales/proyecto por separado.
- Mantenimiento: BASIC, PRO y ENTERPRISE con fit comercial.
- Obras: experiencia profesional sin inventar datos especificos.
- Empresa: posicionamiento, proceso y beta controlada para datos oficiales futuros.
- Contacto: formulario simple, WhatsApp y criterios de prioridad.

## 5. Nueva estructura admin
- Dashboard con metricas comerciales, finanzas, operaciones y alertas.
- Leads con estados de pipeline: Nuevo, Contactado, Esperando fotos, Presupuesto pendiente, Presupuesto enviado, Negociando, Ganado, Perdido.
- Secciones previstas: Clientes, Presupuestos, Obras, Certificados, Mantenimiento, Visitas tecnicas, Ingresos, Gastos, Servicios y packs, Contenido web y Configuracion.
- Mantener auth existente y no romper rutas operativas ya implementadas.

## 6. Modelo de datos propuesto
- Nuevos modelos seguros: `Customer`, `Quote`, `QuoteItem`, `Job`, `ProgressCertificate` existente como base operativa, `MaintenanceContract`, `TechnicalVisit`, `Income`, `Expense`, `Service`, `WebsiteContent`, `CompanySettings`.
- Usar estados como strings para compatibilidad y evolucion futura.
- Todos los modelos nuevos deben tener `createdAt` y `updatedAt`.
- No borrar modelos existentes; extender de forma incremental.

## 7. Riesgos tecnicos
- El repo no esta disponible localmente con `git`; los cambios deben publicarse con API de GitHub.
- `next lint` puede fallar si la version de Next no soporta el comando en el entorno instalado.
- Prisma `db push` aplicara cambios en Render al arrancar; por eso los campos nuevos deben usar defaults o ser opcionales.
- Datos reales de empresa, CUIT, matriculas, responsables y telefono definitivo no deben inventarse.

## 8. Plan de implementacion
- Crear capa de contenido comercial compartida.
- Redisenar header, footer, layout publico y CTA mobile.
- Rehacer home, servicios, packs, mantenimiento, obras, empresa, contacto y presupuestador.
- Redisenar admin dashboard y navegacion como centro de control de servicios electricos.
- Extender Prisma con modelos CRM/ERP seguros.
- Mantener APIs `/api/leads`, Resend, Mercado Pago, auth y modelos existentes.

## 9. Checklist final de pruebas
- `npm run build`
- `npm run test`
- Revisar carga de home, servicios, packs, mantenimiento, obras, empresa, contacto, presupuestador y admin.
- Verificar que el formulario crea lead o falla con mensaje claro.
- Verificar que no se muestran telefono, CUIT, matricula o responsables falsos como datos oficiales.
- Verificar mobile: header, CTA sticky, cards, formularios y admin sidebar.
