// ================= Дані =================
const categories = [
  { id: "home",    name: "Дім і текстиль",  icon: "🛋️" },
  { id: "kitchen", name: "Кухня й посуд",   icon: "🍳" },
  { id: "clean",   name: "Побутова хімія",  icon: "🧽" },
  { id: "beauty",  name: "Краса й гігієна", icon: "🧴" },
  { id: "kids",    name: "Дитячі товари",   icon: "🧸" },
  { id: "office",  name: "Канцтовари",      icon: "✏️" },
  { id: "garden",  name: "Дача й сад",      icon: "🌱" },
  { id: "pets",    name: "Для тварин",      icon: "🐾" },
  { id: "tools",   name: "Інструменти",     icon: "🔧" },
  { id: "season",  name: "Сезонні товари",  icon: "🎄" },
];

const products = [
  { id: 1,  name: "Сковорода антипригарна 24 см",      cat: "kitchen", img: "skovoroda",          price: 289, old: 399, hit: true,  rating: 4.8, reviews: 54 },
  { id: 2,  name: "Набір рушників, 3 шт.",              cat: "home",    img: "rushnyky",           price: 199, old: 259,             rating: 4.6, reviews: 21 },
  { id: 3,  name: "Засіб для миття посуду 1 л",         cat: "clean",   img: "zasib-posud",        price: 49,  old: 65,              rating: 4.9, reviews: 132 },
  { id: 4,  name: "Конструктор «Місто», 120 деталей",   cat: "kids",    img: "konstruktor",        price: 349,            isNew: true, rating: 0,  reviews: 0 },
  { id: 5,  name: "Плед флісовий 150×200 см, лавандовий", cat: "home",  img: "pled",               price: 259, old: 349, hit: true,  rating: 4.7, reviews: 38 },
  { id: 6,  name: "Зошит А5, 48 аркушів",               cat: "office",  img: "zoshyt",             price: 15,  old: 19,              rating: 4.5, reviews: 12 },
  { id: 7,  name: "Шампунь для всієї родини 750 мл",    cat: "beauty",  img: "shampun",            price: 79,  old: 99,              rating: 4.4, reviews: 27 },
  { id: 8,  name: "Гірлянда LED, 10 м, тепле світло",   cat: "season",  img: "girlyanda",          price: 149, old: 219, hit: true,  rating: 4.9, reviews: 76 },
  { id: 9,  name: "Набір контейнерів для їжі, 5 шт.",   cat: "kitchen", img: "konteinery",         price: 129,                       rating: 4.6, reviews: 19 },
  { id: 10, name: "Іграшка м'яка «Ведмедик», 35 см",    cat: "kids",    img: "vedmedyk",           price: 189, old: 239,             rating: 5.0, reviews: 9 },
  { id: 11, name: "Губки кухонні, 10 шт.",              cat: "clean",   img: "gubky",              price: 35,  old: 45,              rating: 4.7, reviews: 88 },
  { id: 12, name: "Рюкзак шкільний, помаранчевий",      cat: "office",  img: "ryukzak",            price: 449, old: 599,             rating: 4.8, reviews: 15 },
  { id: 13, name: "Насіння томатів «Черрі»",            cat: "garden",  img: "nasinnya-tomativ",   price: 19,                        rating: 4.3, reviews: 6 },
  { id: 14, name: "Миска керамічна для котів",          cat: "pets",    img: "myska-kit",          price: 59,  old: 79,              rating: 4.8, reviews: 23 },
  { id: 15, name: "Набір викруток, 6 шт.",              cat: "tools",   img: "vykrutky",           price: 169, old: 219,             rating: 4.6, reviews: 31 },
  { id: 16, name: "Ялинкові іграшки, 12 шт.",           cat: "season",  img: "yalynkovi-igrashky", price: 119, old: 159, isNew: true, rating: 0,  reviews: 0 },
];

const FREE_DELIVERY_FROM = 500; // безкоштовна доставка замовлення від цієї суми
const DELIVERY_FEE = 59;
const BONUS_RATE = 0.05;
const priceRanges = [
  { label: "До ₴50", min: 0, max: 50 },
  { label: "₴50–₴200", min: 50, max: 200 },
  { label: "Від ₴200", min: 200, max: Infinity },
];

