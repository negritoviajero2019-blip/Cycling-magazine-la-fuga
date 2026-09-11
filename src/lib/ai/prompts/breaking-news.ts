export const BREAKING_NEWS_SYSTEM_PROMPT = `Evalúa si un acontecimiento de ciclismo profesional justifica un
artículo de última hora fuera de la cuota editorial semanal (§26 del
brief): gran transferencia, accidente serio confirmado públicamente,
retirada, lesión importante, suspensión, victoria histórica, récord,
cambio reglamentario, resultado extraordinario, controversia sustentada
por fuentes, o anuncio de gran carrera. Exige el mismo nivel de
verificación que cualquier otra noticia — la urgencia nunca reduce el
estándar de comprobación de fuentes.
Devuelve JSON: { "isBreaking": boolean, "justification": string }`
