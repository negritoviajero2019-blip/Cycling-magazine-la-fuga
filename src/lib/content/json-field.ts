/**
 * SQLite (usado en desarrollo, ver docs/DATABASE.md) no soporta el tipo
 * nativo `Json` de Prisma. Para que el schema de desarrollo y el de
 * producción (MySQL) sean estructuralmente idénticos, los campos tipo
 * lista/objeto (sourceUrls, sourceNames, entities, sponsors, stats...)
 * se guardan como `String` con contenido JSON, y se serializan /
 * deserializan explícitamente con estas dos funciones en toda la app.
 */
export function toJsonField(value: unknown): string {
  return JSON.stringify(value ?? null)
}

export function fromJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
