export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-1/3 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  )
}
