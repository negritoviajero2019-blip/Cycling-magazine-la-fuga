# Taxonomía de ciclismo

La taxonomía es **dinámica** (modelo `Tag`, campo `type`) — esto es una
guía de criterio, no una lista cerrada que haya que hardcodear.

## Categorías (`Category`, fijas en el MVP — ver `prisma/seed.ts`)

`ultima-hora`, `grand-tours`, `clasicas`, `fichajes`,
`ciclismo-femenino`, `tecnologia`, `analisis`. Se pueden añadir más
categorías (p. ej. `worldtour`, `entrenamiento`) desde `/admin` sin
tocar código.

## Tipos de tag (`Tag.type`)

- `rider` — slug del ciclista, p. ej. `tadej-pogacar`.
- `team` — slug del equipo, p. ej. `uae-team-emirates`.
- `race` — slug de la carrera, p. ej. `tour-de-france`.
- `topic` — tema editorial, p. ej. `dopaje`, `caidas`, `contrarreloj`.
- `generic` — cualquier otro tag libre.

## Criterio para asignar categoría a un artículo

- Resultado o noticia de una Grand Tour (Tour de France, Giro d'Italia,
  Vuelta a España) → `grand-tours`.
- Clásica (Paris-Roubaix, Strade Bianche, Milán-San Remo...) →
  `clasicas`.
- Fichaje, renovación, salida de equipo → `fichajes`.
- Carrera o resultado del calendario femenino → `ciclismo-femenino`
  (además de la categoría de carrera si aplica).
- Bicicletas, componentes, wearables, datos → `tecnologia`.
- Piezas de profundidad, previas largas, perfiles → `analisis`.
- Cualquier cosa muy reciente y de alto impacto → también marcar
  `breakingNews: true` en `Article` (no es una categoría, es un flag).

## Slugs

Todos los slugs (`Rider.slug`, `Team.slug`, `Race.slug`, `Tag.slug`) se
normalizan en minúsculas, sin acentos, con guiones — coherente con el
resto de la taxonomía dinámica del sitio.
