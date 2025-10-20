import {
  AdminCredentialsForm,
  type AdminCredentialsCopy,
} from '@/components/auth/admin-credentials-form'

const copy: AdminCredentialsCopy = {
  cardTitle: 'Ingresá con tu clave única',
  cardDescription: 'Usá la cuenta administradora configurada para Render y accedé directo al panel.',
  emailLabel: 'Correo administrador',
  emailPlaceholder: 'admin@nerin.com.ar',
  passwordLabel: 'Contraseña',
  passwordPlaceholder: 'Tu contraseña segura',
  submitLabel: 'Entrar al panel',
  pendingLabel: 'Validando credenciales...',
  errorMessage: 'Credenciales inválidas. Verificá el correo y la contraseña que configuraste.',
}

export function AdminLoginForm() {
  return <AdminCredentialsForm {...copy} />
}
