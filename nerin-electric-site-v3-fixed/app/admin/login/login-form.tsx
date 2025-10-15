import { MagicLinkForm, type MagicLinkFormCopy } from '@/components/auth/magic-link-form'

const copy: MagicLinkFormCopy = {
  cardTitle: 'Solicitá acceso seguro',
  cardDescription: 'Usá tu correo corporativo para recibir el enlace de ingreso al panel.',
  emailLabel: 'Correo corporativo',
  placeholder: 'nombre@nerin.com.ar',
  submitLabel: 'Enviar acceso al panel',
  pendingLabel: 'Enviando enlace...',
  successMessage: 'Abrí el enlace del correo para entrar al panel administrativo.',
}

export function AdminLoginForm() {
  return <MagicLinkForm {...copy} />
}
