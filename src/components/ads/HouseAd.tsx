import Image from 'next/image'

/**
 * Anuncio propio (casa) de Iron Mind & Body Coaching
 * (ironmindandbody.com), otro proyecto del mismo editor de La Fuga.
 * Se muestra en los espacios publicitarios mientras no haya un
 * publisher de AdSense configurado (ver AdBanner/AdInArticle/
 * AdSidebar) — en vez de dejar el placeholder vacío. Copy y colores
 * tomados directamente del sitio real (fondo oscuro, dorado
 * rgb(143,111,44), logo propio), no inventados.
 */
const IRONMIND_URL = 'https://ironmindandbody.com'
const GOLD = '#8F6F2C'

const logo = (
  <Image
    src="/images/ads/ironmindandbody-logo.png"
    alt="Iron Mind & Body Coaching"
    width={505}
    height={505}
    className="h-full w-full shrink-0 object-contain"
  />
)

function Label({ children }: { children: string }) {
  return (
    <span className="absolute left-3 top-2 text-[10px] uppercase tracking-wide text-white/40">
      {children}
    </span>
  )
}

function Cta({ children }: { children: string }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold text-white"
      style={{ backgroundColor: GOLD }}
    >
      {children}
    </span>
  )
}

interface HouseAdProps {
  label?: string
}

export function HouseAdBanner({ label = 'Publicidad' }: HouseAdProps) {
  return (
    <a
      href={IRONMIND_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="relative mx-auto flex h-[90px] w-full max-w-[728px] items-center gap-4 overflow-hidden rounded bg-[#111111] px-5 transition-opacity hover:opacity-90"
    >
      <Label>{label}</Label>
      <div className="h-11 w-11 shrink-0">{logo}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">Entrena tu cuerpo y tu mente</p>
        <p className="truncate text-xs text-white/60">
          Iron Mind &amp; Body Coaching — online en todo el mundo, presencial en Xalapa, Ver.
        </p>
      </div>
      <Cta>Conócenos</Cta>
    </a>
  )
}

export function HouseAdRectangle({ label = 'Publicidad' }: HouseAdProps) {
  return (
    <a
      href={IRONMIND_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="relative mx-auto my-8 flex h-[250px] w-full max-w-[336px] flex-col items-center justify-center gap-3 overflow-hidden rounded bg-[#111111] px-6 text-center transition-opacity hover:opacity-90"
    >
      <Label>{label}</Label>
      <div className="h-16 w-16">{logo}</div>
      <div>
        <p className="text-base font-bold text-white">Entrena tu cuerpo y tu mente</p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/60">
          Coaching online en todo el mundo, presencial en Xalapa, Ver. Entrenamiento, nutrición y
          trabajo mental en un mismo plan.
        </p>
      </div>
      <Cta>ironmindandbody.com</Cta>
    </a>
  )
}

export function HouseAdSkyscraper({ label = 'Publicidad' }: HouseAdProps) {
  const pillars = ['Mente — enfoque y mentalidad', 'Cuerpo — movimiento y forma', 'Fuerza — entrenamiento real']
  return (
    <a
      href={IRONMIND_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex h-[600px] w-full max-w-[300px] flex-col overflow-hidden rounded bg-[#111111] px-6 py-8 text-center transition-opacity hover:opacity-90"
    >
      <Label>{label}</Label>
      <div className="mx-auto mt-4 h-24 w-24">{logo}</div>
      <p className="mt-6 text-xl font-bold leading-snug text-white">
        Entrena tu cuerpo y tu mente
      </p>
      <p className="mt-3 text-xs leading-relaxed text-white/60">
        Iron Mind &amp; Body Coaching: entrenamiento, nutrición y trabajo mental guiados por
        coaches especializados, con ajustes según tu progreso real.
      </p>
      <ul className="mx-auto mt-6 space-y-2 text-left text-xs text-white/70">
        {pillars.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: GOLD }} />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Cta>Ver paquetes en ironmindandbody.com</Cta>
      </div>
    </a>
  )
}
