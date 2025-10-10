'use client'

import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const faqs = [
  {
    q: '¿Los packs incluyen materiales?',
    a: 'No. Los packs son exclusivamente mano de obra. Los materiales se eligen junto al cliente según marcas preferidas como Schneider, Prysmian, Gimsa, Daisa o Genrock.',
  },
  {
    q: '¿Cómo se paga un proyecto?',
    a: 'Dividimos el proyecto en hitos y emitimos Certificados de Avance. Cada certificado puede abonarse online vía Mercado Pago con el link que enviamos.',
  },
  {
    q: '¿Qué incluye el proyecto eléctrico?',
    a: 'Incluye cálculos de cargas, planos unifilares, memorias técnicas, selectividad y cómputos de materiales. Tiene un valor base de $500.000 editable desde el panel de administración.',
  },
  {
    q: '¿Trabajan con técnicos propios?',
    a: 'Sí. Todo el personal es propio, con ART y seguros de RC vigentes. Coordinamos ingreso a obras y consorcios con protocolos claros.',
  },
  {
    q: '¿Pueden integrarse con otras obras?',
    a: 'Participamos en coordinación con HVAC, datos, audio y obra civil. Compartimos cronograma y documentación en formato digital para evitar interferencias.',
  },
  {
    q: '¿Ofrecen soporte post obra?',
    a: 'Sí. Podés contratar uno de nuestros planes de mantenimiento BASIC, PRO o ENTERPRISE para visitas programadas y soporte correctivo.',
  },
]

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Badge>FAQ</Badge>
        <h1>Preguntas frecuentes</h1>
        <p className="text-lg text-slate-600">
          Respuestas rápidas sobre procesos, garantías y alcance de nuestros servicios eléctricos.
        </p>
      </header>
      <Accordion>
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} question={faq.q} answer={<p>{faq.a}</p>} />
        ))}
      </Accordion>
    </div>
  )
}
