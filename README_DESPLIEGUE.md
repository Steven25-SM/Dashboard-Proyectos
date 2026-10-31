# Laboratorio 11 — versión corregida para GitHub y Vercel

## Correcciones realizadas
- Componentes originales del Ejercicio 1 restaurados en `src/components/styling/`.
- Componentes shadcn/ui del Dashboard conservados en `src/components/ui/`, usando nombres en minúsculas.
- Importaciones del Ejercicio 1 corregidas para evitar colisiones `Button`/`button`, `Badge`/`badge` e `Input`/`input` en Windows y Linux.
- Código TSX de los componentes del Ejercicio 1 y del Dashboard formateado.
- Conservados `/styling`, `/dashboard` y las operaciones CRUD existentes.
- `.git`, `node_modules`, `.next` y otros directorios generados no están incluidos en este ZIP.

## Para comprobar el proyecto en tu computadora
1. Extrae el ZIP y abre la carpeta `next-components-styling`.
2. Ejecuta `npm ci`.
3. Ejecuta `npm run build`.
4. Ejecuta `npm run dev` y comprueba las rutas `/styling` y `/dashboard`.

> La revisión de sintaxis de los `.tsx` pasó. No se pudo completar `npm ci` ni `next build` en el entorno de preparación porque la descarga de paquetes de npm falló; debes comprobar el build local antes de desplegar.

## GitHub (repositorio nuevo para la tarea)

```
git init
git branch -M main
git add .
git commit -m "Tarea 11: Dashboard Tangerine corregido"
git remote add origin https://github.com/Steven25-SM/Dashboard-Proyectos.git
git push -u origin main
```

Si el repositorio remoto contiene commits previos o si `git remote -v` devuelve un remoto distinto, revisa primero antes de ejecutar `git push`.

## Vercel
Importa `Steven25-SM/Dashboard-Proyectos` en https://vercel.com/new con Framework `Next.js`, Root Directory `./` y valores predeterminados. Comprueba `/styling` y `/dashboard` tras el despliegue.
