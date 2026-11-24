# ApiTienda

Configura `DATABASE_URL` en `.env` para una base PostgreSQL que use el esquema `public`. Ejecuta los comandos desde la carpeta `api`.

## Base de datos nueva

```powershell
npm ci
npx prisma migrate deploy
npm run build
```

## Base de datos existente

Si la base ya contiene las tablas originales de la tienda y todavía no tiene historial de Prisma, comprueba que su estructura coincida con la migración `0_init`. Si coincide, registra esa migración como aplicada antes de ejecutar las pendientes.

```powershell
npm ci
npx prisma migrate resolve --applied 0_init
npx prisma migrate deploy
npm run build
```

Si ya existe un historial de Prisma, usa `npx prisma migrate status` para revisar el estado antes de desplegar. Si las tablas de usuarios y permisos se crearon anteriormente con SQL, compara su estructura con la migración `20261123000000_users_rbac` antes de decidir si corresponde registrarla como aplicada.
