export type OfferItem = {
  id: string
  title: string
  description: string
  link: string
  image_link: string
  price: number
  availability?: string
  brand?: string
}

export const offers: OfferItem[] = [
  {
    id: 'pack-starter',
    title: 'Pack Starter Residencial',
    description: 'Pack de mano de obra para departamentos de 2-3 ambientes con alcance base y documentación mínima.',
    link: '/packs#starter',
    image_link: '/nerin/og-cover.png',
    price: 950000,
  },
  {
    id: 'pack-pro',
    title: 'Pack Pro Residencial',
    description: 'Pack de mano de obra para viviendas de 3-4 ambientes con tableros, canalizaciones y puesta a tierra.',
    link: '/packs#pro',
    image_link: '/nerin/og-cover.png',
    price: 1450000,
  },
  {
    id: 'pack-premium',
    title: 'Pack Premium Residencial',
    description: 'Pack integral para viviendas premium con diseño, ejecución y checklist avanzado de seguridad.',
    link: '/packs#premium',
    image_link: '/nerin/og-cover.png',
    price: 2200000,
  },
  {
    id: 'plan-basic',
    title: 'Plan de mantenimiento BASIC',
    description: 'Visitas programadas, checklist digital y soporte correctivo en horarios hábiles.',
    link: '/mantenimiento#basic',
    image_link: '/nerin/og-cover.png',
    price: 180000,
  },
  {
    id: 'plan-pro',
    title: 'Plan de mantenimiento PRO',
    description: 'Cobertura ampliada, reportes ejecutivos y tiempos de respuesta acordados por SLA.',
    link: '/mantenimiento#pro',
    image_link: '/nerin/og-cover.png',
    price: 280000,
  },
  {
    id: 'plan-enterprise',
    title: 'Plan de mantenimiento ENTERPRISE',
    description: 'Soporte prioritario para edificios y retail con reportes mensuales completos.',
    link: '/mantenimiento#enterprise',
    image_link: '/nerin/og-cover.png',
    price: 420000,
  },
  {
    id: 'servicio-tableros',
    title: 'Tableros eléctricos a medida',
    description: 'Diseño, montaje y certificación de tableros generales, seccionales y CCM.',
    link: '/servicios',
    image_link: '/nerin/og-cover.png',
    price: 650000,
  },
  {
    id: 'servicio-puesta-tierra',
    title: 'Puesta a tierra certificada',
    description: 'Mallas, jabalinas y mediciones con informe técnico y adecuación normativa.',
    link: '/servicios',
    image_link: '/nerin/og-cover.png',
    price: 280000,
  },
  {
    id: 'servicio-instalaciones',
    title: 'Instalaciones eléctricas completas',
    description: 'Proyecto ejecutivo, canalizaciones, montaje y puesta en marcha en obra nueva.',
    link: '/servicios',
    image_link: '/nerin/og-cover.png',
    price: 1800000,
  },
  {
    id: 'servicio-cctv',
    title: 'Datos, CCTV y audio profesional',
    description: 'Redes estructuradas, cámaras y audio distribuido listos para crecer.',
    link: '/servicios',
    image_link: '/nerin/og-cover.png',
    price: 520000,
  },
  {
    id: 'servicio-aire',
    title: 'Instalación de aires acondicionados',
    description: 'Instalación integral con cañería, vacío, carga y alimentación eléctrica.',
    link: '/servicios',
    image_link: '/nerin/og-cover.png',
    price: 350000,
  },
]
