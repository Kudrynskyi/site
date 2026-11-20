// ================= Оформлення замовлення (демо) =================
// Кроки: контакти → доставка → оплата → підтвердження. Нічого не надсилається.

let cart = load("ogogo-cart", {});
let wishlist = new Set(load("ogogo-wish", []));
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";
const co = Object.assign({ name: "", phone: "", email: "", delivery: "pickup", city: "Київ", address: "", payment: "card", useBonus: false, comment: "" }, load("ogogo-checkout", {}));

const entries = () => Object.entries(cart).map(([k, q]) => [byId(k), q]).filter(([p]) => p);
const goodsSum = () => entries().reduce((s, [p, q]) => s + (p.old || p.price) * q, 0);
const total = () => entries().reduce((s, [p, q]) => s + p.price * q, 0);
const BONUS_BALANCE = 50; // демо-баланс бонусів
const DELIVERY = { pickup: 0, courier: 89, post: 59 };
const deliveryCost = () => (co.delivery === "pickup" || total() >= FREE_DELIVERY_FROM ? 0 : DELIVERY[co.delivery]);
const bonusUsed = () => (co.useBonus ? Math.min(BONUS_BALANCE, total()) : 0);
const toPay = () => total() + deliveryCost() - bonusUsed();

function renderCounts() {
  const n = entries().reduce((s, [, q]) => s + q, 0);
  $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  $$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
  $("#headerTotal").textContent = money(total());
  $("#bonusTotal").textContent = money(entries().reduce((s, [p, q]) => s + bonus(p) * q, 0));
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const opt = (group, val, title, sub, price) => `
  <label class="co-opt ${co[group] === val ? "on" : ""}">
    <input type="radio" name="${group}" value="${val}" ${co[group] === val ? "checked" : ""}>
    <span class="co-radio"></span>
    <span class="co-opt-txt"><b>${title}</b><small>${sub}</small></span>
    ${price !== undefined ? `<span class="co-opt-price">${price}</span>` : ""}
  </label>`;

function render() {
  if (!entries().length) {
    $("#coContent").innerHTML = `<div class="co-empty"><b>Кошик порожній</b><span>Додайте товари, щоб оформити замовлення.</span><a class="btn btn-brand" href="index.html">Перейти до покупок</a></div>`;
    return;
  }
  const st = stores.find((x) => x.id === storeId) || stores[0];
  const freeShip = total() >= FREE_DELIVERY_FROM;
  const priceLbl = (v) => (v === 0 || freeShip ? "Безкоштовно" : money(v));
  $("#coContent").innerHTML = `
  <div class="co-grid">
    <form class="co-form" id="coForm" novalidate>
      <section class="co-step">
        <h2><span class="co-num">1</span>Контактні дані</h2>
        <div class="co-fields">
          <label class="co-field"><span>Ім'я та прізвище</span><input name="name" autocomplete="name" value="${esc(co.name)}" placeholder="Олена Коваль"></label>
          <label class="co-field"><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" value="${esc(co.phone)}" placeholder="+380 __ ___ __ __"></label>
          <label class="co-field co-wide"><span>Email (необов'язково)</span><input name="email" type="email" autocomplete="email" value="${esc(co.email)}" placeholder="name@example.com"></label>
        </div>
      </section>

      <section class="co-step">
        <h2><span class="co-num">2</span>Доставка</h2>
        <div class="co-opts">
          ${opt("delivery", "pickup", "Самовивіз з магазину", `${st.city}, ${storeAddr(st)} · сьогодні`, "Безкоштовно")}
          ${opt("delivery", "courier", "Кур'єр", "Завтра, 10:00–21:00", priceLbl(DELIVERY.courier))}
          ${opt("delivery", "post", "Відділення пошти", "1–2 дні по Україні", priceLbl(DELIVERY.post))}
        </div>
        ${co.delivery === "pickup"
          ? `<button type="button" class="co-link" data-open-stores>Змінити магазин</button>`
          : `<div class="co-fields">
              <label class="co-field"><span>Місто</span><input name="city" value="${esc(co.city)}"></label>
              <label class="co-field"><span>${co.delivery === "courier" ? "Вулиця, будинок, квартира" : "Номер відділення"}</span><input name="address" value="${esc(co.address)}" placeholder="${co.delivery === "courier" ? "вул. Прикладна, 1, кв. 5" : "№ 12"}"></label>
            </div>`}
      </section>

      <section class="co-step">
        <h2><span class="co-num">3</span>Оплата</h2>
        <div class="co-opts">
          ${opt("payment", "card", "Карткою онлайн", "Visa, Mastercard, Apple Pay, Google Pay")}
          ${opt("payment", "cash", "При отриманні", "Готівкою або карткою")}
        </div>
        <label class="co-check"><input type="checkbox" name="useBonus" ${co.useBonus ? "checked" : ""}><span>Списати бонуси: доступно <b>${money(BONUS_BALANCE)}</b></span></label>
        <label class="co-field co-wide"><span>Коментар до замовлення</span><textarea name="comment" rows="2" placeholder="Наприклад, зателефонуйте перед доставкою">${esc(co.comment)}</textarea></label>
      </section>
    </form>

    <aside class="co-sum">
      <h2>Ваше замовлення</h2>
      <ul class="co-items">${entries().map(([p, q]) => `
        <li><span class="co-item-img"><img src="${imgSrc(p)}" alt=""><em>${q}</em></span><span class="co-item-name">${p.name}</span><b>${money(p.price * q)}</b></li>`).join("")}</ul>
      <div class="co-lines">
        <div><span>Товари</span><span>${money(goodsSum())}</span></div>
        ${goodsSum() > total() ? `<div class="neg"><span>Знижка</span><span>−${money(goodsSum() - total())}</span></div>` : ""}
        <div><span>Доставка</span><span>${deliveryCost() ? money(deliveryCost()) : "Безкоштовно"}</span></div>
        ${bonusUsed() ? `<div class="neg"><span>Бонуси</span><span>−${money(bonusUsed())}</span></div>` : ""}
      </div>
      <div class="co-total"><span>До сплати</span><b>${money(toPay())}</b></div>
      <button class="btn btn-brand btn-block co-submit" form="coForm" type="submit">Підтвердити замовлення</button>
      <p class="co-note">Це демо: замовлення й оплата не надсилаються.</p>
    </aside>
  </div>`;

  const form = $("#coForm");
  form.addEventListener("input", (e) => {
    const t = e.target;
    co[t.name] = t.type === "checkbox" ? t.checked : t.value;
    t.closest(".co-field")?.classList.remove("err");
    save("ogogo-checkout", co);
    if (t.type === "radio" || t.type === "checkbox") render();
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); submit(); });
}

