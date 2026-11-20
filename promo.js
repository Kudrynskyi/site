// ================= Сторінки акцій =================
// promo.html — усі акції; promo.html?id=warm — окрема акція.
// Дані (promos, products…) — у data.js, переклад — у i18n.js

let cart = load("ogogo-cart", {});
let wishlist = new Set(load("ogogo-wish", []));
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";
const promoId = new URLSearchParams(location.search).get("id");
const promo = promoId ? promoById(promoId) : null;

// ---------- Лічильники ----------
function renderCounts() {
  const entries = Object.entries(cart).map(([k, q]) => [byId(k), q]).filter(([p]) => p);
  const n = entries.reduce((s, [, q]) => s + q, 0);
  $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  $$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
  $("#headerTotal").textContent = money(entries.reduce((s, [p, q]) => s + p.price * q, 0));
  $("#bonusTotal").textContent = money(entries.reduce((s, [p, q]) => s + bonus(p) * q, 0));
}
function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  save("ogogo-cart", cart);
  renderCounts();
  renderGrid();
}

// ---------- Розмітка ----------
function heroArt(pr) {
  if (pr.id === "card") return `
    <div class="loyalty-card" aria-hidden="true">
      <span class="lc-logo"><span class="logo-o">О</span>гого!</span>
      <span class="lc-name">бонусна картка</span><span class="lc-chip"></span><span class="lc-num">•••• 2026</span>
    </div>
    <span class="coin c1">₴</span><span class="coin c2">₴</span><span class="coin c3">₴</span>`;
  return `<img src="images/${pr.imgs[0]}.webp" alt="" class="pb-hero">${pr.imgs[1] ? `<img src="images/${pr.imgs[1]}.webp" alt="" class="pb-side">` : ""}`;
}
const is3d = (pr) => pr.id === "crazy" || pr.id === "school";

function daysLeft(pr) {
  if (!pr.ends) return null;
  const d = Math.ceil((new Date(pr.ends + "T23:59:59") - new Date()) / 864e5);
  return d > 0 ? d : 0;
}
function leftLabel(pr) {
  const d = daysLeft(pr);
  if (d === null) return "Діє завжди";
  if (d === 0) return "Акція завершилась";
  return `Залишилось ${d} ${plural(d, "день", "дні", "днів")}`;
}

