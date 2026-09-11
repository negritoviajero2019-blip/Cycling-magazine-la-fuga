# Base de datos

## Por qué hay dos archivos de schema Prisma

- `prisma/schema.prisma` — **producción**, `provider = "mysql"`. Es el
  schema real que corre en Hostinger. Usa `@db.Text`/`@db.LongText` en
  los campos largos (contenido de artículo, bios, etc.) porque MySQL
  limita `String` a `VARCHAR(191)` por defecto en Prisma.
- `prisma/schema.dev.prisma` — **desarrollo local**, `provider =
  "sqlite"`. Permite `npm install && npm run dev` sin instalar MySQL.
  Es el mismo schema quitando el `provider` y los atributos `@db.Text`
  (SQLite no soporta tipos nativos ni enums de Prisma).

**Regla:** si añades o cambias un modelo, hazlo primero en
`schema.prisma` y replica el cambio en `schema.dev.prisma`. No hay
generación automática entre ambos — es una elección deliberada para
mantener el schema de producción simple y explícito.

## Por qué no hay enums nativos de Prisma

SQLite no soporta el tipo `enum` de Prisma, y queríamos que ambos
schemas fueran estructuralmente idénticos campo a campo. Todos los
"estados" (`Article.status`, `NewsCandidate.status`, etc.) se guardan
como `String` y se validan en la capa de aplicación con las constantes
de `src/lib/content/enums.ts` (TypeScript union types) y los schemas Zod
de `src/lib/ai/schemas.ts` / `src/lib/content/article-input.ts`. Esa es
la única fuente de verdad de los valores válidos.

## Comandos

```bash
# Desarrollo (SQLite, prisma/dev.db)
npm run db:dev:generate
npm run db:dev:migrate
npm run db:dev:seed
npm run db:dev:studio   # explorar la BD visualmente

# Producción (MySQL, Hostinger)
npm run db:prod:generate
npm run db:prod:push   # nunca "migrate dev" ni "migrate deploy" en producción
```

**Por qué `db push` y no `migrate deploy` en producción:** Prisma guarda el
historial de migraciones en `prisma/migrations/`, y esa carpeta queda "atada"
al primer provider con el que se generó — en este proyecto se generó desde
`schema.dev.prisma` (SQLite). Aplicar ese historial contra MySQL falla con
`P3019 (provider mismatch)`. Como el schema de producción no tiene su propio
historial de migraciones independiente, `db push` sincroniza el schema
directamente sin depender de ese historial — es seguro para este proyecto en
su etapa actual. Si en el futuro se necesita un historial de migraciones real
para producción (control de versiones de schema, rollbacks), hay que darle a
`schema.prisma` su propia carpeta de migraciones separada (por ejemplo
moviéndolo a `prisma/prod/schema.prisma`).

## Modelo de datos (resumen)

Ver `prisma/schema.prisma` como fuente de verdad. Grupos principales:

- **Contenido editorial**: `Article`, `ArticleRevision`, `Category`,
  `Tag`, `Author`.
- **Dominio ciclista**: `Race`, `Stage`, `Rider`, `Team`, `Result`,
  `Transfer`.
- **Automatización**: `NewsCandidate`, `Source`, `CronExecution`.
- **Soporte**: `Media`, `NewsletterSubscriber`, `User`, `SiteSetting`.

## Seed de datos ficticios

`prisma/seed.ts` crea contenido **claramente marcado como de prueba**
(`[EJEMPLO]`, `(DATO FICTICIO)`) para poder navegar el sitio en
desarrollo. Se bloquea a sí mismo si `NODE_ENV=production`. **Nunca
ejecutar `npm run db:dev:seed` contra la base de datos real.**
