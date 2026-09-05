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

## V3.8.16 — 2026-09-02

- **Tank Pixel** pasa a formato **mejor de 3**: gana la partida el jugador que consiga 2 rondas.
- Los tanques aumentan su vida de **5 a 7 puntos** por ronda.
- Se reduce la frecuencia de disparo normal y del bonus de **CADENCIA** para dar un ritmo más táctico.
- Al terminar una ronda se hace una pausa breve y se reinicia el escenario para la siguiente; el marcador de rondas se conserva.
- El desbloqueo desde **Zona de padres** queda unificado para los **tres juegos de acción**: el botón concede **una sola partida compartida** y el acceso se consume al iniciar cualquiera de ellos.

## V3.8.11 — 2026-09-02

- Los **Retos diarios no se eliminan**: quedan conservados y se pueden volver a activar desde la Zona de padres.
- Nuevo modo diario por defecto: **contador de niveles**.
- El objetivo inicial es completar **10 niveles diferentes al día** para desbloquear los juegos de acción.
- Cada nivel cuenta **una sola vez por día**; repetir un nivel no incrementa el contador.
- En la Zona de padres se añade **Progreso diario**, con selector entre **Niveles** y **Retos**.
- El número de niveles necesarios es configurable desde Padres, con un mínimo de 10 y máximo de 100.
- El contador se reinicia automáticamente cada día.
- El desbloqueo de los juegos de acción mantiene el pase diario existente: completar el objetivo permite una partida compartida entre los juegos de acción.
