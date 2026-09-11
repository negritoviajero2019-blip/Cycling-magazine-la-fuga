# Despliegue en Hostinger (Plan Ilimitado)

El hosting del proyecto es el **Plan Ilimitado** de Hostinger (hosting
compartido/Business, sin acceso root). Esto es suficiente para este
proyecto: hPanel ofrece Node.js vía Phusion Passenger, MySQL, y Cron
Jobs — no hace falta un VPS.

## 1. Base de datos

1. hPanel → Bases de datos → MySQL → crear una base de datos y un
   usuario con todos los privilegios sobre ella.
2. Copia el `DATABASE_URL` resultante:
   `mysql://usuario:password@localhost:3306/nombre_bd` (normalmente
   `localhost` porque la app corre en el mismo servidor).
3. Ejecuta la migración inicial: `npm run db:prod:migrate:deploy`
   (desde tu máquina con `DATABASE_URL` apuntando a producción, o vía
   SSH en el propio hosting).

## 2. Aplicación Node.js

1. hPanel → Sitios web → Node.js → crear una aplicación:
   - Directorio: la carpeta donde se despliega el repo (p. ej.
     `cycling-magazine`).
   - Versión de Node: 18 LTS o superior.
   - Archivo de arranque: `node_modules/.bin/next` con argumento
     `start`, o un pequeño `server.js` que invoque `next start` —
     hPanel genera un wrapper compatible con Passenger automáticamente
     al elegir "Next.js" si está disponible en tu versión de hPanel.
2. Variables de entorno: se cargan todas las de `.env.example` desde el
   propio panel de la app Node.js (no subir `.env` al repo).
3. Build: `npm install && npm run build` se ejecuta antes de cada
   despliegue (ver flujo de CI/CD abajo) — el build **no** necesita
   conexión a la base de datos (todas las páginas públicas son
   dinámicas, `dynamic = 'force-dynamic'`).

## 3. CI/CD (GitHub → Hostinger)

Flujo recomendado, documentado en `.github/workflows/deploy.yml`:

```
push a main → GitHub Actions instala deps y hace `next build`
            → rsync por SSH del build al directorio de la app en Hostinger
            → toca tmp/restart.txt (convención Passenger) para reiniciar
```

Credenciales necesarias en GitHub Secrets: `HOSTINGER_SSH_HOST`,
`HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY`, `HOSTINGER_APP_PATH`.

**Alternativa más simple** (sin GitHub Actions): usar el Git deploy
nativo de hPanel apuntando al repo de GitHub — solo hace `git pull`, así
que hay que ejecutar `npm install && npm run build` manualmente o vía un
hook post-recepción en el propio servidor la primera vez que se use
esta vía.

## 4. Dominio y CDN

1. Apunta el dominio a Hostinger (o usa el subdominio temporal que da
   hPanel mientras no haya dominio definitivo).
2. Recomendado: pon **Cloudflare (plan gratuito)** delante como
   DNS/CDN/SSL — solo cambia los nameservers, no requiere tocar código.

## 5. Cron Jobs

Ver `docs/CRON.md` — se configuran desde hPanel → Avanzado → Cron Jobs,
apuntando a los endpoints internos de automatización con `CRON_SECRET`.

## 6. Checklist antes de pasar a producción real

- [ ] `ANTHROPIC_API_KEY` configurada (si no, la automatización sigue
      inactiva de forma segura).
- [ ] `NEXTAUTH_SECRET` generado (`openssl rand -base64 32`).
- [ ] `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` de un admin real (no el de
      seed de desarrollo).
- [ ] `CRON_SECRET` generado y coincide con el configurado en hPanel.
- [ ] Seed de datos ficticios **no** ejecutado contra la BD de
      producción.
- [ ] Textos legales (`/privacy-policy`, `/cookie-policy`, `/terms`)
      revisados — actualmente son placeholders marcados explícitamente.
- [ ] `NEXT_PUBLIC_SITE_URL` apunta al dominio real.