function promoCard(p) {
  const qty = cart[p.id] || 0;
  const wished = wishlist.has(p.id);
  return `
    <article class="card">
      <div class="card-media">
        <a href="${productUrl(p)}" class="card-link" aria-label="${p.name}"><img src="${imgSrc(p)}" alt="${p.name}" loading="lazy"></a>
        <div class="badges">${promoBadges(p)}</div>
        <button class="wish ${wished ? "on" : ""}" data-wish="${p.id}" aria-label="${wished ? "Прибрати з обраного" : "Додати в обране"}"><svg><use href="#${wished ? "i-heart-fill" : "i-heart"}"/></svg></button>
        ${qty
          ? `<div class="quick-stepper"><button data-dec="${p.id}" aria-label="Менше">−</button><span>${qty}</span><button data-inc="${p.id}" aria-label="Більше">+</button></div>`
          : `<button class="quick-add" data-add="${p.id}" aria-label="Додати «${p.name}» у кошик"><svg class="qa-plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span class="qa-l">Додати</span></button>`}
      </div>
      <h3 class="card-name"><a href="${productUrl(p)}">${p.name}</a></h3>
      <div class="rating">${stars(p)}</div>
      <div class="price-panel">
        <div class="price-col">
          ${p.old ? `<div class="old-row"><s>${money(p.old)}</s><span class="drop">−${money(p.old - p.price)}</span></div>` : ""}
          <b class="price">${money(p.price)}</b>
        </div>
        ${qty ? `<div class="pp-stepper" aria-label="Кількість у кошику"><button data-dec="${p.id}" aria-label="Менше">−</button><span>${qty}</span><button data-inc="${p.id}" aria-label="Більше">+</button></div>` : `<button class="buy" data-add="${p.id}">КУПИТИ</button>`}
      </div>
    </article>`;
}

function renderGrid() {
  const g = $("#promoGrid");
  if (g && promo) g.innerHTML = promoProducts(promo).map(promoCard).join("");
}

function renderList() {
  document.title = "Усі акції — Огого!";
  $("#promoCrumbs").innerHTML = `<a href="index.html">Інтернет-магазин</a><span>/</span><span>Усі акції</span>`;
  $("#promoContent").innerHTML = `
    <div class="catalog-title"><h1 class="promo-h1">Усі акції</h1><span>${promos.length} ${plural(promos.length, "акція", "акції", "акцій")}</span></div>
    <div class="promo-list">
      ${promos.map((pr) => `
        <a class="pb promo-tile" href="${promoUrl(pr)}">
          <h2 class="pb-title ${is3d(pr) ? "pb-3d" : ""}">${pr.title}</h2>
          <p class="pb-pill">${pr.tag} · ${pr.dates}</p>
          <div class="pb-stage">${heroArt(pr)}</div>
          <span class="promo-tile-foot"><span>${leftLabel(pr)}</span><span class="pb-cta">Детальніше</span></span>
        </a>`).join("")}
    </div>`;
}

function renderPromo() {
  const pr = promo;
  const list = promoProducts(pr);
  document.title = `${pr.title} — Акції Огого!`;
  $("#promoCrumbs").innerHTML = `<a href="index.html">Інтернет-магазин</a><span>/</span><a href="promo.html">Усі акції</a><span>/</span><span>${pr.title}</span>`;
  $("#promoContent").innerHTML = `
    <section class="pb promo-hero">
      <div class="promo-hero-text">
        <span class="dates">${pr.dates}</span>
        <h1 class="pb-title ${is3d(pr) ? "pb-3d" : ""}">${pr.title}</h1>
        <p class="pb-pill">${pr.tag}</p>
        <p class="promo-lead">${pr.lead}</p>
        <div class="promo-actions">
          <a class="pb-cta promo-go-btn" href="#promoGrid">${pr.cta}</a>
          <span class="promo-left">${leftLabel(pr)}</span>
        </div>
      </div>
      <div class="pb-stage promo-hero-art">${heroArt(pr)}</div>
    </section>

    <section class="promo-terms">
      <h2 class="section-title">Умови акції</h2>
      <ul>${pr.terms.map((t) => `<li>${t}</li>`).join("")}</ul>
    </section>

    <section class="section">
      <div class="catalog-title"><h2>Товари акції</h2><span>${list.length} ${plural(list.length, "товар", "товари", "товарів")}</span></div>
      <div class="products promo-grid" id="promoGrid"></div>
    </section>

    <section class="section">
      <h2 class="section-title">Інші акції</h2>
      <div class="promo-others">
        ${promos.filter((x) => x.id !== pr.id).map((x) => `
          <a class="promo-mini" href="${promoUrl(x)}">
            <span class="promo-mini-img">${x.imgs[0] ? `<img src="images/${x.imgs[0]}.webp" alt="">` : `<span class="logo-o">О</span>`}</span>
            <span class="promo-mini-txt"><b>${x.title}</b><small>${x.tag} · ${x.dates}</small></span>
            <svg class="chev"><use href="#i-chevron-right"/></svg>
          </a>`).join("")}
      </div>
    </section>`;
  renderGrid();
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-wish]");
  if (!t) return;
  const d = t.dataset;
  if (d.add) {
    if (cart[d.add]) { location.href = "index.html#cart"; return; }
    setQty(d.add, 1); toast("Додано в кошик ✓");
  } else if (d.inc) setQty(d.inc, (cart[d.inc] || 0) + 1);
  else if (d.dec) setQty(d.dec, (cart[d.dec] || 0) - 1);
  else if (d.wish) {
    const id = Number(d.wish);
    wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
    save("ogogo-wish", [...wishlist]);
    renderCounts(); renderGrid();
    toast(wishlist.has(id) ? "Додано в обране ♥" : "Прибрано з обраного");
  }
});

if (promoId && !promo) location.replace("promo.html");
else if (promo) {
  renderPromo();
  if (promo.id === "card") { const b = $(".promo-go-btn"); b.removeAttribute("href"); b.setAttribute("data-soon", "Картка з'явиться згодом 🙂"); }
} else renderList();
renderCounts();

// ---------- Каталог у шапці ----------
$("#catalogMenuGrid").innerHTML = categories.map((c) =>
  `<a class="catalog-item" href="index.html?cat=${c.id}"><span>${c.icon}</span>${c.name}</a>`).join("");
function toggleCatalog(force) {
  const menu = $("#catalogMenu");
  const open = force ?? menu.hidden;
  menu.hidden = !open;
  $("#catalogBtn").setAttribute("aria-expanded", String(open));
}
$("#catalogBtn").addEventListener("click", () => toggleCatalog());
$("#burgerBtn").addEventListener("click", () => toggleCatalog());

// ---------- Вибір магазину ----------
function renderStoreLabels() {
  const st = stores.find((x) => x.id === storeId) || stores[0];
  $$("[data-store-full]").forEach((el) => (el.textContent = `${st.city}, ${storeAddr(st)}`));
  $$("[data-store-city]").forEach((el) => (el.textContent = st.city));
  $$("[data-store-addr]").forEach((el) => (el.textContent = storeAddr(st)));
}
function renderStores() {
  const cities = ["Усі", ...new Set(stores.map((x) => x.city))];
  $("#cityChips").innerHTML = cities.map((c) =>
    `<button class="city-chip ${c === storeCity ? "on" : ""}" data-city="${c}">${c}</button>`).join("");
  const q = $("#storeSearch").value.trim().toLowerCase();
  const list = stores.filter((x) =>
    (storeCity === "Усі" || x.city === storeCity) &&
    (!q || `${x.city} ${x.place} ${x.street} ${tr(x.city)} ${tr(x.street)}`.toLowerCase().includes(q)));
  $("#storeList").innerHTML = list.length ? list.map((x) => `
    <li><button class="store-item ${x.id === storeId ? "on" : ""}" data-store="${x.id}">
      <svg class="store-ico"><use href="#i-store"/></svg>
      <span><b>${x.city}${x.place ? `, ${x.place}` : ""}</b><small>${x.street} · ${x.hours}</small></span>
      ${x.id === storeId ? `<svg class="tick"><use href="#i-check"/></svg>` : ""}
    </button></li>`).join("") : `<li class="store-none">Магазинів не знайдено</li>`;
}
function openStores() {
  closeAll();
  renderStores();
  $("#storeModal").classList.add("open");
  $("#storeModal").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.classList.add("locked");
}
$("#storeSearch").addEventListener("input", renderStores);
$("#storeModal").addEventListener("click", (e) => {
  const c = e.target.closest("[data-city]");
  if (c) { storeCity = c.dataset.city; renderStores(); return; }
  const b = e.target.closest("[data-store]");
  if (b) {
    storeId = Number(b.dataset.store);
    save("ogogo-store", storeId);
    renderStoreLabels();
    closeAll();
    const st = stores.find((x) => x.id === storeId);
    toast(`Магазин: ${st.city}, ${storeAddr(st)} ✓`);
  }
});

// ---------- Шари й сповіщення ----------
function closeAll() {
  $("#storeModal").classList.remove("open");
  $("#storeModal").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.classList.remove("locked");
  toggleCatalog(false);
}
$("#overlay").addEventListener("click", closeAll);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open-stores],[data-close],[data-soon]");
  if (!t) { if (!e.target.closest("#catalogMenu, #catalogBtn, #burgerBtn")) toggleCatalog(false); return; }
  if ("openStores" in t.dataset) openStores();
  else if ("close" in t.dataset) closeAll();
  else if (t.dataset.soon) toast(t.dataset.soon);
});

// ---------- Компактна шапка ----------
const headerEl = $(".header");
const onScrollHeader = () => headerEl.classList.toggle("scrolled", window.scrollY > 80);
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

renderStoreLabels();

// Телефон: ховати рядок з лого й магазином під час прокрутки вниз, показувати — вгору
(function autoHideTopRow() {
  const header = document.querySelector(".header");
  const top = header && header.querySelector(".top-nav");
  if (!top) return;
  const mq = window.matchMedia("(max-width: 760px)");
  const setH = () => header.style.setProperty("--top-h", top.offsetHeight + "px");
  setH(); window.addEventListener("resize", setH);
  let lastY = window.scrollY, ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, dy = y - lastY;
      if (!mq.matches || y < 120 || document.body.classList.contains("locked")) header.classList.remove("hide-top");
      else if (dy > 6) header.classList.add("hide-top");
      else if (dy < -6) header.classList.remove("hide-top");
      if (Math.abs(dy) > 6) lastY = y;
      ticking = false;
    });
  }, { passive: true });
})();
