# Cómo actualizar Aprendo Jugando

El sistema automático ya instalado solo necesita un archivo:

1. Sube `actualizacion.zip` a la raíz del repositorio.
2. Confirma el commit.
3. GitHub comprueba, instala y publica la versión automáticamente.

El ZIP debe contener la aplicación completa: `index.html`, `version.json`, `README.md`, `CHANGELOG.md`, `assets/`, `css/` y `js/`.

Si el paquete está incompleto, tiene rutas peligrosas, no cambia nada o su versión no es superior a la instalada, la actualización se detiene con un error claro.
