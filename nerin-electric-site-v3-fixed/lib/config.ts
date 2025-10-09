export const siteConfig = {
  name: 'NERIN · Ingeniería Eléctrica',
  description:
    'Instalaciones eléctricas de alta performance para empresas, obras y viviendas premium en CABA y GBA.',
  domain: 'https://www.nerin.com.ar',
  whatsapp: {
    number: process.env.PUBLIC_WHATSAPP_NUMBER || '5491100000000',
    message:
      process.env.PUBLIC_WHATSAPP_MESSAGE ||
      'Hola, soy [Nombre]. Quiero cotizar un servicio eléctrico con NERIN.',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/nerin-electric',
    instagram: 'https://www.instagram.com/nerin.electric',
  },
  ogImage: '/nerin/og-cover.png',
  keywords: [
    'instalaciones eléctricas',
    'contratista eléctrico',
    'tableros eléctricos',
    'puesta a tierra',
    'consorcios',
    'obras eléctricas CABA',
  ],
}
