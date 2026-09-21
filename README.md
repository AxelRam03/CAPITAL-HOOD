# Landing de barbería — cartel pintado a mano

HTML + CSS + JavaScript sin dependencias (solo Google Fonts). Se abre con doble clic en `index.html`.

## Dirección de arte

**Idea:** un cartel de barbería pintado a mano sobre pared negra. Estilo hecho a mano, precisión de barbero, personalidad propia.

| Elemento | Decisión |
|---|---|
| Logo | Nombre en Bowlby One (rótulo pesado) junto a unas tijeras dibujadas en rojo. Si hay logo propio, va en `config.brand.logo`. |
| Títulos | Bowlby One en mayúsculas, con borde de tinta irregular (filtro SVG `#ink`). Frases de firma (nombre en el hero, «Sal como leyenda.», «Agenda en minutos.») en Yellowtail, como trazo de pincel. |
| Texto | Barlow: limpia, legible, de rotulación. |
| Rojo | Solo donde hay acción o valor: botones, precios, trazo de pincel del hero, sección destacada, cinta de poste. Nunca como fondo general (excepto la sección destacada). |
| Botones | Rectángulo casi recto con sombra dura desplazada (como impresión desalineada). Hover: se despega; clic: se hunde. Sin degradados ni sombras difusas. |
| Iconos | Trazo grueso y redondeado, dibujados a mano (tijeras, navaja, peine, frasco, estrella). Sprite SVG en `index.html`. |
| Separadores | Franja de poste de barbero (rojo/blanco/negro), línea ondulada dibujada a mano, papel rasgado entre secciones oscuras y claras. |
| Numeración | Números con contorno. Solo aparecen donde hay secuencia real: servicios, motivos, pasos de reserva. |
| Fotografías | Blanco y negro duro; color al pasar el cursor. Cinta adhesiva sobre las fotos. Se cambia con `--photo-filter` en `css/style.css`. |
| Textura | Grano fino sobre toda la página (5 % de opacidad). |
| Ritmo | Cada sección tiene su propia composición: hero de cartel, papel claro, carta de precios, campaña roja, galería de revista, etc. |

**Movimiento:** una sola entrada orquestada (el trazo rojo del hero). El resto es discreto: líneas que se dibujan, fotos que se asientan, botones que responden. Todo se desactiva con `prefers-reduced-motion`.

## Estructura

```
index.html          contenido y estructura
css/style.css       sistema visual (tokens al inicio)
js/config.js        ← EDITA SOLO ESTE ARCHIVO para cada negocio
js/script.js        render desde la configuración, navegación, reservas, SEO
assets/images/      fotos (WebP/AVIF), logo, og.jpg
assets/icons/       favicon.svg
```

## Qué editar en `js/config.js`

Nombre, ciudad, URL, teléfono, WhatsApp, Instagram, TikTok, dirección, horarios, servicios con precio y duración, servicio destacado, estadísticas, testimonios, fotos, colores y modo de reservas.

Todo lo que esté entre `[corchetes]` es placeholder: se ve en la página, pero **no** se publica en enlaces ni en Schema.org.

## Reservas

El botón **Reservar cita** abre un flujo de 6 pasos: servicio → fecha → hora → nombre → teléfono → confirmación. Destino en `config.booking.provider`:

- `"whatsapp"` (por defecto): abre WhatsApp con el mensaje armado.
- `"external"`: abre Calendly, Fresha, Booksy, etc. (`externalUrl`).
- `"api"`: `POST` JSON a `apiEndpoint`.
- `onSubmit(data)`: función propia; tiene prioridad sobre las anteriores.

Las horas del formulario (`slots`) son ejemplos. Cuando conectes un sistema real, sustitúyelas por la disponibilidad real.

## Antes de publicar

1. Reemplazar todos los `[placeholders]` de `config.js`.
2. Subir fotos reales (WebP/AVIF) a `assets/images/` y escribir sus rutas en `config.photos`. Tamaños recomendados en los comentarios de `config.js`. Añadir `alt` descriptivo a cada una.
3. Añadir `assets/images/og.jpg` (1200 × 630) para compartir en redes.
4. Escribir en `index.html` (`<title>`, meta description, canonical y Open Graph) los datos reales, para buscadores que no ejecutan JavaScript.
5. Pegar la URL de inserción de Google Maps en `location.mapEmbedUrl`.
6. Añadir `schemaHours` (formato `"Mo-Sa 09:00-20:00"`) y `geo` para el SEO local.
7. Sustituir estadísticas y testimonios por datos reales.
8. Integrar el feed real de Instagram dentro de `[data-instagram-feed]`.
9. Probar en móvil real.

## Google Reviews (opcional)

`window.renderReviews([{ quote, name }, ...])` pinta los testimonios. Cuando tengas la API o el widget, llama a esa función con las reseñas reales.
