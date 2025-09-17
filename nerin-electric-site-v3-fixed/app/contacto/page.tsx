import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contacto | NERIN',
}

export default function Contacto() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-extrabold mb-6">Contacto</h1>
      <ContactForm />
    </section>
  )
}
