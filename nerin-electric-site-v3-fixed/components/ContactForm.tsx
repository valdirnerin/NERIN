'use client'

import { FormEvent, useState } from 'react'

interface ContactFormState {
  nombre: string
  email: string
  mensaje: string
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    nombre: '',
    email: '',
    mensaje: '',
  })
  const [success, setSuccess] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess('Gracias por contactarnos. Te responderemos a la brevedad.')
    setForm({ nombre: '', email: '', mensaje: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 md:grid-cols-2 rounded-lg border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="nombre">
          Nombre y apellido
        </label>
        <input
          id="nombre"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="tu@email.com"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="mensaje">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={6}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Contanos sobre tu proyecto..."
          value={form.mensaje}
          onChange={(event) => setForm((prev) => ({ ...prev, mensaje: event.target.value }))}
          required
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Enviar
        </button>
        {success && <span className="text-sm text-green-700">{success}</span>}
      </div>
    </form>
  )
}
