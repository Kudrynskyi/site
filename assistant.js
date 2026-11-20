// ================= AI-помічник «Огого!» (демо) =================
// Працює локально на даних каталогу (data.js), без сервера й без справжньої моделі.

(function () {
  const EN_UI = typeof LANG !== "undefined" && LANG === "en";
  const T = (uk, en) => (EN_UI ? en : uk);
  const name = (p) => (typeof tr === "function" ? tr(p.name) : p.name);
  const catName = (c) => (typeof tr === "function" ? tr(c.name) : c.name);

  // ---------- Розмітка ----------
  const sheet = document.createElement("section");
  sheet.className = "ai-sheet";
  sheet.id = "aiSheet";
  sheet.setAttribute("translate", "no");
  sheet.setAttribute("aria-hidden", "true");
  sheet.setAttribute("aria-label", T("AI-помічник", "AI assistant"));
  sheet.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="ai-head">
      <span class="ai-avatar">${sparkle()}</span>
      <div><b>${T("AI-помічник Огого!", "Ogogo! AI assistant")}</b><small>${T("Демо · відповідає з каталогу", "Demo · answers from the catalog")}</small></div>
      <button class="icon-btn ai-close" aria-label="${T("Закрити", "Close")}"><svg><use href="#i-close"/></svg></button>
    </div>
    <div class="ai-log" id="aiLog" aria-live="polite"></div>
    <div class="ai-chips" id="aiChips"></div>
    <form class="ai-form" id="aiForm">
      <input id="aiInput" autocomplete="off" placeholder="${T("Що шукаєте? Напр.: подарунок до ₴200", "What are you looking for? E.g. a gift under ₴200")}">
      <button type="submit" aria-label="${T("Надіслати", "Send")}"><svg viewBox="0 0 24 24"><path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </form>`;
  const backdrop = document.createElement("div");
  backdrop.className = "ai-backdrop";
  backdrop.hidden = true;
  document.body.append(backdrop, sheet);

  const log = sheet.querySelector("#aiLog");
  const chips = [
    T("Подарунок до ₴200", "Gift under ₴200"),
    T("Найбільші знижки", "Biggest discounts"),
    T("Щось для кухні", "Something for the kitchen"),
    T("Новинки", "New arrivals"),
    T("Що в моєму кошику?", "What's in my cart?"),
  ];
  sheet.querySelector("#aiChips").innerHTML = chips.map((c) => `<button type="button" class="ai-chip">${c}</button>`).join("");

  function sparkle() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l1.9 5.4 5.6 1.6-5.6 1.7L12 16.5l-1.9-5.3-5.6-1.7 5.6-1.6Z" fill="currentColor"/><path d="M19 14.5l.9 2.4 2.4.8-2.4.9-.9 2.4-.8-2.4-2.5-.9 2.5-.8Z" fill="currentColor"/><path d="M5 15.5l.6 1.6 1.6.6-1.6.5L5 19.8l-.6-1.6-1.6-.5 1.6-.6Z" fill="currentColor"/></svg>`;
  }

  // ---------- Повідомлення ----------
  function say(text, cls = "bot", items = null) {
    const m = document.createElement("div");
    m.className = `ai-msg ${cls}`;
    m.innerHTML = `<p>${text}</p>` + (items && items.length ? `<div class="ai-items">${items.map(itemHtml).join("")}</div>` : "");
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function itemHtml(p) {
    return `<div class="ai-item">
      <a href="${productUrl(p)}"><img src="${imgSrc(p)}" alt=""></a>
      <a class="ai-item-name" href="${productUrl(p)}">${name(p)}</a>
      <div class="ai-item-row"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ""}
        <button class="ai-add" data-ai-add="${p.id}" aria-label="${T("Додати в кошик", "Add to cart")}">+</button></div>
    </div>`;
  }
  function typing() {
    const t = document.createElement("div");
    t.className = "ai-msg bot ai-typing";
    t.innerHTML = "<p><span></span><span></span><span></span></p>";
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }

  // ---------- «Розуміння» запиту ----------
  const CAT_WORDS = {
    home: ["дім", "текстил", "рушник", "плед", "ковдр", "home", "towel", "blanket", "textile"],
    kitchen: ["кухн", "посуд", "сковород", "контейнер", "kitchen", "pan", "cook", "container"],
    clean: ["хімі", "прибиран", "миття", "губк", "clean", "dish", "sponge"],
    beauty: ["крас", "гігієн", "шампун", "beauty", "shampoo", "hygiene"],
    kids: ["діт", "дитин", "іграш", "конструктор", "ведмед", "kid", "child", "toy", "teddy", "lego"],
    office: ["школ", "канц", "зошит", "рюкзак", "school", "notebook", "backpack", "stationery"],
    garden: ["дач", "сад", "город", "насін", "garden", "seed", "tomato"],
    pets: ["кот", "кіш", "тварин", "собак", "pet", "cat", "dog"],
    tools: ["інструмент", "викрут", "ремонт", "tool", "screwdriver"],
    season: ["свят", "ялин", "новий рік", "гірлянд", "декор", "christmas", "holiday", "lights", "decor"],
  };

  function answer(qRaw) {
    const q = qRaw.toLowerCase();
    let list = products.slice();
    const notes = [];

    if (/кошик|cart/.test(q)) {
      const cart = load("ogogo-cart", {});
      const items = Object.keys(cart).map(byId).filter(Boolean);
      if (!items.length) return [T("Кошик поки порожній. Підказати щось популярне?", "Your cart is empty. Shall I suggest something popular?"), products.filter((p) => p.hit).slice(0, 3)];
      const total = items.reduce((s, p) => s + p.price * cart[p.id], 0);
      const left = FREE_DELIVERY_FROM - total;
      const tip = left > 0
        ? T(` До безкоштовної доставки бракує ${money(left)} — ось що можна додати:`, ` You're ${money(left)} away from free delivery — here's what you could add:`)
        : T(" Доставка вже безкоштовна 🎉", " Delivery is already free 🎉");
      const extra = left > 0 ? products.filter((p) => !cart[p.id] && p.price <= left + 60).sort((a, b) => b.price - a.price).slice(0, 3) : [];
      return [T(`У кошику ${items.length} ${plural(items.length, "товар", "товари", "товарів")} на ${money(total)}.`, `You have ${items.length} item${items.length === 1 ? "" : "s"} for ${money(total)}.`) + tip, extra.length ? extra : items];
    }

    const words0 = q.split(/[^a-zа-яїієґ'0-9]+/i).filter((w) => w.length > 3);
    const direct = products.filter((p) => words0.some((w) => (p.name + " " + name(p)).toLowerCase().includes(w.slice(0, Math.max(4, w.length - 2)))));
    if (direct.length && direct.length <= 3 && !/\d/.test(q)) {
      const p0 = direct[0];
      return [T(`Знайшов: «${name(p0)}» за ${money(p0.price)}${p0.old ? ` (−${discount(p0)}%)` : ""}.`, `Found: “${name(p0)}” for ${money(p0.price)}${p0.old ? ` (−${discount(p0)}%)` : ""}.`), direct];
    }

    const num = q.match(/(\d{2,5})/);
    if (num && /до|під|дешевш|under|below|less|max|up to|бюджет|budget/.test(q)) {
      const max = Number(num[1]);
      list = list.filter((p) => p.price <= max);
      notes.push(T(`до ${money(max)}`, `under ${money(max)}`));
    } else if (num && /від|over|more than|from/.test(q)) {
      const min = Number(num[1]);
      list = list.filter((p) => p.price >= min);
      notes.push(T(`від ${money(min)}`, `over ${money(min)}`));
    }

    const cats = Object.entries(CAT_WORDS).filter(([, w]) => w.some((x) => q.includes(x))).map(([c]) => c);
    if (cats.length) { list = list.filter((p) => cats.includes(p.cat)); notes.push(cats.map((c) => catName(catById(c))).join(", ")); }

    if (/знижк|акці|розпрод|дешев|sale|discount|deal|cheap/.test(q)) { list = list.filter((p) => p.old).sort((a, b) => discount(b) - discount(a)); notes.push(T("зі знижкою", "on sale")); }
    if (/новинк|нове|new/.test(q)) { list = list.filter((p) => p.isNew); notes.push(T("новинки", "new")); }
    if (/хіт|популяр|кращ|рейтинг|best|popular|top/.test(q)) { list = list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); }
    if (/подар|gift|present/.test(q)) {
      list = list.filter((p) => ["kids", "season", "home", "beauty"].includes(p.cat)).sort((a, b) => b.rating - a.rating);
      notes.push(T("на подарунок", "as a gift"));
    }

    if (!notes.length && !/хіт|популяр|кращ|best|popular|top/.test(q)) {
      const words = q.split(/[^a-zа-яїієґ'0-9]+/i).filter((w) => w.length > 2);
      const hit = products.filter((p) => words.some((w) => (p.name + " " + name(p)).toLowerCase().includes(w.slice(0, Math.max(3, w.length - 2)))));
      if (hit.length) return [T("Ось що я знайшов:", "Here's what I found:"), hit.slice(0, 4)];
      return [T("Не впевнений, що зрозумів 🙂 Спробуйте: «подарунок до ₴200», «щось для кухні» чи «найбільші знижки».", "Not sure I got that 🙂 Try “gift under ₴200”, “something for the kitchen” or “biggest discounts”."), products.filter((p) => p.hit).slice(0, 3)];
    }

    if (!list.length) return [T(`Нічого не знайшов (${notes.join(", ")}). Ось популярне:`, `Nothing found (${notes.join(", ")}). Here's what's popular:`), products.filter((p) => p.hit).slice(0, 3)];
    const top = list.slice(0, 4);
    const best = top[0];
    const why = best.old
      ? T(`Найвигідніше — «${name(best)}»: −${discount(best)}%, економія ${money(best.old - best.price)}.`, `Best value: “${name(best)}” — −${discount(best)}%, you save ${money(best.old - best.price)}.`)
      : best.reviews
        ? T(`Раджу «${name(best)}» — рейтинг ${best.rating.toFixed(1)} з ${best.reviews} відгуків.`, `I'd pick “${name(best)}” — rated ${best.rating.toFixed(1)} from ${best.reviews} reviews.`)
        : T(`Зверніть увагу на «${name(best)}» — це новинка.`, `Check out “${name(best)}” — it's new.`);
    return [T(`Підібрав ${list.length} ${plural(list.length, "товар", "товари", "товарів")} (${notes.join(", ")}). `, `Found ${list.length} item${list.length === 1 ? "" : "s"} (${notes.join(", ")}). `) + why, top];
  }

  function ask(q) {
    if (!q.trim()) return;
    say(q.replace(/</g, "&lt;"), "me");
    const t = typing();
    setTimeout(() => { t.remove(); const [text, items] = answer(q); say(text, "bot", items); }, 550);
  }

  // ---------- Події ----------
  function open() {
    sheet.classList.add("open"); sheet.setAttribute("aria-hidden", "false");
    backdrop.hidden = false; document.body.classList.add("locked");
    if (!log.children.length) say(T("Привіт! Я допоможу знайти товар, вкластися в бюджет чи підібрати подарунок. Що шукаємо?", "Hi! I can help you find a product, stay on budget or pick a gift. What are we looking for?"));
    setTimeout(() => sheet.querySelector("#aiInput").focus({ preventScroll: true }), 250);
  }
  function close() {
    sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true");
    backdrop.hidden = true; document.body.classList.remove("locked");
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-ai]")) { e.preventDefault(); open(); return; }
    const chip = e.target.closest(".ai-chip"); if (chip) { ask(chip.textContent); return; }
    const add = e.target.closest("[data-ai-add]");
    if (add) {
      const id = Number(add.dataset.aiAdd);
      if (typeof addToCart === "function") addToCart(id, false);
      else if (typeof setQty === "function" && typeof cart !== "undefined") setQty(id, (cart[id] || 0) + 1);
      else { const c = load("ogogo-cart", {}); c[id] = (c[id] || 0) + 1; save("ogogo-cart", c); }
      add.textContent = "✓"; add.classList.add("done");
    }
  });
  sheet.querySelector(".ai-close").addEventListener("click", close);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.classList.contains("open")) close(); });
  sheet.querySelector("#aiForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = sheet.querySelector("#aiInput");
    ask(inp.value); inp.value = "";
  });

  // ---------- AI-підсумок товару (сторінка товару) ----------
  window.aiSummary = function (p) {
    const d = (typeof details !== "undefined" && details[p.id]) || { specs: {}, desc: "" };
    const pros = [];
    if (p.old) pros.push(T(`Зараз −${discount(p)}%: економія ${money(p.old - p.price)}`, `−${discount(p)}% right now: save ${money(p.old - p.price)}`));
    if (p.reviews && p.rating >= 4.7) pros.push(T(`Покупці в захваті: ${p.rating.toFixed(1)} з 5 (${p.reviews} відгуків)`, `Shoppers love it: ${p.rating.toFixed(1)}/5 (${p.reviews} reviews)`));
    else if (p.reviews) pros.push(T(`Добрий рейтинг: ${p.rating.toFixed(1)} з 5`, `Good rating: ${p.rating.toFixed(1)}/5`));
    if (p.hit) pros.push(T("Один із хітів продажу", "One of our best sellers"));
    if (p.isNew) pros.push(T("Новинка в асортименті", "New in the range"));
    const spec = Object.entries(d.specs).slice(0, 2).map(([k, v]) => `${typeof tr === "function" ? tr(k) : k}: ${typeof tr === "function" ? tr(v) : v}`);
    if (spec.length) pros.push(spec.join(" · "));
    const cat = catById(p.cat);
    const fit = {
      home: T("для затишку вдома й на подарунок", "for a cosy home or as a gift"),
      kitchen: T("для щоденного приготування", "for everyday cooking"),
      clean: T("для швидкого прибирання", "for quick cleaning"),
      beauty: T("для щоденного догляду всієї родини", "for the whole family's daily care"),
      kids: T("для дітей і на подарунок", "for kids and as a gift"),
      office: T("для школи й навчання", "for school and study"),
      garden: T("для дачі, городу чи балкона", "for the garden or balcony"),
      pets: T("для вашого улюбленця", "for your pet"),
      tools: T("для дрібного ремонту вдома", "for small home repairs"),
      season: T("для святкового настрою", "for a festive mood"),
    }[p.cat];
    const lead = T(`Коротко: «${name(p)}» — ${fit}.`, `In short: “${name(p)}” — ${fit}.`);
    const note = p.price >= FREE_DELIVERY_FROM
      ? T("Доставка буде безкоштовною.", "Delivery will be free.")
      : T(`Додайте товарів ще на ${money(FREE_DELIVERY_FROM - p.price)} — і доставка буде безкоштовною.`, `Add ${money(FREE_DELIVERY_FROM - p.price)} more for free delivery.`);
    return `
      <div class="ai-sum" translate="no">
        <div class="ai-sum-head"><span class="ai-avatar sm">${sparkle()}</span><b>${T("AI-підсумок", "AI summary")}</b><span class="ai-tag">${T("демо", "demo")}</span></div>
        <p class="ai-sum-lead">${lead}</p>
        <ul>${pros.map((x) => `<li>${x}</li>`).join("")}</ul>
        <p class="ai-sum-note">${note}</p>
        <div class="ai-sum-foot">
          <small>${T(`Згенеровано з ${p.reviews ? `${p.reviews} відгуків і ` : ""}характеристик · ${catName(cat)}`, `Generated from ${p.reviews ? `${p.reviews} reviews and ` : ""}specs · ${catName(cat)}`)}</small>
          <button class="ai-ask" data-ai>${T("Запитати помічника", "Ask the assistant")}</button>
        </div>
      </div>`;
  };
})();
