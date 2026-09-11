# Flujo de publicación

## Cuota editorial semanal

Mínimo 4 artículos nuevos por semana, distribución sugerida: lunes,
miércoles, viernes, domingo (configurable). Estos 4 buscan oportunidad
editorial real de esos días — **nunca se inventa una noticia solo por
cumplir la cuota**. Si la actualidad del día es pobre, se publica en su
lugar: análisis, previa, perfil, historia, explicador, ranking,
tecnología, o previa de la próxima carrera (ver
`article-templates.md`).

## Breaking news (no cuenta para la cuota semanal)

Se crea un artículo adicional de última hora cuando hay: gran
transferencia, accidente serio confirmado públicamente, retirada,
lesión importante, suspensión, victoria histórica, récord, cambio
reglamentario, resultado extraordinario, controversia sustentada por
fuentes, o anuncio de gran carrera. La urgencia **nunca** reduce el
estándar de verificación — mismo proceso de `fact-checking.md`.

## Pipeline completo (equivalente en código: `src/lib/content/automation.ts`)

```
CRON (hPanel) → news-discovery → source collection → deduplicación
→ relevance score → fact-check → article generation → SEO → imagen
→ validación → NewsCandidate/Article en BD → publicación
→ sitemap/RSS (siempre en vivo, sin regeneración manual)
```

Cuando trabajas de forma interactiva en esta sesión de Claude Code, sigues
el mismo orden, pero con tu propio criterio editorial en cada paso en
vez de llamadas automáticas a la API.

## Cron jobs en producción (referencia)

- `news-discovery` — cada 4-6h. Busca acontecimientos recientes.
- `weekly-content-planner` — diario. Vigila si la cuota semanal va bien
  encaminada.
- `scheduled-publisher` — cada ~15 min. Publica lo que ya alcanzó su
  `publishedAt` programado.

Todos protegidos por `CRON_SECRET` (ver `docs/CRON.md`). El panel
`/admin/automation` permite disparar un escaneo manual, pausar y
reanudar la automatización sin tocar código ni credenciales.

## Antes de dar un artículo por terminado

1. `scripts/check-duplicates.ts` — no hay un artículo ya existente sobre
   el mismo hecho.
2. `scripts/score-news.ts` — relevancia y confianza calculadas.
3. `scripts/validate-article.ts` — el JSON final pasa el schema Zod.
4. Estado final decidido según `editorial-policy.md` §clasificación:
   `published` (solo si `auto_publish_safe`), o `review` para que un
   humano lo revise en `/admin/articles`.
