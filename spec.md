# Santa Fe de Antioquia — Galería del Apartamento

## Resumen

Página web estática para mostrar fotografías de un apartamento ubicado en
Santa Fe de Antioquia, Colombia. Las imágenes se organizan en secciones
con carruseles generados dinámicamente según la convención de nombres.
No requiere dependencias externas ni paso de compilación.

## Stack técnico

- HTML5, CSS3, JavaScript vanilla
- Sin dependencias externas
- Sin paso de compilación

## Estructura del proyecto

```
./
├── index.html          # Página principal
├── styles.css          # Estilos visuales (temática colonial)
├── app.js              # Lógica: carruseles dinámicos
├── package.json        # Script de desarrollo
├── spec.md             # Esta especificación
└── images/             # Carpeta con las fotografías
    ├── Habitaciones-01.jpg
    ├── Habitaciones-02.jpg
    ├── Sala-01.jpg
    ├── Cocina-01.jpg
    ├── headerCitadela.png     # Imagen de fondo del header
    ├── headerPueblo.jpg       # Imagen de fondo del header
    ├── Habitaciones-01.jpg
    ├── Habitaciones-02.jpg
    ├── Sala-01.jpg
    ├── Cocina-01.jpg
    ├── Banos-01.jpg
    ├── ZonasComunes-01.jpg
    └── Otros-01.jpg
```

## Header

El encabezado combina dos imágenes (`headerCitadela.png` y `headerPueblo.jpg`)
usando CSS `background-blend-mode: overlay` para crear un efecto visual
mixto. Sobre ellas se aplica un degradado oscuro semitransparente para
garantizar la legibilidad del texto.

Para cambiar las imágenes del header, reemplazar los archivos
`headerCitadela.png` y `headerPueblo.jpg` en la carpeta `images/`.

## Convención de nombres de imágenes

Colocar los archivos en `images/` siguiendo el formato:

```
{Sección}-{NN}.{ext}
```

Donde:
- **Sección**: nombre exacto de la sección (Habitaciones, Sala, Cocina, Banos, ZonasComunes, Otros) — debe coincidir con el campo `file` en `app.js`
- **NN**: número consecutivo de dos dígitos (01, 02, 03…) — también soporta sin padding (1, 2, 3…)
- **ext**: jpg, jpeg, webp o png

El JavaScript explora automáticamente los números desde 01 hasta 30 y
detiene la búsqueda al primer faltante. No es necesario registrar las
imágenes en ningún archivo de configuración.

Ejemplos válidos:
- `Habitaciones-01.jpg`
- `Sala-01.webp`
- `ZonasComunes-01.png`

## Cómo agregar o quitar imágenes

### Agregar
1. Colocar el archivo en `images/` con la convención de nomenclatura
2. Si la sección ya existe, numerar consecutivamente
3. Si no existe la sección, crear la primera imagen con -01

### Quitar
1. Eliminar el archivo de `images/`
2. Renombrar las imágenes restantes para mantener la secuencia numérica

## Secciones disponibles

| Sección         | file             | Descripción                          |
|-----------------|------------------|--------------------------------------|
| Recomendaciones | — (especial)     | Imagen informativa (hero card)       |
| Habitaciones    | Habitaciones     | Dormitorios                          |
| Sala            | Sala             | Sala principal                       |
| Cocina          | Cocina           | Cocina                               |
| Baños           | Banos            | Baños                                |
| Zonas Comunes   | ZonasComunes     | Áreas compartidas del edificio       |
| Otros           | Otros            | Otras fotografías de interés         |

Cada sección regular tiene tres campos en `app.js`:
- **`id`**: identificador para el ancla en la URL
- **`label`**: texto visible en la página
- **`file`**: prefijo para buscar las imágenes en `images/`

La sección **Recomendaciones** es especial: no usa el descubrimiento automático de imágenes. En lugar de un carrusel, muestra una imagen fija (`images/Recomendaciones.jpeg`) en una tarjeta de ancho completo. Se define con `special: true` y aparece primero en la navegación con una animación de pulso para atraer la atención.

Para agregar, renombrar o eliminar secciones, editar el arreglo `SECTIONS` en `app.js`.

## Vista local

### Opción 1 — npm
```bash
npm run dev
```

### Opción 2 — Python
```bash
python -m http.server 8080
```

### Opción 3 — Node.js (npx)
```bash
npx serve .
```

Abrir en el navegador: http://localhost:8080

## Despliegue en GitHub Pages

1. Crear un repositorio en GitHub (ej: `apartamento-santafe`)
2. Inicializar git y hacer push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/{usuario}/{repositorio}.git
   git push -u origin main
   ```
3. En GitHub: Settings → Pages → Source: **Deploy from a branch** → branch: `main`, folder: `/ (root)`
4. La página quedará publicada en `https://{usuario}.github.io/{repositorio}/`

> Si usas un repositorio con nombre `{usuario}.github.io`, la URL será
> `https://{usuario}.github.io/` (sin subcarpeta).

## Personalización

- **Colores y estilo colonial**: editar `styles.css` (variables CSS en `:root`)
- **Secciones**: editar el arreglo `SECTIONS` en `app.js`
- **Imágenes**: solo agregar o quitar archivos en `images/`

## Licencia

Uso personal.
