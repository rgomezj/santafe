var SERVICES_DATA = [
  {
    icon: '\uD83C\uDF04',
    title: 'Vistas panor\u00e1micas',
    items: [
      'Vista a la piscina',
      'Vista al complejo tur\u00edstico',
    ],
  },
  {
    icon: '\uD83D\uDEC1',
    title: 'Ba\u00f1o',
    items: [
      'Productos de limpieza',
      'Champ\u00fa',
      'Jab\u00f3n corporal',
      'Agua caliente',
      'Gel de ducha',
    ],
  },
  {
    icon: '\uD83D\uDECF\uFE0F',
    title: 'Dormitorio y lavadero',
    items: [
      { name: 'Lavadora en la vivienda', detail: 'Gratis' },
      { name: 'Servicios b\u00e1sicos', detail: 'Toallas, s\u00e1banas, jab\u00f3n y papel higi\u00e9nico' },
      'Ganchos para la ropa',
      'S\u00e1banas',
      'S\u00e1banas de algod\u00f3n',
      'Almohadas y mantas adicionales',
      'Persianas o cortinas opacas',
      'Plancha',
      'Secadora',
      'Tendedero de ropa',
      { name: 'Espacio para guardar ropa', detail: 'armario' },
      'Entretenimiento',
      'TV',
    ],
  },
  {
    icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66',
    title: 'Familia',
    items: [
      'Seguros para ventanas',
      'Juegos de mesa',
      { name: 'Parque infantil al aire libre', detail: 'Una zona exterior equipada con estructuras de juego para ni\u00f1os' },
    ],
  },
  {
    icon: '\uD83C\uDF21\uFE0F',
    title: 'Calefacci\u00f3n y refrigeraci\u00f3n',
    items: [
      'Ventiladores port\u00e1tiles',
      'Aire acondicionado en habitaciones',
    ],
  },
  {
    icon: '\uD83D\uDD12',
    title: 'Seguridad en el hogar',
    items: [
      'Detector de humo',
    ],
  },
  {
    icon: '\uD83C\uDF10',
    title: 'Internet y oficina',
    items: [
      'Wifi',
      'Zona de trabajo',
    ],
  },
  {
    icon: '\uD83C\uDF73',
    title: 'Utensilios y vajilla',
    items: [
      'Cocina',
      'Los hu\u00e9spedes pueden cocinar en este espacio',
      'Refrigerador',
      'Microondas',
      'Utensilios b\u00e1sicos para cocinar',
      'Ollas y sartenes, aceite, sal y pimienta',
      'Platos y cubiertos',
      'Bolsa, platos, tazas, etc.',
      'Congelador',
      'Estufa de gas de acero inoxidable',
      { name: 'Cafetera', detail: 'Cafetera de filtro' },
      'Copas de vino',
      'Licuadora',
      'Arrocera',
      'Compactador de basura',
    ],
  },
  {
    icon: '\uD83D\uDE97',
    title: 'Estacionamiento e instalaciones',
    items: [
      'Estacionamiento gratuito en las instalaciones',
      { name: 'Piscinas al aire libre compartidas', detail: 'disponible todo el a\u00f1o, disponible en un horario espec\u00edfico, cubierta de piscina, juguetes de piscina, terraza, tobog\u00e1n acu\u00e1tico' },
      'Ascensor',
    ],
  },
  {
    icon: '\uD83D\uDD11',
    title: 'Servicios',
    items: [
      'Llegada aut\u00f3noma',
      'Cerradura inteligente',
    ],
  },
];

var SECTIONS = [
  { id: 'habitaciones', label: 'Habitaciones', file: 'Habitaciones' },
  { id: 'sala', label: 'Sala', file: 'Sala' },
  { id: 'cocina', label: 'Cocina', file: 'Cocina' },
  { id: 'banos', label: 'Ba\u00f1os', file: 'Banos' },
  { id: 'zonas-comunes', label: 'Zonas Comunes', file: 'ZonasComunes' },
  { id: 'otros', label: 'Otros', file: 'Otros' },
  { id: 'recomendaciones', label: 'Recomendaciones', special: true }
];

var EXTENSIONS = ['jpg'];
var MAX_PROBE = 20;

function imageExists(url) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () { resolve(true); };
    img.onerror = function () { resolve(false); };
    img.src = url;
  });
}

