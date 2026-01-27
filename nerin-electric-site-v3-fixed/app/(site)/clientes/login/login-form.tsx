import { MagicLinkForm, type MagicLinkFormCopy } from '@/components/auth/magic-link-form'

const copy: MagicLinkFormCopy = {
  cardTitle: 'Solicitá tu enlace mágico',
  cardDescription: 'Ingresá el correo que tenés registrado con NERIN.',
  emailLabel: 'Email',
  placeholder: 'correo@empresa.com',
  submitLabel: 'Enviar enlace de acceso',
  pendingLabel: 'Enviando enlace...',
  successMessage: 'Revisá tu correo y hacé clic en el enlace para ingresar.',
}

export function LoginForm() {
  return <MagicLinkForm {...copy} />
}
