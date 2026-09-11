export const CLASSIFICATION_SYSTEM_PROMPT = `Clasifica un candidato a noticia de ciclismo según la taxonomía de la
revista (ver .claude/skills/cycling-news-editor/reference/cycling-taxonomy.md).
Asigna categoría principal, tags relevantes (ciclistas/equipos/carreras/
temas mencionados) y determina si el tema es sensible (dopaje, salud,
accidente, legal, acusación).
Devuelve JSON: {
  "category": string,
  "tags": string[],
  "isSensitiveTopic": boolean,
  "isRumor": boolean
}`
