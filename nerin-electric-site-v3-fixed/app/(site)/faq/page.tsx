'use client'

import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const faqs = [
  {
    q: 'Como se define si es trabajo chico, refaccion u obra?',
    a: 'Un trabajo chico es puntual y puede tener precio orientativo. Una refaccion tiene mas alcance y requiere relevamiento. Una obra grande se gestiona por etapas, avances, certificados y cobros.',
  },
  {
    q: 'Los precios del catalogo son finales?',
    a: 'Son precios orientativos cuando el trabajo se puede estandarizar. Materiales, viaticos, variantes, estado de la instalacion y seguridad pueden cambiar el precio.',
  },
  {
    q: 'Cuando pasa a revision por Valdir Nerin?',
    a: 'Cuando el pedido esta fuera de catalogo, fuera de zona, tiene riesgo electrico, requiere fotos complejas, refaccion, obra o demasiadas variantes.',
  },
  {
    q: 'Que pasa si la instalacion es insegura?',
    a: 'NERIN puede cancelar, reprogramar o pasar a presupuesto manual cualquier trabajo si hay riesgo, falta de acceso, humedad, recalentamiento o cableado deteriorado.',
  },
  {
    q: 'Como se manejan las obras grandes?',
    a: 'Se trabajan con presupuesto por alcance, seguimiento de avance, costos separados, certificados por etapa y cobros asociados.',
  },
]

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Badge>FAQ</Badge>
        <h1>Preguntas frecuentes</h1>
        <p className="text-lg text-slate-600">
          Respuestas rapidas sobre trabajos chicos, refacciones, obras y presupuestacion manual.
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
