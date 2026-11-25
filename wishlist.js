// ================= Сторінка «Обране» =================
let cart = load("ogogo-cart", {});
let wishlist = new Set(load("ogogo-wish", []));
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";
let wlSort = "added";
let lastRemoved = null;

function renderCounts() {
  const entries = Object.entries(cart).map(([k, q]) => [byId(k), q]).filter(([p]) => p);
  const n = entries.reduce((s, [, q]) => s + q, 0);
  $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  $$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
  $("#headerTotal").textContent = money(entries.reduce((s, [p, q]) => s + p.price * q, 0));
  $("#bonusTotal").textContent = money(entries.reduce((s, [p, q]) => s + bonus(p) * q, 0));
}
const saveWish = () => save("ogogo-wish", [...wishlist]);
const setQty = (id, q) => { if (q <= 0) delete cart[id]; else cart[id] = q; save("ogogo-cart", cart); renderCounts(); render(); };

function wlCard(p) {
  const qty = cart[p.id] || 0;
  return `
    <article class="card wl-card">
      <div class="card-media">
        <a href="${productUrl(p)}" class="card-link" aria-label="${p.name}"><img src="${imgSrc(p)}" alt="${p.name}" loading="lazy"></a>
        <div class="badges">${promoBadges(p)}</div>
        <button class="wish on wl-remove" data-unwish="${p.id}" aria-label="Прибрати з обраного"><svg><use href="#i-heart-fill"/></svg></button>
        ${qty
          ? `<div class="quick-stepper"><button data-dec="${p.id}" aria-label="Менше">−</button><span>${qty}</span><button data-inc="${p.id}" aria-label="Більше">+</button></div>`
          : `<button class="quick-add" data-add="${p.id}" aria-label="Додати «${p.name}» у кошик"><svg class="qa-plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span class="qa-l">Додати</span></button>`}
      </div>
      <h3 class="card-name"><a href="${productUrl(p)}">${p.name}</a></h3>
      <div class="rating">${stars(p)}</div>
      ${fomoLine(p)}
      <p class="wl-stock"><span class="dot"></span>Є в наявності${p.old ? ` · <b>економія ${money(p.old - p.price)}</b>` : ""}</p>
      <div class="price-panel">
        <div class="price-col">
          ${p.old ? `<div class="old-row"><s>${money(p.old)}</s></div>` : ""}
          <b class="price">${money(p.price)}</b>
        </div>
        ${qty ? `<div class="pp-stepper" aria-label="Кількість у кошику"><button data-dec="${p.id}" aria-label="Менше">−</button><span>${qty}</span><button data-inc="${p.id}" aria-label="Більше">+</button></div>` : `<button class="buy" data-add="${p.id}">КУПИТИ</button>`}
      </div>
    </article>`;
}

function render() {
  const order = [...wishlist];
  let list = order.map(byId).filter(Boolean);
  if (wlSort === "cheap") list.sort((a, b) => a.price - b.price);
  if (wlSort === "discount") list.sort((a, b) => discount(b) - discount(a));
  if (wlSort === "added") list.reverse();
  const total = list.reduce((s, p) => s + p.price, 0);
  const saving = list.reduce((s, p) => s + (p.old ? p.old - p.price : 0), 0);
  const notInCart = list.filter((p) => !cart[p.id]);
  const undo = lastRemoved ? `<div class="wl-undo"><span>«${lastRemoved.name}» прибрано з обраного</span><button data-undo>Повернути</button></div>` : "";

  if (!list.length) {
    const sugg = products.filter((p) => p.hit || p.old).sort((a, b) => b.rating - a.rating).slice(0, 5);
    $("#wlContent").innerHTML = `${undo}
      <div class="wl-empty">
        <span class="wl-empty-ic"><svg><use href="#i-heart"/></svg></span>
        <h1>В обраному поки порожньо</h1>
        <p>Натискайте ♥ на товарах, щоб зберегти їх тут і повернутися пізніше.</p>
        <a class="btn btn-brand" href="index.html#catalog">До каталогу</a>
      </div>
      <h2 class="section-title">Вам може сподобатись</h2>
      <div class="products wl-grid">${sugg.map(sugCard).join("")}</div>`;
    return;
  }
  $("#wlContent").innerHTML = `${undo}
    <div class="catalog-title"><h1 class="promo-h1">Обране</h1><span>${list.length} ${plural(list.length, "товар", "товари", "товарів")}</span></div>
    <div class="wl-bar">
      <div class="wl-sum"><span>Разом <b>${money(total)}</b></span>${saving ? `<span class="wl-save">Економія ${money(saving)}</span>` : ""}</div>
      <label class="sort-box"><svg><use href="#i-sort"/></svg><select id="wlSort" aria-label="Сортування">
        <option value="added" ${wlSort === "added" ? "selected" : ""}>Нещодавно додані</option>
        <option value="cheap" ${wlSort === "cheap" ? "selected" : ""}>Від дешевих</option>
        <option value="discount" ${wlSort === "discount" ? "selected" : ""}>Найбільша знижка</option>
      </select></label>
      <button class="btn btn-ghost wl-clear" data-clear>Очистити</button>
      <button class="btn btn-brand wl-all" data-all ${notInCart.length ? "" : "disabled"}>${notInCart.length ? `Додати все в кошик (${notInCart.length})` : "Усе вже в кошику ✓"}</button>
    </div>
    <div class="products wl-grid">${list.map(wlCard).join("")}</div>`;
  $("#wlSort").addEventListener("change", (e) => { wlSort = e.target.value; render(); });
}

function sugCard(p) {
  const html = wlCard(p);
  return html.replace(`class="wish on wl-remove" data-unwish="${p.id}" aria-label="Прибрати з обраного"><svg><use href="#i-heart-fill"/></svg>`, `class="wish" data-towish="${p.id}" aria-label="Додати в обране"><svg><use href="#i-heart"/></svg>`).replace(/<p class="wl-stock">.*?<\/p>/, "");
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-unwish],[data-towish],[data-all],[data-clear],[data-undo]");
  if (!t || !t.closest("#wlContent")) return;
  const d = t.dataset;
  if (d.add) { setQty(d.add, (cart[d.add] || 0) + 1); toast("Додано в кошик ✓"); }
  else if (d.inc) setQty(d.inc, (cart[d.inc] || 0) + 1);
  else if (d.dec) setQty(d.dec, (cart[d.dec] || 0) - 1);
  else if (d.unwish) { const id = Number(d.unwish); wishlist.delete(id); lastRemoved = byId(id); saveWish(); renderCounts(); render(); }
  else if (d.towish) { wishlist.add(Number(d.towish)); lastRemoved = null; saveWish(); renderCounts(); render(); toast("Додано в обране ♥"); }
  else if ("undo" in d) { if (lastRemoved) wishlist.add(lastRemoved.id); lastRemoved = null; saveWish(); renderCounts(); render(); }
  else if ("all" in d) {
    let n = 0; [...wishlist].forEach((id) => { if (!cart[id] && byId(id)) { cart[id] = 1; n++; } });
    save("ogogo-cart", cart); renderCounts(); render(); toast(`Додано в кошик: ${n} ${plural(n, "товар", "товари", "товарів")} ✓`);
  }
  else if ("clear" in d) { wishlist.clear(); lastRemoved = null; saveWish(); renderCounts(); render(); }
});
window.addEventListener("storage", (e) => {
  if (e.key === "ogogo-wish") wishlist = new Set(load("ogogo-wish", []));
  if (e.key === "ogogo-cart") cart = load("ogogo-cart", {});
  if (e.key === "ogogo-wish" || e.key === "ogogo-cart") { renderCounts(); render(); }
});

render();
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
// Гістерезис: згортаємо після 140px, розгортаємо лише біля самого верху —
// інакше зміна висоти шапки зсуває сторінку й клас перемикається туди-сюди.
const onScrollHeader = () => {
  const y = window.scrollY, on = headerEl.classList.contains("scrolled");
  if (!on && y > 140) headerEl.classList.add("scrolled");
  else if (on && y < 20) headerEl.classList.remove("scrolled");
};
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
