type StatCardProps = {
  label: string
  value: string | number
  description?: string
}

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-subtle">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {description ? <p className="mt-2 text-xs text-slate-500">{description}</p> : null}
    </div>
  )
}
