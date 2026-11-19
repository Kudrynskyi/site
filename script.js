// ---------- Дані ----------
const categories = [
  { id: "home",     name: "Дім і текстиль",     icon: "🛋️", color: "#FFE3D3" },
  { id: "kitchen",  name: "Кухня й посуд",      icon: "🍳", color: "#FFF1C7" },
  { id: "clean",    name: "Побутова хімія",     icon: "🧽", color: "#D9F2E6" },
  { id: "beauty",   name: "Краса й гігієна",    icon: "🧴", color: "#F6DDF0" },
  { id: "kids",     name: "Дитячі товари",      icon: "🧸", color: "#DCE8FF" },
  { id: "office",   name: "Канцтовари",         icon: "✏️", color: "#E9E1FF" },
  { id: "garden",   name: "Дача й сад",         icon: "🌱", color: "#E3F5CF" },
  { id: "pets",     name: "Для тварин",         icon: "🐾", color: "#FBE6CF" },
  { id: "tools",    name: "Інструменти",        icon: "🔧", color: "#E4E9EE" },
  { id: "season",   name: "Сезонні товари",     icon: "🎄", color: "#D6F0F2" },
  { id: "food",     name: "Продукти",           icon: "🍪", color: "#FCE1D9" },
  { id: "auto",     name: "Авто",               icon: "🚗", color: "#E0E6F8" },
];

const products = [
  { id: 1,  name: "Сковорода антипригарна 24 см", cat: "kitchen", icon: "🍳", price: 289, old: 399, badge: "Хіт" },
  { id: 2,  name: "Набір рушників, 3 шт.",        cat: "home",    icon: "🧺", price: 199, old: 259 },
  { id: 3,  name: "Засіб для миття посуду 1 л",   cat: "clean",   icon: "🧴", price: 49,  old: 65,  badge: "−25%" },
  { id: 4,  name: "Конструктор «Місто», 120 дет.",cat: "kids",    icon: "🧱", price: 349, old: null, badge: "Новинка" },
  { id: 5,  name: "Плед флісовий 150×200",        cat: "home",    icon: "🛏️", price: 259, old: 349 },
  { id: 6,  name: "Зошит А5, 48 арк.",            cat: "office",  icon: "📒", price: 15,  old: 19 },
  { id: 7,  name: "Шампунь для всієї родини",     cat: "beauty",  icon: "🧼", price: 79,  old: 99 },
  { id: 8,  name: "Гірлянда LED, 10 м",           cat: "season",  icon: "✨", price: 149, old: 219, badge: "Хіт" },
  { id: 9,  name: "Набір контейнерів, 5 шт.",     cat: "kitchen", icon: "🥡", price: 129, old: null },
  { id: 10, name: "Іграшка м'яка «Ведмедик»",     cat: "kids",    icon: "🧸", price: 189, old: 239 },
  { id: 11, name: "Губки кухонні, 10 шт.",        cat: "clean",   icon: "🧽", price: 35,  old: 45 },
  { id: 12, name: "Рюкзак шкільний",              cat: "office",  icon: "🎒", price: 449, old: 599, badge: "−25%" },
  { id: 13, name: "Насіння томатів «Черрі»",      cat: "garden",  icon: "🍅", price: 19,  old: null },
  { id: 14, name: "Миска для котів",              cat: "pets",    icon: "🐱", price: 59,  old: 79 },
  { id: 15, name: "Набір викруток, 6 шт.",        cat: "tools",   icon: "🪛", price: 169, old: 219 },
  { id: 16, name: "Ялинкові іграшки, 12 шт.",     cat: "season",  icon: "🎄", price: 119, old: 159, badge: "Новинка" },
];

// ---------- Допоміжне ----------
const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString("uk-UA") + " ₴";
const catById = (id) => categories.find((c) => c.id === id);

let cart = {};
try { cart = JSON.parse(localStorage.getItem("ogogo-cart")) || {}; } catch (e) { cart = {}; }
const saveCart = () => { try { localStorage.setItem("ogogo-cart", JSON.stringify(cart)); } catch (e) {} };