const sortOptions = [
  { id: "popular", name: "Популярні" },
  { id: "cheap",   name: "Від дешевих" },
  { id: "expensive", name: "Від дорогих" },
  { id: "discount", name: "Найбільша знижка" },
  { id: "rating",  name: "За рейтингом" },
];

// ================= Допоміжне =================
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const money = (n) => "₴" + n.toLocaleString("uk-UA");
const catById = (id) => categories.find((c) => c.id === id);
const byId = (id) => products.find((p) => p.id === Number(id));
const imgSrc = (p) => `images/${p.img}.jpg`;
const bonus = (p) => Math.round(p.price * BONUS_RATE);
const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}
const itemsWord = (n) => `${n} ${plural(n, "товар", "товари", "товарів")}`;

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// ================= Стан =================
let cart = load("ogogo-cart", {});
let wishlist = new Set(load("ogogo-wish", []));
const prices = products.map((p) => p.price);
const PRICE_MIN = Math.min(...prices);
const PRICE_MAX = Math.max(...prices);

const state = {
  query: "",
  cats: new Set(),
  flags: new Set(),
  min: PRICE_MIN,
  max: PRICE_MAX,
  sort: "popular",
  wishOnly: false,
};

// ================= Головна: категорії й пропозиції =================
function renderCategories() {
  $("#categoryList").innerHTML = categories.map((c) => {
    const p = products.find((x) => x.cat === c.id);
    return `
      <button class="cat-tile" data-cat-go="${c.id}">
        <span class="cat-img">${p ? `<img src="${imgSrc(p)}" alt="" loading="lazy">` : c.icon}</span>
        <span class="cat-name">${c.name}</span>
      </button>`;
  }).join("");

  $("#catalogMenuGrid").innerHTML = categories.map((c) =>
    `<button class="catalog-item" data-cat-go="${c.id}"><span>${c.icon}</span>${c.name}</button>`).join("");

  $("#catChecks").innerHTML = categories.map((c) => `
    <label class="check"><input type="checkbox" data-cat="${c.id}"><span class="check-emoji">${c.icon}</span>${c.name}
      <em>${products.filter((p) => p.cat === c.id).length}</em></label>`).join("");
}

function renderDeals() {
  const deals = products.filter((p) => p.old).sort((a, b) => (b.old - b.price) - (a.old - a.price)).slice(0, 6);
  const tones = ["#D1E3FC", "#FFE7D6", "#E6DEFA", "#DDF3E4", "#FFF0BF", "#FCE1EC"];
  $("#dealList").innerHTML = deals.map((p, i) => `
    <article class="deal" style="--tone:${tones[i % tones.length]}">
      <div class="deal-text">
        <p class="deal-title">${i === 0 ? "ТОВАР<br>ДНЯ" : "ГАРЯЧА<br>ЦІНА"}</p>
        <p class="deal-price">${money(p.price)}</p>
        <div class="deal-old"><s>${money(p.old)}</s><span class="save">−${money(p.old - p.price)}</span></div>
        <span class="grow"></span>
        <p class="deal-name">${p.name}</p>
      </div>
      <button class="deal-img" data-add="${p.id}" aria-label="Додати «${p.name}» у кошик">
        <img src="${imgSrc(p)}" alt="" loading="lazy">
      </button>
    </article>`).join("");
}

// ================= Каталог =================
function filtered() {
  const q = state.query.trim().toLowerCase();
  let list = products.filter((p) =>
    (!q || p.name.toLowerCase().includes(q) || catById(p.cat).name.toLowerCase().includes(q)) &&
    (!state.cats.size || state.cats.has(p.cat)) &&
    p.price >= state.min && p.price <= state.max &&
    (!state.flags.has("sale") || p.old) &&
    (!state.flags.has("hit") || p.hit) &&
    (!state.flags.has("new") || p.isNew) &&
    (!state.flags.has("cheap") || p.price <= 100) &&
    (!state.wishOnly || wishlist.has(p.id))
  );
  const sorters = {
    popular: (a, b) => (b.hit ? 1 : 0) - (a.hit ? 1 : 0) || b.reviews - a.reviews,
    cheap: (a, b) => a.price - b.price,
    expensive: (a, b) => b.price - a.price,
    discount: (a, b) => discount(b) - discount(a),
    rating: (a, b) => b.rating - a.rating,
  };
  return list.sort(sorters[state.sort]);
}

