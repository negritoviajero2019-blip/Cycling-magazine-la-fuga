# SEO y Google Discover

## Metadata por artículo

- `seoTitle` ≤ 60 caracteres, incluye la entidad principal (ciclista,
  equipo o carrera).
- `seoDescription` ≤ 155 caracteres, resume el hecho concreto, sin
  clickbait.
- `canonicalUrl` siempre presente (se genera automáticamente en
  `src/lib/seo/metadata.ts`).
- Open Graph + Twitter/X cards: se generan automáticamente a partir de
  `seoTitle`/`seoDescription`/imagen — no hace falta rellenarlos a mano.

## Structured data (§38)

Se usa solo el schema que corresponde al contenido real:

- `NewsArticle` en cada artículo (`src/lib/seo/structured-data.ts`).
- `BreadcrumbList` en artículo/carrera/equipo/ciclista.
- `Person` en páginas de ciclista.
- `SportsEvent` en páginas de carrera.
- `Organization` y `WebSite` (con `SearchAction`) en el layout global.

Nunca añadir un schema que no corresponda al contenido real de la
página (p. ej. no poner `NewsArticle` en una página de listado).

## Buenas prácticas para Google Discover / News

Autoría clara (`Article.author`), fecha de publicación y de
actualización visibles, imágenes de calidad (o el fallback editorial,
nunca una imagen rota), contenido 100% original, página de autores,
fuentes citadas cuando aporte valor, y la política editorial pública en
`/editorial-policy` — todo esto es E-E-A-T aplicado, no garantiza
aparición en Discover pero es condición necesaria.

## SEO programático controlado (§86)

Se generan páginas dinámicas para ciclistas, equipos, carreras,
categorías y tags — pero **solo se indexan si tienen contenido
suficiente**. Los tags con menos de 3 artículos llevan `noindex` (ver
`src/app/(site)/tag/[slug]/page.tsx`). Nunca generar miles de páginas
vacías.

## Qué NO se indexa (§95)

`/admin`, endpoints `/api/*`, la página de búsqueda (`/search`), y tags
con thin content. Configurado en `src/app/robots.ts` y por página vía
`noindex` en `buildMetadata()`.

## Internal linking (§67-68)

Cuando se mencione un ciclista/equipo/carrera/artículo relacionado con
página propia en el sitio, enlazar de forma natural. Cada artículo debe
cerrar con 3-6 artículos relacionados (`RelatedArticles`, basado en
categoría/tags compartidos).
