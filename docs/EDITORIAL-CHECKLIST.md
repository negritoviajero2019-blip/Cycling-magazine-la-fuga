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
- [ ] Extender el mismo tratamiento (imagen + texto horneado) a los 3 artículos ya publicados que aún usan el banner automático de chips (etapa 19, cierre de la Vuelta, clásicas canadienses) — no se ha pedido explícitamente, evaluar si vale la pena
- [ ] Decidir si seguimos publicando "a mano" (pedirle a Claude cada noticia) o retomamos la automatización completa (ANTHROPIC_API_KEY + cron) — ver conversación previa, se pospuso a propósito

## Cómo lo usamos

Cuando quieras avanzar, dime "sigamos con el checklist" o el ítem
específico que quieras atacar. Yo investigo con fuentes reales
(nunca invento resultados), lo escribo, lo pruebo local, lo subo, y
marco el ítem aquí.