function probe(url) {
  return imageExists(url).then(function (exists) {
    return { url: url, exists: exists };
  });
}

async function discoverImages(label) {
  var probes = [];
  var base = 'images/';

  for (var i = 1; i <= MAX_PROBE; i++) {
    var url = base + label + '-' + String(i).padStart(2, '0') + '.' + EXTENSIONS[0];
    probes.push(probe(url));
  }

  var results = await Promise.all(probes);

  var images = [];
  for (var r = 0; r < results.length; r++) {
    if (results[r].exists) {
      images.push(results[r].url);
    } else {
      break;
    }
  }
  return images;
}

function buildRecommendationSection(section) {
  var el = document.createElement('section');
  el.id = section.id;
  el.className = 'gallery-section recommendation-section';

  el.innerHTML =
    '<h2 class="section-title">' + section.label + '</h2>' +
    '<div class="recommendation-card">' +
      '<img class="recommendation-image" src="images/Recomendaciones.jpeg" alt="Recomendaciones" loading="lazy">' +
    '</div>';

  el.querySelector('.recommendation-image').addEventListener('click', function (e) {
    lightboxImages = [e.target.src];
    openLightbox(0);
  });

  return el;
}

function buildServicesHTML() {
  var html = '';
  for (var c = 0; c < SERVICES_DATA.length; c++) {
    var cat = SERVICES_DATA[c];
    html += '<div class="services-category">';
    html += '<h3 class="services-category-title">' + cat.icon + ' ' + cat.title + '</h3>';
    html += '<ul class="services-category-items">';
    for (var i = 0; i < cat.items.length; i++) {
      var item = cat.items[i];
      html += '<li class="services-item">';
      if (typeof item === 'string') {
        html += '<span class="services-item-name">' + item + '</span>';
      } else {
        html += '<span class="services-item-name">' + item.name + '</span>';
        if (item.detail) {
          html += '<span class="services-item-detail">' + item.detail + '</span>';
        }
      }
      html += '</li>';
    }
    html += '</ul>';
    html += '</div>';
  }
  return html;
}

var lightboxImages = [];

function buildSection(section, images) {
  var el = document.createElement('section');
  el.id = section.id;
  el.className = 'gallery-section';

  var slidesHtml = '';
  for (var k = 0; k < images.length; k++) {
    slidesHtml += '<img class="carousel-slide" src="' + images[k] + '" alt="' + section.label + '" loading="lazy">';
  }

  el.innerHTML =
    '<h2 class="section-title">' + section.label + '</h2>' +
    '<div class="carousel">' +
      '<div class="carousel-viewport">' +
        '<div class="carousel-track">' + slidesHtml + '</div>' +
      '</div>' +
      '<button class="carousel-btn carousel-prev" aria-label="Anterior">&#10094;</button>' +
      '<button class="carousel-btn carousel-next" aria-label="Siguiente">&#10095;</button>' +
      '<div class="carousel-footer">' +
        '<div class="carousel-dots"></div>' +
        '<span class="carousel-counter"></span>' +
      '</div>' +
    '</div>';

  var viewport = el.querySelector('.carousel-viewport');
  var track = el.querySelector('.carousel-track');
  var dotsEl = el.querySelector('.carousel-dots');
  var counterEl = el.querySelector('.carousel-counter');
  var prevBtn = el.querySelector('.carousel-prev');
  var nextBtn = el.querySelector('.carousel-next');

  var idx = 0;

  function render() {
    counterEl.textContent = (idx + 1) + ' / ' + images.length;

    dotsEl.innerHTML = '';
    images.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === idx ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
      dot.addEventListener('click', function () { go(i); });
      dotsEl.appendChild(dot);
    });
  }

  function go(i) {
    if (i === idx) return;
    idx = i;
    var slide = track.children[idx];
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    render();
  }

  prevBtn.addEventListener('click', function () {
    go((idx - 1 + images.length) % images.length);
  });

  nextBtn.addEventListener('click', function () {
    go((idx + 1) % images.length);
  });

  viewport.addEventListener('scroll', function () {
    if (viewport.clientWidth === 0) return;
    var i = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (i !== idx) {
      idx = i;
      render();
    }
  });

  var touchStartX = 0;
  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        go((idx + 1) % images.length);
      } else {
        go((idx - 1 + images.length) % images.length);
      }
    }
  }, { passive: true });

  track.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') {
      var allImages = Array.from(track.children);
      lightboxImages = allImages.map(function (img) { return img.src; });
      var currentIdx = allImages.indexOf(e.target);
      openLightbox(currentIdx);
    }
  });

  render();
  return el;
}