function stars(p) {
  if (!p.reviews) {
    return `<span class="reviews"><svg><use href="#i-comment"/></svg>Залишити відгук</span>`;
  }
  const full = Math.round(p.rating);
  return `
    <span class="stars" aria-label="Рейтинг ${p.rating}">
      ${[1, 2, 3, 4, 5].map((i) => `<svg class="${i <= full ? "on" : ""}"><use href="#i-star"/></svg>`).join("")}
      <b>${p.rating.toFixed(1)}</b>
    </span>
    <span class="reviews"><svg><use href="#i-comment"/></svg>${p.reviews}</span>`;
}

function productCard(p) {
  const wished = wishlist.has(p.id);
  const badges = [
    p.old ? `<span class="badge badge-sale">−${discount(p)}%</span>` : "",
    p.hit ? `<span class="badge badge-hit">ХІТ</span>` : "",
    p.isNew ? `<span class="badge badge-new">НОВИНКА</span>` : "",
  ].join("");
  const qty = cart[p.id] || 0;
  const quick = qty
    ? `<div class="quick-stepper" aria-label="Кількість у кошику">
         <button data-dec="${p.id}" aria-label="Менше">−</button><span>${qty}</span><button data-inc="${p.id}" aria-label="Більше">+</button>
       </div>`
    : `<button class="quick-add" data-quick-add="${p.id}" aria-label="Швидко додати «${p.name}» у кошик">+</button>`;
  return `
    <article class="card">
      <div class="card-media">
        <img src="${imgSrc(p)}" alt="${p.name}" loading="lazy">
        <div class="badges">${badges}</div>
        <button class="wish ${wished ? "on" : ""}" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? "Прибрати з обраного" : "Додати в обране"}">
          <svg><use href="#${wished ? "i-heart-fill" : "i-heart"}"/></svg>
        </button>
        ${quick}
      </div>
      <h3 class="card-name">${p.name}</h3>
      <div class="rating">${stars(p)}</div>
      <div class="price-panel">
        <div class="price-col">
          ${p.old ? `<div class="old-row"><s>${money(p.old)}</s><span class="drop">−${money(p.old - p.price)}</span></div>` : ""}
          <b class="price">${money(p.price)}</b>
        </div>
        <button class="buy ${qty ? "in-cart" : ""}" data-${qty ? "open-cart" : "add"}="${p.id}">${qty ? "У КОШИКУ" : "КУПИТИ"}</button>
      </div>
    </article>`;
}

function renderCatalog() {
  const list = filtered();
  $("#productGrid").innerHTML = list.map(productCard).join("");
  $("#emptyMsg").hidden = list.length > 0;

  let title = "Хіти продажу";
  if (state.wishOnly) title = "Обране";
  else if (state.query.trim()) title = `Пошук: «${state.query.trim()}»`;
  else if (state.cats.size === 1) title = catById([...state.cats][0]).name;
  $("#catalogTitle").textContent = title;
  $("#crumbCurrent").textContent = title;
  $("#catalogCount").textContent = itemsWord(list.length);
  $("#foundCount").textContent = itemsWord(list.length);

  // Активні фільтри
  const chips = [];
  if (state.wishOnly) chips.push(["wish", "", "Тільки обране"]);
  if (state.query.trim()) chips.push(["query", "", `Пошук: ${state.query.trim()}`]);
  state.cats.forEach((c) => chips.push(["cat", c, catById(c).name]));
  const flagNames = { sale: "Зі знижкою", hit: "Хіти продажу", new: "Новинки", cheap: "До ₴100" };
  state.flags.forEach((f) => chips.push(["flag", f, flagNames[f]]));
  if (state.min > PRICE_MIN || state.max < PRICE_MAX) chips.push(["price", "", `Ціна: ${state.min}–${state.max} ₴`]);

  $("#activeFilters").innerHTML = chips.map(([type, val, label]) =>
    `<button class="active-chip" data-remove="${type}" data-val="${val}">${label}<svg><use href="#i-close"/></svg></button>`).join("");
  $("#clearFilters").hidden = chips.length === 0;
  $("#filterCount").textContent = chips.length;
  $("#filterCount").hidden = chips.length === 0;

  // Чекбокси
  $$("[data-cat]").forEach((el) => (el.checked = state.cats.has(el.dataset.cat)));
  $$("[data-flag]").forEach((el) => (el.checked = state.flags.has(el.dataset.flag)));
  $$(".quick-chip").forEach((el) => el.classList.toggle("on", state.flags.has(el.dataset.quick)));
  $$("[data-range]").forEach((el) => {
    const r = priceRanges[el.dataset.range];
    el.classList.toggle("on", state.min === Math.max(PRICE_MIN, r.min) && state.max === Math.min(PRICE_MAX, r.max));
  });
  $("#showResults").textContent = list.length ? `ПОКАЗАТИ ${itemsWord(list.length).toUpperCase()}` : "НІЧОГО НЕ ЗНАЙДЕНО";
  syncPriceUI();
}

