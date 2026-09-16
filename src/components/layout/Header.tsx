import Link from 'next/link'
import Image from 'next/image'
import { branding, nav } from '@/lib/config/branding'
import { MobileMenu } from './MobileMenu'
import { SearchBox } from './SearchBox'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 md:py-3.5 lg:py-4">
        <Link href="/" className="shrink-0" aria-label={branding.name}>
          <Image
            src={branding.logo}
            alt="La Fuga Cycling Magazine"
            width={branding.logoWidth}
            height={branding.logoHeight}
            priority
            sizes="(min-width: 1280px) 230px, (min-width: 768px) 195px, 160px"
            className="h-auto w-[160px] md:w-[195px] xl:w-[230px]"
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-x-3 gap-y-1 flex-wrap lg:flex"
          aria-label="Navegación principal"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-medium text-ink transition-opacity duration-200 hover:opacity-55 xl:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SearchBox className="w-36 xl:w-56" />
        </div>

        <MobileMenu />
      </div>
    </header>
  )
}
