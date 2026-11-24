/* ==========================================================================
   ELITE MOTORS — app.js
   UI layer: collection, compare, modals, forms. No dependencies, no backend.
   ========================================================================== */
(function () {
  'use strict';

  const EM = window.EM;
  const cars = EM.cars;
  const articles = EM.articles;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const STORE = { compare: 'em.compare', bookings: 'em.bookings', list: 'em.list' };

  /* ---------------------------------------------------------------- storage */
  const store = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (err) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        /* private mode — the session simply will not persist */
      }
    }
  };

  /* ------------------------------------------------------------------ toasts */
  function toast(message) {
    const host = $('#toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    window.setTimeout(() => {
      el.classList.remove('is-in');
      window.setTimeout(() => el.remove(), 400);
    }, 3400);
  }

  /* ------------------------------------------------------------------ header */
  function initHeader() {
    const header = $('#siteHeader');
    const toggle = $('#navToggle');
    const menu = $('#mobileMenu');
    const veil = $('#veil');
    if (!header) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let open = false;
    function setMenu(next) {
      open = next;
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.setAttribute('aria-hidden', String(!open));
      document.documentElement.classList.toggle('is-locked', open);
    }

    toggle.addEventListener('click', () => setMenu(!open));
    $$('.mobile-menu__link', menu).forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    $$('a[href^="#"]', menu).forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1180 && open) setMenu(false);
    });
    if (veil) veil.classList.remove('is-on');
  }

  /* -------------------------------------------------------------- scrollspy */
  function initScrollSpy() {
    const links = $$('.nav__link');
    const targets = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    if (!targets.length) return;

    let ticking = false;
    function update() {
      ticking = false;
      const line = window.scrollY + window.innerHeight * 0.32;
      let active = -1;
      targets.forEach((section, i) => {
        if (section.offsetTop <= line) active = i;
      });
      links.forEach((link, i) => {
        if (i === active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------ scroll reveal */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach((el) => el.classList.add('is-in'));
      $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
        $$('[data-count]', entry.target).forEach((el) => animateCount(el));
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach((el) => {
      io.observe(el);
    });
  }

  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    if (el.dataset.done) return;
    el.dataset.done = '1';
    if (reduceMotion.matches || target < 10) {
      el.textContent = target + suffix;
      return;
    }
    const start = performance.now();
    const duration = 1400;
    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------- media */
  function initMedia(root) {
    $$('.media img', root).forEach((img) => {
      const frame = img.closest('.media');
      function ready() {
        img.classList.add('is-loaded');
        if (frame) frame.classList.add('is-ready');
      }
      function broken() {
        img.classList.remove('is-loaded');
        if (frame) frame.classList.add('is-broken', 'is-ready');
      }
      if (img.complete) {
        if (img.naturalWidth > 0) ready();
        else broken();
      } else {
        img.addEventListener('load', ready, { once: true });
        img.addEventListener('error', broken, { once: true });
      }
    });
  }

  /* -------------------------------------------------------------------- hero */
  function initPreloader() {
    const preloader = $('#preloader');
    const html = document.documentElement;
    function finish() {
      if (preloader) preloader.classList.add('is-done');
      html.classList.add('is-loaded');
    }
    window.setTimeout(finish, 850);
    window.addEventListener('load', () => window.setTimeout(finish, 250));
  }

  function initHeroParallax() {
    const media = $('#heroMedia');
    const inner = $('#heroInner');
    if (!media || !inner || reduceMotion.matches) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          media.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0) scale(' + (1 - Math.min(y, 600) * 0.00006).toFixed(3) + ')';
          inner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
          inner.style.transform = 'translate3d(0,' + (y * 0.06).toFixed(1) + 'px,0)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============================================================== COLLECTION */
  function brandList() {
    const brands = [];
    cars.forEach((car) => { if (brands.indexOf(car.brand) === -1) brands.push(car.brand); });
    return brands.sort();
  }

  function renderBrands() {
    const host = $('#brandGrid');
    if (!host) return;
    host.innerHTML = brandList().map((brand) => {
      const stock = cars.filter((car) => car.brand === brand);
      const from = Math.min.apply(null, stock.map((car) => car.price));
      const initials = brand.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
      return '<button class="brand-tile" type="button" data-brand-tile="' + brand + '">' +
        '<span class="brand-tile__go" aria-hidden="true"><svg class="icon"><use href="#i-arrow"></use></svg></span>' +
        '<span class="brand-tile__emblem" aria-hidden="true">' + initials + '</span>' +
        '<span><span class="brand-tile__name">' + brand + '</span>' +
        '<span class="brand-tile__meta">' + stock.length + (stock.length === 1 ? ' car' : ' cars') + ' · from ' + EM.money(from) + '</span></span>' +
      '</button>';
    }).join('');
  }

  const state = {
    query: '',
    sort: 'featured',
    body: [],
    brand: [],
    condition: [],
    maxPrice: 6
  };

  function activeFilterCount() {
    return state.body.length + state.brand.length + state.condition.length +
      (state.maxPrice < 6 ? 1 : 0) + (state.query ? 1 : 0);
  }

  function passing(car) {
    if (state.body.length && state.body.indexOf(car.body) === -1) return false;
    if (state.brand.length && state.brand.indexOf(car.brand) === -1) return false;
    if (state.condition.length) {
      const isNew = car.condition === 'new';
      const wanted = state.condition.some((c) => (c === 'new' ? isNew : !isNew));
      if (!wanted) return false;
    }
    if (car.price > state.maxPrice + 0.001) return false;
    if (state.query) {
      const haystack = [car.brand, car.model, car.short, car.body, car.colour, car.engine, car.tagline]
        .concat(car.features).join(' ').toLowerCase();
      if (haystack.indexOf(state.query) === -1) return false;
    }
    return true;
  }

  function sortCars(list) {
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'power-desc': (a, b) => b.power - a.power,
      'name-asc': (a, b) => (a.brand + a.model).localeCompare(b.brand + b.model),
      featured: (a, b) => (Number(b.featured) - Number(a.featured)) || (a.price - b.price)
    };
    return list.slice().sort(by[state.sort] || by.featured);
  }

  function cardMarkup(car, index) {
    const inCompare = compare.list.indexOf(car.id) !== -1;
    return '' +
      '<article class="car-card" style="--i:' + index + '" data-car="' + car.id + '">' +
        '<div class="car-card__media media" data-label="' + car.brand + ' ' + car.model + '">' +
          '<img src="' + car.image.src + '" alt="' + car.image.alt + '" loading="lazy" width="1200" height="750">' +
        '</div>' +
        '<div class="car-card__tags">' +
          '<span class="tag tag--glass">' + car.year + '</span>' +
          '<span class="tag tag--solid">' + car.badge + '</span>' +
        '</div>' +
        '<div class="car-card__body">' +
          '<div>' +
            '<p class="car-card__brand">' + car.brand + ' · ' + (car.condition === 'new' ? 'New' : 'Pre-owned') + '</p>' +
            '<h3 class="car-card__name">' + car.model + '</h3>' +
          '</div>' +
          '<div class="car-card__price"><strong>' + EM.money(car.price) + '</strong><span>' + EM.emi(car.price) + '</span></div>' +
          '<dl class="spec-grid">' +
            '<div><dt><svg class="icon" aria-hidden="true"><use href="#i-gauge"></use></svg>Power</dt><dd>' + car.power + ' hp</dd></div>' +
            '<div><dt><svg class="icon" aria-hidden="true"><use href="#i-bolt"></use></svg>0–100</dt><dd>' + car.accel.toFixed(1) + ' s</dd></div>' +
            '<div><dt><svg class="icon" aria-hidden="true"><use href="#i-gear"></use></svg>Gearbox</dt><dd>' + car.drivetrain + '</dd></div>' +
            '<div><dt><svg class="icon" aria-hidden="true"><use href="#i-car"></use></svg>Odometer</dt><dd>' + (car.condition === 'new' ? 'Delivery' : EM.km(car.km)) + '</dd></div>' +
          '</dl>' +
          '<ul class="feature-chips">' + car.features.slice(0, 3).map((f) => '<li>' + f + '</li>').join('') + '</ul>' +
          '<div class="car-card__actions">' +
            '<button class="btn btn--ghost btn--sm" type="button" data-open-car="' + car.id + '">View details</button>' +
            '<button class="btn btn--ghost btn--sm" type="button" data-compare-toggle="' + car.id + '" aria-pressed="' + inCompare + '">' +
              (inCompare ? 'In compare' : 'Compare') +
            '</button>' +
            '<button class="btn btn--light btn--sm" type="button" data-book-car="' + car.id + '">Test drive</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderCars() {
    const grid = $('#carGrid');
    if (!grid) return;
    const list = sortCars(cars.filter(passing));
    grid.innerHTML = list.map((car, i) => cardMarkup(car, i)).join('');
    initMedia(grid);
    $('#emptyState').hidden = list.length > 0;
    const count = $('#resultsCount');
    if (count) {
      const n = list.length;
      count.innerHTML = 'Showing <strong>' + n + '</strong> ' + (n === 1 ? 'car' : 'cars') +
        (n !== cars.length ? ' of ' + cars.length : '');
    }
    const filtersOn = activeFilterCount();
    $('#clearFiltersInline').hidden = filtersOn === 0;
    const badge = $('#filterBadge');
    if (badge) {
      badge.textContent = String(filtersOn);
      badge.hidden = filtersOn === 0;
    }
  }

  function syncFilterInputs() {
    $$('input[name="body"]').forEach((input) => { input.checked = state.body.indexOf(input.value) !== -1; });
    $$('input[name="condition"]').forEach((input) => { input.checked = state.condition.indexOf(input.value) !== -1; });
    $$('input[name="brand"]').forEach((input) => { input.checked = state.brand.indexOf(input.value) !== -1; });
    const range = $('#priceRange');
    if (range) {
      range.value = String(state.maxPrice);
      updateRangeFill(range);
    }
    const out = $('#priceOutput');
    if (out) out.textContent = state.maxPrice >= 6 ? 'Up to ₹6.0 Cr' : 'Up to ₹' + state.maxPrice.toFixed(1) + ' Cr';
    const search = $('#searchInput');
    if (search && search.value !== state.query) search.value = state.query;
  }

  function updateRangeFill(range) {
    const min = Number(range.min);
    const max = Number(range.max);
    const pct = ((Number(range.value) - min) / (max - min)) * 100;
    range.style.setProperty('--fill', pct.toFixed(2) + '%');
  }

  function initCollection() {
    const brandBox = $('#brandFilters');
    if (brandBox) {
      brandBox.innerHTML = brandList().map((brand) =>
        '<label class="chip"><input type="checkbox" name="brand" value="' + brand + '"><span>' + brand + '</span></label>'
      ).join('');
    }

    const search = $('#searchInput');
    if (search) {
      search.addEventListener('input', () => {
        state.query = search.value.trim().toLowerCase();
        renderCars();
      });
    }

    const sort = $('#sortSelect');
    if (sort) {
      sort.addEventListener('change', () => {
        state.sort = sort.value;
        renderCars();
      });
    }

    const range = $('#priceRange');
    if (range) {
      updateRangeFill(range);
      range.addEventListener('input', () => {
        state.maxPrice = Number(range.value);
        updateRangeFill(range);
        const out = $('#priceOutput');
        if (out) out.textContent = state.maxPrice >= 6 ? 'Up to ₹6.0 Cr' : 'Up to ₹' + state.maxPrice.toFixed(1) + ' Cr';
        renderCars();
      });
    }

    function readChecks() {
      state.body = $$('input[name="body"]:checked').map((i) => i.value);
      state.brand = $$('input[name="brand"]:checked').map((i) => i.value);
      state.condition = $$('input[name="condition"]:checked').map((i) => i.value);
    }

    ['#bodyFilters', '#brandFilters', '#conditionFilters'].forEach((sel) => {
      const box = $(sel);
      if (!box) return;
      box.addEventListener('change', () => {
        readChecks();
        renderCars();
      });
    });

    function resetFilters() {
      state.body = [];
      state.brand = [];
      state.condition = [];
      state.query = '';
      state.maxPrice = 6;
      syncFilterInputs();
      renderCars();
    }

    $('#clearFilters').addEventListener('click', resetFilters);
    $('#emptyReset').addEventListener('click', resetFilters);
    $('#clearFiltersInline').addEventListener('click', resetFilters);

    const toggle = $('#filtersToggle');
    const panel = $('#filters');
    if (toggle && panel) {
      toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    renderCars();
  }

  function filterByBrand(brand) {
    state.query = '';
    state.body = [];
    state.condition = [];
    state.maxPrice = 6;
    state.brand = [brand];
    syncFilterInputs();
    renderCars();
    const panel = $('#filters');
    if (panel && window.innerWidth <= 1099) panel.classList.add('is-open');
    const target = $('#collection');
    if (target) target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    toast('Filtered to ' + brand + ' — ' + cars.filter(passing).length + ' cars');
  }

  /* ================================================================= COMPARE */
  const compare = {
    list: [],
    diffOnly: true,
    limit: 3
  };

  function loadCompare() {
    const saved = store.get(STORE.compare, []);
    if (Array.isArray(saved)) {
      compare.list = saved.filter((id) => EM.byId(id)).slice(0, compare.limit);
    }
  }

  function saveCompare() {
    store.set(STORE.compare, compare.list);
  }

  function slotMarkup(car, index) {
    if (!car) {
      return '<div class="slot slot--empty">' +
        '<span class="slot__index">0' + (index + 1) + '</span>' +
        '<div class="slot__add">' +
          '<p class="slot__add-label"><svg class="icon" aria-hidden="true"><use href="#i-plus"></use></svg>Empty slot</p>' +
          '<a class="btn btn--ghost btn--sm" href="#collection">Choose a car</a>' +
        '</div>' +
      '</div>';
    }
    return '<div class="slot">' +
      '<span class="slot__index">0' + (index + 1) + '</span>' +
      '<div class="slot__media media" data-label="' + car.brand + '">' +
        '<img src="' + car.image.src + '" alt="" loading="lazy" width="320" height="240">' +
      '</div>' +
      '<div class="slot__info">' +
        '<p class="slot__brand">' + car.brand + '</p>' +
        '<p class="slot__name">' + car.model + '</p>' +
        '<p class="slot__price">' + EM.money(car.price) + '</p>' +
        '<button class="link-btn" type="button" data-compare-remove="' + car.id + '">Remove</button>' +
      '</div>' +
    '</div>';
  }

  function renderCompare() {
    const slotHost = $('#compareSlots');
    if (!slotHost) return;
    const chosen = compare.list.map(EM.byId);
    let html = '';
    for (let i = 0; i < 3; i++) html += slotMarkup(chosen[i], i);
    slotHost.innerHTML = html;
    initMedia(slotHost);

    const table = $('#cmpTable');
    const wrap = $('#cmpWrap');
    const hint = $('#compareHint');
    const enough = chosen.length >= 2;
    wrap.hidden = !enough;
    hint.hidden = enough;
    $('#cmpSwipe').hidden = !enough;

    if (enough) {
      table.className = 'cmp' + (compare.diffOnly ? ' is-diff-only' : '');
      table.style.setProperty('--cols', String(chosen.length));
      table.innerHTML = cmpMarkup(chosen);
    } else {
      table.innerHTML = '';
    }

    renderQuickPairs();
    renderTray();
    $$('[data-compare-toggle]').forEach((btn) => {
      const on = compare.list.indexOf(btn.dataset.compareToggle) !== -1;
      btn.setAttribute('aria-pressed', String(on));
      btn.textContent = on ? 'In compare' : 'Compare';
    });
    const diffToggle = $('#diffOnly');
    if (diffToggle) diffToggle.checked = compare.diffOnly;
  }

  const ROWS = [
    { label: 'Price', key: 'price', kind: 'lower', best: true, render: (c) => EM.money(c.price) },
    { label: 'Model year', key: 'year', kind: 'higher', best: true, render: (c) => String(c.year) },
    { label: 'Condition', key: 'condition', render: (c) => (c.condition === 'new' ? 'New' : 'Pre-owned') },
    { label: 'Body', key: 'body', render: (c) => c.body },
    { label: 'Engine', key: 'engine', render: (c) => c.engine },
    { label: 'Power', key: 'power', kind: 'higher', best: true, bar: true, render: (c) => c.power + ' hp' },
    { label: 'Torque', key: 'torque', kind: 'higher', best: true, bar: true, render: (c) => c.torque + ' Nm' },
    { label: '0–100 km/h', key: 'accel', kind: 'lower', best: true, bar: true, render: (c) => c.accel.toFixed(1) + ' s' },
    { label: 'Top speed', key: 'topSpeed', kind: 'higher', best: true, bar: true, render: (c) => c.topSpeed + ' km/h' },
    { label: 'Drivetrain', key: 'drivetrain', render: (c) => c.drivetrain },
    { label: 'Gearbox', key: 'transmission', render: (c) => c.transmission },
    { label: 'Odometer', key: 'km', kind: 'lower', best: true, bar: true, render: (c) => (c.condition === 'new' ? 'Delivery mileage' : EM.km(c.km)) },
    { label: 'Owners', key: 'owners', kind: 'lower', best: true, render: (c) => (c.owners === 0 ? 'None — unregistered' : String(c.owners)) },
    { label: 'Seats', key: 'seats', render: (c) => String(c.seats) },
    { label: 'Colour', key: 'colour', render: (c) => c.colour },
    { label: 'Warranty', key: 'warranty', render: (c) => c.warranty },
    { label: 'Key features', key: 'features', list: true, render: (c) => c.features }
  ];

  function rowValues(row, chosen) {
    return chosen.map((car) => {
      if (row.list) return car[row.key].slice().sort().join('|');
      if (typeof car[row.key] === 'number') return car[row.key];
      return String(car[row.key]);
    });
  }

  function cmpMarkup(chosen) {
    let head = '<colgroup><col class="cmp__label-col">';
    chosen.forEach(() => { head += '<col>'; });
    head += '</colgroup><thead><tr><th scope="col"><span class="sr-only">Specification</span></th>';
    chosen.forEach((car) => {
      head += '<th scope="col"><div class="cmp__car"><small>' + car.brand + '</small><span>' + car.model + '</span></div></th>';
    });
    head += '</tr></thead>';

    let body = '<tbody>';
    ROWS.forEach((row, r) => {
      const values = rowValues(row, chosen);
      const same = values.every((v) => v === values[0]);
      const numeric = typeof values[0] === 'number';
      let best = -1;
      if (numeric && row.best && chosen.length > 1) {
        const sorted = values.slice().sort((a, b) => (row.kind === 'higher' ? b - a : a - b));
        best = values.indexOf(sorted[0]);
      }
      const max = numeric ? Math.max.apply(null, values) : 0;
      const min = numeric ? Math.min.apply(null, values) : 0;

      body += '<tr class="' + (same ? 'is-same' : 'is-diff') + '" style="--r:' + r + '">' +
        '<th scope="row">' + row.label +
          '<span class="cmp__state">' + (same ? 'Same' : 'Differs') + '</span>' +
        '</th>';

      chosen.forEach((car, i) => {
        let inner;
        if (row.list) {
          inner = '<ul>' + car[row.key].slice(0, 6).map((f) => '<li>' + f + '</li>').join('') + '</ul>';
        } else {
          inner = '<span class="cmp__value">' + row.render(car) + '</span>';
          if (row.bar && numeric && chosen.length > 1) {
            let width = 0;
            if (max > 0) {
              width = row.kind === 'higher' ? (values[i] / max) * 100 : (min / values[i]) * 100;
            }
            inner += '<span class="cmp-bar" aria-hidden="true"><i style="--w:' + Math.max(4, Math.round(width)) + '%"></i></span>';
          }
        }
        const cellClass = best === i ? ' class="is-best"' : '';
        body += '<td' + cellClass + '>' + inner + '</td>';
      });
      body += '</tr>';
    });
    body += '</tbody>';

    return head + body;
  }

  function toggleCompare(id, forceAdd) {
    const index = compare.list.indexOf(id);
    if (index !== -1) {
      compare.list.splice(index, 1);
      toast('Removed from comparison');
    } else {
      if (compare.list.length >= compare.limit) {
        toast('Compare holds three cars — remove one first');
        renderCompare();
        return;
      }
      compare.list.push(id);
      toast('Added to comparison · ' + compare.list.length + '/3');
    }
    if (forceAdd) { /* reserved */ }
    saveCompare();
    renderCompare();
  }

  function renderTray() {
    const tray = $('#compareTray');
    if (!tray) return;
    const count = compare.list.length;
    const visible = count > 0;
    tray.classList.toggle('is-visible', visible);
    tray.setAttribute('aria-hidden', String(!visible));
    $('#trayCount').textContent = count + '/3';
    $('#trayNames').innerHTML = compare.list
      .map((id) => { const car = EM.byId(id); return '<span>' + car.short + '</span>'; })
      .join('');
    const go = $('#trayGo');
    if (go) {
      go.textContent = count >= 2 ? 'Compare now' : 'Add one more';
      go.href = count >= 2 ? '#compare' : '#collection';
    }
  }

  function renderQuickPairs() {
    const host = $('#compareQuick');
    if (!host) return;
    const pairs = [
      ['porsche-911', 'amg-gt'],
      ['bmw-m5', 'audi-rs7'],
      ['ferrari-roma', 'huracan']
    ];
    host.innerHTML = pairs.map((pair) => {
      const a = EM.byId(pair[0]);
      const b = EM.byId(pair[1]);
      if (!a || !b) return '';
      return '<button class="btn btn--ghost btn--sm" type="button" data-quick-pair="' + pair.join(',') + '">' +
        a.short + ' vs ' + b.short + '</button>';
    }).join('');
  }

  function initCompare() {
    loadCompare();
    renderCompare();

    const diffToggle = $('#diffOnly');
    if (diffToggle) {
      diffToggle.addEventListener('change', () => {
        compare.diffOnly = diffToggle.checked;
        const table = $('#cmpTable');
        if (table) table.classList.toggle('is-diff-only', compare.diffOnly);
      });
    }

    $('#clearCompare').addEventListener('click', () => {
      compare.list = [];
      saveCompare();
      renderCompare();
      toast('Comparison cleared');
    });

    $('#trayClear').addEventListener('click', () => {
      compare.list = [];
      saveCompare();
      renderCompare();
      toast('Comparison cleared');
    });

    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-compare-toggle]');
      if (toggle) {
        e.preventDefault();
        toggleCompare(toggle.dataset.compareToggle);
        return;
      }
      const remove = e.target.closest('[data-compare-remove]');
      if (remove) {
        toggleCompare(remove.dataset.compareRemove);
        return;
      }
      const quick = e.target.closest('[data-quick-pair]');
      if (quick) {
        compare.list = quick.dataset.quickPair.split(',').slice(0, 3);
        saveCompare();
        renderCompare();
        toast('Loaded a head-to-head comparison');
      }
    });
  }

  /* ================================================================== MODALS */
  let lastFocus = null;

  function openDialog(dialog) {
    if (!dialog) return;
    lastFocus = document.activeElement;
    dialog.classList.remove('is-closing');
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.documentElement.classList.add('is-locked');
    const closeBtn = dialog.querySelector('[data-close-modal]');
    if (closeBtn) closeBtn.focus();
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    dialog.classList.add('is-closing');
    window.setTimeout(() => {
      dialog.classList.remove('is-closing');
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      document.documentElement.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 220);
  }

  const gallery = { images: [], index: 0, carId: null };

  function carModalMarkup(car) {
    const inCompare = compare.list.indexOf(car.id) !== -1;
    return '' +
      '<div class="detail">' +
        '<div class="detail__gallery">' +
          '<div class="gallery__stage" id="galleryStage">' +
            '<img class="gallery__img" id="galleryImg" src="' + car.gallery[0].src + '" alt="' + car.gallery[0].alt + '" width="1600" height="1000">' +
            '<button class="gallery__nav gallery__nav--prev" type="button" id="galleryPrev" aria-label="Previous photograph">' +
              '<svg class="icon" aria-hidden="true"><use href="#i-chevron"></use></svg>' +
            '</button>' +
            '<button class="gallery__nav gallery__nav--next" type="button" id="galleryNext" aria-label="Next photograph">' +
              '<svg class="icon" aria-hidden="true"><use href="#i-chevron"></use></svg>' +
            '</button>' +
            '<div class="gallery__meta">' +
              '<span class="tag tag--glass" id="galleryCounter">1 / ' + car.gallery.length + '</span>' +
              '<span class="tag tag--glass">' + car.badge + '</span>' +
            '</div>' +
          '</div>' +
          '<p class="gallery__caption" id="galleryCaption">' + car.gallery[0].caption + '</p>' +
          '<div class="gallery__thumbs" id="galleryThumbs">' +
            car.gallery.map((img, i) =>
              '<button class="gallery__thumb" type="button" data-thumb="' + i + '" aria-current="' + (i === 0) + '" aria-label="Photograph ' + (i + 1) + '">' +
                '<img src="' + img.src + '" alt="" loading="lazy" width="320" height="200">' +
              '</button>'
            ).join('') +
          '</div>' +
        '</div>' +
        '<div class="detail__info">' +
          '<p class="detail__brand">' + car.brand + ' · ' + car.year + '</p>' +
          '<h2 class="detail__name">' + car.model + '</h2>' +
          '<div class="detail__tags">' +
            '<span class="tag">' + (car.condition === 'new' ? 'New' : 'Pre-owned') + '</span>' +
            '<span class="tag">' + car.body + '</span>' +
            '<span class="tag">' + car.drivetrain + '</span>' +
            '<span class="tag">' + car.colour + '</span>' +
          '</div>' +
          '<p class="detail__tagline">' + car.tagline + '</p>' +
          '<div class="detail__price"><strong>' + EM.money(car.price) + '</strong><span>On-road Vijayawada · ' + EM.emi(car.price) + ' est.</span></div>' +
          '<dl class="kpis">' +
            '<div><dt>Power</dt><dd>' + car.power + '<small> hp</small></dd></div>' +
            '<div><dt>0–100</dt><dd>' + car.accel.toFixed(1) + '<small> s</small></dd></div>' +
            '<div><dt>Top speed</dt><dd>' + car.topSpeed + '<small> km/h</small></dd></div>' +
            '<div><dt>Odometer</dt><dd>' + (car.condition === 'new' ? '0' : (car.km / 1000).toFixed(1)) + '<small> ' + (car.condition === 'new' ? 'delivery' : 'k km') + '</small></dd></div>' +
          '</dl>' +
          '<section class="detail__section">' +
            '<h3 class="detail__h">Overview</h3>' +
            '<p>' + car.description + '</p>' +
          '</section>' +
          '<section class="detail__section">' +
            '<h3 class="detail__h">Specification</h3>' +
            '<dl class="spec-table">' +
              '<div><dt>Engine</dt><dd>' + car.engine + '</dd></div>' +
              '<div><dt>Torque</dt><dd>' + car.torque + ' Nm</dd></div>' +
              '<div><dt>Gearbox</dt><dd>' + car.transmission + '</dd></div>' +
              '<div><dt>Drivetrain</dt><dd>' + car.drivetrain + '</dd></div>' +
              '<div><dt>Seats</dt><dd>' + car.seats + '</dd></div>' +
              '<div><dt>Boot</dt><dd>' + car.boot + ' L</dd></div>' +
              '<div><dt>Owners</dt><dd>' + (car.owners === 0 ? 'None' : car.owners) + '</dd></div>' +
              '<div><dt>Odometer</dt><dd>' + (car.condition === 'new' ? 'Delivery mileage' : EM.km(car.km)) + '</dd></div>' +
              '<div><dt>Colour</dt><dd>' + car.colour + '</dd></div>' +
              '<div><dt>Warranty</dt><dd>' + car.warranty + '</dd></div>' +
            '</dl>' +
          '</section>' +
          '<section class="detail__section">' +
            '<h3 class="detail__h">Features</h3>' +
            '<ul class="checklist">' + car.features.map((f) =>
              '<li><svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg><span>' + f + '</span></li>'
            ).join('') + '</ul>' +
          '</section>' +
          '<section class="detail__section">' +
            '<h3 class="detail__h">Indicative finance</h3>' +
            '<table class="table">' +
              '<thead><tr><th scope="col">Term</th><th scope="col">Monthly</th></tr></thead>' +
              '<tbody>' +
                '<tr><th scope="row">Down payment <small>20% of on-road price</small></th><td>' + EM.money(car.price * 0.2) + '</td></tr>' +
                '<tr class="is-featured"><th scope="row">60 months <small>8.5% p.a. reducing</small></th><td>' + EM.emi(car.price) + '</td></tr>' +
                '<tr><th scope="row">84 months <small>8.9% p.a. reducing</small></th><td>₹' + Math.round((car.price * 0.8 * 10000000) * (0.089 / 12) / (1 - Math.pow(1 + 0.089 / 12, -84)) / 100000) / 10 + ' L / month</td></tr>' +
              '</tbody>' +
              '<tfoot><tr><th scope="row">Insurance + registration</th><td>Included</td></tr></tfoot>' +
            '</table>' +
            '<p class="note">Illustrative only. Final terms depend on lender approval and your credit profile.</p>' +
          '</section>' +
          '<div class="detail__actions">' +
            '<button class="btn btn--light" type="button" data-book-car="' + car.id + '">Book a test drive</button>' +
            '<button class="btn btn--ghost" type="button" data-compare-toggle="' + car.id + '" aria-pressed="' + inCompare + '">' +
              (inCompare ? 'In compare' : 'Add to compare') + '</button>' +
            '<button class="btn btn--ghost" type="button" data-report="' + car.id + '">Inspection report</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function setGallery(index) {
    const img = $('#galleryImg');
    if (!img || !gallery.images.length) return;
    const total = gallery.images.length;
    gallery.index = (index + total) % total;
    const next = gallery.images[gallery.index];
    img.classList.add('is-switching');
    window.setTimeout(() => {
      img.src = next.src;
      img.alt = next.alt;
      const done = () => img.classList.remove('is-switching');
      if (img.complete) window.setTimeout(done, 30);
      else img.addEventListener('load', done, { once: true });
    }, 120);
    $('#galleryCaption').textContent = next.caption;
    $('#galleryCounter').textContent = (gallery.index + 1) + ' / ' + total;
    $$('.gallery__thumb').forEach((thumb, i) => {
      thumb.setAttribute('aria-current', String(i === gallery.index));
    });
  }

  function openCar(id) {
    const car = EM.byId(id);
    if (!car) return;
    const modal = $('#carModal');
    $('#carModalTitle').textContent = car.brand + ' ' + car.model;
    $('#carModalBody').innerHTML = carModalMarkup(car);
    gallery.images = car.gallery;
    gallery.index = 0;
    gallery.carId = car.id;
    openDialog(modal);

    const body = $('#carModalBody');
    body.scrollTop = 0;

    $('#galleryPrev').addEventListener('click', () => setGallery(gallery.index - 1));
    $('#galleryNext').addEventListener('click', () => setGallery(gallery.index + 1));
    $('#galleryThumbs').addEventListener('click', (e) => {
      const thumb = e.target.closest('[data-thumb]');
      if (thumb) setGallery(Number(thumb.dataset.thumb));
    });

    let startX = null;
    const stage = $('#galleryStage');
    stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 44) setGallery(gallery.index + (dx < 0 ? 1 : -1));
    });
  }

  function openArticle(index) {
    const article = articles[index];
    if (!article) return;
    const modal = $('#articleModal');
    $('#articleModalBody').innerHTML = '' +
      '<div class="article">' +
        '<div class="article__media media" data-label="Journal">' +
          '<img src="' + article.image.src + '" alt="' + article.image.alt + '" width="1400" height="600">' +
        '</div>' +
        '<div class="article__body">' +
          '<div class="story__meta"><b>' + article.tag + '</b><span>' + article.read + '</span><span>' + article.date + '</span></div>' +
          '<h2 class="article__title" id="articleModalTitle">' + article.title + '</h2>' +
          article.body.map((p) => '<p>' + p + '</p>').join('') +
          '<ul>' + article.list.map((li) => '<li>' + li + '</li>').join('') + '</ul>' +
          '<p>' + article.closing + '</p>' +
          '<div class="article__foot">' +
            '<p class="note">Written by the Elite Motors acquisition desk.</p>' +
            '<button class="btn btn--ghost btn--sm" type="button" data-close-modal>Close</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    openDialog(modal);
    initMedia($('#articleModalBody'));
    $('#articleModalBody').scrollTop = 0;
  }

  function initModals() {
    document.addEventListener('click', (e) => {
      const openCarBtn = e.target.closest('[data-open-car]');
      if (openCarBtn) {
        e.preventDefault();
        openCar(openCarBtn.dataset.openCar);
        return;
      }
      const articleBtn = e.target.closest('[data-open-article]');
      if (articleBtn) {
        e.preventDefault();
        openArticle(Number(articleBtn.dataset.openArticle));
        return;
      }
      const bookBtn = e.target.closest('[data-book-car]');
      if (bookBtn) {
        const carId = bookBtn.dataset.bookCar;
        const modal = $('#carModal');
        closeDialog(modal);
        prefillBooking(carId);
        return;
      }
      const reportBtn = e.target.closest('[data-report]');
      if (reportBtn) {
        toast('Inspection report requested — the desk will call you');
        return;
      }
      const closeBtn = e.target.closest('[data-close-modal]');
      if (closeBtn) {
        closeDialog(closeBtn.closest('dialog'));
        return;
      }
      const brandBtn = e.target.closest('[data-filter-brand]');
      if (brandBtn) {
        filterByBrand(brandBtn.dataset.filterBrand);
        return;
      }
      const tile = e.target.closest('[data-brand-tile]');
      if (tile) {
        filterByBrand(tile.dataset.brandTile);
      }
    });

    $$('dialog.modal').forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeDialog(dialog);
      });
      dialog.addEventListener('close', () => {
        document.documentElement.classList.remove('is-locked');
      });
    });

    document.addEventListener('keydown', (e) => {
      const carModal = $('#carModal');
      if (!carModal || !carModal.open) return;
      if (e.key === 'ArrowLeft') setGallery(gallery.index - 1);
      if (e.key === 'ArrowRight') setGallery(gallery.index + 1);
    });
  }

  /* =================================================================== FORMS */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function digits(value) {
    return String(value).replace(/[^\d]/g, '');
  }

  function validPhone(value) {
    let d = digits(value);
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d);
  }

  function setError(input, message) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('has-error', Boolean(message));
    const slot = field.querySelector('[data-error-for="' + input.id + '"]');
    if (slot) slot.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function bookingRef() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let out = '';
    for (let i = 0; i < 6; i++) out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return 'EM-TD-' + out;
  }

  function prefillBooking(carId) {
    const select = $('#bkCar');
    if (select && carId) {
      select.value = carId;
      select.classList.remove('is-empty');
    }
    const section = $('#test-drive');
    if (section) section.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    const form = $('#bookingForm');
    if (form && form.hidden) resetBookingForm();
    window.setTimeout(() => {
      const name = $('#bkName');
      if (name && !name.value) name.focus({ preventScroll: true });
    }, 500);
    if (carId) toast('Ready to book — pick a date and time');
  }

  function resetBookingForm() {
    const form = $('#bookingForm');
    if (!form) return;
    form.hidden = false;
    form.reset();
    $('#bookingSuccess').hidden = true;
    $$('.field', form).forEach((f) => f.classList.remove('has-error'));
    $$('.field__error', form).forEach((p) => { p.textContent = ''; });
    $('#bookingStatus').textContent = '';
    const date = $('#bkDate');
    if (date) date.min = new Date().toISOString().slice(0, 10);
    $$('select.input', form).forEach((s) => s.classList.toggle('is-empty', !s.value));
  }

  function renderSavedBookings() {
    const list = store.get(STORE.bookings, []);
    const wrap = $('#savedWrap');
    const host = $('#savedList');
    if (!wrap || !host) return;
    wrap.hidden = !list.length;
    host.innerHTML = list.slice(0, 5).map((item) =>
      '<div class="saved__item">' +
        '<span class="saved__ref">' + item.ref + '</span>' +
        '<span class="saved__car">' + item.car + '</span>' +
        '<span class="saved__when">' + item.when + '</span>' +
      '</div>'
    ).join('');
  }

  function initBooking() {
    const form = $('#bookingForm');
    if (!form) return;
    const select = $('#bkCar');
    cars.forEach((car) => {
      const opt = document.createElement('option');
      opt.value = car.id;
      opt.textContent = car.brand + ' ' + car.model + ' — ' + EM.money(car.price);
      select.appendChild(opt);
    });

    $$('select.input', form).forEach((s) => {
      s.addEventListener('change', () => s.classList.toggle('is-empty', !s.value));
    });

    const date = $('#bkDate');
    if (date) date.min = new Date().toISOString().slice(0, 10);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#bkName');
      const phone = $('#bkPhone');
      const email = $('#bkEmail');
      const car = $('#bkCar');
      const day = $('#bkDate');
      const time = $('#bkTime');
      const status = $('#bookingStatus');
      let firstBad = null;

      function check(input, message) {
        setError(input, message);
        if (message && !firstBad) firstBad = input;
        return !message;
      }

      check(name, name.value.trim().length < 2 ? 'Please tell us your name.' : '');
      check(phone, !validPhone(phone.value) ? 'Enter a 10-digit Indian mobile number.' : '');
      check(email, !EMAIL_RE.test(email.value.trim()) ? 'That email does not look complete.' : '');
      check(car, !car.value ? 'Choose the car you would like to drive.' : '');
      check(time, !time.value ? 'Choose a time slot.' : '');
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const picked = day.value ? new Date(day.value + 'T00:00:00') : null;
      check(day, !picked ? 'Choose a date.' : (picked < today ? 'Choose today or a later date.' : ''));

      if (firstBad) {
        status.classList.remove('is-ok');
        status.textContent = 'Please check the highlighted fields.';
        firstBad.focus();
        return;
      }

      const button = $('#bookingSubmit');
      button.disabled = true;
      button.textContent = 'Reserving…';

      window.setTimeout(() => {
        const ref = bookingRef();
        const chosen = EM.byId(car.value);
        const niceDate = new Date(day.value + 'T00:00:00').toLocaleDateString('en-IN', {
          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
        const where = $('#bkPlace');
        const placeText = where.value === 'home' ? 'At your address' : 'Vijayawada showroom';

        const saved = store.get(STORE.bookings, []);
        saved.unshift({ ref: ref, car: chosen.brand + ' ' + chosen.short, when: niceDate + ' · ' + time.value });
        store.set(STORE.bookings, saved.slice(0, 10));

        form.hidden = true;
        const success = $('#bookingSuccess');
        success.hidden = false;
        success.innerHTML = '' +
          '<div class="success__check"><svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg></div>' +
          '<h3 class="success__title">Your drive is pencilled in</h3>' +
          '<p>A specialist will call <strong>' + phone.value.trim() + '</strong> within two working hours to confirm. This is a demo — no data left your browser.</p>' +
          '<div class="ref-card">' +
            '<span class="ref-card__label">Booking reference</span>' +
            '<div class="ref-card__row">' +
              '<span class="ref-card__value" id="bookingRefValue">' + ref + '</span>' +
              '<button class="link-btn" type="button" id="copyRef">Copy reference</button>' +
            '</div>' +
          '</div>' +
          '<dl class="summary">' +
            '<div><dt>Car</dt><dd>' + chosen.brand + ' ' + chosen.model + '</dd></div>' +
            '<div><dt>When</dt><dd>' + niceDate + ' · ' + time.value + '</dd></div>' +
            '<div><dt>Where</dt><dd>' + placeText + '</dd></div>' +
            '<div><dt>Contact</dt><dd>' + email.value.trim() + '</dd></div>' +
          '</dl>' +
          '<div class="success__actions">' +
            '<a class="btn btn--ghost btn--sm" href="#collection">Keep browsing</a>' +
            '<button class="btn btn--ghost btn--sm" type="button" id="bookAnother">Book another drive</button>' +
            '<a class="btn btn--light btn--sm" href="tel:+918664200900">Call the desk</a>' +
          '</div>';

        $('#copyRef').addEventListener('click', () => {
          const copy = () => toast('Reference copied');
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(ref).then(copy, copy);
          } else {
            copy();
          }
        });
        $('#bookAnother').addEventListener('click', () => {
          resetBookingForm();
          const nameInput = $('#bkName');
          if (nameInput) nameInput.focus();
        });

        renderSavedBookings();
        toast('Test drive requested · ' + ref);
        success.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });

        button.disabled = false;
        button.innerHTML = 'Request test drive <svg class="icon icon--move" aria-hidden="true"><use href="#i-arrow"></use></svg>';
      }, 700);
    });

    $('#clearSaved').addEventListener('click', () => {
      store.set(STORE.bookings, []);
      renderSavedBookings();
      toast('Saved requests cleared');
    });

    renderSavedBookings();
  }

  function initContact() {
    const form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#ctName');
      const phone = $('#ctPhone');
      const email = $('#ctEmail');
      const message = $('#ctMessage');
      const status = $('#ctStatus');
      let firstBad = null;

      function check(input, bad) {
        setError(input, bad ? 'This field needs attention.' : '');
        if (bad && !firstBad) firstBad = input;
      }

      check(name, name.value.trim().length < 2);
      check(phone, !validPhone(phone.value));
      check(email, !EMAIL_RE.test(email.value.trim()));
      check(message, message.value.trim().length < 10);

      if (firstBad) {
        status.classList.remove('is-ok');
        status.textContent = 'Please check the highlighted fields — the message needs at least 10 characters.';
        firstBad.focus();
        return;
      }

      status.textContent = '';
      const button = $('#ctSubmit');
      button.disabled = true;
      button.textContent = 'Sending…';

      window.setTimeout(() => {
        const success = $('#ctSuccess');
        form.hidden = true;
        success.hidden = false;
        success.className = 'inline-success';
        success.innerHTML = '' +
          '<svg class="icon" style="width:26px;height:26px" aria-hidden="true"><use href="#i-check"></use></svg>' +
          '<h4>Message received, ' + name.value.trim().split(' ')[0] + '</h4>' +
          '<p class="note">We reply within one working day. This is a demo, so nothing was actually sent — your details stay in this browser.</p>' +
          '<button class="btn btn--ghost btn--sm" type="button" id="ctReset">Write another message</button>';
        $('#ctReset').addEventListener('click', () => {
          form.reset();
          form.hidden = false;
          success.hidden = true;
          $$('.field', form).forEach((f) => f.classList.remove('has-error'));
          $$('.field__error', form).forEach((p) => { p.textContent = ''; });
          button.disabled = false;
          button.innerHTML = 'Send message <svg class="icon icon--move" aria-hidden="true"><use href="#i-send"></use></svg>';
        });
        toast('Message sent to the desk');
      }, 650);
    });
  }

  function initNewsletter() {
    const forms = [
      { form: $('#subscribeForm'), input: $('#nlEmail'), status: $('#nlStatus'), button: $('#nlSubmit') },
      { form: $('#footerSubscribe'), input: $('#ftEmail'), status: $('[data-sub-status]'), button: null }
    ];

    forms.forEach((entry) => {
      if (!entry.form) return;
      entry.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = entry.input.value.trim();
        entry.form.classList.toggle('has-error', !EMAIL_RE.test(value));
        if (!EMAIL_RE.test(value)) {
          entry.status.textContent = 'Enter a valid email address.';
          entry.input.focus();
          return;
        }
        const list = store.get(STORE.list, []);
        if (list.indexOf(value) === -1) list.push(value);
        store.set(STORE.list, list);
        entry.status.classList.add('is-ok');
        entry.status.textContent = 'You are on the list. One email a week, no more.';
        entry.input.value = '';
        if (entry.button) {
          entry.button.disabled = true;
          window.setTimeout(() => { entry.button.disabled = false; }, 2200);
        }
        toast('Subscribed — welcome to the list');
      });
      entry.input.addEventListener('input', () => {
        if (entry.form.classList.contains('has-error')) {
          entry.form.classList.remove('has-error');
          entry.status.textContent = '';
        }
      });
    });
  }

  /* ==================================================================== INIT */
  function initMisc() {
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    initMedia(document);
    initHeader();
    initScrollSpy();
    renderBrands();
    initCollection();
    initCompare();
    initModals();
    initBooking();
    initContact();
    initNewsletter();
    initPreloader();
    initHeroParallax();
    initReveal();

    /* Marquee: clone the track content so the loop is seamless on wide screens. */
    $$('.marquee__track').forEach((track) => {
      if (track.children.length < 4) {
        const clones = Array.prototype.slice.call(track.children).map((g) => g.cloneNode(true));
        clones.forEach((c) => { c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
      }
    });

    /* Keep the compare tray clear of the modal. */
    const observer = new MutationObserver(() => {
      const open = $$('dialog.modal[open]').length > 0;
      const tray = $('#compareTray');
      if (tray) tray.style.opacity = open ? '0' : '';
    });
    $$('dialog.modal').forEach((d) => observer.observe(d, { attributes: true, attributeFilter: ['open'] }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMisc);
  } else {
    initMisc();
  }
})();
