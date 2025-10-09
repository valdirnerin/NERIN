import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    title: 'Instalaciones eléctricas completas',
    description:
      'Proyecto ejecutivo, tableros, cañerías, cableado, puesta en marcha y certificaciones. Documentamos cada etapa con planos as-built y memorias técnicas.',
    bullets: [
      'Dimensionamiento según carga diversificada y selectividad de protecciones.',
      'Integración con grupos electrógenos, UPS y monitoreo remoto.',
      'Gestión de permisos y coordinación con distribuidoras (Edesur, Edenor).',
    ],
  },
  {
    title: 'Tableros a medida',
    description:
      'Fabricamos tableros generales, seccionales, CCM y tableros de transferencia. Ensayos de rigidez dieléctrica, termografías y etiquetado completo.',
    bullets: [
      'Ingeniería de detalle con planos unifilares y listado de materiales.',
      'Componentes Schneider, ABB, Siemens según preferencia del cliente.',
      'Envío con protocolos de montaje y torqueado certificado.',
    ],
  },
  {
    title: 'Puesta a tierra y descargas atmosféricas',
    description:
      'Medimos, mejoramos y certificamos puestas a tierra según AEA 90364-7-771. Diseñamos sistemas de protección contra descargas atmosféricas (SPCR).',
    bullets: [
      'Estudios de resistividad y diseño de mallas, jabalinas o anillos.',
      'Informes firmados por profesional matriculado.',
      'Plan de mantenimiento preventivo anual.',
    ],
  },
  {
    title: 'Canalizaciones y bandejas portacables',
    description:
      'Tendido prolijo y auditado para obras corporativas, industrias y centros logísticos. Seleccionamos materiales de alta resistencia mecánica.',
    bullets: [
      'Bandejas galvanizadas, portacables tipo escalerilla y ductos plásticos ignífugos.',
      'Planimetría con rutas de cableado y puntos de acceso.',
      'Coordinación con HVAC, datos y arquitectura para evitar interferencias.',
    ],
  },
  {
    title: 'Datos, CCTV y audio profesional',
    description:
      'Infraestructura de red categoría 6A, cámaras de seguridad, audio distribuido y automatización residencial/corporativa.',
    bullets: [
      'Certificación Fluke de cada punto de datos.',
      'Integración con plataformas VMS y control de accesos.',
      'Cableado estructurado listo para IoT y sistemas BMS.',
    ],
  },
  {
    title: 'Instalación de aires acondicionados',
    description:
      'Instalación integral incluyendo cañería de cobre, vacío, pruebas de estanqueidad y alimentación eléctrica independiente por circuito dedicado.',
    bullets: [
      'Coordinación con fabricante para mantener garantía oficial.',
      'Instalaciones Split, VRV y sistemas industriales.',
      'Documentación de consumo y cálculos de caída de tensión.',
    ],
  },
  {
    title: 'Adecuaciones AEA 90364-7-771',
    description:
      'Diagnóstico de instalaciones existentes y adecuaciones para cumplir normativa vigente. Informe apto para ART, aseguradoras y entes de control.',
    bullets: [
      'Auditoría con checklist completo AEA.',
      'Plan de acción con prioridades y costos asociados.',
      'Entrega de certificados y documentación fotográfica.',
    ],
  },
]

export default function ServiciosPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <Badge>Servicios</Badge>
        <h1>Soluciones eléctricas integrales para proyectos exigentes</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Cada servicio incluye planificación técnica, ejecución con mano de obra propia, controles de calidad y
          documentación final lista para auditorías.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.title} className="space-y-4">
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>{service.description}</p>
              <ul className="space-y-2">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