function submit() {
  const errs = [];
  if (co.name.trim().length < 2) errs.push("name");
  if (co.phone.replace(/\D/g, "").length < 10) errs.push("phone");
  if (co.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(co.email)) errs.push("email");
  if (co.delivery !== "pickup" && !co.address.trim()) errs.push("address");
  if (co.delivery !== "pickup" && !co.city.trim()) errs.push("city");
  $$(".co-field").forEach((f) => f.classList.toggle("err", errs.includes(f.querySelector("input,textarea")?.name)));
  if (errs.length) {
    toast("Перевірте виділені поля");
    $(".co-field.err input")?.focus();
    return;
  }
  const num = "OG-" + String(Date.now()).slice(-6);
  const st = stores.find((x) => x.id === storeId) || stores[0];
  const where = co.delivery === "pickup" ? `Самовивіз: ${st.city}, ${storeAddr(st)}` : co.delivery === "courier" ? `Кур'єр: ${co.city}, ${co.address}` : `Відділення пошти: ${co.city}, ${co.address}`;
  const sum = toPay(), earned = entries().reduce((s, [p, q]) => s + bonus(p) * q, 0);
  cart = {}; save("ogogo-cart", cart); renderCounts();
  document.title = "Замовлення оформлено — Огого!";
  $(".co-title").hidden = true;
  $("#coContent").innerHTML = `
    <div class="co-done">
      <span class="co-done-ic"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <h1>Дякуємо, замовлення оформлено!</h1>
      <p>Номер замовлення <b>${num}</b></p>
      <div class="co-done-card">
        <div><span>Отримання</span><b>${esc(where)}</b></div>
        <div><span>Оплата</span><b>${co.payment === "card" ? "Карткою онлайн" : "При отриманні"}</b></div>
        <div><span>Сума</span><b>${money(sum)}</b></div>
        <div><span>Нараховано бонусів</span><b>+${money(earned)}</b></div>
      </div>
      <p class="co-note">Це демо: замовлення не надсилається, але так виглядатиме підтвердження.</p>
      <a class="btn btn-brand co-home" href="index.html">Продовжити покупки</a>
    </div>`;
  window.scrollTo({ top: 0 });
}

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
    if (typeof render === "function") render();
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
