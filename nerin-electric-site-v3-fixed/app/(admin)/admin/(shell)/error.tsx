'use client'

import { useEffect } from 'react'

export default function AdminError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error('[Admin] Unhandled error', error)
  }, [error])

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-white p-6 text-sm text-slate-600 shadow-subtle">
      <h1 className="text-lg font-semibold text-foreground">Algo salió mal en el admin</h1>
      <p>Ocurrió un error en el servidor. Revisá los logs para más detalles.</p>
      {error.message ? <p className="text-xs text-slate-500">Mensaje: {error.message}</p> : null}
      {error.digest ? <p className="text-xs text-slate-500">Digest: {error.digest}</p> : null}
      <p className="text-xs text-slate-500">Si el problema persiste, verificá la base de datos y volvé a intentar.</p>
      <p className="text-xs text-slate-500">Logs internos: revisá el dashboard de Render.</p>
    </div>
  )
}
