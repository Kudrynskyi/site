// ================= Мова сайту: УКР / ENG =================
// Вибір зберігається в localStorage ("ogogo-lang"). Для англійської
// перекладаються всі тексти сторінки, зокрема ті, що домальовує JS.

const LANG = (() => { try { return localStorage.getItem("ogogo-lang") === "en" ? "en" : "uk"; } catch (e) { return "uk"; } })();

function setLang(lang) {
  try { localStorage.setItem("ogogo-lang", lang); } catch (e) {}
  location.reload();
}

const EN = {
  // --- Загальне й шапка ---
  "Огого! — мультимаркет низьких цін": "Ogogo! — the low-price multimarket",
  "Огого! — товари для дому, кухні, дітей і свят за чесними цінами.": "Ogogo! — goods for home, kitchen, kids and holidays at fair prices.",
  "Огого! — на головну": "Ogogo! — home",
  "картка Огого": "Ogogo card", "СУПЕР": "SUPER", "ЗНИЖКА": "SALE",
  "КАТАЛОГ": "CATALOG", "Каталог": "Catalog", "Каталог ▾": "Catalog ▾",
  "Я шукаю…": "I'm looking for…", "Пошук товарів": "Search products", "Шукати": "Search",
  "Зателефонувати": "Call us", "AI-помічник": "AI assistant", "Змінити магазин": "Change store", "Увійти в профіль": "Sign in",
  "Увійти": "Sign in", "Обране": "Wishlist", "Ваші бонуси": "Your bonuses", "Разом": "Total",
  "Кошик": "Cart", "Усі акції": "All deals", "РОЗПРОДАЖ ДО −40%": "SALE UP TO −40%",
  "Магазини": "Stores", "Допомога": "Help", "ⓘ Допомога": "ⓘ Help", "Покупцям": "For customers",
  "Покупцям ▾": "For customers ▾", "Розділи": "Sections", "Навігація": "Navigation",
  "Головна": "Home", "Меню": "Menu", "Профіль": "Profile", "Закрити": "Close", "Назад": "Back",
  "Інтернет-магазин": "Online store", "Акції": "Deals",

  // --- Категорії ---
  "Дім і текстиль": "Home & textiles", "Кухня й посуд": "Kitchen & cookware", "Побутова хімія": "Household cleaning",
  "Краса й гігієна": "Beauty & hygiene", "Дитячі товари": "Kids", "Канцтовари": "Stationery",
  "Дача й сад": "Garden", "Для тварин": "Pets", "Інструменти": "Tools", "Сезонні товари": "Seasonal",

  // --- Банери ---
  "ТЕПЛІШЕ": "WARMER", "РАЗОМ": "TOGETHER", "ШАЛЕНІ": "CRAZY", "ЗНИЖКИ": "DEALS",
  "КАРТКА": "OGOGO!", "ОГОГО!": "CARD", "ДО": "BACK TO", "ШКОЛИ": "SCHOOL",
  "Пледи й рушники до −40%": "Blankets & towels up to −40%", "Обрати текстиль": "Shop textiles",
  "+5% бонусами з кожної покупки": "+5% back in bonuses on every order", "Ціни тільки для своїх": "Members-only prices",
  "Отримати картку": "Get the card", "Картка з'явиться згодом 🙂": "The card is coming soon 🙂",
  "Зошити від ₴15, рюкзаки −25%": "Notebooks from ₴15, backpacks −25%", "До канцтоварів": "Shop stationery",
  "Попередній банер": "Previous banner", "Наступний банер": "Next banner",
  "бонусна картка": "bonus card",

  // --- Головна ---
  "Рекомендовані категорії": "Recommended categories", "Гарячі пропозиції": "Hot deals",
  "ТОВАР": "DEAL OF", "ДНЯ": "THE DAY", "ГАРЯЧА": "HOT", "ЦІНА": "PRICE",
  "Хіти продажу": "Best sellers", "Обране ": "Wishlist",
  "Популярні": "Popular", "Від дешевих": "Price: low to high", "Від дорогих": "Price: high to low",
  "Найбільша знижка": "Biggest discount", "За рейтингом": "Top rated", "Сортування": "Sort",
  "Фільтри": "Filters", "Знайдено:": "Found:", "Скинути фільтри": "Clear filters", "Скинути": "Reset",
  "Ціна, ₴": "Price, ₴", "Від": "From", "До": "To", "До ₴50": "Under ₴50", "₴50–₴200": "₴50–₴200", "Від ₴200": "Over ₴200",
  "Мінімальна ціна": "Minimum price", "Максимальна ціна": "Maximum price", "ЗАСТОСУВАТИ": "APPLY",
  "Популярні фільтри": "Popular filters", "Зі знижкою": "On sale", "Новинки": "New arrivals",
  "До ₴100": "Under ₴100", "Хіти": "Best sellers", "Категорії": "Categories",
  "ПОКАЗАТИ ТОВАРИ": "SHOW PRODUCTS", "НІЧОГО НЕ ЗНАЙДЕНО": "NOTHING FOUND",
  "Нічого не знайшли 😕 Спробуйте змінити фільтри.": "Nothing found 😕 Try changing the filters.",
  "Тільки обране": "Wishlist only", "ХІТ": "HIT", "НОВИНКА": "NEW",
  "КУПИТИ": "BUY", "У КОШИКУ": "IN CART", "Залишити відгук": "Write a review",
  "Додати в обране": "Add to wishlist", "Прибрати з обраного": "Remove from wishlist",
  "Менше": "Less", "Більше": "More", "Кількість у кошику": "Quantity in cart",
  "В обраному поки порожньо — натисніть ♥ на товарі": "Your wishlist is empty — tap ♥ on a product",
  "Додано в обране ♥": "Added to wishlist ♥", "Прибрано з обраного": "Removed from wishlist",
  "Додано в кошик ✓": "Added to cart ✓", "Додано в кошик": "Added to cart",

  // --- Кошик ---
  "ОФОРМИТИ ЗАМОВЛЕННЯ": "CHECKOUT", "Оформити замовлення": "Checkout", "Вам також знадобиться": "You may also need",
  "ДОДАТИ": "ADD", "Кошик порожній": "Your cart is empty", "Перейти до покупок": "Continue shopping",
  "До сплати": "To pay", "Знижка": "Discount", "Доставка": "Delivery", "Безкоштовно": "Free",
  "Додайте ще": "Add", "— і доставка буде безкоштовною": "more for free delivery",
  "Доставка безкоштовна 🎉": "Free delivery 🎉", "Ви отримаєте": "You'll earn", "бонусів": "in bonuses",
  "Є в наявності · забрати сьогодні": "In stock · pick up today", "Прибрано з кошика": "Removed from cart",
  "Дякуємо! Це демо — замовлення не надсилається 🙂": "Thank you! This is a demo — no order is sent 🙂",

  // --- Магазини ---
  "Оберіть магазин": "Choose a store", "Місто, вулиця або ТРЦ": "City, street or mall",
  "Покажемо наявність і ціни у вибраному магазині. Забрати замовлення можна вже сьогодні.": "We'll show stock and prices at the selected store. You can pick up your order today.",
  "Магазинів не знайдено": "No stores found", "Усі": "All",
  "Київ": "Kyiv", "Львів": "Lviv", "Одеса": "Odesa", "Харків": "Kharkiv", "Дніпро": "Dnipro",

  // --- Сторінка товару ---
  "Товар — Огого!": "Product — Ogogo!", "Фото товару": "Product photo", "Є в наявності": "In stock",
  "Самовивіз сьогодні": "Pick up today", "Безкоштовно з вибраного магазину": "Free from your store",
  "Доставка 1–2 дні": "Delivery in 1–2 days", "₴59 · безкоштовно від ₴500": "₴59 · free over ₴500",
  "Повернення 14 днів": "14-day returns", "Без зайвих питань": "No questions asked",
  "Опис": "Description", "Характеристики": "Specifications", "Відгуки": "Reviews", "Схожі товари": "Similar products",
  "Відгуків ще немає. Будьте першим!": "No reviews yet. Be the first!", "Відгуки з'являться згодом 🙂": "Reviews are coming soon 🙂",
  "Товар не знайдено": "Product not found", "Товар не знайдено — Огого!": "Product not found — Ogogo!",
  "Можливо, посилання застаріло.": "The link may be out of date.", "На головну": "Go home",
  "Перейти в кошик": "Go to cart", "У кошик": "To cart", "Категорія": "Category", "Код товару": "Product code",

  // --- Футер ---
  "Мультимаркет товарів для дому та родини за чесними цінами. Понад 50 магазинів, щодня з 8:00 до 22:00.": "A multimarket of goods for home and family at fair prices. 50+ stores, open daily 8:00–22:00.",
  "Доставка й оплата": "Delivery & payment", "Повернення": "Returns", "Бонусна програма": "Bonus program",
  "Компанія": "Company", "Про нас": "About us", "Вакансії": "Careers", "Контакти": "Contacts",
  "Безкоштовно по Україні": "Free across Ukraine", "© 2026 Огого! · Навчальний концепт-проєкт": "© 2026 Ogogo! · Educational concept project",

  // --- Профіль ---
  "Профіль — Огого!": "Profile — Ogogo!", "Гість": "Guest",
  "Увійдіть, щоб бачити замовлення й бонуси": "Sign in to see your orders and bonuses",
  "Бонусна картка": "Bonus card", "на рахунку": "on balance", "Налаштування": "Settings",
  "Мова сайту": "Site language", "Українська": "Ukrainian", "English": "English",
  "Мій магазин": "My store", "Покупки": "Shopping", "Мої замовлення": "My orders",
  "Замовлення з'являться згодом 🙂": "Orders are coming soon 🙂", "Вхід з'явиться згодом 🙂": "Sign-in is coming soon 🙂",
  "Мова": "Language", "Мову змінено": "Language changed",


  // --- Акції ---
  "Акції — Огого!": "Deals — Ogogo!", "Усі акції — Огого!": "All deals — Ogogo!", "Акція": "Deal",
  "Тепліше разом": "Warmer together", "Шалені знижки": "Crazy deals", "Картка Огого!": "Ogogo! card", "До школи": "Back to school",
  "до −40%": "up to −40%", "до −32%": "up to −32%", "+5% бонусами": "+5% in bonuses", "від ₴15": "from ₴15",
  "1 – 21 грудня": "Dec 1 – 21", "до 31 грудня": "until Dec 31", "постійна програма": "ongoing program",
  "Пледи, рушники й текстиль для затишку вдома за найнижчими цінами сезону.": "Blankets, towels and textiles for a cosy home at the season's lowest prices.",
  "Найбільші знижки тижня в усіх категоріях: гірлянди, посуд, іграшки та інше.": "The week's biggest discounts across all categories: lights, cookware, toys and more.",
  "Отримуйте 5% від кожної покупки бонусами й оплачуйте ними до 100% наступних замовлень.": "Get 5% of every purchase back in bonuses and pay up to 100% of future orders with them.",
  "Усе для навчання: зошити, рюкзаки й канцелярія за шкільними цінами.": "Everything for school: notebooks, backpacks and stationery at school prices.",
  "Знижка до −40% на товари категорії «Дім і текстиль»": "Up to −40% on Home & textiles", "Безкоштовна доставка замовлень від ₴500": "Free delivery on orders over ₴500",
  "Бонуси нараховуються на всі акційні товари": "Bonuses apply to all deal products", "Тільки товари зі знижкою, відсортовані від найбільшої": "Discounted products only, biggest discount first",
  "Кількість товару обмежена": "Limited stock", "Ціни дійсні в інтернет-магазині й у магазинах мережі": "Prices valid online and in our stores",
  "+5% бонусами з кожної покупки": "+5% back in bonuses on every order", "1 бонус = ₴1 знижки на наступні замовлення": "1 bonus = ₴1 off future orders",
  "Особливі ціни для власників картки": "Special prices for card holders", "Картка безкоштовна, оформлення за 1 хвилину": "The card is free and takes 1 minute to get",
  "Зошити від ₴15": "Notebooks from ₴15", "Рюкзаки −25%": "Backpacks −25%", "Бонус +5% на картку Огого": "+5% bonus on your Ogogo card",
  "Обрати текстиль": "Shop textiles", "Дивитися знижки": "See deals", "Отримати картку": "Get the card", "До канцтоварів": "Shop stationery",
  "Умови акції": "Deal terms", "Товари акції": "Deal products", "Інші акції": "Other deals", "Детальніше": "Learn more",
  "Діє завжди": "Always on", "Акція завершилась": "This deal has ended",

  // --- Футер ---
  "Доставка 1–2 дні": "Delivery in 1–2 days", "Безкоштовно від ₴500 або ₴59 по Україні": "Free over ₴500, otherwise ₴59 across Ukraine",
  "Понад 50 магазинів, щодня з 8:00 до 22:00": "50+ stores, open daily 8:00–22:00", "Зручна оплата": "Easy payment",
  "Карткою онлайн, готівкою або бонусами": "Card online, cash or bonuses", "Без зайвих питань і з чеком або без": "No questions asked, with or without a receipt",
  "Мультимаркет товарів для дому та родини за чесними цінами.": "A multimarket of goods for home and family at fair prices.",
  "Ми в соцмережах": "Follow us", "Каталог товарів": "Product catalog", "Обмін і повернення": "Exchanges & returns",
  "Мій профіль": "My profile", "Партнерам": "For partners", "Політика конфіденційності": "Privacy policy",
  "Служба підтримки": "Customer support", "Графік роботи": "Opening hours", "Пн – Нд: 8:00 – 22:00": "Mon – Sun: 8:00 – 22:00",
  "Загальні питання": "General questions", "Підпишись на новини та акції": "Get news and deals",
  "Надсилаємо тільки найкращі пропозиції — без спаму 🙂": "Only the best offers — no spam 🙂", "Ваш email": "Your email",
  "Погоджуюсь з політикою конфіденційності й обробкою моїх даних": "I agree to the privacy policy and the processing of my data",
  "Підписатися": "Subscribe", "Огого! завжди під рукою": "Ogogo! always at hand", "Завантажити в": "Download on",
  "Способи оплати": "Payment methods", "Застосунок з'явиться згодом 🙂": "The app is coming soon 🙂",
  "Додати": "Add", "ВИГОДА": "SAVE",
  "Категорія": "Category",

  // --- Оформлення ---
  "Оформлення замовлення — Огого!": "Checkout — Ogogo!", "Оформлення замовлення": "Checkout", "Оформлення": "Checkout",
  "Контактні дані": "Contact details", "Ім'я та прізвище": "Full name", "Телефон": "Phone", "Email (необов'язково)": "Email (optional)",
  "Олена Коваль": "Olena Koval", "Самовивіз з магазину": "Store pickup", "Кур'єр": "Courier", "Завтра, 10:00–21:00": "Tomorrow, 10:00–21:00",
  "Відділення пошти": "Post office", "1–2 дні по Україні": "1–2 days across Ukraine", "Змінити магазин": "Change store", "Місто": "City",
  "Вулиця, будинок, квартира": "Street, building, apartment", "Номер відділення": "Branch number", "Оплата": "Payment",
  "Карткою онлайн": "Card online", "Visa, Mastercard, Apple Pay, Google Pay": "Visa, Mastercard, Apple Pay, Google Pay",
  "При отриманні": "On delivery", "Готівкою або карткою": "Cash or card", "Коментар до замовлення": "Order comment",
  "Наприклад, зателефонуйте перед доставкою": "E.g. call before delivery", "Ваше замовлення": "Your order", "Товари": "Items",
  "Бонуси": "Bonuses", "Підтвердити замовлення": "Place order", "Це демо: замовлення й оплата не надсилаються.": "This is a demo: no order or payment is sent.",
  "Перевірте виділені поля": "Please check the highlighted fields", "Додайте товари, щоб оформити замовлення.": "Add products to check out.",
  "Замовлення оформлено — Огого!": "Order placed — Ogogo!", "Дякуємо, замовлення оформлено!": "Thank you, your order is placed!",
  "Номер замовлення": "Order number", "Отримання": "Delivery", "Сума": "Total", "Нараховано бонусів": "Bonuses earned",
  "Це демо: замовлення не надсилається, але так виглядатиме підтвердження.": "This is a demo: no order is sent, but this is what the confirmation looks like.",
  "Продовжити покупки": "Continue shopping", "сьогодні": "today",

  // --- Оформлення v2 ---
  "Отримувач": "Recipient", "Вкажіть контакти": "Add your contacts", "Продовжити": "Continue", "Змінити": "Change",
  "Оберіть доставку": "Choose delivery", "Оберіть спосіб оплати": "Choose payment", "Спосіб оплати": "Payment method",
  "Самовивіз з магазину": "Store pickup", "Кур'єр до дверей": "Courier to your door", "Доставка з 10:00 до 21:00": "Delivered 10:00–21:00",
  "Заберіть у найближчому відділенні, у зручний час": "Pick up at the nearest branch whenever suits you",
  "Ваше місто:": "Your city:", "Забрати самостійно": "Pick up", "Кур'єром": "By courier", "Обрати інший магазин": "Choose another store",
  "Оплата при отриманні": "Pay on delivery", "Ваші товари": "Your items", "На суму": "Total", "Редагувати кошик": "Edit cart",
  "Мені можна не передзвонювати": "No need to call me", "Якщо вам потрібна консультація щодо замовлення — зніміть галочку": "Untick if you'd like a call about your order",
  "Коментар до замовлення": "Order comment", "Списати бонуси": "Use bonuses", "Доступно:": "Available:", "Усі": "All",
  "Застосувати промокод": "Apply promo code", "Застосувати": "Apply", "Спробуйте OGOGO10 — знижка 10%": "Try OGOGO10 for 10% off",
  "Такого промокоду немає": "This promo code doesn't exist", "Бонусів буде списано": "Bonuses used", "Бонусів буде нараховано": "Bonuses earned",
  "Заповніть дані замовлення": "Fill in order details", "Підтвердити": "Confirm", "Далі": "Next", "Отримаєте": "Arrives",
  "Підтверджуючи замовлення, ви погоджуєтеся з умовами використання й політикою конфіденційності. Це демо: нічого не надсилається.": "By placing the order you agree to the terms of use and privacy policy. This is a demo: nothing is sent.",
  "Ми надішлемо SMS, коли замовлення буде готове.": "We'll text you when your order is ready.", "Менеджер зателефонує вам найближчим часом.": "A manager will call you shortly.",
  "Це демо — нічого не надсилається.": "This is a demo — nothing is sent.", "Сума бонусів": "Bonus amount", "Промокод": "Promo code",
  "Безпечна оплата: дані картки вводяться на сторінці банку (у демо — не запитуються)": "Secure payment: card details are entered on the bank's page (not requested in the demo)",
  "Зберемо замовлення в магазині й надішлемо SMS, коли воно буде готове. Зберігаємо 4 дні.": "We'll pack your order in the store and text you when it's ready. We keep it for 4 days.",
  "Що робити, якщо якогось товару не буде?": "What if an item is out of stock?", "Замініть на схожий товар за тією ж ціною": "Replace it with a similar item at the same price",
  "Зберіть замовлення без нього": "Pack the order without it", "Зателефонуйте мені": "Call me",
  "Якщо товару не буде в наявності, ми зберемо замовлення без нього. Якщо не буде жодного товару — скасуємо замовлення й повідомимо. Кошти повернемо автоматично.": "If an item is out of stock we'll pack the order without it. If nothing is available we'll cancel the order and let you know. Any payment is refunded automatically.",
  "Якщо товару немає": "If out of stock", "Замінити на схожий": "Replace with similar", "Зібрати без нього": "Pack without it", "Зателефонувати": "Call",
  "Обране — Огого!": "Wishlist — Ogogo!", "Є в наявності ·": "In stock ·", "В обраному поки порожньо": "Your wishlist is empty",
  "Натискайте ♥ на товарах, щоб зберегти їх тут і повернутися пізніше.": "Tap ♥ on products to save them here and come back later.",
  "До каталогу": "Go to catalog", "Вам може сподобатись": "You may also like", "Нещодавно додані": "Recently added",
  "Очистити": "Clear", "Усе вже в кошику ✓": "Everything is in your cart ✓", "Повернути": "Undo", "Разом": "Total",
  "Ми підібрали товари й категорії на основі ваших переглядів і покупок": "We picked products and categories based on what you viewed and bought",
  "Переглядайте товари — і ми підберемо добірку саме для вас": "Browse products and we'll put together a selection just for you",
  "Категорії для вас": "Categories for you", "Рекомендуємо для вас": "Recommended for you", "Популярне зараз": "Popular right now",
  "Скинути рекомендації": "Reset recommendations", "Нещодавно переглянуте": "Recently viewed", "Рекомендації скинуто": "Recommendations reset",
  "З обраного — зараз зі знижкою": "From your wishlist — now on sale", "Доброго ранку": "Good morning", "Добрий день": "Good afternoon",
  "Добрий вечір": "Good evening", "Доброї ночі": "Good night", "Для вас": "For you",
  "— персональна ціна для вас": "— your personal price", "Для вас персональна знижка −10%": "Personal discount for you −10%", "— увійдіть, щоб побачити свої ціни": "— sign in to see your prices", "Оформити": "Checkout", "Ваша ціна": "Your price", "Обрати": "Choose",
  "Усі": "All", "3 ★ і нижче": "3 ★ and below", "Спочатку нові": "Newest first", "Найкорисніші": "Most helpful", "Високі оцінки": "Highest rated", "Низькі оцінки": "Lowest rated",
  "Купив(ла) в Огого": "Verified purchase", "Ваш відгук": "Your review", "Немає відгуків з такою оцінкою": "No reviews with this rating", "Відгуків ще немає. Будьте першим!": "No reviews yet. Be the first!",
  "Оберіть оцінку": "Choose a rating", "Жахливо": "Terrible", "Погано": "Poor", "Нормально": "Okay", "Добре": "Good", "Чудово": "Excellent", "Ім’я": "Name", "Як вас звати": "Your name",
  "Що сподобалось, а що ні? Як використовуєте товар?": "What did you like or dislike? How do you use it?", "Опублікувати": "Publish", "Ваш відгук ": "Your review",
  "Поставте оцінку від 1 до 5": "Give a rating from 1 to 5", "Напишіть хоча б кілька слів (від 10 символів)": "Write at least a few words (10+ characters)", "Дякуємо! Відгук опубліковано ✓": "Thank you! Review published ✓",
  "Чудова якість за свої гроші, рекомендую!": "Great quality for the money, recommend!", "Беру вже вдруге — усе як в описі.": "Buying for the second time — exactly as described.",
  "Забрала в магазині того ж дня, дуже зручно.": "Picked it up in store the same day, very convenient.", "Перевершило очікування, вживу виглядає ще краще.": "Exceeded expectations, looks even better in person.",
  "Користуюсь щодня, жодних нарікань.": "Use it every day, no complaints.", "Купили на подарунок — усі в захваті.": "Bought as a gift — everyone loved it.",
  "Загалом задоволений, але упаковка могла б бути кращою.": "Generally happy, but the packaging could be better.", "Добре співвідношення ціни та якості.": "Good value for money.",
  "Хороший товар, трохи менший, ніж здавалося на фото.": "Good product, a bit smaller than it looked in the photo.", "Усе добре, єдине — хотілося б більше кольорів.": "All good, just wish there were more colours.",
  "Нормально, але очікував більшого.": "Okay, but expected more.", "За акційною ціною — ок, за повною не взяв би.": "Fine at the sale price, wouldn't pay full price.",
  "Свою функцію виконує, без вау-ефекту.": "Does the job, nothing special.", "Якість так собі, швидко втратило вигляд.": "So-so quality, quickly lost its look.",
  "Не зовсім те, що в описі.": "Not quite as described.", "Не підійшло, повернув без проблем — дякую магазину.": "Didn't suit me, returned with no hassle — thanks to the store.", "Розчарований, на жаль.": "Disappointed, unfortunately.",
  "Вас цікавило — тепер дешевше": "You looked at this — now cheaper", "Знижка для вас": "A deal for you",
  "Можна отримати": "Pick up", "за ~10 хв": "in ~10 min", "у": "at", "Змінити магазин": "Change store",
  // --- Товари ---
  "Сковорода антипригарна 24 см": "Non-stick frying pan, 24 cm",
  "Набір рушників, 3 шт.": "Towel set, 3 pcs",
  "Засіб для миття посуду 1 л": "Dishwashing liquid, 1 L",
  "Конструктор «Місто», 120 деталей": "“City” building set, 120 pieces",
  "Плед флісовий 150×200 см, лавандовий": "Fleece blanket 150×200 cm, lavender",
  "Плед флісовий": "Fleece blanket",
  "Зошит А5, 48 аркушів": "A5 notebook, 48 sheets",
  "Шампунь для всієї родини 750 мл": "Family shampoo, 750 ml",
  "Гірлянда LED, 10 м, тепле світло": "LED string lights, 10 m, warm white",
  "Гірлянда LED, 10 м": "LED string lights, 10 m", "Гірлянда LED": "LED string lights",
  "Набір контейнерів для їжі, 5 шт.": "Food container set, 5 pcs",
  "Іграшка м'яка «Ведмедик», 35 см": "Teddy bear plush toy, 35 cm",
  "Губки кухонні, 10 шт.": "Kitchen sponges, 10 pcs",
  "Рюкзак шкільний, помаранчевий": "School backpack, orange", "Рюкзак шкільний": "School backpack",
  "Насіння томатів «Черрі»": "Cherry tomato seeds",
  "Миска керамічна для котів": "Ceramic cat bowl",
  "Набір викруток, 6 шт.": "Screwdriver set, 6 pcs",
  "Ялинкові іграшки, 12 шт.": "Christmas ornaments, 12 pcs",

  // --- Описи ---
  "Легка алюмінієва сковорода з трикомпонентним антипригарним покриттям. Рівномірно прогрівається, не потребує багато олії й легко миється.": "A light aluminium pan with a three-layer non-stick coating. Heats evenly, needs little oil and is easy to clean.",
  "Набір із трьох махрових рушників: коралового, білого й сірого. Щільна бавовна добре вбирає вологу й лишається м'якою після прання.": "A set of three terry towels: coral, white and grey. Dense cotton absorbs well and stays soft after washing.",
  "Концентрований засіб для миття посуду з ароматом лайма. Швидко розчиняє жир навіть у холодній воді й дбайливо ставиться до шкіри рук.": "Concentrated lime-scented dishwashing liquid. Cuts grease fast even in cold water and is gentle on hands.",
  "Конструктор для маленьких архітекторів: будиночки, дерево й автомобіль. Деталі сумісні з популярними наборами цеглинок.": "A set for little architects: houses, a tree and a car. Pieces fit popular brick sets.",
  "Пухнастий флісовий плед ніжного лавандового кольору. Тримає тепло, не линяє й не скочується після прання.": "A fluffy fleece blanket in soft lavender. Keeps you warm, doesn't fade or pill after washing.",
  "Зошит формату А5 у клітинку з яскравою обкладинкою. Щільний папір, на якому не просвічує ручка.": "An A5 squared notebook with a bright cover. Thick paper that pens don't bleed through.",
  "М'який шампунь для всієї родини з дозатором. Підходить для щоденного миття, не пересушує шкіру голови.": "A gentle family shampoo with a pump. Fine for daily use and doesn't dry out the scalp.",
  "Гірлянда на мідному дроті з теплим світлом. Тонкий дріт легко обвивається навколо ялинки, дзеркала чи полиці.": "Warm-white copper-wire string lights. The thin wire wraps easily around a tree, mirror or shelf.",
  "П'ять контейнерів різного розміру з кольоровими кришками. Складаються один в одний і не займають місця в шафі.": "Five containers in different sizes with colourful lids. They nest inside each other to save cupboard space.",
  "М'який ведмедик із бантиком, який захоче обійняти кожен. Гіпоалергенний наповнювач, міцні шви.": "A soft teddy bear with a bow that everyone wants to hug. Hypoallergenic filling, strong seams.",
  "Кухонні губки з абразивним шаром для складних забруднень і м'якою стороною для делікатного посуду.": "Kitchen sponges with a scouring side for tough dirt and a soft side for delicate dishes.",
  "Легкий шкільний рюкзак з ортопедичною спинкою, двома відділеннями й бічними кишенями для пляшки.": "A light school backpack with an ergonomic back, two compartments and side bottle pockets.",
  "Насіння солодких томатів черрі для городу й балкона. Невибаглива рання культура з високим урожаєм.": "Sweet cherry tomato seeds for the garden or balcony. An easy, early, high-yield variety.",
  "Стійка керамічна миска для котів, що не ковзає підлогою. Підходить для сухого й вологого корму.": "A stable ceramic cat bowl that doesn't slide. Suits dry and wet food.",
  "Набір викруток з магнітними наконечниками й зручними прогумованими ручками для дому й дачі.": "A screwdriver set with magnetic tips and comfortable rubber grips for home and garden.",
  "Набір скляних ялинкових кульок у червоно-золотих тонах. Кожна кулька в окремій комірці подарункової коробки.": "A set of red-and-gold glass baubles. Each one sits in its own slot of a gift box.",

  // --- Характеристики: назви ---
  "Діаметр": "Diameter", "Матеріал": "Material", "Покриття": "Coating", "Підходить для": "Suitable for",
  "Можна мити в посудомийці": "Dishwasher safe", "Кількість": "Quantity", "Розмір": "Size", "Склад": "Composition",
  "Щільність": "Density", "Прання": "Washing", "Об'єм": "Volume", "Аромат": "Scent", "Тип": "Type",
  "Кількість деталей": "Pieces", "Вік": "Age", "Розмір коробки": "Box size", "Колір": "Colour",
  "Формат": "Format", "Аркушів": "Sheets", "Лініювання": "Ruling", "Щільність паперу": "Paper weight",
  "Тип волосся": "Hair type", "Дозатор": "Pump", "Без": "Free from", "Довжина": "Length",
  "Кількість LED": "LED count", "Колір світла": "Light colour", "Живлення": "Power", "Режимів": "Modes",
  "Мікрохвильовка": "Microwave safe", "Висота": "Height", "Наповнювач": "Filling", "Вага": "Weight",
  "Дозрівання": "Ripening", "Вирощування": "Growing", "Посудомийка": "Dishwasher", "Типи шліців": "Tip types",
  "Магнітні": "Magnetic", "Кольори": "Colours",

  // --- Характеристики: значення ---
  "алюміній": "aluminium", "антипригарне, 3 шари": "non-stick, 3 layers", "газ, електро, склокераміка": "gas, electric, ceramic",
  "так": "yes", "так, без кришки": "yes, without the lid", "100% бавовна": "100% cotton", "до 40 °C": "up to 40 °C",
  "до 30 °C": "up to 30 °C", "лайм": "lime", "концентрат": "concentrate", "нейтральний": "neutral",
  "від 4 років": "4+ years", "ABS-пластик": "ABS plastic", "фліс": "fleece", "лавандовий": "lavender",
  "клітинка": "squared", "А5": "A5", "усі типи": "all types", "силіконів": "silicones",
  "теплий білий": "warm white", "поліпропілен": "polypropylene", "від 0,3 до 2,5 л": "0.3 to 2.5 L",
  "від 0 років": "0+ years", "холофайбер": "hollow fibre", "ручне": "hand wash", "поролон, абразив": "foam, abrasive",
  "поліестер": "polyester", "помаранчевий": "orange", "індетермінантний": "indeterminate",
  "відкритий ґрунт, балкон": "open ground, balcony", "кераміка": "ceramic", "м'ятний": "mint",
  "хром-ванадієва сталь": "chrome-vanadium steel", "скло": "glass", "червоний, золотий, білий": "red, gold, white",
};

