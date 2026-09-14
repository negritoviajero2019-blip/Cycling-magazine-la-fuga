import Image from 'next/image'

/**
 * Como next/image, pero renderiza <img> plano para las cabeceras
 * generadas localmente (data URI, ver header-banner-svg.ts) — el
 * optimizador de imágenes de Next no soporta SVG en data URIs, y estos
 * banners vectoriales no lo necesitan (ya son livianos).
 */
export function ArticleImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}) {
  if (src.startsWith('data:')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} className={className} />
  }
  return <Image src={src} alt={alt} width={width} height={height} priority={priority} className={className} />
}
