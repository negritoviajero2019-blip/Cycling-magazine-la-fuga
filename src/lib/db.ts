import { PrismaClient } from '@prisma/client'

/**
 * Cliente Prisma singleton — cacheado en `globalThis` en TODOS los
 * entornos, incluida producción. Sin esto, cada vez que Node vuelve a
 * evaluar este módulo (hot-reload en dev, pero también cada reinicio
 * del proceso en producción) se crea un PrismaClient nuevo, y cada uno
 * abre su propio pool de conexiones — en un hosting con límite de
 * conexiones/hora (p.ej. `max_connections_per_hour` de MySQL) esto
 * agota el límite en minutos si el proceso se reinicia varias veces.
 * Ver incidente 2026-09-15: `ERROR 42000 (1226) ... max_connections_per_hour`.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

globalForPrisma.prisma = prisma

/**
 * Envuelve una consulta a la BD para que un fallo de conexión nunca
 * tumbe una página pública: se registra y se devuelve el valor de
 * fallback (habitualmente [] o null), permitiendo ocultar la sección
 * con elegancia en vez de mostrar un error (§83 del brief).
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error('[db] query failed, using fallback:', error)
    return fallback
  }
}
