## V3.8.5 — 2026-08-31

- **Defensa planetaria** pasa a un ritmo más táctico: los meteoritos tardan más en caer y los resistentes requieren más impactos para destruirse.
- La velocidad aumenta de forma **sutil por oleadas y nivel**, evitando un salto brusco de dificultad.
- Se incorporan **enemigos de fuego**: algunas naves enemigas descienden lentamente y disparan proyectiles hacia los guardianes.
- Nuevos bonus ofensivos: **MULTI**, que añade disparos simultáneos, y **BOMBA**, que elimina todos los meteoritos y proyectiles enemigos presentes en pantalla.
- Se mantienen los bonus existentes de **disparo rápido, escudo y tiempo lento**.
- Los bonus nuevos se muestran en el HUD y las bombas acumuladas pueden activarse con la tecla **B** en ordenador.
- La frecuencia de bonus se mantiene contenida para que sigan siendo una ayuda estratégica y no una fuente constante de ventajas.

## V3.8.4 — 2026-08-29

- En **Duelo de Guardianes**, la cadencia del monstruo aumenta por etapas mientras no consiga alcanzar al avatar y vuelve al ritmo normal cuando acierta.
- Nuevo bonus poco frecuente para el monstruo: durante ocho segundos sus bolas aumentan de tamaño, sin aumentar el daño.
- Cualquier jugador pierde todas sus mejoras activas al recibir un impacto.
- Los bonus del avatar aparecen un poco menos a menudo y los del monstruo usan un temporizador independiente mucho más espaciado.
- El indicador de ritmo muestra ahora la cadencia específica del monstruo.

## V3.8.3 — 2026-08-26

- Se restaura un único **scroll vertical nativo** y se eliminan los contenedores de desplazamiento superpuestos que lo volvían lento e irregular en móvil.
- La página queda recortada al ancho real de la pantalla con `overflow-x: clip`, sin desplazamiento lateral y sin perjudicar el scroll vertical.
- En pantallas táctiles se desactivan las capas decorativas que obligaban a repintar una superficie mayor que la pantalla durante el desplazamiento.
- Los juegos de pantalla completa conservan su bloqueo de scroll mientras están activos.

## V3.8.2 — 2026-08-26

- En **Duelo de Guardianes**, el disparo normal del avatar ya no se interrumpe nunca, tampoco durante el bonus de láser.
- El láser pausa exclusivamente los perdigones de los satélites y elimina solo los que ya estaban en pantalla.
- Los bonus de potencia y cadencia siguen funcionando con el disparo normal mientras el láser está activo.

## V3.8.1 — 2026-08-25

- Las palabras de la sopa se validan al marcarlas en cualquiera de los dos sentidos: de principio a fin o de fin a principio.
- Si las letras de relleno forman por casualidad otra aparición completa de una palabra objetivo, ese recorrido también se acepta.
- El resaltado verde se aplica sobre la aparición exacta que haya marcado el jugador.

## V3.8.0 — 2026-08-25

- Rehecho el desplazamiento vertical para utilizar un único scroll nativo, sin alternar entre `html`, `body` y `#app`.
- En dispositivos táctiles se desactivan el fondo fijo animado y el desenfoque continuo que provocaban tirones durante el desplazamiento.
- La interfaz queda fijada al ancho del dispositivo y el zoom accidental se bloquea desde el viewport; los campos evitan también el autozoom de iPhone.
- En **Duelo de Guardianes**, el láser es ahora un modo exclusivo: retira los perdigones existentes y pausa los disparos normales y de satélite hasta que termine.
- Los bonus de potencia, cadencia y satélite conservan su tiempo restante mientras el láser está activo.
