# Aprendo Jugando

Juego educativo web infantil publicado mediante GitHub Pages.

## Actividades

- Sumas
- Restas
- Mayor o menor
- Palabras
- Sopa de letras
- Sonido inicial
- Sonido final
- Construye la palabra
- Ordena sílabas
- Busca la rima
- Encuentra las diferencias (50 escenas numeradas con 6 cambios cada una)

Las actividades educativas tienen progresión por niveles, recompensas y registro de progreso. Al completar un nivel se puede abrir directamente el siguiente sin regresar al selector.

Encuentra las diferencias mantiene la misma dificultad intermedia en sus 50 escenas. Al terminar una se abre la siguiente y el navegador guarda automáticamente la escena alcanzada.

## Unidades pedagógicas

La sección **Unidades pedagógicas** enseña conceptos nuevos mediante explicaciones breves, apoyos visuales, narración y práctica guiada antes de pasar a los juegos.

La primera unidad, **La misión del puente del 10**, está pensada para niños de 6 años e introduce las restas con números mayores de 10 en cinco misiones: reconocer decenas y unidades, llegar a 10, dividir la resta en dos saltos, resolver pequeñas historias y superar un reto final. Cada misión se completa con al menos el 50 % de aciertos y el avance queda guardado automáticamente en el navegador.

## Retos diarios

Cada día aparecen 5 retos cortos y diferentes. La selección combina actividades de números, palabras, sonidos y sílabas para que el conjunto sea más variado. La dificultad se adapta al progreso de cada actividad y completar un reto diario no desbloquea ni marca como hecho un nivel normal.

## Duelo de Guardianes

Juego de acción para dos jugadores en el mismo dispositivo: uno controla el avatar y el otro un monstruo de aspecto propio. El avatar dispara automáticamente en horizontal, mientras que el disparo del monstruo se dirige hacia la posición del avatar. En la mitad del avatar aparecen mejoras temporales que debe recoger antes de que salgan de la pantalla: disparos más potentes, mayor cadencia y un satélite que orbita y también dispara. El ritmo general aumenta si nadie recibe impactos y vuelve al ritmo normal cuando alguien es alcanzado. Al comenzar una ronda y después de recibir un disparo, cada personaje parpadea y permanece inmune durante 2 segundos. Cada ronda requiere 5 impactos y la partida completa la gana quien consigue primero 3 rondas, al mejor de 5.

Al completar los 5 retos diarios se desbloquea una sola partida de acción. Al terminarla, los juegos vuelven a bloquearse. El Modo Padres permite probar el duelo sin consumir la recompensa diaria.

## Defensa del planeta

Juego de acción cooperativo para dos jugadores. Cada participante controla un guardián dentro de su mitad mientras ambos disparan automáticamente contra los meteoritos. La misión dura 75 segundos, la dificultad aumenta progresivamente y el equipo comparte un escudo de 5 impactos. Se gana resistiendo hasta el final y se pierde si el escudo llega a cero.

Los dos juegos de acción comparten el pase diario de una partida. El Modo Padres permite probarlos sin dejarlos desbloqueados fuera de ese modo.

Todos los juegos utilizan efectos sonoros breves y de volumen moderado para confirmar aciertos y acompañar disparos, impactos, bonus y resultados sin resultar estridentes.

En las actividades habladas de lectoescritura, el enunciado completo se escucha solo en la primera pregunta; las siguientes locuciones pronuncian únicamente la palabra del ejercicio.

Las sumas y las restas se leen automáticamente en voz alta en cada ejercicio, por ejemplo «cuatro más tres» u «ocho menos dos».

Los ejercicios de Palabras conservan siempre la locución y un botón de altavoz: el enunciado completo se añade a la primera palabra y después se pronuncia solo cada palabra. Los retos diarios requieren un mínimo del 50 % de aciertos para marcarse como superados.

Desde la V3.1.1, la entrada a Defensa del planeta utiliza un controlador explícito para asegurar que se abra correctamente tanto desde Inicio como desde el Modo Padres.

## Guardado del progreso

El progreso se conserva en dos copias dentro del navegador. Desde el Modo Padres también puede guardarse en un archivo local mediante **💾 Guardar copia** y restaurarse con **📂 Recuperar copia**. Esta copia permite recuperar la evolución si el navegador elimina sus datos o si se cambia de dispositivo o dirección web.

La primera vez que se abre el Modo Padres se solicita crear un PIN de 4 a 6 cifras. Su huella se guarda solamente en ese navegador y puede cambiarse desde la propia Zona de padres; no forma parte del código público ni del archivo de progreso.

El Modo Padres también permite activar o desactivar las restas con números mayores de 10. La opción está desactivada inicialmente, por lo que las restas se limitan a números hasta 10 hasta que un adulto la habilite. Completar la unidad pedagógica no cambia este ajuste automáticamente.

## Avatar y tienda

El juego incluye el avatar Guardián Nova mediante un sistema paper-doll con capas prealineadas de 1024 × 1024, inventario y tienda-catálogo con 32 piezas en total: 24 de Guardián Nova y 8 de Eclipse Áureo. Eclipse Áureo es una colección de nivel 4 negra y dorada que incluye el Cañón Eclipse Áureo. En V2.18 se afinó el anclaje de espada y escudo directamente en sus capas maestras.

La tienda permite filtrar por colección, categoría y rareza y muestra el estado de cada pieza. Los precios pueden ajustarse globalmente desde el Modo Padres.

## Actualización

Las actualizaciones se distribuyen como un único archivo `actualizacion.zip`, que se sube sin descomprimir a la raíz del repositorio. GitHub Actions valida e instala automáticamente el contenido.
