/* Sana Vita Medical — interactions */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- Hero slider ---------- */
  const track = $('#hero-track');
  const slides = $$('.slide', track);
  const tabs = $$('.tab');
  const count = $('#hero-count');
  const countM = $('#hero-count-m');
  const labelM = $('#hero-label-m');
  const pauseBtn = $('#hero-pause');
  const DURATION = 7000;
  let index = 0;
  let paused = reduceMotion;
  let hoverPaused = false;
  let startTs = 0;
  let elapsed = 0;
  let raf = 0;
  let programmatic = false;
  let scrollTimer = 0;

  tabs.forEach((tab, i) => {
    tab.id = `hero-tab-${i}`;
    tab.setAttribute('aria-controls', `hero-slide-${i}`);
    slides[i].id = `hero-slide-${i}`;
    slides[i].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => { goTo(i); resetTimer(); });
  });

  function slideOffset(i) {
    const first = slides[0].offsetLeft;
    return slides[i].offsetLeft - first;
  }

  function render() {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.classList.toggle('is-done', i < index);
      if (!active) tab.querySelector('.tab__progress').style.width = i < index ? '100%' : '0';
    });
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', String(i !== index));
      $$('a, button', s).forEach((el) => { el.tabIndex = i === index ? 0 : -1; });
    });
    count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
    countM.textContent = `${index + 1} / ${slides.length}`;
    labelM.textContent = tabs[index].querySelector('.tab__label').textContent;
  }

  function goTo(i, { scroll = true } = {}) {
    index = (i + slides.length) % slides.length;
    if (scroll) {
      programmatic = true;
      track.scrollTo({ left: slideOffset(index), behavior: reduceMotion ? 'auto' : 'smooth' });
      clearTimeout(scrollTimer);
      // released once scrolling settles (see scroll handler); fallback if no scroll happens
      scrollTimer = setTimeout(() => { programmatic = false; }, 1000);
    }
    render();
  }

  function resetTimer() {
    elapsed = 0;
    startTs = performance.now();
  }

  function tick(ts) {
    const running = !paused && !hoverPaused && !document.hidden;
    if (running) {
      elapsed += ts - startTs;
      if (elapsed >= DURATION) {
        goTo(index + 1);
        elapsed = 0;
      }
    }
    startTs = ts;
    const bar = tabs[index].querySelector('.tab__progress');
    bar.style.width = `${Math.min(elapsed / DURATION, 1) * 100}%`;
    raf = requestAnimationFrame(tick);
  }

  $('#hero-prev').addEventListener('click', () => { goTo(index - 1); resetTimer(); });
  $('#hero-next').addEventListener('click', () => { goTo(index + 1); resetTimer(); });

  function setPaused(p) {
    paused = p;
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.setAttribute('aria-label', p ? 'Відновити автопрокрутку' : 'Зупинити автопрокрутку');
  }
  pauseBtn.addEventListener('click', () => setPaused(!paused));

  // Pause while the user interacts with the slider
  const heroCard = $('.hero__card');
  heroCard.addEventListener('mouseenter', () => { hoverPaused = true; });
  heroCard.addEventListener('mouseleave', () => { hoverPaused = false; });
  heroCard.addEventListener('focusin', () => { hoverPaused = true; });
  heroCard.addEventListener('focusout', (e) => { if (!heroCard.contains(e.relatedTarget)) hoverPaused = false; });

  // Keyboard on tabs
  $('.tabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
    resetTimer();
    tabs[index].focus();
  });

  // Sync index when the user swipes (mobile scroll-snap)
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    if (programmatic) {
      scrollTimer = setTimeout(() => { programmatic = false; }, 150);
      return;
    }
    scrollTimer = setTimeout(() => {
      const x = track.scrollLeft;
      let best = 0;
      slides.forEach((_, i) => {
        if (Math.abs(slideOffset(i) - x) < Math.abs(slideOffset(best) - x)) best = i;
      });
      if (best !== index) { goTo(best, { scroll: false }); resetTimer(); }
    }, 120);
  }, { passive: true });

  window.addEventListener('resize', () => {
    track.scrollTo({ left: slideOffset(index), behavior: 'auto' });
  });

  setPaused(paused);
  render();
  startTs = performance.now();
  raf = requestAnimationFrame(tick);

  /* ---------- Header: "Ще" dropdown ---------- */
  const moreBtn = $('.nav__more');
  const moreMenu = $('#more-menu');
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = moreMenu.hidden;
    moreMenu.hidden = !open;
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!moreMenu.hidden && !moreMenu.contains(e.target)) {
      moreMenu.hidden = true;
      moreBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Mobile drawer ---------- */
  const burger = $('#burger');
  const drawer = $('#drawer');
  function toggleDrawer(open) {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => toggleDrawer(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) toggleDrawer(false); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!drawer.hidden) { toggleDrawer(false); burger.focus(); }
    if (!moreMenu.hidden) { moreMenu.hidden = true; moreBtn.setAttribute('aria-expanded', 'false'); moreBtn.focus(); }
    if (!results.hidden) results.hidden = true;
  });

  /* ---------- Language switch (visual only) ---------- */
  $$('.lang__item').forEach((btn) => btn.addEventListener('click', () => {
    $$('.lang__item').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }));

  /* ---------- Stub links ---------- */
  $$('[data-stub]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));

  /* ---------- Search ---------- */
  const searchForm = $('#search');
  const searchInput = $('#search-input');
  const searchDir = $('#search-dir');
  const results = $('#search-results');

  const mq = window.matchMedia('(max-width: 860px)');
  const fullPlaceholder = searchInput.placeholder;
  const syncPlaceholder = () => { searchInput.placeholder = mq.matches ? searchInput.dataset.placeholderM : fullPlaceholder; };
  mq.addEventListener('change', syncPlaceholder);
  syncPlaceholder();

  const INDEX = [
    { title: 'Жіночий check-up', type: 'Програма', dir: 'Гінекологія', href: '#programs', program: 'Жіночий check-up', keys: 'жінки гінеколог узд аналізи' },
    { title: 'Чоловічий check-up', type: 'Програма', dir: 'Кардіологія', href: '#programs', program: 'Чоловічий check-up', keys: 'чоловіки серце гормони урологія' },
    { title: 'Скринінг 40+', type: 'Програма', dir: 'Терапія', href: '#programs', program: 'Скринінг 40+', keys: 'безкоштовно державна тиск цукор холестерин' },
    { title: 'Кардіо-скринінг', type: 'Програма', dir: 'Кардіологія', href: '#programs', program: 'Кардіо-скринінг', keys: 'екг серце знижка' },
    { title: 'Гінекологія', type: 'Напрямок', dir: 'Гінекологія', href: '#directions', program: 'Гінекологія', keys: 'вагітність' },
    { title: 'Кардіологія', type: 'Напрямок', dir: 'Кардіологія', href: '#directions', program: 'Кардіологія', keys: 'екг серце' },
    { title: 'УЗД-діагностика', type: 'Напрямок', dir: 'УЗД-діагностика', href: '#directions', program: 'УЗД-діагностика', keys: 'узд ультразвук' },
    { title: 'Лабораторія', type: 'Напрямок', dir: 'Лабораторія', href: '#directions', program: 'Аналізи', keys: 'аналізи кров' },
    { title: 'Педіатрія', type: 'Напрямок', dir: 'Педіатрія', href: '#directions', program: 'Педіатрія', keys: 'діти дитина педіатр' },
    { title: 'Терапія', type: 'Напрямок', dir: 'Терапія', href: '#directions', program: 'Терапія', keys: 'сімейний лікар декларація терапевт' },
    { title: 'Олена Коваль', type: 'Гінеколог-ендокринолог', dir: 'Гінекологія', href: '#doctors', program: 'Гінеколог · Олена Коваль', keys: 'лікар ендокринолог' },
    { title: 'Андрій Мельник', type: 'Кардіолог', dir: 'Кардіологія', href: '#doctors', program: 'Кардіолог · Андрій Мельник', keys: 'лікар' },
    { title: 'Ірина Бондар', type: 'Лікар УЗД-діагностики', dir: 'УЗД-діагностика', href: '#doctors', program: 'УЗД · Ірина Бондар', keys: 'лікар узд' },
    { title: 'Марія Шевчук', type: 'Терапевт', dir: 'Терапія', href: '#doctors', program: 'Терапевт · Марія Шевчук', keys: 'лікар сімейний' },
  ];

  function runSearch() {
    const q = searchInput.value.trim().toLowerCase();
    const dir = searchDir.value;
    if (!q && !dir) { results.hidden = true; return; }
    const found = INDEX.filter((item) =>
      (!dir || item.dir === dir) &&
      (!q || `${item.title} ${item.type} ${item.dir} ${item.keys}`.toLowerCase().includes(q)));
    results.innerHTML = '';
    if (!found.length) {
      const p = document.createElement('p');
      p.textContent = 'Нічого не знайдено. Зателефонуйте нам — підкажемо.';
      results.append(p);
    } else {
      found.forEach((item) => {
        const a = document.createElement('a');
        a.href = item.href;
        a.setAttribute('role', 'option');
        a.dataset.program = item.program;
        const t = document.createElement('span');
        t.textContent = item.title;
        const s = document.createElement('small');
        s.textContent = item.type;
        a.append(t, s);
        results.append(a);
      });
    }
    results.hidden = false;
  }

  searchInput.addEventListener('input', runSearch);
  searchDir.addEventListener('change', runSearch);
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch();
    const first = results.querySelector('a');
    if (first) first.focus();
  });
  results.addEventListener('click', (e) => {
    if (e.target.closest('a')) results.hidden = true;
  });
  document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) results.hidden = true;
  });

  /* ---------- Booking form ---------- */
  const form = $('#booking-form');
  const nameInput = $('#f-name');
  const phoneInput = $('#f-phone');
  const programTag = $('#booking-program');
  const success = $('#booking-success');

  // Pre-select the program/doctor when the user comes from a CTA
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-program]');
    if (!link) return;
    programTag.textContent = link.dataset.program;
    programTag.hidden = false;
    success.hidden = true;
  });

  // Phone mask: +38 (0XX) XXX XX XX
  function formatPhone(value) {
    let d = value.replace(/\D/g, '');
    if (d.startsWith('380')) d = d.slice(2);
    else if (d.startsWith('38')) d = d.slice(2);
    if (d && d[0] !== '0') d = `0${d}`;
    d = d.slice(0, 10);
    if (!d) return '';
    let out = `+38 (${d.slice(0, 3)}`;
    if (d.length >= 3) out += ')';
    if (d.length > 3) out += ` ${d.slice(3, 6)}`;
    if (d.length > 6) out += ` ${d.slice(6, 8)}`;
    if (d.length > 8) out += ` ${d.slice(8, 10)}`;
    return out;
  }
  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
    clearError(phoneInput);
  });
  nameInput.addEventListener('input', () => clearError(nameInput));

  function setError(input, msg) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${input.id}-err`);
    $(`#${input.id}-err`).textContent = msg;
  }
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    $(`#${input.id}-err`).textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    if (nameInput.value.trim().length < 2) { setError(nameInput, 'Вкажіть, будь ласка, імʼя'); ok = false; }
    if (phoneInput.value.replace(/\D/g, '').length !== 12) { setError(phoneInput, 'Перевірте номер: +38 (0XX) XXX XX XX'); ok = false; }
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    success.hidden = false;
    success.focus();
    form.reset();
    programTag.hidden = true;
  });

  /* ---------- Sticky CTA (mobile) ---------- */
  const sticky = $('#sticky-cta');
  const hero = $('.hero');
  const booking = $('#booking');
  let heroVisible = true;
  let bookingVisible = false;
  const updateSticky = () => sticky.classList.toggle('is-visible', !heroVisible && !bookingVisible);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; updateSticky(); }).observe(hero);
    new IntersectionObserver(([en]) => { bookingVisible = en.isIntersecting; updateSticky(); }).observe(booking);
  }
})();
