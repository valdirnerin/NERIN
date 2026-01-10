import { prisma } from '@/lib/db'
import { serializeJson, serializeStringArray } from '@/lib/serialization'
import { SITE_DEFAULTS } from '@/lib/content'
import { blogPosts } from '@/content/blogPosts'
import { hash } from 'bcryptjs'

async function main() {
  const adminEmail = 'admin@nerin.com.ar'
  const clientEmail = 'cliente@demo.com'

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Equipo NERIN',
      role: 'admin',
    },
  })

  const clientUser = await prisma.user.upsert({
    where: { email: clientEmail },
    update: {},
    create: {
      email: clientEmail,
      name: 'Consorcio Demo',
      role: 'cliente',
      telefono: '+54 9 11 5555 5555',
    },
  })

  const client = await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: { approved: true, direccion: 'Av. Corrientes 1234', ciudad: 'CABA' },
    create: {
      userId: clientUser.id,
      approved: true,
      direccion: 'Av. Corrientes 1234',
      ciudad: 'CABA',
      notas: 'Logística coordinada con Genrock',
    },
  })

  await prisma.pack.createMany({
    data: [
      {
        nombre: 'Vivienda Estándar',
        slug: 'vivienda-estandar',
        descripcion: 'Pack para departamentos o PH hasta 120 m². Incluye tablero principal, cableado y puesta a tierra básica.',
        bocasIncluidas: 60,
        ambientesReferencia: 6,
        soloManoObra: true,
        precioManoObraBase: 2500000,
        alcanceDetallado: serializeStringArray([
          'Canalización EMT y bandejas vistas donde aplique',
          'Tablero principal con protecciones curvas C',
          'Circuitos independientes para AA, cocina y tomas generales',
          'Puesta a tierra con jabalina de 2.4 m',
          'Certificado de mediciones',
        ]),
      },
      {
        nombre: 'Casa Country 1',
        slug: 'casa-country-1',
        descripcion: 'Pack para viviendas premium hasta 250 m² con doble tablero y previsión de domótica.',
        bocasIncluidas: 120,
        ambientesReferencia: 10,
        soloManoObra: true,
        precioManoObraBase: 5200000,
        alcanceDetallado: serializeStringArray([
          'Doble tablero con seccional por planta',
          'Circuito exclusivo para piscina y bomba',
          'Preinstalación domótica y cableado de datos categoría 6A',
          'Puesta a tierra mejorada con anillo perimetral',
          'Documentación completa y ensayos finales',
        ]),
      },
      {
        nombre: 'Casa Country 2',
        slug: 'casa-country-2',
        descripcion: 'Pack para residencias superiores a 250 m² con tableros múltiples y backup.',
        bocasIncluidas: 180,
        ambientesReferencia: 14,
        soloManoObra: true,
        precioManoObraBase: 7800000,
        alcanceDetallado: serializeStringArray([
          'Tableros seccionales por planta y exteriores',
          'Integración con grupo electrógeno y UPS',
          'Circuito para sala de máquinas y presurizadora',
          'Canalizaciones ocultas con bandejas portacables',
          'Planos, memorias y certificación final',
        ]),
      },
    ],
  })

  await prisma.additionalItem.createMany({
    data: [
      {
        nombre: 'Colocación de artefacto de iluminación',
        descripcion: 'Montaje, conexionado y puesta en marcha de artefactos provistos por el cliente.',
        unidad: 'unidad',
        precioUnitarioManoObra: 15000,
      },
      {
        nombre: 'Tablero seccional adicional',
        descripcion: 'Armado de tablero con protecciones termomagnéticas y diferencial.',
        unidad: 'tablero',
        precioUnitarioManoObra: 320000,
      },
      {
        nombre: 'CCTV por cámara',
        descripcion: 'Instalación y conexionado de cámara CCTV con ajuste y prueba.',
        unidad: 'cámara',
        precioUnitarioManoObra: 42000,
      },
      {
        nombre: 'Punto de datos categoría 6A',
        descripcion: 'Cableado y certificación de punto de red para oficina u hogar.',
        unidad: 'punto',
        precioUnitarioManoObra: 28000,
      },
      {
        nombre: 'Circuito para bomba elevadora',
        descripcion: 'Cañería, cableado y protecciones dedicadas para bomba.',
        unidad: 'circuito',
        precioUnitarioManoObra: 180000,
      },
      {
        nombre: 'Circuito para bomba presurizadora',
        descripcion: 'Instalación eléctrica completa para presurizadora.',
        unidad: 'circuito',
        precioUnitarioManoObra: 160000,
      },
      {
        nombre: 'Preinstalación de split',
        descripcion: 'Cañería de cobre, desagüe y alimentación eléctrica independiente.',
        unidad: 'equipo',
        precioUnitarioManoObra: 95000,
      },
      {
        nombre: 'Cableado de audio distribuido',
        descripcion: 'Canalización y tendido para sistema de audio multizona.',
        unidad: 'zona',
        precioUnitarioManoObra: 70000,
      },
      {
        nombre: 'Zanjeo y cañería exterior',
        descripcion: 'Zanja con cañería PVC reforzada para alimentaciones exteriores.',
        unidad: 'metro lineal',
        precioUnitarioManoObra: 35000,
      },
      {
        nombre: 'Puesta a tierra suplementaria',
        descripcion: 'Instalación de jabalina adicional con medición final.',
        unidad: 'jabalina',
        precioUnitarioManoObra: 120000,
      },
    ],
  })

  await prisma.maintenancePlan.createMany({
    data: [
      {
        nombre: 'BASIC',
        slug: 'basic',
        visitasMes: 1,
        precioMensual: 180000,
        incluyeTareasFijas: serializeStringArray([
          'Revisión de 10 lámparas LED',
          'Chequeo de tableros',
          'Informe mensual',
        ]),
        cantidadesFijasInalterables: true,
      },
      {
        nombre: 'PRO',
        slug: 'pro',
        visitasMes: 2,
        precioMensual: 320000,
        incluyeTareasFijas: serializeStringArray([
          '20 lámparas LED',
          'Termografía bimestral',
          'Chequeo de bombas',
        ]),
        cantidadesFijasInalterables: true,
      },
      {
        nombre: 'ENTERPRISE',
        slug: 'enterprise',
        visitasMes: 4,
        precioMensual: 620000,
        incluyeTareasFijas: serializeStringArray([
          '40 lámparas LED',
          'Guardia de urgencias',
          'Reportes ejecutivos',
        ]),
        cantidadesFijasInalterables: true,
      },
    ],
  })

  await prisma.brand.createMany({
    data: [
      { nombre: 'Schneider Electric' },
      { nombre: 'Prysmian' },
      { nombre: 'Gimsa' },
      { nombre: 'Daisa' },
      { nombre: 'Genrock' },
    ],
  })

  await prisma.caseStudy.createMany({
    data: [
      {
        titulo: 'Edificio corporativo 4.000 m²',
        slug: 'edificio-4000',
        resumen: 'Adecuación completa de tablero general, CCTV y grupo electrógeno para edificio AAA.',
        contenido:
          'El desafío fue migrar la instalación existente sin cortar suministro crítico. Implementamos tableros modulares, cableado LSZH y monitoreo remoto. Cumplimos normativa AEA 90364-7-771 y entregamos documentación completa.',
        metricas: serializeJson([
          { label: 'Tiempo de obra', value: '90 días' },
          { label: 'Circuitos', value: '120' },
        ]),
        fotos: serializeStringArray([]),
        publicado: true,
      },
      {
        titulo: 'Smart Fit - Red de gimnasios',
        slug: 'smart-fit',
        resumen: 'Implementación de tableros, datos y CCTV para múltiples sedes simultáneas.',
        contenido:
          'Coordinamos logística y montaje nocturno para minimizar cierres. Cada sede recibió tableros nuevos, canalizaciones ocultas y cableado estructurado certificado. Implementamos checklist digital y reportes diarios.',
        metricas: serializeJson([
          { label: 'Sedes', value: '6' },
          { label: 'Horas fuera de servicio', value: '<4 h por sede' },
        ]),
        fotos: serializeStringArray([]),
        publicado: true,
      },
    ],
  })

  const project = await prisma.project.upsert({
    where: { id: 'demo-project' },
    update: {},
    create: {
      id: 'demo-project',
      clientId: client.id,
      nombre: 'Reforma eléctrica edificio Demo',
      tipo: 'edificio',
      estado: 'en_progreso',
      direccion: 'Av. Libertador 1500',
      metros2: 3800,
      normativasAplicadas: serializeStringArray(['AEA 90364-7-771', 'NFPA 70']),
    },
  })

  await prisma.progressCertificate.createMany({
    data: [
      {
        projectId: project.id,
        porcentaje: 30,
        monto: 2500000,
        estado: 'pendiente',
      },
      {
        projectId: project.id,
        porcentaje: 60,
        monto: 4500000,
        estado: 'pagado',
        paidAt: new Date(),
      },
    ],
  })

  await prisma.invoice.createMany({
    data: [
      {
        projectId: project.id,
        estado: 'emitida',
        fecha: new Date(),
        urlPdf: 'https://example.com/factura-nerin.pdf',
      },
    ],
  })

  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: SITE_DEFAULTS.name,
      industry: 'Instalaciones eléctricas',
      whatsappNumber: SITE_DEFAULTS.contact.whatsappNumber,
      whatsappMessage: SITE_DEFAULTS.contact.whatsappMessage,
      direccionOficina: SITE_DEFAULTS.contact.address,
      emailContacto: SITE_DEFAULTS.contact.email,
      zone: SITE_DEFAULTS.contact.serviceArea,
      schedule: SITE_DEFAULTS.contact.schedule,
      primaryCopy: SITE_DEFAULTS.tagline,
      metrics: serializeJson(SITE_DEFAULTS.trust.metrics),
      siteExperience: serializeJson(SITE_DEFAULTS),
    },
  })

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await hash('AccesoNerin123', 12),
      role: 'ADMIN',
    },
  })

  await prisma.contentService.createMany({
    data: SITE_DEFAULTS.services.items.map((item, index) => ({
      title: item.title,
      description: item.description,
      order: index + 1,
      active: true,
    })),
    skipDuplicates: true,
  })

  await prisma.portfolioProject.createMany({
    data: [
      {
        title: 'Edificio 4.000 m²',
        description: 'Montaje eléctrico confirmation, tableros generales y documentación final.',
        tags: serializeStringArray(['Obra comercial', 'Tableros']),
        locationText: 'CABA · Villa Ortúzar',
        images: serializeStringArray([
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        ]),
      },
      {
        title: 'Smart Fit',
        description: 'Adecuaciones eléctricas con tiempos de respuesta rápidos y reportes semanales.',
        tags: serializeStringArray(['Retail', 'Mantenimiento']),
        locationText: 'CABA · Microcentro',
        images: serializeStringArray([
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        ]),
      },
    ],
    skipDuplicates: true,
  })

  await prisma.blogPost.createMany({
    data: blogPosts.map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: new Date(post.publishedAt),
    })),
    skipDuplicates: true,
  })

  console.log('Seed completado')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
