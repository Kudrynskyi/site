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
const imgSrc = (p) => `images/${p.img}.webp`;
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

// ================= Магазини =================
const stores = [
  { id: 1, city: "Київ",   place: "ТРЦ «Сонячний»", street: "вул. Прикладна, 1",  hours: "8:00–22:00" },
  { id: 2, city: "Київ",   place: "",               street: "вул. Зелена, 25",    hours: "8:00–22:00" },
  { id: 3, city: "Київ",   place: "ТЦ «Каштан»",    street: "просп. Світлий, 40", hours: "9:00–21:00" },
  { id: 4, city: "Львів",  place: "ТЦ «Площа»",     street: "вул. Квіткова, 7",   hours: "9:00–21:00" },
  { id: 5, city: "Одеса",  place: "",               street: "вул. Морська, 3",    hours: "8:00–22:00" },
  { id: 6, city: "Харків", place: "ТРЦ «Простір»",  street: "вул. Річкова, 12",   hours: "9:00–21:00" },
  { id: 7, city: "Дніпро", place: "",               street: "вул. Липова, 18",    hours: "8:00–22:00" },
];
const storeAddr = (st) => [st.place, st.street].filter(Boolean).join(", ");

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


// ================= Деталі товарів =================
const details = {
  1:  { code: "100231", desc: "Легка алюмінієва сковорода з трикомпонентним антипригарним покриттям. Рівномірно прогрівається, не потребує багато олії й легко миється.", specs: { "Діаметр": "24 см", "Матеріал": "алюміній", "Покриття": "антипригарне, 3 шари", "Підходить для": "газ, електро, склокераміка", "Можна мити в посудомийці": "так" } },
  2:  { code: "100458", desc: "Набір із трьох махрових рушників: коралового, білого й сірого. Щільна бавовна добре вбирає вологу й лишається м'якою після прання.", specs: { "Кількість": "3 шт.", "Розмір": "50×90 см", "Склад": "100% бавовна", "Щільність": "450 г/м²", "Прання": "до 40 °C" } },
  3:  { code: "100902", desc: "Концентрований засіб для миття посуду з ароматом лайма. Швидко розчиняє жир навіть у холодній воді й дбайливо ставиться до шкіри рук.", specs: { "Об'єм": "1 л", "Аромат": "лайм", "Тип": "концентрат", "pH": "нейтральний" } },
  4:  { code: "101115", desc: "Конструктор для маленьких архітекторів: будиночки, дерево й автомобіль. Деталі сумісні з популярними наборами цеглинок.", specs: { "Кількість деталей": "120", "Вік": "від 4 років", "Матеріал": "ABS-пластик", "Розмір коробки": "28×19×6 см" } },
  5:  { code: "100467", desc: "Пухнастий флісовий плед ніжного лавандового кольору. Тримає тепло, не линяє й не скочується після прання.", specs: { "Розмір": "150×200 см", "Матеріал": "фліс", "Колір": "лавандовий", "Щільність": "220 г/м²", "Прання": "до 30 °C" } },
  6:  { code: "101870", desc: "Зошит формату А5 у клітинку з яскравою обкладинкою. Щільний папір, на якому не просвічує ручка.", specs: { "Формат": "А5", "Аркушів": "48", "Лініювання": "клітинка", "Щільність паперу": "60 г/м²" } },
  7:  { code: "100951", desc: "М'який шампунь для всієї родини з дозатором. Підходить для щоденного миття, не пересушує шкіру голови.", specs: { "Об'єм": "750 мл", "Тип волосся": "усі типи", "Дозатор": "так", "Без": "силіконів" } },
  8:  { code: "102340", desc: "Гірлянда на мідному дроті з теплим світлом. Тонкий дріт легко обвивається навколо ялинки, дзеркала чи полиці.", specs: { "Довжина": "10 м", "Кількість LED": "100", "Колір світла": "теплий білий", "Живлення": "USB", "Режимів": "8" } },
  9:  { code: "100244", desc: "П'ять контейнерів різного розміру з кольоровими кришками. Складаються один в одний і не займають місця в шафі.", specs: { "Кількість": "5 шт.", "Об'єм": "від 0,3 до 2,5 л", "Матеріал": "поліпропілен", "Мікрохвильовка": "так, без кришки" } },
  10: { code: "101126", desc: "М'який ведмедик із бантиком, який захоче обійняти кожен. Гіпоалергенний наповнювач, міцні шви.", specs: { "Висота": "35 см", "Вік": "від 0 років", "Наповнювач": "холофайбер", "Прання": "ручне" } },
  11: { code: "100915", desc: "Кухонні губки з абразивним шаром для складних забруднень і м'якою стороною для делікатного посуду.", specs: { "Кількість": "10 шт.", "Розмір": "9×6×3 см", "Матеріал": "поролон, абразив" } },
  12: { code: "101882", desc: "Легкий шкільний рюкзак з ортопедичною спинкою, двома відділеннями й бічними кишенями для пляшки.", specs: { "Об'єм": "18 л", "Вік": "7–12 років", "Матеріал": "поліестер", "Колір": "помаранчевий", "Вага": "0,6 кг" } },
  13: { code: "102511", desc: "Насіння солодких томатів черрі для городу й балкона. Невибаглива рання культура з високим урожаєм.", specs: { "Вага": "0,1 г", "Тип": "індетермінантний", "Дозрівання": "90–100 днів", "Вирощування": "відкритий ґрунт, балкон" } },
  14: { code: "102733", desc: "Стійка керамічна миска для котів, що не ковзає підлогою. Підходить для сухого й вологого корму.", specs: { "Об'єм": "300 мл", "Матеріал": "кераміка", "Колір": "м'ятний", "Посудомийка": "так" } },
  15: { code: "102915", desc: "Набір викруток з магнітними наконечниками й зручними прогумованими ручками для дому й дачі.", specs: { "Кількість": "6 шт.", "Типи шліців": "PH, SL", "Матеріал": "хром-ванадієва сталь", "Магнітні": "так" } },
  16: { code: "102352", desc: "Набір скляних ялинкових кульок у червоно-золотих тонах. Кожна кулька в окремій комірці подарункової коробки.", specs: { "Кількість": "12 шт.", "Діаметр": "6 см", "Матеріал": "скло", "Кольори": "червоний, золотий, білий" } },
};
const productUrl = (p) => `product.html?id=${p.id}`;

