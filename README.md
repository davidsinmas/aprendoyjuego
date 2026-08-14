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

Cada actividad tiene progresión por niveles, recompensas y registro de progreso.

## Retos diarios

Cada día aparecen 5 retos cortos y diferentes. La selección combina actividades de números, palabras, sonidos y sílabas para que el conjunto sea más variado. La dificultad se adapta al progreso de cada actividad y completar un reto diario no desbloquea ni marca como hecho un nivel normal.

## Duelo de Guardianes

Juego de acción para dos jugadores en el mismo dispositivo. Cada jugador mueve su guardián con el dedo dentro de su mitad de la pantalla y ambos disparan automáticamente. El ritmo de disparo aumenta si nadie recibe impactos y vuelve al ritmo normal cuando alguien es alcanzado. Al comenzar una ronda y después de recibir un disparo, el guardián parpadea y permanece inmune durante 2 segundos. Cada ronda requiere 5 impactos y la partida completa la gana quien consigue primero 3 rondas, al mejor de 5.

El duelo se desbloquea permanentemente al completar los 5 retos diarios. El Modo Padres permite probarlo y desbloquearlo permanentemente.

## Defensa del planeta

Juego de acción cooperativo para dos jugadores. Cada participante controla un guardián dentro de su mitad mientras ambos disparan automáticamente contra los meteoritos. La misión dura 75 segundos, la dificultad aumenta progresivamente y el equipo comparte un escudo de 5 impactos. Se gana resistiendo hasta el final y se pierde si el escudo llega a cero.

Los dos juegos de acción comparten desbloqueo: se habilitan permanentemente al completar los 5 retos diarios o desde el Modo Padres.

Desde la V3.1.1, la entrada a Defensa del planeta utiliza un controlador explícito para asegurar que se abra correctamente tanto desde Inicio como desde el Modo Padres.

## Avatar y tienda

El juego incluye el avatar Guardián Nova mediante un sistema paper-doll con capas prealineadas de 1024 × 1024, inventario y tienda-catálogo con 32 piezas en total: 24 de Guardián Nova y 8 de Eclipse Áureo. Eclipse Áureo es una colección de nivel 4 negra y dorada que incluye el Cañón Eclipse Áureo. En V2.18 se afinó el anclaje de espada y escudo directamente en sus capas maestras.

La tienda permite filtrar por colección, categoría y rareza y muestra el estado de cada pieza. Los precios pueden ajustarse globalmente desde el Modo Padres.

## Actualización

Las actualizaciones se distribuyen como un único archivo `actualizacion.zip`, que se sube sin descomprimir a la raíz del repositorio. GitHub Actions valida e instala automáticamente el contenido.
