# Sistema operativo NERIN Electricidad

## 1. Nueva logica del sistema
NERIN Electricidad queda orientado a vender, presupuestar, ejecutar y cobrar servicios electricos. El foco deja de estar en planes mensuales o contratos recurrentes y pasa a cuatro lineas: trabajos chicos, refacciones, obras grandes y servicios especiales.

## 2. Trabajos chicos, refacciones y obras
- Trabajos chicos: servicios puntuales con precio orientativo, variantes, zona, duracion y criterios de seguridad.
- Refacciones: trabajos medianos que requieren relevamiento, fotos, alcance, materiales, mano de obra, costos y cobros.
- Obras grandes: gestion de avance fisico/economico, certificados, materiales, jornales, gastos, adicionales, cobros y portal cliente preparado.
- Servicios especiales: diagnosticos, informes, revisiones y relevamientos que generan consultas y confianza.

## 3. Catalogo de trabajos
El catalogo publico vive en `/trabajos-electricos` y cada ficha en `/trabajos-electricos/[slug]`. Cada trabajo muestra precio desde o a presupuestar, que incluye, que no incluye, variantes, motivos de cambio de precio, motivos de revision manual y cancelacion por seguridad.

## 4. Presupuestacion manual por Valdir Nerin
Los pedidos fuera de catalogo, fuera de zona, complejos, riesgosos, con fotos dudosas o con muchas variantes pasan a revision manual por Valdir Nerin. El mensaje publico evita prometer un precio mal calculado.

## 5. Gestion de obras
La estructura de obras prepara resumen, avances, certificados, materiales, jornales, gastos, adicionales, cobros, equipo, cliente y notas. Los costos internos y margenes quedan para admin, no para el cliente.

## 6. Certificados
Los certificados se mantienen como parte central de obras grandes. Se contempla numero, fecha, porcentaje, monto, detalle, estado, envio, aprobacion, cobro y observaciones.

## 7. Portal cliente
El portal cliente queda preparado conceptualmente para `/cliente/obra/[token]`: debe mostrar estado, avance, certificados emitidos/cobrados/pendientes, proximos pasos, observaciones visibles, archivos y saldo. No debe mostrar costos internos, margen, jornales, notas privadas ni ganancia.

## 8. Alertas
El dashboard incorpora la seccion "Que revisar hoy" para solicitudes sin responder, pedidos a revisar por Valdir Nerin, trabajos terminados sin cobrar, refacciones sin presupuesto, obras sin avance/certificado reciente, gastos altos y trabajos fuera de zona.

## 9. Implementado en este PR
- Navegacion publica sin mantenimiento mensual.
- Home enfocada en trabajos chicos, refacciones, obras y servicios especiales.
- Rutas publicas nuevas: `/trabajos-electricos`, `/trabajos-electricos/[slug]`, `/refacciones-electricas`, `/obras-electricas`, `/servicios-especiales`.
- Formulario de solicitud por tipo, zona, propiedad, urgencia, descripcion, fotos y contacto.
- Admin reorganizado: Inicio, Solicitudes, Trabajos chicos, Refacciones, Obras, Clientes, Presupuestos, Dinero, Catalogo web y Configuracion.
- Modelos Prisma preparados para catalogo, solicitudes, trabajos chicos, refacciones, costos, avances, cobros, zonas y alertas.

## 10. Preparado para proximos PRs
- CRUD completo del catalogo web.
- Conversion real de solicitud a trabajo chico, refaccion u obra.
- Carga de materiales, jornales, gastos y cobros con formularios persistentes.
- Portal cliente con token seguro.
- Alertas calculadas desde datos reales.
- Configuracion visual de zonas, textos de seguridad, alta demanda y revision por Valdir Nerin.

## Nota de Render
El TXT indica root directory de Render `nerin_final_updated`, pero el repo actual mantiene el proyecto en `nerin-electric-site-v3-fixed`. En este PR no se renombra la carpeta para evitar romper despliegue, imports y scripts.