// FOMO: залишок у магазині та популярність (демо, стабільні для товару)
const stockLeft = (p) => ((p.id * 37 + 11) % 23) + 2;          // 2…24
const isLowStock = (p) => stockLeft(p) <= 7;
const boughtWeek = (p) => 18 + ((p.id * 53) % 140) + Math.round((p.reviews || 0) / 2);
const FLAME = `<svg class="fomo-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 3-1.6 4.6-2.9 6.4C7.8 10.7 7 12.3 7 14.3A5 5 0 0 0 17 14.4c0-2-.9-3.6-2-4.8.1 1.4-.4 2.6-1.4 3.2.3-3.6-.8-7.4-1.6-10.3Z" fill="currentColor"/></svg>`;
const fomoLine = (p) => isLowStock(p) ? `<p class="card-fomo">${FLAME}Залишилось ${stockLeft(p)} шт.</p>` : "";

// Клік по рейтингу в картці → відгуки товару
document.addEventListener("click", (e) => {
  const r = e.target.closest(".card .rating");
  if (!r) return;
  const a = r.closest(".card").querySelector('a[href*="product.html"]');
  if (a) { e.preventDefault(); location.href = a.getAttribute("href").split("#")[0] + "#reviews"; }
});

// ================= Акції =================
const promos = [
  {
    id: "warm", title: "Тепліше разом", tag: "до −40%", dates: "1 – 21 грудня", ends: "2026-12-21",
    lead: "Пледи, рушники й текстиль для затишку вдома за найнижчими цінами сезону.",
    terms: ["Знижка до −40% на товари категорії «Дім і текстиль»", "Безкоштовна доставка замовлень від ₴500", "Бонуси нараховуються на всі акційні товари"],
    imgs: ["pled", "rushnyky"], cats: ["home"], cta: "Обрати текстиль",
  },
  {
    id: "crazy", title: "Шалені знижки", tag: "до −32%", dates: "до 31 грудня", ends: "2026-12-31",
    lead: "Найбільші знижки тижня в усіх категоріях: гірлянди, посуд, іграшки та інше.",
    terms: ["Тільки товари зі знижкою, відсортовані від найбільшої", "Кількість товару обмежена", "Ціни дійсні в інтернет-магазині й у магазинах мережі"],
    imgs: ["girlyanda", "yalynkovi-igrashky"], sale: true, cta: "Дивитися знижки",
  },
  {
    id: "card", title: "Картка Огого!", tag: "+5% бонусами", dates: "постійна програма", ends: null,
    lead: "Отримуйте 5% від кожної покупки бонусами й оплачуйте ними до 100% наступних замовлень.",
    terms: ["+5% бонусами з кожної покупки", "1 бонус = ₴1 знижки на наступні замовлення", "Особливі ціни для власників картки", "Картка безкоштовна, оформлення за 1 хвилину"],
    imgs: [], hits: true, cta: "Отримати картку",
  },
  {
    id: "school", title: "До школи", tag: "від ₴15", dates: "до 31 грудня", ends: "2026-12-31",
    lead: "Усе для навчання: зошити, рюкзаки й канцелярія за шкільними цінами.",
    terms: ["Зошити від ₴15", "Рюкзаки −25%", "Бонус +5% на картку Огого"],
    imgs: ["ryukzak", "zoshyt"], cats: ["office", "kids"], cta: "До канцтоварів",
  },
];
const promoById = (id) => promos.find((x) => x.id === id);
const promoUrl = (p) => `promo.html?id=${p.id}`;
const promoProducts = (pr) => {
  let list = products.slice();
  if (pr.cats) list = list.filter((p) => pr.cats.includes(p.cat));
  if (pr.sale) list = list.filter((p) => p.old).sort((a, b) => discount(b) - discount(a));
  if (pr.hits) list = list.sort((a, b) => (b.hit ? 1 : 0) - (a.hit ? 1 : 0) || b.rating - a.rating).slice(0, 8);
  return list;
};

// ================= Промо-наліпки на картках =================
// Зубчаста «−N%», шестикутник «Вигода ₴X» / «Новинка», кругла «Хіт».
function promoBadges(p, max = 2) {
  const out = [];
  if (p.old) out.push(`<span class="stk stk-burst"><b>−${discount(p)}%</b></span>`);
  if (p.old && p.old - p.price >= 40) out.push(`<span class="stk stk-hex"><small>ВИГОДА</small><b>${money(p.old - p.price)}</b></span>`);
  else if (p.isNew) out.push(`<span class="stk stk-hex stk-new"><small>НОВИНКА</small><b>2026</b></span>`);
  if (p.hit) out.push(`<span class="stk stk-ring"><b>ХІТ</b></span>`);
  return out.slice(0, max).join("");
}
