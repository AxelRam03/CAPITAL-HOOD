/* ==========================================================================
   config.js — TODO lo que cambia de un negocio a otro vive aquí.
   Edita solo este archivo para reutilizar la página con una barbería real.

   Regla: los textos entre [corchetes] son PLACEHOLDERS. Mientras un dato siga
   entre corchetes, la página lo muestra tal cual y NO lo publica en el
   Schema.org ni en los enlaces. Reemplázalos por datos reales antes de publicar.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ---------- Marca ---------- */
  brand: {
    name: "BLACK & RED BARBER SHOP",
    tagline: "CORTES QUE HABLAN POR TI.",
    city: "Ciudad de México",            // se usa en <title>, meta description y Schema
    url: "https://example.com/",     // URL canónica final (con https:// y "/" al final)
    logo: ""                          // ej. "assets/images/logo.svg". Vacío = usa el nombre en texto
  },

  /* ---------- Contacto y redes ---------- */
  contact: {
    phone: "+52 55 0000 0000",
    whatsappNumber: "5215500000000",  // solo dígitos con código de país, ej. 521234567890
    whatsappMessage: "Hola, quiero agendar una cita para corte.",
    instagram: "@blackandred.barber",
    instagramUrl: "",                     // opcional: URL completa (si se deja vacío se arma con el @)
    tiktok: "@blackandred.barber",
    tiktokUrl: ""
  },

  /* ---------- Ubicación y horarios ---------- */
  location: {
    address: "Av. Principal 123, Ciudad de México",
    mapEmbedUrl: "",   // Google Maps → Compartir → Insertar mapa → copia SOLO la URL del src="..."
    mapsLink: "",      // opcional: enlace corto de "Cómo llegar". Vacío = se arma con la dirección
    geo: { lat: null, lng: null }   // ej. { lat: 19.4326, lng: -99.1332 } para el Schema
  },

  // Horario visible en la página
  hours: [
    { days: "Lunes - Sábado", time: "10:00 - 20:00" }
  ],
  // Horario para Google (Schema.org). Formato: "Mo-Sa 09:00-20:00". Vacío = no se publica.
  schemaHours: [],

  /* ---------- Servicios y precios ----------
     price y duration son placeholders: sustitúyelos por los reales. */
  currency: "$",
  services: [
    {
      id: "corte-clasico",
      name: "Corte clásico",
      desc: "Tijera y máquina, contorno limpio y acabado con navaja. El corte de siempre, bien hecho.",
      price: "250",
      duration: "45 min"
    },
    {
      id: "fade",
      name: "Fade",
      desc: "Degradado a tu medida: bajo, medio o alto. Transición limpia de la piel al largo que elijas.",
      price: "300",
      duration: "50 min"
    },
    {
      id: "corte-barba",
      name: "Corte + barba",
      desc: "Corte y perfilado de barba en una sola cita. Sales con todo resuelto.",
      price: "400",
      duration: "70 min"
    },
    {
      id: "barba",
      name: "Barba",
      desc: "Recorte, perfilado y acabado con navaja para una línea limpia.",
      price: "180",
      duration: "30 min"
    },
    {
      id: "black-mask",
      name: "Black mask",
      desc: "Mascarilla negra de limpieza facial. Retira impurezas y deja la piel fresca.",
      price: "200",
      duration: "25 min"
    }
  ],

  // Servicio que aparece en la sección roja. Usa el "id" de un servicio de arriba.
  featuredServiceId: "corte-barba",

  /* ---------- Estadísticas (sustituir por cifras reales) ---------- */
  stats: [
    { value: "+500", label: "Clientes" },
    { value: "+5",   label: "Años" },
    { value: "100%", label: "Estilo" }
  ],

  /* ---------- Testimonios ----------
     Sustituir por reseñas reales. Para conectar Google Reviews después:
     reemplaza este arreglo por el resultado de tu API/widget y llama a
     window.renderReviews(lista) — ver script.js, función renderReviews. */
  testimonials: [
    { quote: "Testimonio real del cliente.", name: "Cliente" },
    { quote: "Testimonio real del cliente.", name: "Cliente" },
    { quote: "Testimonio real del cliente.", name: "Cliente" }
  ],

  /* ---------- Fotografías ----------
     Coloca los archivos en assets/images/ (WebP o AVIF) y escribe la ruta.
     Vacío = se muestra un placeholder identificado con el tamaño recomendado.
     srcset (opcional): "assets/images/g1-600.webp 600w, assets/images/g1-1200.webp 1200w" */
  photos: {
    hero:     { src: "", srcset: "", alt: "" },   // 1200 × 1500  (retrato)
    g1:       { src: "", srcset: "", alt: "" },   // 900 × 1150   fade
    g2:       { src: "", srcset: "", alt: "" },   // 900 × 900    corte clásico
    g3:       { src: "", srcset: "", alt: "" },   // 700 × 1000   barba
    g4:       { src: "", srcset: "", alt: "" },   // 700 × 800    detalle
    g5:       { src: "", srcset: "", alt: "" },   // 900 × 1200   barbero trabajando
    g6:       { src: "", srcset: "", alt: "" },   // 900 × 800    herramientas
    g7:       { src: "", srcset: "", alt: "" },   // 1000 × 700   el local
    interior: { src: "", srcset: "", alt: "" }    // 900 × 1100   interior
  },

  /* ---------- Colores (opcional: la paleta base ya está en css/style.css) ---------- */
  colors: {
    // ink: "#0A0A0A", red: "#C1121F", redDeep: "#78000F", paper: "#F5F1E8", coal: "#181818"
  },

  /* ---------- Reservaciones ----------
     provider:
       "whatsapp" → arma el mensaje con los datos del formulario y abre WhatsApp (default).
       "external" → abre externalUrl (Calendly, Fresha, Booksy, etc.).
       "api"      → hace POST JSON a apiEndpoint con { service, date, time, name, phone }.
     onSubmit (opcional): función propia; si existe, tiene prioridad sobre provider.
       Ejemplo: onSubmit: async (data) => { await miSistema.crear(data); }
     slots: horas que se ofrecen en el formulario. Cuando conectes un sistema real,
     sustitúyelas por la disponibilidad real. */
  booking: {
    provider: "whatsapp",
    externalUrl: "",
    apiEndpoint: "",
    onSubmit: null,
    slots: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00"]
  }
};
