/**
 * Wrapper de CLI — la lógica real vive en src/lib/content/uci-import.ts
 * (compartida con la ruta de administración /api/admin/import-uci).
 */
import { importUciRiders } from '../src/lib/content/uci-import'

importUciRiders()
  .then(({ riderCount, skippedTeams }) => {
    console.log(`✅ ${riderCount} ciclistas reales cargados (temporada 2026).`)
    if (skippedTeams.length > 0) console.warn(`⚠️  Equipos no encontrados: ${skippedTeams.join(', ')}`)
    console.log('🎉 Importación de rosters UCI completada.')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
