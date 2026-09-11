'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { nav } from '@/lib/config/branding'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  // Cierra con Escape (2.1.2 — ninguna trampa de teclado: siempre hay
  // una forma clara de salir sin depender del ratón).
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center text-2xl"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav
          aria-label="Navegación móvil"
          className="absolute inset-x-0 top-full z-50 border-t border-border bg-background shadow-card"
        >
          <ul className="flex flex-col divide-y divide-border">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
