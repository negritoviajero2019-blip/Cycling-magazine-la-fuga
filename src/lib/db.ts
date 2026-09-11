import { PrismaClient } from '@prisma/client'

/**
 * Cliente Prisma singleton (evita agotar conexiones con hot-reload
 * en desarrollo). Las páginas públicas son dinámicas (§ ver app/(site)),
 * así que `next build` nunca necesita una conexión a la BD en build time.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
