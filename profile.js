// ================= Сторінка профілю =================
// Дані й допоміжні функції — у data.js, переклад — у i18n.js

const cart = load("ogogo-cart", {});
const wishlist = new Set(load("ogogo-wish", []));
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";

// ---------- Лічильники й бонуси ----------
const entries = Object.entries(cart).map(([k, q]) => [byId(k), q]).filter(([p]) => p);
const count = entries.reduce((s, [, q]) => s + q, 0);
const total = entries.reduce((s, [p, q]) => s + p.price * q, 0);
const bonuses = entries.reduce((s, [p, q]) => s + bonus(p) * q, 0);
$$("[data-cart-count]").forEach((el) => { el.textContent = count; el.hidden = count === 0; });
$$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
$("#headerTotal").textContent = money(total);
$("#bonusTotal").textContent = money(bonuses);
$("#pfBonus").textContent = money(bonuses);

// ---------- Мова ----------
$$("[data-lang]").forEach((b) => {
  const on = b.dataset.lang === LANG;
  b.classList.toggle("on", on);
  b.setAttribute("aria-checked", String(on));
  b.addEventListener("click", () => { if (b.dataset.lang !== LANG) setLang(b.dataset.lang); });
});
$("#langName").textContent = LANG === "en" ? "English" : "Українська";

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
