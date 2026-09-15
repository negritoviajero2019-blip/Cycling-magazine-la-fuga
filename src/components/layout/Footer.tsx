import Link from 'next/link'
import Image from 'next/image'
import { branding, footerLinks } from '@/lib/config/branding'
import { NewsletterForm } from '@/components/editorial/NewsletterForm'
import { CookiePreferencesButton } from '@/components/layout/CookiePreferencesButton'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <Image
            src={branding.logo}
            alt="La Fuga Cycling Magazine"
            width={branding.logoWidth}
            height={branding.logoHeight}
            sizes="170px"
            className="h-auto w-[170px]"
          />
          <p className="mt-3 max-w-xs text-sm text-muted">{branding.tagline}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Newsletter</p>
          <NewsletterForm />
        </div>

        <nav aria-label="Enlaces legales y corporativos">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Información</p>
          <ul className="flex flex-col gap-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePreferencesButton />
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {branding.name}. Todos los derechos reservados.
      </div>
    </footer>
  )
}