// ---------- Категорії ----------
function renderCategories() {
  $("#categoryGrid").innerHTML = categories.map((c) => `
    <button class="category" data-cat="${c.id}" style="--bg:${c.color}">
      <span class="category-icon">${c.icon}</span>
      <span>${c.name}</span>
    </button>`).join("");

  $("#catalogMenuGrid").innerHTML = categories.map((c) => `
    <button class="catalog-item" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join("");
}

// ---------- Товари ----------
let currentCat = null;
let currentQuery = "";

function renderProducts() {
  const q = currentQuery.trim().toLowerCase();
  const list = products.filter((p) =>
    (!currentCat || p.cat === currentCat) &&
    (!q || p.name.toLowerCase().includes(q))
  );

  $("#productGrid").innerHTML = list.map((p) => {
    const c = catById(p.cat);
    return `
    <article class="product">
      ${p.badge ? `<span class="badge ${p.badge.startsWith("−") ? "badge-sale" : p.badge === "Новинка" ? "badge-new" : ""}">${p.badge}</span>` : ""}
      <div class="product-img" style="--bg:${c.color}">${p.icon}</div>
      <small class="product-cat">${c.name}</small>
      <h3>${p.name}</h3>
      <div class="price-row">
        <span class="price ${p.old ? "price-sale" : ""}">${money(p.price)}</span>
        ${p.old ? `<s class="old">${money(p.old)}</s>` : ""}
      </div>
      <button class="btn btn-primary btn-block" data-add="${p.id}">У кошик</button>
    </article>`;
  }).join("");

  $("#emptyMsg").hidden = list.length > 0;

  let title = "Хіти продажу";
  if (currentCat) title = catById(currentCat).name;
  if (q) title = `Пошук: «${currentQuery.trim()}»`;
  $("#productsTitle").textContent = title;
  $("#resetFilter").hidden = !currentCat && !q;
}

function filterByCategory(id) {
  currentCat = id;
  currentQuery = "";
  $("#searchInput").value = "";
  closeCatalog();
  renderProducts();
  $("#hits").scrollIntoView({ behavior: "smooth" });
}

// ---------- Каталог ----------
function closeCatalog() {
  $("#catalogMenu").hidden = true;
  $("#catalogBtn").setAttribute("aria-expanded", "false");
}

$("#catalogBtn").addEventListener("click", () => {
  const open = $("#catalogMenu").hidden;
  $("#catalogMenu").hidden = !open;
  $("#catalogBtn").setAttribute("aria-expanded", String(open));
});

// ---------- Пошук ----------
$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  currentQuery = $("#searchInput").value;
  currentCat = null;
  renderProducts();
  $("#hits").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", (e) => {
  currentQuery = e.target.value;
  renderProducts();
});

$("#resetFilter").addEventListener("click", () => {
  currentCat = null;
  currentQuery = "";
  $("#searchInput").value = "";
  renderProducts();
});

// ---------- Кошик ----------
function renderCart() {
  const ids = Object.keys(cart);
  let count = 0, total = 0;

  $("#cartItems").innerHTML = ids.map((id) => {
    const p = products.find((x) => x.id === Number(id));
    const qty = cart[id];
    count += qty;
    total += p.price * qty;
    return `
      <li class="cart-item">
        <span class="cart-item-icon">${p.icon}</span>
        <div class="cart-item-info">
          <b>${p.name}</b>
          <small>${money(p.price)}</small>
        </div>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Менше">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Більше">+</button>
        </div>
      </li>`;
  }).join("");

  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartEmpty").hidden = ids.length > 0;
  $("#checkoutBtn").disabled = ids.length === 0;
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function openCart() {
  $("#cartPanel").classList.add("open");
  $("#cartPanel").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
}

function closeCart() {
  $("#cartPanel").classList.remove("open");
  $("#cartPanel").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#checkoutBtn").addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
  closeCart();
  toast("Дякуємо! Це демо — замовлення не надсилається 🙂");
});

// ---------- Один обробник кліків ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-cat],[data-filter-cat]");
  if (!t) {
    if (!e.target.closest("#catalogMenu, #catalogBtn")) closeCatalog();
    return;
  }
  if (t.dataset.add) {
    changeQty(t.dataset.add, 1);
    toast("Додано в кошик ✓");
  }
  if (t.dataset.inc) changeQty(t.dataset.inc, 1);
  if (t.dataset.dec) changeQty(t.dataset.dec, -1);
  if (t.dataset.cat) filterByCategory(t.dataset.cat);
  if (t.dataset.filterCat) filterByCategory(t.dataset.filterCat);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeCart(); closeCatalog(); }
});

// ---------- Старт ----------
renderCategories();
renderProducts();
renderCart();
