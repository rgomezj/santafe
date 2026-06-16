var SECTIONS = [
  { id: 'habitaciones', label: 'Habitaciones', file: 'Habitaciones' },
  { id: 'sala', label: 'Sala', file: 'Sala' },
  { id: 'cocina', label: 'Cocina', file: 'Cocina' },
  { id: 'banos', label: 'Ba\u00f1os', file: 'Banos' },
  { id: 'zonas-comunes', label: 'Zonas Comunes', file: 'ZonasComunes' },
  { id: 'otros', label: 'Otros', file: 'Otros' },
];

var EXTENSIONS = ['jpg', 'jpeg', 'webp', 'png'];
var MAX_PROBE = 30;

function imageExists(url) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () { resolve(true); };
    img.onerror = function () { resolve(false); };
    img.src = url;
  });
}

async function discoverImages(label) {
  var images = [];
  var base = 'images/';

  for (var i = 1; i <= MAX_PROBE; i++) {
    var padded = String(i).padStart(2, '0');
    var candidates = [
      base + label + '-' + padded,
      base + label + '-' + i,
    ];
    var found = false;

    for (var c = 0; c < candidates.length; c++) {
      for (var e = 0; e < EXTENSIONS.length; e++) {
        var url = candidates[c] + '.' + EXTENSIONS[e];
        if (await imageExists(url)) {
          images.push(url);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) break;
  }
  return images;
}

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
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    render();
  }

  prevBtn.addEventListener('click', function () {
    go((idx - 1 + images.length) % images.length);
  });

  nextBtn.addEventListener('click', function () {
    go((idx + 1) % images.length);
  });

  if (images.length === 1) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }

  render();
  return el;
}

async function init() {
  var main = document.querySelector('.main');
  var nav = document.querySelector('.nav-links');

  for (var s = 0; s < SECTIONS.length; s++) {
    var section = SECTIONS[s];
    var images = await discoverImages(section.file);
    if (images.length === 0) continue;

    main.appendChild(buildSection(section, images));

    var link = document.createElement('a');
    link.href = '#' + section.id;
    link.className = 'nav-link';
    link.textContent = section.label;
    nav.appendChild(link);
  }
}

document.addEventListener('DOMContentLoaded', init);
