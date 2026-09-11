export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'breaking' | 'rumor'
}) {
  const styles = {
    default: 'bg-primary text-white',
    breaking: 'bg-breaking text-white animate-pulse',
    rumor: 'bg-warning text-white',
  }[variant]

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${styles}`}
    >
      {children}
    </span>
  )
}
