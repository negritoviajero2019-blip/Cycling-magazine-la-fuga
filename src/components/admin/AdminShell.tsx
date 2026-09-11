'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { branding } from '@/lib/config/branding'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/articles', label: 'Artículos' },
  { href: '/admin/articles/new', label: 'Nuevo artículo' },
  { href: '/admin/automation', label: 'Automatización' },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-56 shrink-0 border-r border-border bg-background p-4">
        <p className="mb-6 font-heading text-lg font-bold">{branding.name}</p>
        <nav className="flex flex-col gap-1" aria-label="Navegación de administración">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`rounded px-3 py-2 text-sm font-medium ${
                pathname === link.href ? 'bg-primary text-white' : 'hover:bg-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="mt-8 w-full rounded border border-border px-3 py-2 text-left text-sm text-muted hover:text-breaking"
        >
          Cerrar sesión
        </button>
      </aside>
      <main id="main-content" className="flex-1 p-8">{children}</main>
    </div>
  )
}
