# Backups y recuperación

## Base de datos (MySQL en Hostinger)

- hPanel incluye copias de seguridad automáticas periódicas del hosting
  (frecuencia según el plan) — verifícalo en hPanel → Copias de
  seguridad.
- Backup manual bajo demanda:
  ```bash
  mysqldump -u USUARIO -p NOMBRE_BD > backup-$(date +%Y%m%d).sql
  ```
- Restauración:
  ```bash
  mysql -u USUARIO -p NOMBRE_BD < backup-YYYYMMDD.sql
  ```
- Recomendado: programar un cron adicional (fuera del sistema editorial)
  que haga `mysqldump` semanal y lo suba a un almacenamiento externo
  (p. ej. un bucket separado) — no depender solo de las copias del
  propio hosting.

## Media (imágenes subidas)

En el MVP, los archivos subidos viven en `public/uploads/` dentro del
propio hosting (`src/lib/media/storage.ts`). Inclúyelos en el backup
del hosting o sincronízalos aparte (`rsync`/descarga periódica). Si más
adelante se migra a Cloudflare R2/S3 (ver `src/lib/media/storage.ts`),
esos proveedores ya incluyen redundancia propia.

## Variables de entorno / credenciales

Nunca se versionan (`.env` está en `.gitignore`). Guarda una copia
cifrada de las variables de producción en un gestor de secretos o
password manager del equipo — sin ellas, redesplegar tras una pérdida
total del servidor requiere reconfigurar todo desde cero.

## Procedimiento de recuperación ante desastre

1. Nuevo hosting/app Node.js en Hostinger (ver `docs/DEPLOYMENT.md`).
2. Restaurar el `.sql` más reciente en una BD MySQL nueva.
3. Restaurar `public/uploads/`.
4. Repoblar las variables de entorno desde el gestor de secretos.
5. `npm run db:prod:push` (por si hay cambios de schema más nuevos
   que el backup).
6. Verificar `/`, `/admin`, `/sitemap.xml`, `/feed.xml`.
