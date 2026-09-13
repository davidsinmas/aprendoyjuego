## V3.15.3 — 2026-09-13

- Sincroniza todas las opciones de la Zona de padres mediante la cuenta Ludeiko conectada.
- Los cambios aparecen en los demás dispositivos mediante actualización en tiempo real.
- Al volver a una pestaña o recuperar la conexión, primero descarga la configuración más reciente para evitar sobrescribirla con una copia antigua.
- Añade un botón «Sincronizar ahora» y una comprobación automática cada 30 segundos como respaldo.

## V3.15.2 — 2026-09-13

- Sustituye la síntesis de voz del navegador por locuciones femeninas naturales en español de España.
- Añade un catálogo completo para números del 0 al 200, operaciones, vocabulario, instrucciones y unidad pedagógica.
- Mantiene la voz, el ritmo rápido y el tono entusiasta aprobados en todas las actividades.
- Empaqueta las locuciones en bloques de audio con marcas temporales para reducir el número de descargas.

## V3.15.1 — 2026-09-12

- Sustituye los tonos de refuerzo por locuciones femeninas naturales en español de España.
- Añade mensajes breves para acierto, error y bonus sin ralentizar el ritmo de los ejercicios.
- Añade locuciones específicas para avance de dificultad, nivel completado, objetivo diario, logro, subida de nivel, ronda, victoria y derrota.
- Conserva los efectos procedurales de disparos, rebotes, impactos, cuenta atrás, meteoritos y escudos.
- Mantiene los tonos anteriores como respaldo si un archivo de voz no pudiera reproducirse.

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

## V3.8.8 — 2026-08-31

- Los bonus ofensivos pasan a ser **temporales**: disparo rápido, MULTI, tiempo lento y BOMBA pierden su efecto cuando se agota su tiempo.
- El HUD muestra una **barra de duración** que se vacía en tiempo real y los segundos restantes.
- Cuanto mayor es la ventaja, **menor es su duración**: rápido 7 s, MULTI 6 s, tiempo lento 5 s y bomba 5 s.
- La **frecuencia de aparición de bonus baja considerablemente** y los bonus más potentes tienen una probabilidad menor de aparecer.
- La bomba pasa a ser un recurso que debe **activarse antes de que expire**; en ordenador se activa con **B** y también aparece un botón táctil cuando está disponible.
- Se añaden **misiles guiados de defensa** que buscan automáticamente las rocas que están próximas al suelo y las interceptan.
- Los enemigos que disparan aumentan su frecuencia de fuego conforme avanzan las oleadas y el nivel.
- Se incorporan **cuatro modelos de enemigos de disparo**: explorador, rápido, dispersión y ráfaga.
- Cada modelo utiliza un **tipo de proyectil diferente**: disparo directo, proyectil rápido, abanico de tres proyectiles y ráfaga de tres disparos.
- Los enemigos de mayor categoría aparecen progresivamente en oleadas posteriores para mantener una escalada de dificultad.

## V3.8.5 — 2026-08-31

- **Defensa planetaria** pasa a un ritmo más táctico: los meteoritos tardan más en caer y los resistentes requieren más impactos para destruirse.
- La velocidad aumenta de forma **sutil por oleadas y nivel**, evitando un salto brusco de dificultad.
- Se incorporan **enemigos de fuego**: algunas naves enemigas descienden lentamente y disparan proyectiles hacia los guardianes.
- Nuevos bonus ofensivos: **MULTI**, que añade disparos simultáneos, y **BOMBA**, que elimina todos los meteoritos y proyectiles enemigos presentes en pantalla.
- Se mantienen los bonus existentes de **disparo rápido, escudo y tiempo lento**.
- Los bonus nuevos se muestran en el HUD y las bombas acumuladas pueden activarse con la tecla **B** en ordenador.
