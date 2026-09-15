/**
 * Estado de consentimiento de cookies (RGPD/LSSI) — persistido en
 * localStorage, nunca en el servidor. "accepted" habilita analítica
 * (Google Analytics) y, cuando exista, publicidad personalizada
 * (Google AdSense); "rejected" y `null` (todavía no ha decidido) dejan
 * el sitio solo con cookies técnicas imprescindibles.
 */
export type ConsentStatus = 'accepted' | 'rejected'

const STORAGE_KEY = 'lafuga-cookie-consent'
export const CONSENT_CHANGE_EVENT = 'lafuga-cookie-consent-changed'
export const CONSENT_REOPEN_EVENT = 'lafuga-cookie-consent-reopen'

export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === 'accepted' || value === 'rejected' ? value : null
}

export function setStoredConsent(status: ConsentStatus) {
  window.localStorage.setItem(STORAGE_KEY, status)
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: status }))
}

/** Reabre el banner para que el usuario pueda cambiar su elección — ver el botón "Preferencias de cookies" en el footer. */
export function requestReopenCookiePreferences() {
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))
}
