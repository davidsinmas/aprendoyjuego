## V3.15.5 — 2026-09-07

- Se unifica compra, inventario, equipamiento y renderizado bajo `AvatarSystem`, evitando dos lógicas independientes para el mismo flujo.
- El avatar de la tienda ahora renderiza realmente la capa base y las piezas equipadas/previsualizadas.
- Se amplía la persistencia de slots para conservar también cola, cuello y accesorio del Felino.
- Se corrige la sustitución de piezas del mismo slot y el estado inmediato tras comprar/equipar/desequipar.
- Se mantiene la progresión oficial Aprendiz → Explorador → Aventurero → Guerrero → Héroe → Campeón → Maestro → Leyenda y el bloqueo por nivel.
- El avatar de la tienda permanece sticky durante el desplazamiento, también en móvil.
- El acceso `Tienda` de la pantalla principal queda inmediatamente después de `Mi avatar`.
- Se incorpora el nuevo avatar maestro Felino y capas derivadas del muestrario existente, todas con lienzo 1024×1024.
