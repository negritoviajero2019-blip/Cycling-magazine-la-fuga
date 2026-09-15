'use client'

import { requestReopenCookiePreferences } from '@/lib/consent/cookie-consent'

/** Reabre el banner de consentimiento — ver CookieConsentBanner.tsx. */
export function CookiePreferencesButton() {
  return (
    <button onClick={requestReopenCookiePreferences} className="text-left hover:text-accent">
      Preferencias de cookies
    </button>
  )
}
