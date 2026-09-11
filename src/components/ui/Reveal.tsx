'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal ligero (upgrade UI, agosto 2026): añade la clase
 * `.reveal` (definida en globals.css) y la marca visible cuando entra
 * en viewport, vía IntersectionObserver. Sin JS o con
 * prefers-reduced-motion, el contenido ya es visible (ver CSS) — nunca
 * depende de esto para ser legible.
 */
export function Reveal({
  children,
  className = '',
  delayMs = 0,
}: {
  children: React.ReactNode
  className?: string
  delayMs?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.setTimeout(() => setVisible(true), delayMs)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delayMs])

  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}
