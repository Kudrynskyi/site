// ================= Сторінка товару =================
// Дані (products, details, stores…) і допоміжні функції — у data.js

let cart = load("ogogo-cart", {});
let wishlist = new Set(load("ogogo-wish", []));
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";

const id = Number(new URLSearchParams(location.search).get("id"));
const product = byId(id);

// ---------- Кошик і лічильники ----------
const cartEntries = () => Object.entries(cart).map(([k, q]) => [byId(k), q]).filter(([p]) => p);
const cartCount = () => cartEntries().reduce((s, [, q]) => s + q, 0);
const cartTotal = () => cartEntries().reduce((s, [p, q]) => s + p.price * q, 0);

function renderCounts() {
  const n = cartCount();
  $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  $$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
  $("#headerTotal").textContent = money(cartTotal());
  $("#bonusTotal").textContent = money(cartEntries().reduce((s, [p, q]) => s + bonus(p) * q, 0));
}

function setQty(pid, qty) {
  if (qty <= 0) delete cart[pid]; else cart[pid] = qty;
  save("ogogo-cart", cart);
  renderCounts();
  renderActions();
  renderRelated();
}

function toggleWish(pid) {
  pid = Number(pid);
  wishlist.has(pid) ? wishlist.delete(pid) : wishlist.add(pid);
  save("ogogo-wish", [...wishlist]);
  renderCounts();
  renderWish();
  renderRelated();
  toast(wishlist.has(pid) ? "Додано в обране ♥" : "Прибрано з обраного");
}

// ---------- Основний блок ----------
function renderProduct() {
  const p = product;
  const c = catById(p.cat);
  const d = details[p.id] || { code: String(100000 + p.id), desc: "", specs: {} };

  document.title = `${p.name} — купити за ${money(p.price)} | Огого!`;
  $('meta[name="description"]').setAttribute("content", `${p.name} за ${money(p.price)} в Огого!. ${d.desc}`);

  $("#pdpCrumbs").innerHTML = `
    <a href="index.html">Інтернет-магазин</a><span>/</span>
    <a href="index.html?cat=${c.id}">${c.name}</a><span>/</span>
    <span>${p.name}</span>`;

  $("#pdpImg").src = imgSrc(p);
  $("#pdpImg").alt = p.name;
  $("#pdpBadges").innerHTML = promoBadges(p, 3);

  $("#pdpCat").innerHTML = `<a href="index.html?cat=${c.id}">${c.icon} ${c.name}</a>`;
  $("#pdpTitle").textContent = p.name;
  $("#pdpRating").innerHTML = stars(p);
  $("#pdpCode").textContent = `Код: ${d.code}`;

  $("#pdpOld").innerHTML = p.old ? `<s>${money(p.old)}</s><span class="drop">−${money(p.old - p.price)}</span>` : "";
  $("#pdpPrice").textContent = money(p.price);
  $("#pdpBonus").innerHTML = `+${money(bonus(p))} бонусів на картку Огого`;
  $("#pdpBarOld").innerHTML = p.old ? `<s>${money(p.old)}</s>` : "";
  $("#pdpBarPrice").textContent = money(p.price);

  $("#pdpDesc").textContent = d.desc;
  if (window.aiSummary) $("#pdpAi").innerHTML = window.aiSummary(p);
  $("#pdpSpecs").innerHTML = [["Категорія", c.name], ...Object.entries(d.specs), ["Код товару", d.code]]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

  if (window.renderReviews) renderReviews(p);

  renderWish();
  renderActions();
}

function renderWish() {
  const on = wishlist.has(product.id);
  const b = $("#pdpWish");
  b.classList.toggle("on", on);
  b.setAttribute("aria-pressed", String(on));
  b.setAttribute("aria-label", on ? "Прибрати з обраного" : "Додати в обране");
  b.innerHTML = `<svg><use href="#${on ? "i-heart-fill" : "i-heart"}"/></svg>`;
}

function actionsHtml(compact) {
  const qty = cart[product.id] || 0;
  if (!qty) return `<button class="btn btn-brand pdp-buy" data-add>${compact ? "КУПИТИ" : "КУПИТИ"}</button>`;
  return `
    <div class="stepper pdp-stepper">
      <button data-dec aria-label="Менше">−</button><span>${qty}</span><button data-inc aria-label="Більше">+</button>
    </div>
    <a class="btn pdp-in-cart" href="index.html#cart">${compact ? "У кошик" : "Перейти в кошик"}</a>`;
}

