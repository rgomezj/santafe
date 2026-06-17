var SECTIONS = [
  { id: 'habitaciones', label: 'Habitaciones', file: 'Habitaciones' },
  { id: 'sala', label: 'Sala', file: 'Sala' },
  { id: 'cocina', label: 'Cocina', file: 'Cocina' },
  { id: 'banos', label: 'Ba\u00f1os', file: 'Banos' },
  { id: 'zonas-comunes', label: 'Zonas Comunes', file: 'ZonasComunes' },
  { id: 'otros', label: 'Otros', file: 'Otros' },
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

  var results = await Promise.all(SECTIONS.map(function (section) {
    return discoverImages(section.file).then(function (images) {
      return { section: section, images: images };
    });
  }));

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

  initTheme();
  setupAnimations();
}

document.addEventListener('DOMContentLoaded', init);
