/**
 * Wrapper de CLI — la lógica real vive en src/lib/content/uci-import.ts
 * (compartida con la ruta de administración /api/admin/import-uci).
 */
import { importUciRacesAndTeams } from '../src/lib/content/uci-import'

importUciRacesAndTeams()
  .then(({ raceCount, teamCount }) => {
    console.log(`✅ ${raceCount} carreras del calendario UCI 2026 (masculino + femenino) cargadas.`)
    console.log(`✅ ${teamCount} equipos UCI WorldTour 2026 (masculino + femenino) cargados.`)
    console.log('🎉 Importación de datos reales UCI completada.')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
