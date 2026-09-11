# Variables de entorno

Todas están documentadas con su propósito en `.env.example`. Detalle de
las que requieren un paso extra:

## `DATABASE_URL`

- Desarrollo: `file:./prisma/dev.db` (SQLite, cero configuración).
- Producción: `mysql://usuario:password@host:3306/nombre_bd` (desde
  hPanel → Bases de datos).

## `NEXTAUTH_SECRET`

Genera uno con:

```bash
openssl rand -base64 32
```

## `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`

El usuario admin se siembra (desarrollo) o se crea manualmente
(producción) con un hash bcrypt de la contraseña, nunca en texto plano.
Genera el hash con:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_CONTRASEÑA', 10))"
```

En desarrollo, si dejas `ADMIN_PASSWORD_HASH` vacío, el seed usa la
contraseña `changeme123` — **cámbiala antes de producción**.

## `CRON_SECRET`

Cualquier string aleatorio largo, por ejemplo:

```bash
openssl rand -hex 32
```

Debe coincidir exactamente con el header `x-cron-secret` que configures
en los Cron Jobs de hPanel (ver `docs/CRON.md`).

## `ANTHROPIC_API_KEY`

Clave de la API de Anthropic (console.anthropic.com). Sin ella, toda la
automatización editorial queda inactiva de forma segura — no bloquea el
resto del sitio.

## `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`

Opcionales. Si se omiten, no se carga ningún script de analítica ni
publicidad — cero impacto en rendimiento hasta que se activen
deliberadamente.

## `NEWSLETTER_PROVIDER` / `NEWSLETTER_API_KEY`

Opcionales, fase posterior. El formulario de newsletter funciona igual
sin ellas (guarda el email en `NewsletterSubscriber`); conectar un
proveedor real (Brevo/Mailchimp/ConvertKit) es implementar el adapter en
`src/app/api/public/newsletter/route.ts`.
