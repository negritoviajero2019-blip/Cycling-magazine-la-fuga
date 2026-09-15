# Checklist editorial — La Fuga

Lista de trabajo compartida para saber qué carreras/noticias ya están
cubiertas y qué falta. Se actualiza en cada sesión de trabajo. Cada
ítem se marca `[x]` cuando el artículo/dato ya está publicado en
producción (no solo escrito localmente).

## Temporada UCI 2026 — cobertura de carreras reales

- [x] Calendario completo UCI 2026 (61 carreras) cargado en BD
- [x] 32 equipos WorldTour + Women's WorldTour cargados
- [x] 764 ciclistas reales (rosters completos) cargados
- [x] Vuelta a España — etapa 19 (Dunbar gana, Mas líder)
- [x] Vuelta a España — cierre final (Enric Mas campeón)
- [x] **Grand Prix Cycliste de Québec** (11 sept) — gana Evenepoel
- [x] **Grand Prix Cycliste de Montréal** (13 sept) — Isaac del Toro hace historia
- [x] **UCI Road World Championships 2026** — previa publicada (Pogačar fuera, favoritos Evenepoel/Del Toro). 20-27 sept, Montreal.
- [ ] **UCI Road World Championships 2026** — resultado real, pendiente hasta que se corra (27 sept)
- [ ] Il Lombardia (10 oct) — pendiente hasta que se corra
- [ ] Tour of Guangxi (13–18 oct) — pendiente hasta que se corra, cierra la temporada WorldTour masculina
- [ ] Tour of Chongming Island (13–15 oct) — cierra la temporada Women's WorldTour

## Ciclistas / historias en seguimiento

- [x] Isaac del Toro — GP Montreal cubierto (récord de juventud, primer mexicano en ganarlo)
- [ ] Isaac del Toro — seguimiento en el Mundial (20-27 sept, Montreal)

## Infraestructura / mecánica de publicación

- [x] Botón de admin para cargar datos UCI sin depender de SSH
- [x] Dominio real `lafugamagazine.com` funcionando en producción (tras recuperar el Web App roto)
- [x] Imágenes de cabecera propias (gráfico editorial, sin fotos de agencia) para cada artículo
- [x] Aviso automático de eventos próximos (`detectUpcomingRacePreviews`, corre con "Run News Scan") — detecta carreras del calendario a 7 días y crea un candidato en el panel
- [x] Imagen de portada con titular y bajada "horneados" (composición vía `/api/og-cover`, tipografía Anton/Roboto, paleta lima+blanco) — nuevo estándar para artículos destacados; el sitio detecta `heroImage.source === 'cover-composited'` y no vuelve a sobreponer su propio texto (ver `Hero.tsx`/`PelotonRadar.tsx`). Estrenada en la previa del Mundial.
- [x] Extendido a los 4 artículos publicados: etapa 19, cierre de la Vuelta, clásicas canadienses y previa del Mundial — todos con imagen real + texto horneado. El banner automático de chips queda como respaldo (`ensureHeroImage`) para artículos futuros que no requieran una imagen a medida.
- [ ] Decidir si seguimos publicando "a mano" (pedirle a Claude cada noticia) o retomamos la automatización completa (ANTHROPIC_API_KEY + cron) — ver conversación previa, se pospuso a propósito

## Cadencia editorial por sección (acordado 2026-09-14)

- **Última hora**: diario, 1-3 posts/día según cuánto esté pasando ese día en el pelotón. No forzar volumen si no hay noticia real.
- **Grand Tours**: cobertura en vivo mientras haya una grande en curso; fuera de temporada, 1 artículo/semana de "efeméride" (una etapa memorable de Giro/Tour/Vuelta) — siempre con fecha, datos y fuente real verificados antes de publicar, igual que el resto del sitio.
- **Ciclismo femenino**: hueco real (5 carreras Women's WorldTour ya cargadas, solo 1 artículo). Antes de tener cadencia regular aquí falta importar equipos/rosters reales del Women's WorldTour (mismo proceso que se hizo para hombres).
- **Secciones de nav**: hecho — "Fichajes" pasó a "Latinos" y se agregó "MTB y Gravel" con su propio calendario real de próximos eventos (2026-09-14).
- **Primer artículo real en cada sección que no tenía uno** (hecho, noche del 2026-09-14): Última Hora (caída de Ayuso en Quebec), Ciclismo Femenino (previa Mundial femenino), Latinos (temporada de Carapaz), Tecnología (reglas técnicas UCI 2026), MTB y Gravel (resultados Mundial MTB Val di Sole). Todos con el banner automático de chips como imagen — pendiente reemplazar por imagen horneada con foto real cuando el usuario esté disponible para generarla en ChatGPT.
- **Efeméride de Grand Tour investigada, no publicada todavía**: Vuelta a España 2016, etapa 15 (Formigal) — Contador atacó desde el km 0, Quintana se sumó y aisló a Froome; ganó la etapa Gianluca Brambilla pero Quintana amplió su ventaja sobre Froome de 0:54 a 3:37. Verificado vía Cyclingnews/Press Reader/SI.com. Lista para convertirse en artículo si se confirma.

## Cómo lo usamos

Cuando quieras avanzar, dime "sigamos con el checklist" o el ítem
específico que quieras atacar. Yo investigo con fuentes reales
(nunca invento resultados), lo escribo, lo pruebo local, lo subo, y
marco el ítem aquí.
