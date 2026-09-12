/**
 * Wrapper de CLI — la lógica real vive en src/lib/content/uci-import.ts
 * (compartida con la ruta de administración /api/admin/import-uci).
 */
import { publishVueltaStage19Article } from '../src/lib/content/uci-import'

publishVueltaStage19Article()
  .then(({ slug }) => {
    console.log(`✅ Artículo publicado: ${slug}`)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
