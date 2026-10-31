# Laboratorio 11 — Parche visual Tangerine

Este parche **solo modifica la apariencia** de la ruta `/dashboard` de la Tarea 11.
No reemplaza `globals.css`, `src/app/styling`, `package.json`, ni los componentes generados por shadcn/ui.

## Instalación
1. Asegúrate de tener instalada la **tarea anterior**, que contiene los CRUD.
2. Copia los archivos `src/app/dashboard/page.tsx` y `src/app/dashboard/TangerineDashboard.module.css` de este ZIP a las mismas rutas dentro de tu proyecto `laboratorio-11`.
3. Acepta sobrescribir únicamente `page.tsx` de `/dashboard`.
4. Ejecuta `npm run dev` y abre `http://localhost:3000/dashboard`.
5. Ejecuta `npm run build` antes de hacer push y desplegar en Vercel.

**Se conserva:** Resumen, proyectos, miembros, tareas, CRUD, paginación, alertas, spinner, calendarios y configuración. Los datos siguen estando en memoria.

**Paleta Tangerine:** naranja `#FF822E`, casi negro `#171719`, fondo hueso `#F5F3F0`, blanco `#FFFFFF`.

Nota: el código funcional proviene del parche de la tarea entregado previamente; no se ha reescrito ninguna función de la lógica del Dashboard.
