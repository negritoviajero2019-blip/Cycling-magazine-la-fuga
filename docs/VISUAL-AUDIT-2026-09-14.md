# Auditoría visual y de estilo — 2026-09-14

Hecha con mediciones reales sobre el sitio en vivo (contraste WCAG
calculado, no estimado; tipografía leída de `getComputedStyle`), no por
gusto. **Son solo observaciones — nada de esto se aplicó.** Todo lo que
sí era un bug claro (no una decisión de gusto) se corrigió aparte y está
listado al final para que quede separado de las recomendaciones.

## A. Contraste (WCAG 2.1 AA)

Medido en home, artículo, categoría y `/teams`. Tres fallos reales,
consistentes en todas las páginas donde aparece cada elemento:

| Elemento | Texto sobre fondo | Contraste | Mínimo requerido | Dónde |
|---|---|---|---|---|
| Numeral decorativo "01" en "Más leído" | `#E0E1DD` sobre blanco | **1.31:1** | 3:1 (texto grande) | Home |
| Badge "ÚLTIMA HORA" (ticker superior) | blanco sobre `#E14A58`-ish | **3.8:1** | 4.5:1 (texto <18px) | Todo el sitio |
| Pill de fecha/lectura sobre imagen horneada | blanco 80% sobre negro 50% | **4.25:1** (variable) | 4.5:1 | Hero de artículos con `cover-composited` |

**Por qué importa:** el numeral "01" falla brutalmente (1.31 vs 3) — para
alguien con baja visión es prácticamente invisible. El pill sobre la
imagen es el más delicado: como el fondo es una foto real (no un color
sólido), el contraste varía según qué haya detrás — sobre un cielo claro
puede caer bastante por debajo de 4.25:1.

**Sugerencia (no aplicada):** oscurecer el numeral "01" a un gris más
cercano a `--color-muted` (#626860, da >4.5:1) en vez de `--color-border`;
subir la opacidad del fondo del badge de última hora o cambiar a
`--color-primary` como fondo con blanco (backups seguros); en el pill,
subir la opacidad del negro a 65-70% o agregar `text-shadow` sutil para
que aguante encima de cualquier foto.

## B. Tipografía — el hallazgo más importante

`h1`, `h2`, `h3`, `h4`, `p`, `a` y `button` en **todo el sitio** usan
exactamente la misma familia tipográfica (Inter, vía `next/font`). La
única diferenciación entre titular y cuerpo es tamaño/peso — cero
contraste de "voz" tipográfica.

Esto choca directamente con la identidad que ya construimos para las
imágenes de portada: ahí el titular usa **Anton** (condensada, en
mayúsculas, con el lima como acento) — una tipografía con mucho carácter
que **el sitio en sí mismo nunca usa**. El resultado es una desconexión:
la imagen de cabecera grita "revista deportiva con personalidad" y el
titular en HTML debajo susurra "documento genérico en Inter".

**Sugerencia (no aplicada):** cargar Anton (ya está en
`public/fonts/Anton-Regular.ttf`, licencia SIL OFL, cero costo) como
`--font-heading` para `h1`/`h2` y toda la tipografía de titular del sitio
—no solo de las imágenes—, dejando Inter exclusivamente para cuerpo de
texto, metadatos y UI. Es el cambio de mayor impacto de todo este
reporte: hoy existe la fuente, está pagada en términos de licencia, y no
se usa donde más se necesita.

## C. Paleta de color

La paleta actual (`src/app/globals.css`) ya pasó una auditoría WCAG
propia el 2026-09-09 (accent/warning/success oscurecidos a propósito)
— es sólida y no encontré fallos de contraste en los colores de marca en
sí, solo en los tres casos puntuales de la sección A. **No recomiendo
tocar la paleta base.** Sí sugiero:

- Reservar el lima (`#B7FF3C`) exclusivamente para 1-2 acentos por
  pantalla (CTA, badge activo) — hoy aparece en el pill de categoría de
  casi cada tarjeta, lo que le resta impacto cuando de verdad quieres
  que algo destaque.
- El "breaking" en rojo (`#E11D2E`) funciona bien y está bien diferenciado
  del lima — mantenerlo así.

## D. SEO / metadatos (auditoría secundaria)

Revisé `og:image`, `og:type`, JSON-LD y jerarquía de encabezados en home,
artículo, equipo y categoría:

- **Bien:** páginas de artículo tienen `og:image` (la imagen de portada
  real), `og:type=article`, `article:published_time`, y JSON-LD
  `NewsArticle` + `BreadcrumbList` — nivel de detalle correcto para SEO
  de noticias.
- **Gap menor:** páginas que no son de artículo (`/teams`, `/riders`,
  categorías) no tienen `og:image` — al compartir esos links en redes
  sociales no se ve preview de imagen. Bajo impacto (son páginas de
  listado, no contenido individual) pero fácil de resolver con una
  imagen genérica de marca como fallback.
- **Bien:** un solo `<h1>` por página, sin saltos de nivel de encabezado
  en las páginas revisadas.

## E. Bugs reales corregidos esta noche (para contexto, no observación)

Estos NO son recomendaciones — ya se arreglaron porque eran defectos
objetivos, no decisiones de estilo:

1. Recorte de imágenes horneadas en móvil y en la tarjeta principal del
   Radar del Pelotón (contenedor con `min-height` fijo + `object-cover`
   sobre una imagen 16:9 → cortaba el titular). Corregido con
   `aspect-video`.
2. `publishVueltaFinalArticle` y `publishCanadianClassicsArticle`
   duplicaban filas de `Result` cada vez que se corrían (ya había 9
   copias en local). Corregido con `deleteMany` antes de recrear.
3. Etiqueta "ÚLTIMA HORA" duplicada cuando la categoría del artículo ya
   es "Última Hora" y además `breakingNews:true` (visto en 3 lugares:
   clásicas canadienses, página de artículo, `ArticleCard`).

## Próximo paso sugerido

De todo lo de arriba, si solo se hiciera **una cosa**, sería B (Anton
para titulares) — es el cambio de mayor impacto visual y ya está pagado
en términos de licencia/infraestructura. El resto son ajustes finos.
