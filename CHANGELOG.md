## V3.14.0 — 2026-09-06

- Se establece una única jerarquía oficial de ocho niveles: **Aprendiz, Explorador, Aventurero, Guerrero, Héroe, Campeón, Maestro y Leyenda**.
- Los tres equipamientos actualmente disponibles pasan a corresponder a **Aprendiz, Explorador y Aventurero**.
- La tienda se simplifica al flujo **AVATAR → NIVEL → EQUIPAMIENTO**.
- Cada avatar incorpora su propio nivel y ningún equipamiento de nivel superior puede comprarse ni equiparse.
- Los niveles futuros quedan preparados estructuralmente sin mostrarse como disponibles mientras no tengan equipamientos.
- Se añade migración segura de partidas: identificadores antiguos de equipamiento se transforman a los nuevos identificadores sin perder inventario ni compras.
- Los estados antiguos asociados al segundo nivel se migran al nivel inmediatamente inferior cuando se detectan como datos de avatar heredados.
- Se mantiene el sistema paper-doll y los assets existentes; no se generan nuevos recursos gráficos.

## V3.13.0 — 2026-09-05

- El planning pasa a una interfaz interactiva de tipo **lámina deslizante**.
- El menú de etapas puede retirarse lateralmente casi por completo, dejando una pestaña para recuperarlo.
- Al seleccionar una etapa, el menú se retira automáticamente y la etapa ocupa todo el espacio disponible.
- Se mantiene la navegación anterior/siguiente entre etapas.
- Cada etapa muestra progreso, tareas y estado de completitud.
- Las tareas siguen guardándose localmente en el dispositivo.
- La interacción se adapta a móvil, tablet y escritorio.
- Se incorpora soporte para teclado y reducción de movimiento.

## V3.8.17 — 2026-09-03

- El juego **Palabras** exige ahora que todas las palabras objetivo tengan **mínimo 3 sílabas**.
- Se corrigen también los niveles que estaban definidos para 2 sílabas: el filtro efectivo pasa a ser de 3 o más.
- Se evita el fallback que podía volver a introducir palabras de menos de 3 sílabas cuando no había suficientes coincidencias con las restricciones del nivel.
