// ================= Оформлення замовлення v2 (демо) =================
// Кроки згортаються після заповнення (✓ / !), праворуч — бонуси, промокод, підсумок.
// Нічого не надсилається, дані картки не збираються.

let cart = load("ogogo-cart", {});
let wishlist = new Set(load("ogogo-wish", []));
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";
const co = Object.assign({
  name: "", phone: "", email: "", city: "Київ", mode: "self", delivery: "pickup", address: "", branch: "",
  payment: "", bonusOn: false, bonusAmt: 0, promo: "", promoOn: false, noCall: true, comment: "",
}, load("ogogo-checkout", {}));
const ui = { open: null, items: false, promoMsg: "" };
const persist = () => save("ogogo-checkout", co);

const BONUS_BALANCE = 85;
const PROMOS = { OGOGO10: 0.10, WELCOME: 0.05 };
const CITIES = ["Київ", "Львів", "Одеса", "Харків", "Дніпро"];
const DELIV = {
  pickup:  { mode: "self",    title: "Самовивіз з магазину", price: 0,  days: 0, sub: () => { const st = curStore(); return `${st.city}, ${storeAddr(st)}`; } },
  post:    { mode: "self",    title: "Відділення пошти",     price: 59, days: 2, sub: () => "Заберіть у найближчому відділенні, у зручний час" },
  courier: { mode: "courier", title: "Кур'єр до дверей",     price: 89, days: 1, sub: () => "Доставка з 10:00 до 21:00" },
};

