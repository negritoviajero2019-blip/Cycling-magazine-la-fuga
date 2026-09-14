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

async function loadFonts() {
  if (!antonFont) {
    const buf = await readFile(join(process.cwd(), 'public/fonts/Anton-Regular.ttf'))
    antonFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  }
  if (!interFont) {
    const buf = await readFile(join(process.cwd(), 'public/fonts/Inter-Regular.ttf'))
    interFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  }
  return { antonFont, interFont }
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
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const bg = searchParams.get('bg') || ''
  const linesParam = searchParams.get('lines') || ''
  const subtitle = searchParams.get('subtitle') || ''
  const lines = parseLines(linesParam)

  const { antonFont: anton, interFont: inter } = await loadFonts()

  const bgUrl = bg.startsWith('http') ? bg : `${origin}${bg}`

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: WIDTH, height: HEIGHT, position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgUrl}
          width={WIDTH}
          height={HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
        />
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
              <div style={{ display: 'flex', fontFamily: 'Inter', fontSize: 27, color: 'rgba(255,255,255,0.88)', lineHeight: 1.35 }}>
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
      ],
    },
  )
}
