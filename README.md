# [CYCLING MAGAZINE]

Revista digital profesional de ciclismo: editorial, automatizada con IA
y monetizable con publicidad. Ver `docs/` para el detalle operativo y
`.claude/skills/cycling-news-editor/` para el sistema editorial
automatizado.

> El plan de arquitectura completo (stack, schema, decisiones y
> justificación) vive en el historial de esta conversación / plan mode.
> Este README cubre cómo arrancar y operar el proyecto ya construido.

## Stack

Next.js (App Router) · TypeScript · React · Tailwind CSS · Prisma ·
MySQL (producción, Hostinger) / SQLite (desarrollo local) · Auth.js ·
Anthropic (Claude) para la automatización editorial.

## Arranque rápido (desarrollo, sin credenciales)

```bash
npm install
cp .env.example .env
npm run db:dev:migrate   # crea prisma/dev.db (SQLite)
npm run db:dev:seed      # datos ficticios, ver aviso en prisma/seed.ts
npm run dev
```

Abre `http://localhost:3000`. El login de `/admin` usa
`ADMIN_EMAIL`/contraseña `changeme123` (o el hash que pongas en
`ADMIN_PASSWORD_HASH`) — ver `docs/ENV.md`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` / `npm run typecheck` | Calidad de código |
| `npm test` | Tests unitarios (Vitest) |
| `npm run db:dev:migrate` | Migraciones contra SQLite local |
| `npm run db:prod:push` | Sincroniza el schema contra MySQL de producción |

## Documentación

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — despliegue en Hostinger.
- [`docs/DATABASE.md`](docs/DATABASE.md) — por qué hay dos schemas de Prisma.
- [`docs/CRON.md`](docs/CRON.md) — automatización editorial (cron jobs).
- [`docs/BACKUPS.md`](docs/BACKUPS.md) — copias de seguridad y recuperación.
- [`docs/ENV.md`](docs/ENV.md) — todas las variables de entorno explicadas.

## Estado del proyecto

MVP funcional con datos de ejemplo (marcados como ficticios, nunca
publicar). La automatización editorial real requiere `ANTHROPIC_API_KEY`
(ver `docs/ENV.md`); sin ella, los endpoints de automatización quedan
inactivos de forma segura (no inventan noticias, no fallan en
silencio).