function renderQuickChips() {
  const quick = [["sale", "Зі знижкою"], ["cheap", "До ₴100"], ["new", "Новинки"], ["hit", "Хіти"]];
  $("#quickChips").innerHTML = quick.map(([id, label]) =>
    `<button class="quick-chip" data-quick="${id}">${label}</button>`).join("");
}

function renderPriceChips() {
  $("#priceChips").innerHTML = priceRanges.map((r, i) =>
    `<button class="range-chip" data-range="${i}">${r.label}</button>`).join("");
}

function renderSort() {
  $$("[data-sort]").forEach((sel) => {
    sel.innerHTML = sortOptions.map((o) => `<option value="${o.id}">${o.name}</option>`).join("");
    sel.value = state.sort;
  });
}

// ================= Ціна =================
function syncPriceUI() {
  const rMin = $("#rangeMin"), rMax = $("#rangeMax");
  [rMin, rMax].forEach((r) => { r.min = PRICE_MIN; r.max = PRICE_MAX; r.step = 1; });
  rMin.value = state.min; rMax.value = state.max;
  $("#priceMin").value = state.min; $("#priceMax").value = state.max;
  paintRange();
}

function paintRange() {
  const lo = Number($("#rangeMin").value), hi = Number($("#rangeMax").value);
  const span = PRICE_MAX - PRICE_MIN;
  $("#rangeFill").style.left = ((lo - PRICE_MIN) / span) * 100 + "%";
  $("#rangeFill").style.right = (100 - ((hi - PRICE_MIN) / span) * 100) + "%";
}

$("#rangeMin").addEventListener("input", (e) => {
  const v = Math.min(Number(e.target.value), Number($("#rangeMax").value) - 1);
  e.target.value = v; $("#priceMin").value = v; paintRange();
});
$("#rangeMax").addEventListener("input", (e) => {
  const v = Math.max(Number(e.target.value), Number($("#rangeMin").value) + 1);
  e.target.value = v; $("#priceMax").value = v; paintRange();
});
["#priceMin", "#priceMax"].forEach((s) => $(s).addEventListener("input", () => {
  $("#rangeMin").value = $("#priceMin").value || PRICE_MIN;
  $("#rangeMax").value = $("#priceMax").value || PRICE_MAX;
  paintRange();
}));

$("#applyPrice").addEventListener("click", () => {
  let lo = Number($("#priceMin").value) || PRICE_MIN;
  let hi = Number($("#priceMax").value) || PRICE_MAX;
  if (lo > hi) [lo, hi] = [hi, lo];
  state.min = Math.max(PRICE_MIN, lo);
  state.max = Math.min(PRICE_MAX, hi);
  renderCatalog();
});

// ================= Фільтри =================
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.cat) { t.checked ? state.cats.add(t.dataset.cat) : state.cats.delete(t.dataset.cat); renderCatalog(); }
  if (t.dataset.flag) { t.checked ? state.flags.add(t.dataset.flag) : state.flags.delete(t.dataset.flag); renderCatalog(); }
  if (t.matches("[data-sort]")) { state.sort = t.value; $$("[data-sort]").forEach((s) => (s.value = state.sort)); renderCatalog(); }
});

