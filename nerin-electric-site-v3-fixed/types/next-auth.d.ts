import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      id: string
      role?: string
    }
    save?: () => Promise<void>
  }

  interface User {
    role: string
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    role: string
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: string
  }
}