const curStore = () => stores.find((x) => x.id === storeId) || stores[0];
const entries = () => Object.entries(cart).map(([k, q]) => [byId(k), q]).filter(([p]) => p);
const count = () => entries().reduce((s, [, q]) => s + q, 0);
const goodsSum = () => entries().reduce((s, [p, q]) => s + (p.old || p.price) * q, 0);
const subtotal = () => entries().reduce((s, [p, q]) => s + p.price * q, 0);
const deliveryCost = () => { const d = DELIV[co.delivery]; return !d || d.price === 0 || subtotal() >= FREE_DELIVERY_FROM ? 0 : d.price; };
const promoRate = () => (co.promoOn && PROMOS[co.promo.trim().toUpperCase()]) || 0;
const promoDisc = () => Math.round(subtotal() * promoRate());
const bonusUsed = () => (co.bonusOn ? Math.max(0, Math.min(Number(co.bonusAmt) || 0, BONUS_BALANCE, subtotal() - promoDisc())) : 0);
const toPay = () => subtotal() - promoDisc() - bonusUsed() + deliveryCost();
const earned = () => Math.round((subtotal() - promoDisc() - bonusUsed()) * BONUS_RATE);
const dateIn = (days) => {
  if (days === 0) return "сьогодні";
  const d = new Date(); d.setDate(d.getDate() + days);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// ---------- Перевірка кроків ----------
const phoneOk = () => co.phone.replace(/\D/g, "").length >= 10;
const emailOk = () => !co.email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(co.email);
const recipientOk = () => co.name.trim().length >= 2 && phoneOk() && emailOk();
const deliveryOk = () => co.delivery === "pickup" || (co.delivery === "post" && co.branch.trim()) || (co.delivery === "courier" && co.address.trim());
const paymentOk = () => !!co.payment;
const firstOpen = () => (!recipientOk() ? "recipient" : !deliveryOk() ? "delivery" : !paymentOk() ? "payment" : null);

function renderCounts() {
  $$("[data-cart-count]").forEach((el) => { el.textContent = count(); el.hidden = count() === 0; });
  $$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
  $("#headerTotal").textContent = money(subtotal());
  $("#bonusTotal").textContent = money(entries().reduce((s, [p, q]) => s + bonus(p) * q, 0));
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const status = (ok) => `<span class="cs-st ${ok ? "ok" : "warn"}">${ok ? `<svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>` : "!"}</span>`;
const chev = `<svg class="cs-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function section(id, title, ok, summary, body, hint) {
  const open = ui.open === id;
  return `<section class="cs ${open ? "open" : ""}" data-sec="${id}">
    <button type="button" class="cs-head" data-toggle="${id}" aria-expanded="${open}">
      ${status(ok)}<span class="cs-title">${title}</span>
      ${!open && !ok && hint ? `<span class="cs-hint">${hint}</span>` : ""}
      ${chev}
    </button>
    ${open ? `<div class="cs-body">${body}</div>` : summary ? `<div class="cs-sum">${summary}</div>` : ""}
  </section>`;
}

function recipientSection() {
  const ok = recipientOk();
  const summary = ok ? `<div class="cs-card"><svg class="cs-ic"><use href="#i-user-line"/></svg><span><b>${esc(co.name)}</b><small>${esc(co.phone)}${co.email ? " · " + esc(co.email) : ""}</small></span><button type="button" class="cs-edit" data-toggle="recipient">Змінити</button></div>` : "";
  const body = `
    <div class="co-fields">
      <label class="co-field"><span>Ім'я та прізвище</span><input name="name" autocomplete="name" value="${esc(co.name)}" placeholder="Олена Коваль"></label>
      <label class="co-field"><span>Телефон</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" value="${esc(co.phone)}" placeholder="+380 __ ___ __ __"></label>
      <label class="co-field co-wide"><span>Email (необов'язково)</span><input name="email" type="email" autocomplete="email" value="${esc(co.email)}" placeholder="name@example.com"></label>
    </div>
    <button type="button" class="btn btn-dark cs-next" data-next="recipient">Продовжити</button>`;
  return section("recipient", "Отримувач", ok, summary, body, "Вкажіть контакти");
}

function deliveryOption(key) {
  const d = DELIV[key], on = co.delivery === key;
  const price = d.price === 0 || subtotal() >= FREE_DELIVERY_FROM ? "Безкоштовно" : money(d.price);
  let extra = "";
  if (on && key === "post") extra = `<label class="co-field co-inline"><span>Номер відділення</span><input name="branch" value="${esc(co.branch)}" placeholder="№ 12"></label>`;
  if (on && key === "courier") extra = `<label class="co-field co-inline"><span>Вулиця, будинок, квартира</span><input name="address" value="${esc(co.address)}" placeholder="вул. Прикладна, 1, кв. 5"></label>`;
  if (on && key === "pickup") extra = `<button type="button" class="co-link" data-open-stores>Обрати інший магазин</button>`;
  return `<div class="dopt ${on ? "on" : ""}">
    <label class="dopt-row"><input type="radio" name="delivery" value="${key}" ${on ? "checked" : ""}><span class="co-radio"></span>
      <span class="dopt-txt"><b>${d.title}</b><small>${d.sub()}</small></span>
      <span class="dopt-meta"><b>${price}</b><small>Отримаєте ${dateIn(d.days)}</small></span></label>
    ${extra}
  </div>`;
}

function deliverySection() {
  const ok = deliveryOk(), d = DELIV[co.delivery];
  const where = co.delivery === "pickup" ? `${curStore().city}, ${storeAddr(curStore())}` : co.delivery === "post" ? `${co.city}, відділення ${esc(co.branch)}` : `${co.city}, ${esc(co.address)}`;
  const summary = ok ? `<div class="cs-card"><svg class="cs-ic"><use href="#i-${co.delivery === "pickup" ? "store" : "truck"}"/></svg><span><b>${d.title}</b><small>${where} · Отримаєте ${dateIn(d.days)}</small></span><button type="button" class="cs-edit" data-toggle="delivery">Змінити</button></div>` : "";
  const keys = Object.keys(DELIV).filter((k) => DELIV[k].mode === co.mode);
  const minPrice = (mode) => Math.min(...Object.values(DELIV).filter((x) => x.mode === mode).map((x) => x.price));
  const body = `
    <div class="city-row">
      <label class="city-field"><svg><use href="#i-pin"/></svg><span>Ваше місто:</span><input name="city" value="${esc(co.city)}" list="coCities"></label>
      <div class="city-chips-co">${CITIES.map((c) => `<button type="button" class="cchip ${co.city === c ? "on" : ""}" data-city-co="${c}">${c}</button>`).join("")}</div>
      <datalist id="coCities">${CITIES.map((c) => `<option value="${c}">`).join("")}</datalist>
    </div>
    <div class="seg-tabs" role="tablist">
      <button type="button" role="tab" class="${co.mode === "self" ? "on" : ""}" data-mode="self">Забрати самостійно <small>${minPrice("self") ? `від ${money(minPrice("self"))}` : "від ₴0"}</small></button>
      <button type="button" role="tab" class="${co.mode === "courier" ? "on" : ""}" data-mode="courier">Кур'єром <small>від ${money(minPrice("courier"))}</small></button>
    </div>
    <div class="dopts">${keys.map(deliveryOption).join("")}</div>
    ${subtotal() < FREE_DELIVERY_FROM ? `<p class="co-tip">Додайте товарів ще на <b>${money(FREE_DELIVERY_FROM - subtotal())}</b> — і доставка буде безкоштовною</p>` : ""}
    <button type="button" class="btn btn-dark cs-next" data-next="delivery">Продовжити</button>`;
  return section("delivery", "Доставка", ok, summary, body, "Оберіть доставку");
}

const PAY = {
  card: { title: "Карткою онлайн", sub: "Visa, Mastercard, Apple Pay, Google Pay", ic: "i-cart" },
  cod:  { title: "Оплата при отриманні", sub: "Готівкою або карткою", ic: "i-bag" },
};
function paymentSection() {
  const ok = paymentOk();
  const summary = ok ? `<div class="cs-card"><svg class="cs-ic"><use href="#${PAY[co.payment].ic}"/></svg><span><b>${PAY[co.payment].title}</b><small>${PAY[co.payment].sub}</small></span><button type="button" class="cs-edit" data-toggle="payment">Змінити</button></div>` : "";
  const body = `<div class="dopts">${Object.entries(PAY).map(([k, p]) => `
    <div class="dopt ${co.payment === k ? "on" : ""}"><label class="dopt-row"><input type="radio" name="payment" value="${k}" ${co.payment === k ? "checked" : ""}><span class="co-radio"></span>
      <span class="dopt-txt"><b>${p.title}</b><small>${p.sub}</small></span></label></div>`).join("")}</div>
    <p class="co-secure"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Безпечна оплата: дані картки вводяться на сторінці банку (у демо — не запитуються)</p>`;
  return section("payment", "Спосіб оплати", ok, summary, body, "Оберіть спосіб оплати");
}

function itemsSection() {
  const list = entries();
  return `<section class="cs ${ui.items ? "open" : ""}">
    <button type="button" class="cs-head" data-items aria-expanded="${ui.items}">
      ${status(true)}<span class="cs-title">Ваші товари <em>${count()}</em></span>
      <span class="cs-thumbs">${list.slice(0, 4).map(([p]) => `<img src="${imgSrc(p)}" alt="">`).join("")}${list.length > 4 ? `<i>+${list.length - 4}</i>` : ""}</span>
      <span class="cs-amt"><small>На суму</small><b>${money(subtotal())}</b></span>${chev}
    </button>
    ${ui.items ? `<div class="cs-body"><ul class="co-items">${list.map(([p, q]) => `
      <li><span class="co-item-img"><img src="${imgSrc(p)}" alt=""><em>${q}</em></span><a class="co-item-name" href="${productUrl(p)}">${p.name}</a><b>${money(p.price * q)}</b></li>`).join("")}</ul>
      <a class="co-link" href="index.html#cart">Редагувати кошик</a></div>` : ""}
  </section>`;
}

function extrasSection() {
  return `<section class="cs cs-plain">
    <label class="co-check"><input type="checkbox" name="noCall" ${co.noCall ? "checked" : ""}><span>Мені можна не передзвонювати</span></label>
    ${co.noCall ? `<p class="co-tip">Якщо вам потрібна консультація щодо замовлення — зніміть галочку</p>` : ""}
    <label class="co-field co-wide"><textarea name="comment" rows="2" placeholder="Коментар до замовлення">${esc(co.comment)}</textarea></label>
  </section>`;
}

function sidebar() {
  const ready = recipientOk() && deliveryOk() && paymentOk();
  const promoRateNow = promoRate();
  return `
    <div class="co-box">
      <label class="co-check sb-row"><input type="checkbox" name="bonusOn" ${co.bonusOn ? "checked" : ""}><span>Списати бонуси</span><em>Доступно: <b>${money(BONUS_BALANCE)}</b></em></label>
      ${co.bonusOn ? `<div class="sb-apply"><input name="bonusAmt" type="number" min="0" max="${BONUS_BALANCE}" value="${Number(co.bonusAmt) || BONUS_BALANCE}" inputmode="numeric" aria-label="Сума бонусів"><button type="button" class="btn btn-dark" data-bonus-all>Усі</button></div>` : ""}
    </div>
    <div class="co-box">
      <label class="co-check"><input type="checkbox" name="promoOn" ${co.promoOn ? "checked" : ""}><span>Застосувати промокод</span></label>
      ${co.promoOn ? `<div class="sb-apply"><input name="promo" value="${esc(co.promo)}" placeholder="Напр. OGOGO10" autocapitalize="characters" aria-label="Промокод"><button type="button" class="btn btn-dark" data-promo>Застосувати</button></div>
        ${ui.promoMsg ? `<p class="sb-msg ${promoRateNow ? "ok" : "err"}">${ui.promoMsg}</p>` : `<p class="sb-msg">Спробуйте OGOGO10 — знижка 10%</p>`}` : ""}
    </div>
    <div class="co-box co-sum">
      <div class="co-lines">
        <div><span>Товари (${count()})</span><span>${money(goodsSum())}</span></div>
        ${goodsSum() > subtotal() ? `<div class="pos"><span>Знижка</span><span>−${money(goodsSum() - subtotal())}</span></div>` : ""}
        ${promoDisc() ? `<div class="pos"><span>Промокод ${esc(co.promo.toUpperCase())}</span><span>−${money(promoDisc())}</span></div>` : ""}
        ${bonusUsed() ? `<div class="pos"><span>Бонусів буде списано</span><span>−${money(bonusUsed())}</span></div>` : ""}
        <div><span>${DELIV[co.delivery].title}</span><span>${deliveryCost() ? money(deliveryCost()) : "Безкоштовно"}</span></div>
        <div class="earn"><span>Бонусів буде нараховано</span><span>+${money(earned())}</span></div>
      </div>
      <div class="co-total"><span>До сплати</span><b>${money(toPay())}</b></div>
      ${goodsSum() - subtotal() + promoDisc() + bonusUsed() > 0 ? `<p class="co-saved">Ви заощаджуєте ${money(goodsSum() - subtotal() + promoDisc() + bonusUsed())} 🎉</p>` : ""}
      <button type="button" class="btn btn-brand btn-block co-submit" data-submit>${ready ? "Підтвердити замовлення" : "Заповніть дані замовлення"}</button>
      <p class="co-terms">Підтверджуючи замовлення, ви погоджуєтеся з умовами використання й політикою конфіденційності. Це демо: нічого не надсилається.</p>
    </div>`;
}

function render() {
  if (!entries().length) {
    $(".co-title").hidden = false;
    $("#coContent").innerHTML = `<div class="co-empty"><b>Кошик порожній</b><span>Додайте товари, щоб оформити замовлення.</span><a class="btn btn-brand" href="index.html">Перейти до покупок</a></div>`;
    return;
  }
  if (ui.open === null) ui.open = firstOpen();
  const focusName = document.activeElement && document.activeElement.name;
  $("#coContent").innerHTML = `
    <div class="co-grid">
      <form class="co-form" id="coForm" novalidate onsubmit="return false">
        ${recipientSection()}${deliverySection()}${paymentSection()}${itemsSection()}${extrasSection()}
      </form>
      <aside class="co-side" id="coSide">${sidebar()}</aside>
    </div>
    <div class="co-bar"><span><small>До сплати</small><b>${money(toPay())}</b></span><button type="button" class="btn btn-brand" data-submit>${recipientOk() && deliveryOk() && paymentOk() ? "Підтвердити" : "Далі"}</button></div>`;
  if (focusName) { const el = document.querySelector(`[name="${focusName}"]`); if (el && el.type !== "radio" && el.type !== "checkbox") { el.focus(); const v = el.value; el.value = ""; el.value = v; } }
}

function refreshSide() {
  $("#coSide").innerHTML = sidebar();
  const bar = $(".co-bar b"); if (bar) bar.textContent = money(toPay());
}

// ---------- Події ----------
document.addEventListener("input", (e) => {
  const t = e.target;
  if (!t.closest || !t.closest("#coContent") || !t.name) return;
  co[t.name] = t.type === "checkbox" ? t.checked : t.value;
  t.closest(".co-field")?.classList.remove("err");
  if (t.name === "promo") ui.promoMsg = "";
  persist();
  if (t.type === "radio") { if (t.name === "delivery") co.delivery = t.value; render(); return; }
  if (t.type === "checkbox") { if (t.name === "bonusOn" && t.checked && !co.bonusAmt) co.bonusAmt = BONUS_BALANCE; render(); return; }
  if (t.name === "city") { $$(".cchip").forEach((c) => c.classList.toggle("on", c.dataset.cityCo === t.value)); }
  refreshSide();
});

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-toggle],[data-next],[data-items],[data-mode],[data-city-co],[data-submit],[data-promo],[data-bonus-all]");
  if (!t || !t.closest("#coContent, .co-bar")) return;
  const d = t.dataset;
  if (d.toggle) { ui.open = ui.open === d.toggle ? null : d.toggle; render(); }
  else if (d.next) {
    const ok = d.next === "recipient" ? recipientOk() : deliveryOk();
    if (!ok) return markErrors();
    ui.open = firstOpen(); render();
    document.querySelector(`[data-sec="${ui.open || "payment"}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  else if ("items" in d) { ui.items = !ui.items; render(); }
  else if (d.mode) { co.mode = d.mode; co.delivery = Object.keys(DELIV).find((k) => DELIV[k].mode === d.mode); persist(); render(); }
  else if (d.cityCo) { co.city = d.cityCo; persist(); render(); }
  else if ("bonusAll" in d) { co.bonusAmt = Math.min(BONUS_BALANCE, subtotal()); persist(); render(); }
  else if ("promo" in d) {
    ui.promoMsg = PROMOS[co.promo.trim().toUpperCase()] ? `Промокод застосовано: −${Math.round(PROMOS[co.promo.trim().toUpperCase()] * 100)}%` : "Такого промокоду немає";
    render();
  }
  else if ("submit" in d) submit();
});

function markErrors() {
  const bad = [];
  if (co.name.trim().length < 2) bad.push("name");
  if (!phoneOk()) bad.push("phone");
  if (!emailOk()) bad.push("email");
  if (co.delivery === "post" && !co.branch.trim()) bad.push("branch");
  if (co.delivery === "courier" && !co.address.trim()) bad.push("address");
  $$(".co-field").forEach((f) => f.classList.toggle("err", bad.includes(f.querySelector("input,textarea")?.name)));
  toast("Перевірте виділені поля");
  $(".co-field.err input")?.focus();
}

function submit() {
  const need = firstOpen();
  if (need) {
    ui.open = need; render();
    document.querySelector(`[data-sec="${need}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (need !== "payment") setTimeout(markErrors, 50); else toast("Оберіть спосіб оплати");
    return;
  }
  const num = "OG-" + String(Date.now()).slice(-6);
  const d = DELIV[co.delivery];
  const where = co.delivery === "pickup" ? `${curStore().city}, ${storeAddr(curStore())}` : co.delivery === "post" ? `${co.city}, відділення ${co.branch}` : `${co.city}, ${co.address}`;
  const sum = toPay(), plus = earned();
  cart = {}; save("ogogo-cart", cart); renderCounts();
  document.title = "Замовлення оформлено — Огого!";
  $(".co-title").hidden = true;
  $("#coContent").innerHTML = `
    <div class="co-done">
      <span class="co-done-ic"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <h1>Дякуємо, замовлення оформлено!</h1>
      <p>Номер замовлення <b>${num}</b></p>
      <div class="co-done-card">
        <div><span>${d.title}</span><b>${esc(where)}</b></div>
        <div><span>Отримаєте</span><b>${dateIn(d.days)}</b></div>
        <div><span>Оплата</span><b>${PAY[co.payment].title}</b></div>
        <div><span>Сума</span><b>${money(sum)}</b></div>
        <div><span>Бонусів буде нараховано</span><b>+${money(plus)}</b></div>
      </div>
      <p class="co-note">${co.noCall ? "Ми надішлемо SMS, коли замовлення буде готове." : "Менеджер зателефонує вам найближчим часом."} Це демо — нічого не надсилається.</p>
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
