# Política editorial

## Principio final (§100 del brief original)

Velocidad importa, pero: **precisión > velocidad. Credibilidad > clics.
Calidad > cantidad.** Ante la duda, no publiques.

## Qué se publica

Noticias, resultados, previas, análisis, fichajes, altas/bajas,
lesiones, accidentes relevantes, récords, calendario, clasificaciones,
rumores (siempre marcados como tal), historias de ciclistas, entrevistas
con material legítimo, ciclismo femenino, Grand Tours, clásicas,
campeonatos, tecnología, entrenamiento, nutrición, cultura ciclista,
gravel, y MTB cuando sea relevante.

## Qué NO se publica nunca

- Información sin fuente verificable.
- Hechos basados solo en conocimiento interno del modelo para eventos
  recientes — todo dato temporal se comprueba con búsqueda web real.
- Traducciones literales o "spinning" de artículos de otros medios.
- Fotografías sin licencia clara (ver más abajo, copyright).
- Contenido duplicado de un artículo ya existente (se actualiza el
  original en su lugar).
- Diagnósticos médicos de lesiones — solo se reporta lo que fuentes
  oficiales/médicas confirman.

## Clasificación editorial (usada por la IA y por el pipeline)

Cada candidato a noticia se clasifica en una de tres acciones
(`src/lib/content/confidence-score.ts::classifyEditorialAction`):

- **`auto_publish_safe`** — resultados verificados, anuncios oficiales,
  información objetiva con fuentes fuertes (`confidenceScore` ≥ 85, sin
  tema sensible, sin rumor, sin duplicado, sin problema de copyright).
- **`requires_review`** — controversias, accidentes graves, acusaciones,
  dopaje, temas legales, rumores, o información con confianza media
  (50-84). Se guarda en estado `review` para revisión humana en
  `/admin`.
- **`do_not_publish`** — sin fuente, fuente dudosa, contradicciones
  importantes, copyright problemático, o contenido duplicado.

## Temas sensibles

Accidentes, fallecimientos, salud, dopaje, investigaciones, acusaciones,
problemas legales: lenguaje neutral, fuentes de máxima calidad, nunca
especular. Distinguir siempre entre **acusación**, **investigación**,
**sanción** y **hecho probado**. Nunca diagnosticar lesiones — solo
reportar lo que una fuente médica/oficial haya confirmado
explícitamente.

## Copyright de imágenes

Nunca se reutiliza una fotografía por aparecer en una búsqueda de
Google. Fuentes válidas: fotografías con licencia, Wikimedia Commons con
licencia compatible, material editorial autorizado, fotografía propia,
proveedores con licencia. Si los derechos no están claros, **no se usa
la fotografía** — se usa la tarjeta de fallback editorial
(`src/components/editorial/EditorialFallbackCard.tsx`). Todo medio debe
guardar `url`, `source`, `author`, `license`, `credit` (modelo `Media`).

## Uso de IA — transparencia

El proceso de investigación, redacción y clasificación se apoya en
Claude bajo esta política. La IA nunca debe afirmar como hecho algo que
no pueda verificar — debe usar el sentinel `INSUFFICIENT_VERIFICATION`
(ver `reference/fact-checking.md`). Contenido sobre temas sensibles
generado con asistencia de IA pasa siempre por revisión humana antes de
publicarse. Esta política se explica públicamente en `/editorial-policy`
del sitio.

## Correcciones

Cuando un artículo publicado se actualiza de forma sustancial (cambia
un resultado, se añade un desenlace, se corrige un dato), se marca
`status: "updated"` y se muestra "Actualizado: fecha/hora" en el
artículo. Se registra un resumen del cambio en `ArticleRevision`.
