# Automatización editorial (Cron Jobs)

Tres endpoints internos, protegidos por el header `x-cron-secret`
(valor = `CRON_SECRET`). Fail-closed: sin `CRON_SECRET` configurado,
rechazan cualquier llamada (`src/lib/auth/cron.ts`).

| Endpoint | Frecuencia sugerida | Qué hace |
|---|---|---|
| `POST /api/internal/automation/news-discovery` | cada 4-6h | Busca acontecimientos recientes, deduplica, crea `NewsCandidate` |
| `POST /api/internal/automation/weekly-content-planner` | 1×/día | Revisa si la cuota semanal (4 artículos) va encaminada |
| `POST /api/internal/automation/scheduled-publisher` | cada ~15 min | Publica artículos cuyo `publishedAt` programado ya llegó |

## Configuración en hPanel

hPanel → Avanzado → Cron Jobs → añadir tarea con este comando (ajusta
dominio y secreto):

```bash
curl -s -X POST -H "x-cron-secret: TU_CRON_SECRET" https://tudominio.com/api/internal/automation/news-discovery
```

Repite para los otros dos endpoints con su propia frecuencia.

## Sin `ANTHROPIC_API_KEY`

`news-discovery` responde `{"status":"skipped"}` y registra un
`CronExecution` con `status: "skipped"` y una nota explicando que falta
la clave — nunca inventa contenido ni falla en silencio (§92 del brief
original).

## Pausar la automatización

Desde `/admin/automation` (botón "Pause Automation") o directamente en
`SiteSetting` (`key: "automationPaused"`, `value: "true"`). Todos los
jobs comprueban este flag antes de ejecutar nada.

## Coste de IA

Cada llamada a `news-discovery` con `allowWebSearch: true` tiene coste
por uso de la API de Anthropic. Evita ejecuciones innecesarias: no
llames al endpoint manualmente más de lo razonable, y confía en la
deduplicación (`src/lib/content/dedup.ts`) para no reprocesar el mismo
hecho dos veces (§58 del brief original — control de costes).