var lightbox = document.getElementById('lightbox');
var lightboxImg = lightbox.querySelector('.lightbox-image');
var lightboxPrev = lightbox.querySelector('.lightbox-prev');
var lightboxNext = lightbox.querySelector('.lightbox-next');
var lightboxClose = lightbox.querySelector('.lightbox-close');

function openLightbox(idx) {
  lightboxImg.src = lightboxImages[idx];
  lightbox.dataset.idx = idx;
  lightbox.showModal();
  document.body.style.overflow = 'hidden';
}

lightboxPrev.addEventListener('click', function () {
  var idx = (parseInt(lightbox.dataset.idx) - 1 + lightboxImages.length) % lightboxImages.length;
  lightboxImg.src = lightboxImages[idx];
  lightbox.dataset.idx = idx;
});

lightboxNext.addEventListener('click', function () {
  var idx = (parseInt(lightbox.dataset.idx) + 1) % lightboxImages.length;
  lightboxImg.src = lightboxImages[idx];
  lightbox.dataset.idx = idx;
});

lightboxClose.addEventListener('click', function () {
  lightbox.close();
  document.body.style.overflow = '';
});

lightbox.addEventListener('close', function () {
  document.body.style.overflow = '';
});

document.addEventListener('keydown', function (e) {
  if (!lightbox.open) return;
  if (e.key === 'Escape') { lightbox.close(); return; }
  if (e.key === 'ArrowLeft') { lightboxPrev.click(); }
  if (e.key === 'ArrowRight') { lightboxNext.click(); }
});

function initTheme() {
  var toggle = document.querySelector('.theme-toggle');
  var saved = localStorage.getItem('theme');
  var theme = saved || 'light';
  document.documentElement.dataset.theme = theme;

  toggle.addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
}

function setupAnimations() {
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.gallery-section').forEach(function (el) {
      observer.observe(el);
    });

    var mainEl = document.querySelector('.main');
    if (mainEl) {
      var mo = new MutationObserver(function () {
        document.querySelectorAll('.gallery-section:not(.observed)').forEach(function (el) {
          el.classList.add('observed');
          observer.observe(el);
        });
      });
      mo.observe(mainEl, { childList: true });
    }
  }
}

async function init() {
  var main = document.querySelector('.main');
  var nav = document.querySelector('.nav-links');

  var results = await Promise.all(
    SECTIONS.filter(function (s) { return !s.special; }).map(function (section) {
      return discoverImages(section.file).then(function (images) {
        return { section: section, images: images };
      });
    })
  );

  for (var s = 0; s < results.length; s++) {
    var result = results[s];
    if (result.images.length === 0) continue;

    main.appendChild(buildSection(result.section, result.images));

    var link = document.createElement('a');
    link.href = '#' + result.section.id;
    link.className = 'nav-link';
    link.textContent = result.section.label;
    nav.appendChild(link);
  }
  
  var servicesModal = document.getElementById('services-modal');
  var servicesBody = servicesModal.querySelector('.services-body');
  servicesBody.innerHTML = buildServicesHTML();

  var serviciosLink = document.createElement('a');
  serviciosLink.href = '#';
  serviciosLink.className = 'nav-link';
  serviciosLink.textContent = 'Servicios';
  serviciosLink.addEventListener('click', function (e) {
    e.preventDefault();
    servicesModal.showModal();
    document.body.style.overflow = 'hidden';
  });
  nav.appendChild(serviciosLink);

  servicesModal.querySelector('.services-close').addEventListener('click', function () {
    servicesModal.close();
    document.body.style.overflow = '';
  });

  servicesModal.addEventListener('close', function () {
    document.body.style.overflow = '';
  });

  var specialSection = SECTIONS.find(function (s) { return s.special; });
  if (specialSection) {
    main.appendChild(buildRecommendationSection(specialSection));
    var link = document.createElement('a');
    link.href = '#' + specialSection.id;
    link.className = 'nav-link nav-link-featured';
    link.textContent = specialSection.label;
    nav.appendChild(link);
  }

  initTheme();
  setupAnimations();
}

document.addEventListener('DOMContentLoaded', init);
