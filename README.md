# ProyectoWeb — Buscador de Patógenos

Aplicación web que permite buscar información sobre patógenos. Muestra descripciones y tratamientos adaptados tanto para el público general como para expertos. Los datos se obtienen desde una **base de datos local (MySQL)** o, si no se encuentra el patógeno, desde **Wikipedia** automáticamente.

---

## Tecnologías

- Node.js + Express
- MySQL (mysql2)
- Wikipedia REST API
- Bootstrap 5

---

## Instalación y uso

1. Crear la base de datos ejecutando el script `scriptBase.sql` en MySQL.
2. Instalar dependencias:
```bash
npm install
```
3. Iniciar el servidor:
```bash
node server.js
```
4. Abrir en el navegador: `http://localhost:3000`

---

## Cambios respecto al avance anterior

- **Indicador de fuente:** se agregó un badge visual que indica si los datos provienen de la base de datos local o de Wikipedia.
- **Encoding UTF-8:** se corrigió el problema con acentos, tildes y ñ en los datos de la base de datos.
- **Mejora de CSS:** rediseño completo de la interfaz, imágenes de fondo a pantalla completa y buscador con diseño moderno.
- **Corrección del patrón MVC:** se separaron correctamente las responsabilidades en modelos, servicios, controladores y rutas, corrigiendo la mezcla de lógica que existía en el avance anterior.

---

## Integrantes

- Cristian Barrales