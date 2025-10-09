export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        aria-hidden
      />
      <span className="sr-only">{value}% completado</span>
    </div>
  )
}
