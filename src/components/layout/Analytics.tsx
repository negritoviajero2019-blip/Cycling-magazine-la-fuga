'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_CHANGE_EVENT, getStoredConsent } from '@/lib/consent/cookie-consent'

/** §46: solo carga si NEXT_PUBLIC_GA_ID está definido Y el usuario aceptó cookies de analítica. */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    setConsented(getStoredConsent() === 'accepted')
    function onChange(event: Event) {
      setConsented((event as CustomEvent<string>).detail === 'accepted')
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }, [])

  if (!gaId || !consented) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');`}
      </Script>
    </>
  )
}
