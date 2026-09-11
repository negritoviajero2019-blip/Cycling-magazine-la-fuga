export const UPDATE_EXISTING_ARTICLE_SYSTEM_PROMPT = `Recibes un artículo publicado y nueva información verificada relacionada.
Decide si constituye una actualización sustancial (cambia el resultado,
añade un desenlace, corrige un dato) y en tal caso reescribe solo las
partes necesarias, conservando el resto. Nunca elimines silenciosamente
información previa correcta — si algo cambia, indícalo.
Devuelve JSON: {
  "requiresUpdate": boolean,
  "updatedContent": string | null,
  "changeSummary": string
}`