function resetFilters() {
  state.query = ""; $("#searchInput").value = "";
  state.cats.clear(); state.flags.clear();
  state.min = PRICE_MIN; state.max = PRICE_MAX;
  state.wishOnly = false;
}
$("#clearFilters").addEventListener("click", () => { resetFilters(); renderCatalog(); });

function goToCategory(id) {
  resetFilters();
  state.cats.add(id);
  closeAll();
  renderCatalog();
  $("#catalog").scrollIntoView({ behavior: "smooth" });
}

function openFilters() { $("#filtersPanel").classList.add("open"); showOverlay(); }
$("#openFilters").addEventListener("click", openFilters);
$("#closeFilters").addEventListener("click", closeAll);
$("#showResults").addEventListener("click", () => { closeAll(); $("#catalog").scrollIntoView({ behavior: "smooth" }); });

// ================= Пошук і меню каталогу =================
$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  state.query = $("#searchInput").value;
  state.wishOnly = false;
  renderCatalog();
  $("#catalog").scrollIntoView({ behavior: "smooth" });
});
$("#searchInput").addEventListener("input", (e) => { state.query = e.target.value; renderCatalog(); });

function toggleCatalog(force) {
  const menu = $("#catalogMenu");
  const open = force ?? menu.hidden;
  menu.hidden = !open;
  $("#catalogBtn").setAttribute("aria-expanded", String(open));
}
$("#catalogBtn").addEventListener("click", () => toggleCatalog());
$("#burgerBtn").addEventListener("click", () => toggleCatalog());
$("#catalogPill").addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); toggleCatalog(true); });


// ================= Обране =================
function toggleWish(id) {
  id = Number(id);
  wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
  save("ogogo-wish", [...wishlist]);
  renderCounts();
  renderCatalog();
  toast(wishlist.has(id) ? "Додано в обране ♥" : "Прибрано з обраного");
}

function showWishlist() {
  resetFilters();
  state.wishOnly = true;
  closeAll();
  renderCatalog();
  $("#catalog").scrollIntoView({ behavior: "smooth" });
  if (!wishlist.size) toast("В обраному поки порожньо — натисніть ♥ на товарі");
}

// ================= Кошик =================
function cartEntries() { return Object.entries(cart).map(([id, qty]) => [byId(id), qty]).filter(([p]) => p); }
function cartCount() { return cartEntries().reduce((s, [, q]) => s + q, 0); }
function cartTotal() { return cartEntries().reduce((s, [p, q]) => s + p.price * q, 0); }

function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  save("ogogo-cart", cart);
  renderCounts();
  renderCart();
  renderPreCart();
  renderCatalog();
}

function stepper(p, qty) {
  return `
    <div class="stepper">
      <button data-dec="${p.id}" aria-label="Менше">−</button>
      <span>${qty}</span>
      <button data-inc="${p.id}" aria-label="Більше">+</button>
    </div>`;
}

function renderCounts() {
  const n = cartCount();
  $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  $$("[data-wish-count]").forEach((el) => { el.textContent = wishlist.size; el.hidden = wishlist.size === 0; });
  $("#headerTotal").textContent = money(cartTotal());
  $("#bonusTotal").textContent = money(cartEntries().reduce((s, [p, q]) => s + bonus(p) * q, 0));
}

