/**
 * Convierte la primera mención de cada corredor etiquetado en un
 * artículo (article.riders) en un enlace interno a su hoja de datos
 * (/riders/[slug]), sin tocar el texto dentro de tags existentes
 * (atributos, u otros <a>...</a> ya presentes).
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function linkifyRiderNames(html: string, riders: { slug: string; name: string }[]): string {
  if (!riders.length) return html

  const sorted = [...riders].sort((a, b) => b.name.length - a.name.length)
  const parts = html.split(/(<[^>]+>)/g)
  const linked = new Set<string>()
  let insideAnchor = false

  return parts
    .map((part) => {
      if (part.startsWith('<')) {
        if (/^<a[\s>]/i.test(part)) insideAnchor = true
        if (/^<\/a>/i.test(part)) insideAnchor = false
        return part
      }
      if (insideAnchor) return part

      let text = part
      for (const rider of sorted) {
        if (linked.has(rider.slug) || !rider.name.trim()) continue
        const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${escapeRegExp(rider.name)})(?![\\p{L}\\p{N}])`, 'u')
        if (pattern.test(text)) {
          text = text.replace(pattern, `<a href="/riders/${rider.slug}" class="rider-link">$1</a>`)
          linked.add(rider.slug)
        }
      }
      return text
    })
    .join('')
}
