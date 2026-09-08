## V3.16.0 — 2026-09-08

- Se añade un autodiagnóstico técnico de la tienda de Avatar ejecutable bajo demanda con `?avatar-test=1`.
- La comprobación valida catálogo, IDs, slots, las 9 piezas del Felino, los 8 niveles y los assets del paper-doll.
- La comprobación de assets exige el lienzo estándar 1024×1024.
- El autodiagnóstico no se carga en el uso normal del juego.
- Se conserva íntegramente el sistema de compra, inventario, equipamiento y renderizado de V3.15.5.

## V3.15.5 — 2026-09-07

- Se unifica compra, inventario, equipamiento y renderizado bajo `AvatarSystem`, evitando dos lógicas independientes para el mismo flujo.
- El avatar de la tienda ahora renderiza realmente la capa base y las piezas equipadas/previsualizadas.
- Se amplía la persistencia de slots para conservar también cola, cuello y accesorio del Felino.
- Se corrige la sustitución de piezas del mismo slot y el estado inmediato tras comprar/equipar/desequipar.
- Se mantiene la progresión oficial Aprendiz → Explorador → Aventurero → Guerrero → Héroe → Campeón → Maestro → Leyenda y el bloqueo por nivel.
- El avatar de la tienda permanece sticky durante el desplazamiento, también en móvil.
- El acceso `Tienda` de la pantalla principal queda inmediatamente después de `Mi avatar`.
- Se incorpora el nuevo avatar maestro Felino y capas derivadas del muestrario existente, todas con lienzo 1024×1024.
