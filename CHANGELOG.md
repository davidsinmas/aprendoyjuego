## V3.15.4 — 2026-09-06

- Se corrige estructuralmente la previsualización del Felino: la tienda utiliza directamente su avatar maestro y deja de superponer las piezas del catálogo como capas completas.
- Se elimina el escalado artificial que provocaba que el Felino apareciera ampliado y recortado en la tarjeta.
- El Felino queda centrado y contenido correctamente dentro de su área de previsualización.
- Se añade un botón **Tienda de Avatar** en la pantalla principal para acceder directamente a la tienda.
- Se conserva el flujo de desbloqueo por 350 diamantes y la compra/equipamiento de las 9 piezas.

## V3.15.2 — 2026-09-06

- El equipamiento de la **Categoría 1 · Aventurero** del Felino ahora se muestra también antes de desbloquear el personaje, como catálogo de vista previa.
- Se corrige la presentación de las 9 piezas del Felino mediante sprites individuales del atlas, evitando mostrar el atlas completo dentro de cada tarjeta.
- Se mantiene el bloqueo de compra: primero hay que desbloquear el Felino por **350 diamantes**.
- Se mejora el encuadre de la previsualización del Felino para que el personaje tenga una presencia visual mayor en la tienda.
- Se mantiene el flujo de compra, inventario y equipamiento existente.

## V3.15.1 — 2026-09-06

- El **Felino ahora puede visualizarse antes de comprarlo** desde la tienda de Avatar.
- La selección de un personaje bloqueado ya no intenta comprarlo automáticamente.
- Se añade un botón explícito **Comprar Felino · 350 diamantes** junto a su previsualización.
- La compra descuenta los diamantes y desbloquea inmediatamente el personaje.
- Tras desbloquearlo, el Felino pasa a ser el personaje activo y aparecen sus 9 piezas de la Categoría 1.
- La compra individual de equipamiento queda condicionada a que el personaje esté desbloqueado.
- Se mantiene la compra/equipamiento mediante diamantes y la validación por nivel.

## V3.15.0 — 2026-09-06

- Se incorpora el personaje **Felino** al sistema de avatar.
- Se añade su **Categoría 1 · Aventurero**, con 9 piezas basadas en el muestrario proporcionado: casco, cuello, hombreras, peto, guanteletes, accesorio, piernas, botas y cola.
- La tienda mantiene el flujo **AVATAR → NIVEL → EQUIPAMIENTO** y la nueva colección queda preparada para crecer con categorías posteriores.
- Se amplía el modelo de slots del paper-doll con **cola, cuello y accesorio**.
- Se conserva la jerarquía oficial de ocho niveles: **Aprendiz, Explorador, Aventurero, Guerrero, Héroe, Campeón, Maestro y Leyenda**.
- Los recursos del muestrario se optimizan para web y se incorpora un atlas compacto para la tienda.
