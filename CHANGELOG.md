## V3.15.0 — 2026-09-06

- Se incorpora el personaje **Felino** al sistema de avatar.
- Se añade su **Categoría 1 · Aventurero**, con 9 piezas basadas en el muestrario proporcionado: casco, cuello, hombreras, peto, guanteletes, accesorio, piernas, botas y cola.
- La tienda mantiene el flujo **AVATAR → NIVEL → EQUIPAMIENTO** y la nueva colección queda preparada para crecer con categorías posteriores.
- Se amplía el modelo de slots del paper-doll con **cola, cuello y accesorio**.
- Se conserva la jerarquía oficial de ocho niveles: **Aprendiz, Explorador, Aventurero, Guerrero, Héroe, Campeón, Maestro y Leyenda**.
- Los recursos del muestrario se optimizan para web y se incorpora un atlas compacto para la tienda.

## V3.14.0 — 2026-09-06

- Se establece una única jerarquía oficial de ocho niveles: **Aprendiz, Explorador, Aventurero, Guerrero, Héroe, Campeón, Maestro y Leyenda**.
- Los tres equipamientos actualmente disponibles pasan a corresponder a **Aprendiz, Explorador y Aventurero**.
- La tienda se simplifica al flujo **AVATAR → NIVEL → EQUIPAMIENTO**.
- Cada avatar incorpora su propio nivel y ningún equipamiento de nivel superior puede comprarse ni equiparse.
- Los niveles futuros quedan preparados estructuralmente sin mostrarse como disponibles mientras no tengan equipamientos.
- Se añade migración segura de partidas: identificadores antiguos de equipamiento se transforman a los nuevos identificadores sin perder inventario ni compras.
- Los estados antiguos asociados al segundo nivel se migran al nivel inmediatamente inferior cuando se detectan como datos de avatar heredados.
- Se mantiene el sistema paper-doll y los assets existentes; no se generan nuevos recursos gráficos.