function renderCart() {
  const entries = cartEntries();
  $("#cartList").innerHTML = entries.map(([p, qty]) => `
    <li class="cart-item">
      <img src="${imgSrc(p)}" alt="">
      <div class="cart-info">
        <p>${p.name}</p>
        <span class="pickup">Є в наявності · забрати сьогодні</span>
      </div>
      <div class="cart-row">
        ${stepper(p, qty)}
        <div class="cart-price">${p.old ? `<s>${money(p.old * qty)}</s>` : ""}<b>${money(p.price * qty)}</b></div>
        <button class="icon-btn remove" data-remove-item="${p.id}" aria-label="Видалити"><svg><use href="#i-trash"/></svg></button>
      </div>
    </li>`).join("");
  $("#cartItemsCount").textContent = itemsWord(cartCount());
  const goods = entries.reduce((s, [p, q]) => s + (p.old || p.price) * q, 0);
  const total = cartTotal();
  const saved = goods - total;
  const delivery = total >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const left = FREE_DELIVERY_FROM - total;
  $("#freeDelivery").innerHTML = left > 0
    ? `<p><svg><use href="#i-truck"/></svg>Додайте ще <b>${money(left)}</b> — і доставка буде безкоштовною</p>
       <div class="progress"><span style="width:${Math.min(100, (total / FREE_DELIVERY_FROM) * 100)}%"></span></div>`
    : `<p class="done"><svg><use href="#i-truck"/></svg>Доставка безкоштовна 🎉</p>`;
  $("#cartSummary").innerHTML = `
    <div><span>Товари (${cartCount()})</span><span>${money(goods)}</span></div>
    ${saved ? `<div class="sum-save"><span>Знижка</span><span>−${money(saved)}</span></div>` : ""}
    <div><span>Доставка</span><span>${delivery ? money(delivery) : `<b class="free">Безкоштовно</b>`}</span></div>`;
  $("#cartBonus").innerHTML = `Ви отримаєте <b>+${money(entries.reduce((s, [p, q]) => s + bonus(p) * q, 0))}</b> бонусів`;
  $("#cartTotal").textContent = money(total + delivery);
  $("#cartEmpty").hidden = entries.length > 0;
  $("#freeDelivery").hidden = entries.length === 0;
  $("#cartPay").hidden = entries.length === 0;
}

let lastAdded = null;
function renderPreCart() {
  const p = lastAdded && byId(lastAdded);
  if (!p) return;
  const qty = cart[p.id] || 0;
  $("#preCartItem").innerHTML = `
    <div class="pre-item">
      <img src="${imgSrc(p)}" alt="">
      <div>
        <p>${p.name}</p>
        <div class="pre-row">${qty ? stepper(p, qty) : `<span class="muted">Прибрано з кошика</span>`}<b>${money(p.price * Math.max(qty, 1))}</b></div>
      </div>
    </div>`;
  const extras = products.filter((x) => x.id !== p.id && !cart[x.id])
    .sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat) || a.price - b.price).slice(0, 4);
  $("#preCartExtras").innerHTML = extras.map((x) => `
    <article class="extra">
      <img src="${imgSrc(x)}" alt="" loading="lazy">
      <p>${x.name}</p>
      <div class="extra-row"><b>${money(x.price)}</b><button class="add-btn" data-add-extra="${x.id}"><svg><use href="#i-cart"/></svg>ДОДАТИ</button></div>
    </article>`).join("");
}

function addToCart(id, openSheet = true) {
  setQty(id, (cart[id] || 0) + 1);
  if (openSheet) {
    lastAdded = Number(id);
    renderPreCart();
    closeAll();
    $("#preCart").classList.add("open");
    $("#preCart").setAttribute("aria-hidden", "false");
    showOverlay();
  } else {
    toast("Додано в кошик ✓");
  }
}

function openCart() {
  closeAll();
  renderCart();
  $("#cartPanel").classList.add("open");
  $("#cartPanel").setAttribute("aria-hidden", "false");
  showOverlay();
}

$("#checkoutBtn").addEventListener("click", () => {
  cart = {};
  save("ogogo-cart", cart);
  renderCounts();
  renderCart();
  closeAll();
  toast("Дякуємо! Це демо — замовлення не надсилається 🙂");
});

// ================= Шари =================
// ================= Вибір магазину =================
const stores = [
  { id: 1, city: "Київ",   place: "ТРЦ «Сонячний»", street: "вул. Прикладна, 1",  hours: "8:00–22:00" },
  { id: 2, city: "Київ",   place: "",               street: "вул. Зелена, 25",    hours: "8:00–22:00" },
  { id: 3, city: "Київ",   place: "ТЦ «Каштан»",    street: "просп. Світлий, 40", hours: "9:00–21:00" },
  { id: 4, city: "Львів",  place: "ТЦ «Площа»",     street: "вул. Квіткова, 7",   hours: "9:00–21:00" },
  { id: 5, city: "Одеса",  place: "",               street: "вул. Морська, 3",    hours: "8:00–22:00" },
  { id: 6, city: "Харків", place: "ТРЦ «Простір»",  street: "вул. Річкова, 12",   hours: "9:00–21:00" },
  { id: 7, city: "Дніпро", place: "",               street: "вул. Липова, 18",    hours: "8:00–22:00" },
];
let storeId = load("ogogo-store", 1);
let storeCity = "Усі";
const storeAddr = (st) => [st.place, st.street].filter(Boolean).join(", ");

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