// Частини рядків (адреси, одиниці виміру)
const EN_PARTS = [
  ["ТРЦ «Сонячний»", "“Sonyachnyi” Mall"], ["ТРЦ «Простір»", "“Prostir” Mall"], ["ТЦ «Каштан»", "“Kashtan” Mall"], ["ТЦ «Площа»", "“Ploshcha” Mall"],
  ["вул. Прикладна", "Prykladna St"], ["вул. Зелена", "Zelena St"], ["вул. Квіткова", "Kvitkova St"], ["вул. Морська", "Morska St"],
  ["вул. Річкова", "Richkova St"], ["вул. Липова", "Lypova St"], ["просп. Світлий", "Svitlyi Ave"],
  ["Київ", "Kyiv"], ["Львів", "Lviv"], ["Одеса", "Odesa"], ["Харків", "Kharkiv"], ["Дніпро", "Dnipro"],
  [" шт.", " pcs"], [" см", " cm"], [" мл", " ml"], [" л", " L"], [" м", " m"], [" г/м²", " g/m²"], [" кг", " kg"], [" г", " g"],
  [" років", " years"], [" днів", " days"], ["–12 years", "–12 years"],
];

const EN_RULES = [
  [/^(\d+) товар(?:ів|и)?$/, (m, n) => `${n} ${n === "1" ? "item" : "items"}`],
  [/^ПОКАЗАТИ (\d+) ТОВАР(?:ІВ|И)?$/, (m, n) => `SHOW ${n} ${n === "1" ? "ITEM" : "ITEMS"}`],
  [/^Пошук: «(.*)»$/, (m, q) => `Search: “${q}”`],
  [/^Пошук: (.*)$/, (m, q) => `Search: ${q}`],
  [/^Ціна: (.*)$/, (m, v) => `Price: ${v}`],
  [/^Товари \((\d+)\)$/, (m, n) => `Items (${n})`],
  [/^на основі (\d+) відгук(?:у|ів)$/, (m, n) => `based on ${n} review${n === "1" ? "" : "s"}`],
  [/^\+(₴\d+) бонусів на картку Огого$/, (m, v) => `+${v} in bonuses on your Ogogo card`],
  [/^Код: (.*)$/, (m, v) => `Code: ${v}`],
  [/^Рейтинг (.*)$/, (m, v) => `Rating ${v}`],
  [/^Залишилось (\d+) (?:день|дні|днів)$/, (m, n) => `${n} day${n === "1" ? "" : "s"} left`],
  [/^(\d+) акці(?:я|ї|й)$/, (m, n) => `${n} deal${n === "1" ? "" : "s"}`],
  [/^(.*) — Акції Огого!$/, (m, t) => `${tr(t)} — Ogogo! deals`],
  [/^(.*) · (.*)$/, (m, a, b) => (EN[a] !== undefined || EN[b] !== undefined ? `${tr(a)} · ${tr(b)}` : null)],
  [/^Списати бонуси: доступно$/, () => "Use bonuses: available"],
  [/^(Самовивіз|Кур'єр|Відділення пошти): (.*)$/, (m, k, v) => `${({"Самовивіз":"Pickup","Кур'єр":"Courier","Відділення пошти":"Post office"})[k]}: ${trParts(v)}`],
  [/^(.*) · сьогодні$/, (m, v) => `${trParts(v)} · today`],
  [/^Товари \((\d+)\)$/, (m, n) => `Items (${n})`],
  [/^Отримаєте (.*)$/, (m, v) => `Arrives ${v === "сьогодні" ? "today" : v}`],
  [/^(.*) · Отримаєте (.*)$/, (m, a, v) => `${trParts(a)} · Arrives ${v === "сьогодні" ? "today" : v}`],
  [/^від (₴\d+)$/, (m, v) => `from ${v}`],
  [/^Промокод застосовано: (.*)$/, (m, v) => `Promo code applied: ${v}`],
  [/^Промокод (.*)$/, (m, v) => `Promo ${v}`],
  [/^Ви заощаджуєте (.*) 🎉$/, (m, v) => `You save ${v} 🎉`],
  [/^Додайте товарів ще на$/, () => "Add"],
  [/^(.*), відділення (.*)$/, (m, c, b) => `${trParts(c)}, branch ${b}`],
  [/^Додати все в кошик \((\d+)\)$/, (m, n) => `Add all to cart (${n})`],
  [/^Економія (.*)$/, (m, v) => `You save ${v}`],
  [/^економія (.*)$/, (m, v) => `save ${v}`],
  [/^«(.*)» прибрано з обраного$/, (m, v) => `“${tr(v)}” removed from wishlist`],
  [/^Додано в кошик: (\d+) товар(?:и|ів)? ✓$/, (m, n) => `Added to cart: ${n} item${n === "1" ? "" : "s"} ✓`],
  [/^Є в наявності · $/, () => "In stock · "],
  [/^Схоже на «(.*)»$/, (m, v) => `Similar to “${tr(v)}”`],
  [/^Пасує до «(.*)»$/, (m, v) => `Goes with “${tr(v)}”`],
  [/^Бо вам цікаві «(.*)»$/, (m, v) => `Because you like “${tr(v)}”`],
  [/^(Доброго ранку|Добрий день|Добрий вечір|Доброї ночі)([,!]?)$/, (m, g, c) => `${EN[g]}${c}`],
  [/^У кошику (\d+) (товар|товари|товарів)$/, (m, n) => `${n} ${n === "1" ? "item" : "items"} in cart`],
  [/^на «(.+)»$/, (m, c) => `on “${tr(c)}”`],
  [/^(\d+) (відгук|відгуки|відгуків)$/, (m, n) => `${n} review${n === "1" ? "" : "s"}`],
  [/^Корисно · (\d+)$/, (m, n) => `Helpful · ${n}`],
  [/^Показати ще (\d+)$/, (m, n) => `Show ${n} more`],
  [/^(\d+) (січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня) (\d{4})$/, (m, d, mo, y) => `${["January","February","March","April","May","June","July","August","September","October","November","December"][["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня"].indexOf(mo)]} ${d}, ${y}`],
  [/^Банер (\d+)$/, (m, n) => `Banner ${n}`],
  [/^Магазин: (.*)$/, (m, v) => `Store: ${trParts(v)}`],
  [/^Швидко додати «(.*)» у кошик$/, (m, v) => `Quick add “${tr(v)}” to cart`],
  [/^Додати «(.*)» у кошик$/, (m, v) => `Add “${tr(v)}” to cart`],
  [/^(.*) — купити за (₴[\d\s]+) \| Огого!$/, (m, n, p) => `${tr(n)} — buy for ${p} | Ogogo!`],
  [/^(.*) за (₴[\d\s]+) в Огого!\. (.*)$/, (m, n, p, d) => `${tr(n)} for ${p} at Ogogo!. ${tr(d)}`],
  [/^(\d+)\s*$/, (m, n) => n],
  [/^([^\sА-Яа-яЇїІіЄєҐґA-Za-z0-9]+)\s+(.+)$/, (m, icon, rest) => (EN[rest] !== undefined ? `${icon} ${EN[rest]}` : null)],
];

function trParts(s) {
  let out = s;
  for (const [a, b] of EN_PARTS) out = out.split(a).join(b);
  return out;
}

function tr(s) {
  if (LANG !== "en" || typeof s !== "string") return s;
  const k = s.trim();
  if (!k || !/[А-Яа-яЇїІіЄєҐґ]/.test(k)) return s;
  if (EN[k] !== undefined) return s.replace(k, EN[k]);
  for (const [re, f] of EN_RULES) { const m = k.match(re); if (m) { const v = f(...m); if (v !== null) return s.replace(k, v); } }
  const parts = trParts(k);
  return parts !== k ? s.replace(k, parts) : s;
}

const I18N_ATTRS = ["placeholder", "aria-label", "title", "alt"];
function translateTree(root) {
  if (LANG !== "en" || !root) return;
  if (root.nodeType === 3) { if (root.parentElement && root.parentElement.closest('[translate="no"]')) return; const v = tr(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; return; }
  if (root.nodeType !== 1) return;
  if (root.tagName === "SCRIPT" || root.tagName === "STYLE") return;
  if (root.closest && root.closest('[translate="no"]')) return;
  for (const a of I18N_ATTRS) if (root.hasAttribute && root.hasAttribute(a)) { const v = tr(root.getAttribute(a)); if (v !== root.getAttribute(a)) root.setAttribute(a, v); }
  if (root.tagName === "OPTION" && root.textContent) { const v = tr(root.textContent); if (v !== root.textContent) root.textContent = v; return; }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n = walker.nextNode();
  while (n) {
    if (n.nodeType === 3) { if (n.parentElement && n.parentElement.closest('[translate="no"]')) { n = walker.nextNode(); continue; } const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    else for (const a of I18N_ATTRS) if (n.hasAttribute(a)) { const v = tr(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); }
    n = walker.nextNode();
  }
}

// Лого й перемикач мови не перекладаються; лого лишається українським текстом
document.querySelectorAll(".logo, .lc-logo, .pf-card-logo, .pf-avatar, .seg, .lang").forEach((el) => {
  el.setAttribute("translate", "no");
  el.setAttribute("lang", "uk");
});

if (LANG === "en") {
  document.documentElement.lang = "en";
  translateTree(document.body);
  document.title = tr(document.title);
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", tr(meta.getAttribute("content")));
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "characterData") translateTree(m.target);
      else if (m.type === "attributes") translateTree(m.target);
      else m.addedNodes.forEach(translateTree);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: I18N_ATTRS });
  // заголовок вкладки, який сторінки товару змінюють з JS
  new MutationObserver(() => { const t = tr(document.title); if (t !== document.title) document.title = t; })
    .observe(document.querySelector("title"), { childList: true, characterData: true, subtree: true });
}
