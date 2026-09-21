/* ==========================================================================
   script.js — Lee js/config.js, rellena la página y maneja las interacciones.
   Sin dependencias. Secciones:
     1. Utilidades
     2. Configuración → DOM (textos, enlaces, fotos, listas, mapa)
     3. SEO local (title, meta, Schema.org)
     4. Navegación móvil
     5. Aparición al hacer scroll
     6. Flujo de reservas (diálogo)
   ========================================================================== */
(() => {
  "use strict";

  const C = window.SITE_CONFIG;
  if (!C) { console.error("Falta js/config.js: la página no puede leer su configuración."); return; }

  /* ------------------------------------------------------------------ 1. Utilidades */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  // Un dato "real" es texto no vacío y que NO está entre [corchetes] (placeholder).
  const filled = (v) => typeof v === "string" && v.trim() !== "" && !/^\[.*\]$/.test(v.trim());
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");

  const brand = C.brand || {};
  const contact = C.contact || {};
  const loc = C.location || {};
  const services = C.services || [];
  const currency = C.currency ?? "$";

  /* ------------------------------------------------------------------ 2. Configuración → DOM */

  // Colores opcionales
  const colorVars = { ink: "--ink", red: "--red", redDeep: "--red-deep", paper: "--paper", coal: "--coal" };
  Object.entries(C.colors || {}).forEach(([k, v]) => {
    if (colorVars[k] && v) document.documentElement.style.setProperty(colorVars[k], v);
  });

  // Textos: <span data-cfg="brand.name">
  $$("[data-cfg]").forEach((el) => {
    const v = get(C, el.dataset.cfg);
    if (v != null && v !== "") el.textContent = v;
  });
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Logo de imagen (opcional)
  if (filled(brand.logo)) {
    const a = $(".logo");
    const img = new Image();
    img.src = brand.logo; img.alt = brand.name || ""; img.height = 32; img.className = "logo__img";
    a.replaceChildren(img);
  }

  // WhatsApp: si aún no hay número real, abre el selector de contacto de WhatsApp con el mensaje.
  const waHref = (text) => {
    const digits = String(contact.whatsappNumber || "").replace(/\D/g, "");
    const msg = encodeURIComponent(text ?? contact.whatsappMessage ?? "");
    return digits ? `https://wa.me/${digits}?text=${msg}` : `https://wa.me/?text=${msg}`;
  };

  // Enlaces: <a data-link="instagram|tiktok|whatsapp|maps|phone">
  const social = (url, handle, base) =>
    filled(url) ? url : filled(handle) ? base + handle.trim().replace(/^@/, "") : "";
  const mapsHref = filled(loc.mapsLink)
    ? loc.mapsLink
    : filled(loc.address) ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(loc.address) : "";
  const links = {
    instagram: social(contact.instagramUrl, contact.instagram, "https://www.instagram.com/"),
    tiktok: social(contact.tiktokUrl, contact.tiktok, "https://www.tiktok.com/@"),
    whatsapp: waHref(),
    maps: mapsHref,
    phone: filled(contact.phone) ? "tel:" + contact.phone.replace(/[^\d+]/g, "") : ""
  };
  $$("[data-link]").forEach((a) => {
    const href = links[a.dataset.link];
    if (!href) return; // placeholder: el enlace queda sin destino hasta tener el dato real
    a.href = href;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-wa]").forEach((a) => { a.href = waHref(); a.target = "_blank"; a.rel = "noopener"; });

  // Fotografías: <figure data-photo="g1"> → <img> si hay ruta; si no, placeholder identificado
  $$("[data-photo]").forEach((fig) => {
    const p = (C.photos || {})[fig.dataset.photo];
    const w = fig.dataset.w, h = fig.dataset.h;
    if (p && p.src) {
      const img = new Image();
      img.src = p.src;
      if (p.srcset) { img.srcset = p.srcset; img.sizes = "(min-width: 900px) 45vw, 92vw"; }
      img.alt = p.alt || "";
      img.width = +w; img.height = +h;
      img.decoding = "async";
      img.loading = fig.hasAttribute("data-eager") ? "eager" : "lazy";
      if (fig.hasAttribute("data-eager")) img.fetchPriority = "high";
      fig.prepend(img);
    } else {
      fig.classList.add("ph--empty");
      const tag = document.createElement("p");
      tag.className = "ph__tag";
      tag.innerHTML = `<strong>Aquí va tu foto real</strong><span>${esc(fig.dataset.label)}</span><span>${esc(w)} × ${esc(h)} px</span>`;
      fig.prepend(tag);
    }
  });

  // Servicios
  const list = $("#service-list");
  if (list) {
    list.innerHTML = services.map((s, i) => `
      <li class="svc rv" data-id="${esc(s.id)}">
        <span class="svc__n" aria-hidden="true">${pad(i + 1)}</span>
        <div class="svc__head">
          <h3 class="svc__name">${esc(s.name)}</h3>
          <span class="svc__leader" aria-hidden="true"></span>
          <p class="svc__price"><span class="cur">${esc(currency)}</span>${esc(s.price)}</p>
        </div>
        <p class="svc__desc">${esc(s.desc)}</p>
        <div class="svc__foot">
          <p class="svc__time">${esc(s.duration)}</p>
          <button type="button" class="btn btn--red btn--sm" data-book data-service="${esc(s.id)}" aria-label="Reservar ${esc(s.name)}">Reservar</button>
        </div>
      </li>`).join("");
  }

  // Servicio destacado
  const featured = services.find((s) => s.id === C.featuredServiceId) || services[0];
  if (featured) {
    const set = (k, v) => $$(`[data-feat="${k}"]`).forEach((el) => { el.textContent = v; });
    set("name", featured.name);
    set("desc", featured.desc);
    set("price", `${currency}${featured.price}`);
    const b = $("[data-feat-book]");
    if (b) b.dataset.service = featured.id;
  }

  // Estadísticas
  const stats = $("#stats");
  if (stats) {
    stats.innerHTML = (C.stats || []).map((s) =>
      `<li class="rv"><span class="stat__n">${esc(s.value)}</span><span class="stat__l">${esc(s.label)}</span></li>`).join("");
  }

  // Testimonios (función pública para conectar Google Reviews después)
  function renderReviews(items) {
    const ul = $("#reviews");
    if (!ul) return;
    ul.innerHTML = (items || []).map((t) => `
      <li class="rv">
        <figure class="quote">
          <span class="quote__mark" aria-hidden="true">“</span>
          <blockquote><p>${esc(t.quote)}</p></blockquote>
          <figcaption>${esc(t.name)}</figcaption>
        </figure>
      </li>`).join("");
  }
  window.renderReviews = renderReviews;
  renderReviews(C.testimonials);

  // Horarios
  const hours = $("#hours");
  if (hours) {
    hours.innerHTML = (C.hours || []).map((h) => `<li><span>${esc(h.days)}</span> <span>${esc(h.time)}</span></li>`).join("");
  }

  // Google Maps
  const map = $("[data-map]");
  if (map && filled(loc.mapEmbedUrl)) {
    const f = document.createElement("iframe");
    f.src = loc.mapEmbedUrl;
    f.title = "Mapa de la ubicación de la barbería";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.allowFullscreen = true;
    map.replaceChildren(f);
    map.classList.add("map--live");
  }

  /* ------------------------------------------------------------------ 3. SEO local */
  const name = filled(brand.name) ? brand.name : "";
  const city = filled(brand.city) ? brand.city : "";
  if (name) {
    const title = city ? `${name} | Barbería en ${city}` : name;
    document.title = title;
    $$('meta[property="og:title"], meta[name="twitter:title"]').forEach((m) => m.setAttribute("content", title));
  }
  if (city) {
    const desc = `Barbería en ${city}. Cortes, fades, barba y servicios de grooming. Reserva tu cita.`;
    $$('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((m) => m.setAttribute("content", desc));
  }
  if (filled(brand.url) && !/\[.*\]/.test(brand.url)) {
    $("link[rel=canonical]")?.setAttribute("href", brand.url);
    $('meta[property="og:url"]')?.setAttribute("content", brand.url);
    const og = new URL("assets/images/og.jpg", brand.url).href;
    $('meta[property="og:image"]')?.setAttribute("content", og);
    $('meta[name="twitter:image"]')?.setAttribute("content", og);
  }

  // Schema.org BarberShop: solo campos con datos reales (nunca placeholders)
  const ld = { "@context": "https://schema.org", "@type": "BarberShop" };
  if (name) ld.name = name;
  if (filled(brand.url) && !/\[.*\]/.test(brand.url)) ld.url = brand.url;
  if (filled(contact.phone)) ld.telephone = contact.phone;
  if (filled(loc.address)) ld.address = { "@type": "PostalAddress", streetAddress: loc.address, ...(city && { addressLocality: city }) };
  if (loc.geo && typeof loc.geo.lat === "number" && typeof loc.geo.lng === "number") {
    ld.geo = { "@type": "GeoCoordinates", latitude: loc.geo.lat, longitude: loc.geo.lng };
  }
  if ((C.schemaHours || []).length) ld.openingHours = C.schemaHours;
  const sameAs = [links.instagram, links.tiktok].filter(Boolean);
  if (sameAs.length) ld.sameAs = sameAs;
  const schemaEl = $("#schema");
  if (schemaEl) schemaEl.textContent = JSON.stringify(ld);

  /* ------------------------------------------------------------------ 4. Navegación móvil */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.documentElement.classList.toggle("lock", open);
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });
  window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ------------------------------------------------------------------ 5. Aparición al hacer scroll */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ------------------------------------------------------------------ 6. Flujo de reservas */
  const dlg = $("#booking");
  const form = $("#book-form");
  const B = C.booking || {};
  const STEPS = ["service", "date", "time", "name", "phone", "confirm"];
  const stepEls = STEPS.map((s) => $(`[data-step="${s}"]`, form));
  const bar = $$(".book__progress i");
  const errEl = $("#book-error");
  const btnPrev = $("[data-prev]", form);
  const btnNext = $("[data-next]", form);
  const state = { step: 0, data: {}, done: false };

  // Opciones de servicio y de hora (radios reales, con estilos propios)
  $("#book-services").innerHTML = services.map((s) => `
    <label class="opt">
      <input type="radio" name="service" value="${esc(s.id)}">
      <span class="opt__box"><b>${esc(s.name)}</b><em>${esc(currency)}${esc(s.price)} · ${esc(s.duration)}</em></span>
    </label>`).join("");
  $("#book-times").innerHTML = (B.slots || []).map((t) => `
    <label class="time">
      <input type="radio" name="time" value="${esc(t)}">
      <span>${esc(t)}</span>
    </label>`).join("");

  // Fecha mínima = hoy (hora local)
  const dateInput = $("#book-date");
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = today;

  const serviceById = (id) => services.find((s) => s.id === id);
  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const t = new Date(y, m - 1, d).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const finalLabel = () =>
    typeof B.onSubmit === "function" ? "Confirmar cita"
      : B.provider === "external" ? "Continuar para reservar"
      : B.provider === "api" ? "Enviar reserva"
      : "Confirmar por WhatsApp";
  const finalNote = () =>
    typeof B.onSubmit === "function" || B.provider === "api" ? "Enviaremos tu solicitud y te confirmaremos la cita."
      : B.provider === "external" ? "Se abrirá el sistema de reservas para terminar tu cita."
      : "Se abrirá WhatsApp con tu solicitud lista. La cita queda confirmada cuando envías el mensaje.";

  function collect() {
    return {
      service: (form.elements.service.value || ""),
      date: dateInput.value,
      time: (form.elements.time.value || ""),
      name: $("#book-name").value.trim(),
      phone: $("#book-phone").value.trim()
    };
  }

  function validate(i) {
    const d = collect();
    switch (STEPS[i]) {
      case "service": return d.service ? "" : "Elige un servicio para continuar.";
      case "date":    return d.date && d.date >= today ? "" : "Elige una fecha válida, desde hoy.";
      case "time":    return d.time ? "" : "Elige una hora para continuar.";
      case "name":    return d.name.length >= 2 ? "" : "Escribe tu nombre para continuar.";
      case "phone":   return d.phone.replace(/\D/g, "").length >= 8 ? "" : "Escribe un teléfono válido, con al menos 8 dígitos.";
      default:        return "";
    }
  }

  function show(i) {
    state.step = i;
    stepEls.forEach((el, k) => { el.hidden = k !== i; });
    bar.forEach((b, k) => b.classList.toggle("on", k <= i));
    $("#book-count").textContent = `Paso ${i + 1} de ${STEPS.length}`;
    btnPrev.hidden = i === 0;
    btnNext.textContent = i === STEPS.length - 1 ? finalLabel() : "Siguiente";
    errEl.textContent = "";

    if (STEPS[i] === "confirm") {
      const d = collect(), s = serviceById(d.service);
      $("#book-summary").innerHTML = `
        <div><dt>Servicio</dt><dd>${esc(s ? s.name : d.service)}</dd></div>
        <div><dt>Fecha</dt><dd>${esc(fmtDate(d.date))}</dd></div>
        <div><dt>Hora</dt><dd>${esc(d.time)}</dd></div>
        <div><dt>Nombre</dt><dd>${esc(d.name)}</dd></div>
        <div><dt>Teléfono</dt><dd>${esc(d.phone)}</dd></div>`;
      $("#book-note").textContent = finalNote();
    }
    // Lleva el foco al primer control del paso nuevo
    const first = stepEls[i].querySelector("input:checked, input");
    if (first) first.focus({ preventScroll: true });
  }

  function finish(title, text) {
    state.done = true;
    stepEls.forEach((el) => { el.hidden = true; });
    $("#book-done").hidden = false;
    $("#book-done-title").textContent = title;
    $("#book-done-text").textContent = text;
    $(".book__progress").hidden = true;
    $("#book-count").textContent = "";
    btnPrev.hidden = true;
    btnNext.textContent = "Cerrar";
    errEl.textContent = "";
  }

  async function submit() {
    const d = collect(), s = serviceById(d.service);
    const text = [
      contact.whatsappMessage || "Hola, quiero agendar una cita.",
      `Servicio: ${s ? s.name : d.service}`,
      `Fecha: ${fmtDate(d.date)}`,
      `Hora: ${d.time}`,
      `Nombre: ${d.name}`,
      `Teléfono: ${d.phone}`
    ].join("\n");

    try {
      if (typeof B.onSubmit === "function") {
        btnNext.disabled = true;
        await B.onSubmit(d);
        finish("Solicitud enviada", `Gracias, ${d.name}. Te confirmaremos tu cita.`);
      } else if (B.provider === "external" && filled(B.externalUrl)) {
        window.open(B.externalUrl, "_blank", "noopener");
        finish("Un paso más", "Termina tu reserva en la ventana que se abrió.");
      } else if (B.provider === "api" && filled(B.apiEndpoint)) {
        btnNext.disabled = true;
        const r = await fetch(B.apiEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
        if (!r.ok) throw new Error("HTTP " + r.status);
        finish("Solicitud enviada", `Gracias, ${d.name}. Te confirmaremos tu cita.`);
      } else {
        window.open(waHref(text), "_blank", "noopener");
        finish("Abrimos WhatsApp", "Envía el mensaje que quedó listo para confirmar tu cita.");
      }
    } catch (err) {
      console.error("Reserva:", err);
      errEl.textContent = "No pudimos enviar tu reserva. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp.";
    } finally {
      btnNext.disabled = false;
    }
  }

  function openBooking(serviceId) {
    if (typeof dlg.showModal !== "function") { window.open(waHref(), "_blank", "noopener"); return; }
    if (state.done) { form.reset(); state.done = false; state.step = 0; $("#book-done").hidden = true; $(".book__progress").hidden = false; }
    let start = state.step;
    if (serviceId && serviceById(serviceId)) {
      const r = $(`input[name=service][value="${CSS.escape(serviceId)}"]`, form);
      if (r) r.checked = true;
      if (STEPS[start] === "service") start = 1;   // ya eligió servicio: pasa a la fecha
    }
    show(Math.min(start, STEPS.length - 1));
    dlg.showModal();
    document.documentElement.classList.add("lock");
  }

  btnNext.addEventListener("click", () => {
    if (state.done) { dlg.close(); return; }
    const msg = validate(state.step);
    if (msg) { errEl.textContent = msg; return; }
    if (state.step === STEPS.length - 1) submit(); else show(state.step + 1);
  });
  btnPrev.addEventListener("click", () => show(Math.max(0, state.step - 1)));
  form.addEventListener("submit", (e) => { e.preventDefault(); btnNext.click(); });   // Enter avanza
  form.addEventListener("input", () => { errEl.textContent = ""; });   // "input" (no "change"): evita que el mensaje desaparezca al tocar el botón y el toque se pierda
  $("[data-close]", form).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });       // clic en el fondo cierra
  dlg.addEventListener("close", () => { if (!nav.classList.contains("is-open")) document.documentElement.classList.remove("lock"); });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-book]");
    if (!b) return;
    e.preventDefault();
    setMenu(false);
    openBooking(b.dataset.service);
  });
})();