function renderActions() {
  $("#pdpActions").innerHTML = actionsHtml(false);
  $("#pdpBarActions").innerHTML = actionsHtml(true);
}

// ---------- Схожі товари ----------
function relatedCard(p) {
  const qty = cart[p.id] || 0;
  return `
    <article class="card rel-card">
      <div class="card-media">
        <a href="${productUrl(p)}" class="card-link" aria-label="${p.name}"><img src="${imgSrc(p)}" alt="${p.name}" loading="lazy"></a>
        <div class="badges">${promoBadges(p)}</div>
        ${qty
          ? `<div class="quick-stepper"><button data-rel-dec="${p.id}" aria-label="Менше">−</button><span>${qty}</span><button data-rel-inc="${p.id}" aria-label="Більше">+</button></div>`
          : `<button class="quick-add" data-rel-add="${p.id}" aria-label="Додати «${p.name}» у кошик"><svg class="qa-plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span class="qa-l">Додати</span></button>`}
      </div>
      <div class="price-col">
        ${p.old ? `<div class="old-row"><s>${money(p.old)}</s></div>` : ""}
        <b class="price">${money(p.price)}</b>
      </div>
      <h3 class="card-name"><a href="${productUrl(p)}">${p.name}</a></h3>
    </article>`;
}

function renderRelated() {
  const list = products.filter((x) => x.id !== product.id)
    .sort((a, b) => (b.cat === product.cat) - (a.cat === product.cat) || (b.hit ? 1 : 0) - (a.hit ? 1 : 0))
    .slice(0, 8);
  $("#pdpRelated").innerHTML = list.map(relatedCard).join("");
}

// ---------- Каталог у шапці ----------
function renderCatalogMenu() {
  $("#catalogMenuGrid").innerHTML = categories.map((c) =>
    `<a class="catalog-item" href="index.html?cat=${c.id}"><span>${c.icon}</span>${c.name}</a>`).join("");
}
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
    (!q || `${x.city} ${x.place} ${x.street}`.toLowerCase().includes(q)));
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
  showOverlay();
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
function showOverlay() { $("#overlay").hidden = false; document.body.classList.add("locked"); }
function closeAll() {
  $$(".store-modal").forEach((m) => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); });
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

// ---------- Кліки ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-rel-add],[data-rel-inc],[data-rel-dec],[data-open-stores],[data-close],#pdpWish");
  if (!t) {
    if (!e.target.closest("#catalogMenu, #catalogBtn, #burgerBtn")) toggleCatalog(false);
    return;
  }
  const d = t.dataset;
  const q = cart[product.id] || 0;
  if ("add" in d) { setQty(product.id, q + 1); toast("Додано в кошик ✓"); }
  else if ("inc" in d) setQty(product.id, q + 1);
  else if ("dec" in d) setQty(product.id, q - 1);
  else if (d.relAdd) { setQty(d.relAdd, (cart[d.relAdd] || 0) + 1); toast("Додано в кошик ✓"); }
  else if (d.relInc) setQty(d.relInc, (cart[d.relInc] || 0) + 1);
  else if (d.relDec) setQty(d.relDec, (cart[d.relDec] || 0) - 1);
  else if (t.id === "pdpWish") toggleWish(product.id);
  else if ("openStores" in d) openStores();
  else if ("close" in d) closeAll();
});

// Синхронізація, якщо кошик змінили в іншій вкладці
window.addEventListener("storage", (e) => {
  if (e.key === "ogogo-cart") { cart = load("ogogo-cart", {}); renderCounts(); renderActions(); renderRelated(); }
  if (e.key === "ogogo-wish") { wishlist = new Set(load("ogogo-wish", [])); renderCounts(); renderWish(); }
});

// ---------- Старт ----------
renderCatalogMenu();
renderStoreLabels();
renderCounts();
if (product) {
  renderProduct();
  renderRelated();
} else {
  document.title = "Товар не знайдено — Огого!";
  $$(".pdp > :not(#pdpMissing)").forEach((el) => (el.hidden = true));
  $("#pdpMissing").hidden = false;
  $("#pdpBar").hidden = true;
}

// Компактна шапка під час прокрутки
const headerEl = $(".header");
const onScrollHeader = () => headerEl.classList.toggle("scrolled", window.scrollY > 80);
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

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
