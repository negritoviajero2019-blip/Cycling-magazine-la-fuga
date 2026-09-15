'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  CONSENT_REOPEN_EVENT,
  getStoredConsent,
  setStoredConsent,
  type ConsentStatus,
} from '@/lib/consent/cookie-consent'

/**
 * Banner de consentimiento de cookies (RGPD/LSSI). Aparece en la
 * primera visita (sin decisión guardada) y se puede reabrir desde
 * "Preferencias de cookies" en el footer. Aceptar y rechazar tienen el
 * mismo peso visual a propósito — RGPD exige que rechazar sea tan
 * fácil como aceptar.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getStoredConsent() === null)
    function onReopen() {
      setVisible(true)
    }
    window.addEventListener(CONSENT_REOPEN_EVENT, onReopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, onReopen)
  }, [])

  function decide(status: ConsentStatus) {
    setStoredConsent(status)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-surface px-4 py-4 shadow-lift md:px-6"
    >
      <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-ink">
          Usamos cookies técnicas imprescindibles para que el sitio funcione y, solo si lo
          aceptas, cookies de analítica para entender qué contenido te interesa.{' '}
          <Link href="/cookie-policy" className="font-semibold underline hover:text-accent">
            Más información
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => decide('rejected')}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-soft"
          >
            Rechazar no esenciales
          </button>
          <button
            onClick={() => decide('accepted')}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
