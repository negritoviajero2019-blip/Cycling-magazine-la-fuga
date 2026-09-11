# Fact-checking

## Proceso de investigación (10 pasos, §99 del brief original)

1. Identificar el evento concreto (quién, qué, cuándo, dónde).
2. Encontrar la fuente primaria.
3. Buscar fuentes secundarias que la respalden.
4. Verificar la fecha exacta del hecho.
5. Verificar nombres (ciclistas, equipos, organizadores).
6. Verificar equipos implicados (nombre actual, no uno antiguo).
7. Verificar resultados citados (posición, tiempo, puntos).
8. Detectar contradicciones entre fuentes.
9. Guardar todas las `sourceUrls`/`sourceNames` usadas.
10. Redactar desde cero — nunca copiar ni traducir literalmente.

## El sentinel `INSUFFICIENT_VERIFICATION`

Si tras investigar no puedes confirmar un dato con las fuentes
disponibles, **no lo inventes**. En la tarea de redacción
(`src/lib/ai/prompts/article-writing.ts`), el campo `content` debe
contener literalmente el string `INSUFFICIENT_VERIFICATION` en vez de
una afirmación no verificada — esto bloquea automáticamente la
publicación (ver `GeneratedArticleSchema` en `src/lib/ai/schemas.ts`).

## Confidence score

`src/lib/content/confidence-score.ts::computeConfidenceScore` combina:

- Nivel de credibilidad de la mejor fuente disponible (ver
  `source-policy.md`).
- Número de confirmaciones independientes.
- Si existe una fuente oficial directa.
- Penalización fuerte si se detectan contradicciones entre fuentes.

No publiques automáticamente información delicada con confianza baja —
ver el umbral en `editorial-policy.md` §clasificación editorial.

## Datos temporales que SIEMPRE requieren verificación

"Actualmente corre para...", "es campeón vigente", "la próxima carrera
será...", "última hora", "hoy", "acaba de...", "nuevo fichaje",
"resultado", "lesión", "abandono", "accidente", "nuevo equipo",
"transferencia", "ganador", "clasificación". Ninguno de estos se escribe
sin una búsqueda actualizada que lo respalde en el momento de redactar.

## Fechas y timezone

Fechas siempre en formato explícito del locale (p. ej. "23 de agosto de
2026"), nunca "ayer"/"hoy" ambiguos en el cuerpo del artículo cuando el
contexto necesite precisión. Timezone editorial:
`NEXT_PUBLIC_DEFAULT_TIMEZONE` (por defecto `Europe/Madrid`); fechas de
eventos se guardan en UTC en la base de datos y se formatean al locale
al mostrarse (`src/lib/content/format-date.ts`).
