import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'

const WIDTH = 1600
const HEIGHT = 900
const LIME = '#C7FF21'
const WHITE = '#FFFFFF'

let antonFont: ArrayBuffer | null = null
let interFont: ArrayBuffer | null = null
let interFontExt: ArrayBuffer | null = null

async function readAsArrayBuffer(path: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), path))
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

/**
 * Dos archivos separados para "Inter" (en realidad Roboto, ver
 * public/fonts/): el base (latin) no incluye los diacríticos de
 * nombres como "Roglič" o "Pogačar" (č/š/ž), así que se agrega un
 * segundo buffer con el subset latin-ext bajo el mismo nombre de
 * familia — Satori prueba cada fuente en orden hasta encontrar el
 * glifo, como un fallback de font-family normal.
 */
async function loadFonts() {
  if (!antonFont) antonFont = await readAsArrayBuffer('public/fonts/Anton-Regular.ttf')
  if (!interFont) interFont = await readAsArrayBuffer('public/fonts/Inter-Regular.ttf')
  if (!interFontExt) interFontExt = await readAsArrayBuffer('public/fonts/Inter-Regular-LatinExt.ttf')
  return { antonFont, interFont, interFontExt }
}

interface TitleLine {
  text: string
  color: string
}

function parseLines(param: string): TitleLine[] {
  return param
    .split('|')
    .filter(Boolean)
    .map((seg) => {
      const [text, color] = seg.split(':')
      return { text: decodeURIComponent(text ?? ''), color: color === 'lime' ? LIME : WHITE }
    })
}

/**
 * Compone el titular y la bajada reales sobre una imagen de fondo ya
 * terminada (foto generada con IA o banner propio) — nunca modifica
 * la imagen de fondo en sí, solo agrega texto encima siguiendo la
 * identidad visual de La Fuga (ver docs/EDITORIAL-CHECKLIST.md).
 * Pensado para generarse UNA vez en desarrollo y guardar el PNG
 * resultante en public/images/headers/ (no en producción, que no
 * tiene librerías nativas de imagen disponibles).
 *
 * `bg` es opcional: sin foto (p.ej. para la carátula genérica de marca
 * usada como respaldo en home/categorías/ciclistas/equipos/carreras,
 * ver docs/SOCIAL-PREVIEW.md), se usa un fondo degradado propio en vez
 * de una imagen — sigue generándose una sola vez en dev y guardándose
 * como archivo estático, nunca en vivo en producción.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const bg = searchParams.get('bg') || ''
  const linesParam = searchParams.get('lines') || ''
  const subtitle = searchParams.get('subtitle') || ''
  const lines = parseLines(linesParam)

  const { antonFont: anton, interFont: inter, interFontExt: interExt } = await loadFonts()

  const bgUrl = bg ? (bg.startsWith('http') ? bg : `${origin}${bg}`) : ''

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: WIDTH,
          height: HEIGHT,
          position: 'relative',
          background: bgUrl ? undefined : 'linear-gradient(135deg, #0F1F13 0%, #07110B 55%, #0B160C 100%)',
        }}
      >
        {bgUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgUrl}
            width={WIDTH}
            height={HEIGHT}
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
          />
        )}
        {!bgUrl && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              background: 'linear-gradient(115deg, transparent 52%, rgba(199,255,33,0.16) 60%, transparent 68%)',
            }}
          />
        )}
        {bgUrl && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              background:
                'linear-gradient(100deg, rgba(7,17,11,0.92) 0%, rgba(7,17,11,0.75) 28%, rgba(7,17,11,0.15) 52%, rgba(7,17,11,0) 68%)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            left: '5%',
            right: '45%',
            bottom: '7%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.98 }}>
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  fontFamily: 'Anton',
                  fontSize: 84,
                  color: line.color,
                  textTransform: 'uppercase',
                  letterSpacing: -1,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
          {subtitle && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', width: 90, height: 5, background: LIME, marginTop: 22, marginBottom: 18 }} />
              <div style={{ display: 'flex', fontFamily: 'Inter, InterExt', fontSize: 27, color: 'rgba(255,255,255,0.88)', lineHeight: 1.35 }}>
                {subtitle}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Anton', data: anton, weight: 400, style: 'normal' },
        { name: 'Inter', data: inter, weight: 400, style: 'normal' },
        { name: 'InterExt', data: interExt, weight: 400, style: 'normal' },
      ],
    },
  )
}
