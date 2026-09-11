# Política de fuentes

## Prioridad (de mayor a menor confianza)

1. Organismos oficiales y organizadores de carrera (ASO, RCS Sport, Vuelta...)
2. UCI (Unión Ciclista Internacional)
3. Equipos oficiales (comunicados, web, canales verificados)
4. Ciclistas por canales verificados (cuentas oficiales verificadas)
5. Comunicados oficiales de patrocinadores/organizaciones relacionadas
6. Agencias de noticias (AFP, EFE, Reuters...)
7. Medios deportivos reconocidos (especializados en ciclismo)
8. Periodistas especializados confiables (con trayectoria verificable)
9. Otras fuentes, solo como apoyo — nunca como única fuente de un hecho
   importante

Esta jerarquía corresponde a `SOURCE_CREDIBILITY_TIER` en
`src/lib/content/enums.ts` y a los pesos de
`src/lib/content/confidence-score.ts`.

## Reglas de verificación

- Para **breaking news importante**: buscar idealmente confirmación
  independiente de al menos dos fuentes.
- Si únicamente existe una fuente confiable y es la fuente **oficial**,
  puede considerarse suficiente por sí sola.
- Si la información es un **rumor**: debe indicarse explícitamente como
  "rumor", "según informa...", "todavía no confirmado oficialmente".
  Nunca se presenta un rumor como hecho.

## Registro de fuentes

Cada `NewsCandidate` y `Article` guarda `sourceUrls` y `sourceNames`
(arrays). El artículo publicado puede mostrar una sección "Fuentes
consultadas" (ver `src/app/(site)/news/[slug]/page.tsx`) cuando
editorialmente aporte valor — nunca se copian párrafos completos ni se
traduce literalmente el artículo de otro medio; se investiga y se
redacta desde cero.
