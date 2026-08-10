# Changelog

## V2.11.1 — 2026-08-10
- Corregido el flujo automático para que pueda guardar la actualización aunque no exista la antigua carpeta `tools/`.
- Se conserva íntegramente la colección Guardián Nova y todas las mejoras de tienda de V2.11.0.

## V2.11.0 — 2026-08-09
- Primera colección gráfica real: Guardián Nova, con ocho piezas equipables.
- Capas del avatar prealineadas sobre el lienzo maestro de 1024 × 1024 px.
- Miniaturas optimizadas independientes de las capas utilizadas por el avatar.
- Nueva tienda responsive con catálogo, rarezas y vista previa antes de comprar.
- Compra y equipamiento en un solo paso, conservando el control desde el inventario.
- Nuevo centro de avatar, progreso de colección e inventario con previsualización.
- Eliminación automática de los objetos técnicos antiguos del progreso guardado.

## V2.10.0 — 2026-08-09
- Tienda visual conectada al catálogo de equipamiento.
- Compra de objetos con diamantes y control de saldo.
- Inventario persistente con acciones para equipar y quitar objetos.
- Accesos directos a avatar y logros desde la pantalla principal.
- Dos objetos técnicos para comprobar el flujo completo sin sustituir el arte definitivo.
- Versión única en `version.json` y carga de recursos con control de caché.
- Actualización automática mediante un único archivo `actualizacion.zip`.
- Eliminación de copias JavaScript obsoletas dentro de `css/`.

## V2.9.0 — 2026-08-08
- Nueva infraestructura de avatar paper-doll independiente de la tienda.
- Lienzo maestro fijado en 1024 × 1024 px.
- Capas equipables sin coordenadas, escala ni rotación individual.
- Catálogo de objetos separado en `js/avatar-data.js`.
- Motor de renderizado y equipamiento en `js/avatar.js`.
- Persistencia de inventario y equipamiento en `storage.js`.
- Validación de catálogo y dimensiones de assets.
- Estructura de carpetas preparada para avatar, armaduras, armas, escudos y efectos.

## V2.8.0 — 2026-08-08
- Zona de padres protegida con contraseña.
- Modo Padres temporal con acceso de prueba a todos los niveles.
- Edición manual de nivel de jugador y XP.
- Controles de diamantes: -100, +100, +500 y cantidad exacta.
- Botón para desactivar el modo Padres y restaurar los bloqueos normales.
- Se mantienen nombre, exportación/importación y borrado del progreso.

## V2.7.0
- 10 niveles progresivos de palabras y sopas de letras.
