/**
 * Capa de almacenamiento de medios abstraída (§80 del plan de
 * arquitectura): el MVP guarda en disco del hosting; migrar a
 * Cloudflare R2/S3 más adelante es implementar `MediaStorage` una vez,
 * sin tocar los componentes que suben o sirven imágenes.
 */
export interface MediaStorage {
  save(file: Buffer, filename: string): Promise<{ url: string }>
}

class LocalDiskStorage implements MediaStorage {
  async save(file: Buffer, filename: string): Promise<{ url: string }> {
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
    await writeFile(path.join(dir, safeName), file)
    return { url: `/uploads/${safeName}` }
  }
}

export function getMediaStorage(): MediaStorage {
  return new LocalDiskStorage()
}

/**
 * Fallback visual editorial (§24): cuando no existe fotografía con
 * licencia clara, nunca se usa una imagen sin derechos — se genera
 * una tarjeta gráfica de marca con los datos disponibles. El componente
 * visual está en src/components/editorial/EditorialFallbackCard.tsx;
 * esta función decide cuándo usarlo.
 */
export function shouldUseFallbackCard(media?: { license?: string | null } | null): boolean {
  return !media || !media.license
}