function showOverlay() { $("#overlay").hidden = false; document.body.classList.add("locked"); }
function closeAll() {
  ["#preCart", "#cartPanel", "#storeModal"].forEach((s) => { $(s).classList.remove("open"); $(s).setAttribute("aria-hidden", "true"); });
  $("#filtersPanel").classList.remove("open");
  $("#overlay").hidden = true;
  document.body.classList.remove("locked");
  toggleCatalog(false);
  setTab("home");
}
$("#overlay").addEventListener("click", closeAll);

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

// ================= Таб-бар =================
function setTab(name) { $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name)); }

$$(".tab").forEach((tab) => tab.addEventListener("click", () => {
  const name = tab.dataset.tab;
  if (name === "home") { closeAll(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (name === "catalog") { closeAll(); toggleCatalog(true); window.scrollTo({ top: 0, behavior: "smooth" }); setTab("catalog"); return; }
  if (name === "cart") { openCart(); setTab("cart"); return; }
  if (name === "wishlist") { showWishlist(); setTab("wishlist"); return; }
  if (name === "menu") { closeAll(); $("#footer").scrollIntoView({ behavior: "smooth" }); setTab("menu"); }
}));

// ================= Кліки =================
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-quick-add],[data-range],[data-add],[data-add-extra],[data-inc],[data-dec],[data-wish],[data-cat-go],[data-quick],[data-remove],[data-remove-item],[data-open-cart],[data-show-wishlist],[data-open-stores],[data-close]");
  if (!t) {
    if (!e.target.closest("#catalogMenu, #catalogBtn, #burgerBtn, #catalogPill, .tab-bar")) toggleCatalog(false);
    return;
  }
  const d = t.dataset;
  if (d.quickAdd) addToCart(d.quickAdd, false);
  else if (d.range !== undefined) {
    const r = priceRanges[d.range];
    const isOn = t.classList.contains("on");
    state.min = isOn ? PRICE_MIN : Math.max(PRICE_MIN, r.min);
    state.max = isOn ? PRICE_MAX : Math.min(PRICE_MAX, r.max);
    renderCatalog();
  }
  else if (d.add) addToCart(d.add);
  else if (d.addExtra) { addToCart(d.addExtra, false); renderPreCart(); }
  else if (d.inc) setQty(d.inc, (cart[d.inc] || 0) + 1);
  else if (d.dec) setQty(d.dec, (cart[d.dec] || 0) - 1);
  else if (d.removeItem) setQty(d.removeItem, 0);
  else if (d.wish) toggleWish(d.wish);
  else if (d.catGo) goToCategory(d.catGo);
  else if (d.quick) {
    e.preventDefault();
    if (t.classList.contains("sale-chip")) { resetFilters(); state.flags.add("sale"); }
    else state.flags.has(d.quick) ? state.flags.delete(d.quick) : state.flags.add(d.quick);
    renderCatalog();
    if (t.classList.contains("sale-chip")) $("#catalog").scrollIntoView({ behavior: "smooth" });
  }
  else if (d.remove) {
    const { remove: type, val } = d;
    if (type === "cat") state.cats.delete(val);
    if (type === "flag") state.flags.delete(val);
    if (type === "price") { state.min = PRICE_MIN; state.max = PRICE_MAX; }
    if (type === "query") { state.query = ""; $("#searchInput").value = ""; }
    if (type === "wish") state.wishOnly = false;
    renderCatalog();
  }
  else if ("openCart" in d) openCart();
  else if ("showWishlist" in d) showWishlist();
  else if ("openStores" in d) openStores();
  else if ("close" in d) closeAll();
});

document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

// ================= Старт =================
renderCategories();
renderDeals();
renderPriceChips();
renderSort();
renderCatalog();
renderCounts();
renderCart();
renderStoreLabels();

$("#resetInSheet").addEventListener("click", () => { resetFilters(); renderCatalog(); });
