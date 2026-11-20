// ================= Вікно пошуку =================
// Порожній стан: історія, категорії, популярні товари, крос-сел.
// Під час набору: підказки, категорії й товари. Телефон — на весь екран, комп'ютер — під полем.

(function () {
  const input = document.getElementById("searchInput");
  const form = document.getElementById("searchForm");
  if (!input || !form) return;
  const EN = typeof LANG !== "undefined" && LANG === "en";
  const T = (uk, en) => (EN ? en : uk);
  const nm = (p) => (typeof tr === "function" ? tr(p.name) : p.name);
  const cn = (c) => (typeof tr === "function" ? tr(c.name) : c.name);
  const isHome = !!document.getElementById("productGrid");
  const mq = window.matchMedia("(max-width: 760px)");

  // ---------- Історія й переглянуте ----------
  const getHist = () => load("ogogo-search", []);
  const pushHist = (q) => { q = q.trim(); if (!q) return; save("ogogo-search", [q, ...getHist().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6)); };
  const pid = Number(new URLSearchParams(location.search).get("id"));
  if (/product\.html/.test(location.pathname) && byId(pid)) save("ogogo-viewed", [pid, ...load("ogogo-viewed", []).filter((x) => x !== pid)].slice(0, 8));

  // ---------- Розмітка ----------
  const panel = document.createElement("div");
  panel.className = "sx";
  panel.id = "searchPanel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="sx-top">
      <button class="sx-back" type="button" aria-label="${T("Назад", "Back")}"><svg><use href="#i-chevron-left"/></svg></button>
      <form class="sx-field" role="search">
        <svg class="sx-ic"><use href="#i-search"/></svg>
        <input type="search" class="sx-input" placeholder="${T("Я шукаю…", "I'm looking for…")}" autocomplete="off" aria-label="${T("Пошук товарів", "Search products")}">
      </form>
    </div>
    <div class="sx-body" id="sxBody"></div>`;
  const shade = document.createElement("div");
  shade.className = "sx-shade";
  shade.hidden = true;
  document.body.append(shade, panel);
  const body = panel.querySelector("#sxBody");
  const pin = panel.querySelector(".sx-input");

  const thumb = (p) => `<img src="${imgSrc(p)}" alt="" loading="lazy">`;
  const priceHtml = (p) => `<b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ""}`;

  function miniCard(p) {
    return `<a class="sx-card" href="${productUrl(p)}">
      <span class="sx-card-img">${thumb(p)}${p.old ? `<em>−${discount(p)}%</em>` : ""}</span>
      <span class="sx-card-name">${nm(p)}</span>
      <span class="sx-card-price">${priceHtml(p)}</span>
    </a>`;
  }

  const COMPLEMENT = {
    kitchen: ["clean", "home"], clean: ["kitchen", "beauty"], home: ["season", "beauty"], beauty: ["clean", "home"],
    kids: ["office", "season"], office: ["kids"], garden: ["tools"], tools: ["garden"], pets: ["home"], season: ["home", "kids"],
  };
  function crossSell() {
    const cart = load("ogogo-cart", {});
    const inCart = Object.keys(cart).map(byId).filter(Boolean);
    const viewed = load("ogogo-viewed", []).map(byId).filter(Boolean);
    const base = inCart.length ? inCart : viewed;
    if (!base.length) return { title: T("Вам може сподобатись", "You may also like"), list: products.filter((p) => p.old).sort((a, b) => discount(b) - discount(a)).slice(0, 6) };
    const cats = new Set(base.flatMap((p) => COMPLEMENT[p.cat] || []));
    const skip = new Set(base.map((p) => p.id));
    let list = products.filter((p) => cats.has(p.cat) && !skip.has(p.id) && !cart[p.id]);
    if (list.length < 4) list = list.concat(products.filter((p) => !skip.has(p.id) && !cart[p.id] && !list.includes(p)));
    return {
      title: inCart.length ? T("До вашого кошика пасує", "Goes well with your cart") : T("Разом із переглянутим купують", "Often bought with what you viewed"),
      list: list.sort((a, b) => b.rating - a.rating).slice(0, 6),
    };
  }

  function renderEmpty() {
    const hist = getHist();
    const popular = products.filter((p) => p.hit).concat(products.filter((p) => !p.hit).sort((a, b) => b.reviews - a.reviews)).slice(0, 8);
    const xs = crossSell();
    body.innerHTML = `
      ${hist.length ? `<section class="sx-sec">
        <div class="sx-head"><h3>${T("Історія пошуку", "Search history")}</h3><button type="button" class="sx-clear">${T("Очистити", "Clear")}</button></div>
        <div class="sx-hist">${hist.map((q) => `<button type="button" class="sx-chip" data-q="${q.replace(/"/g, "&quot;")}"><svg><use href="#i-search"/></svg><span translate="no">${q}</span></button>`).join("")}</div>
      </section>` : ""}
      <section class="sx-sec">
        <div class="sx-head"><h3>${T("Категорії", "Categories")}</h3></div>
        <div class="sx-cats">${categories.map((c) => {
          const p = products.find((x) => x.cat === c.id);
          return `<a class="sx-cat" href="index.html?cat=${c.id}" data-sx-cat="${c.id}"><span class="sx-cat-img">${p ? thumb(p) : c.icon}</span><span>${cn(c)}</span></a>`;
        }).join("")}</div>
      </section>
      <section class="sx-sec">
        <div class="sx-head"><h3>${T("Популярне зараз", "Popular right now")}</h3></div>
        <div class="sx-pop">${popular.map((p) => `<a class="sx-pop-chip" href="${productUrl(p)}"><span class="sx-pop-img">${thumb(p)}</span><span>${nm(p)}</span></a>`).join("")}</div>
      </section>
      <section class="sx-sec">
        <div class="sx-head"><h3>${xs.title}</h3></div>
        <div class="sx-row">${xs.list.map(miniCard).join("")}</div>
      </section>`;
  }

  function renderResults(q) {
    const ql = q.toLowerCase().trim();
    const words = ql.split(/\s+/).filter(Boolean);
    const match = (s) => words.every((w) => s.toLowerCase().includes(w));
    const prods = products.filter((p) => match(p.name + " " + nm(p) + " " + cn(catById(p.cat))));
    const cats = categories.filter((c) => match(c.name + " " + cn(c)));
    const sugg = [...new Set(prods.map((p) => nm(p).split(",")[0]))].slice(0, 4);
    if (!prods.length && !cats.length) {
      body.innerHTML = `<div class="sx-empty"><b>${T("Нічого не знайшли", "Nothing found")} 😕</b><span>${T("Спробуйте інше слово або подивіться популярне:", "Try another word or check what's popular:")}</span></div>
        <div class="sx-row">${products.filter((p) => p.hit).map(miniCard).join("")}</div>`;
      return;
    }
    body.innerHTML = `
      <ul class="sx-sugg">${sugg.map((s) => `<li><button type="button" data-q="${s.replace(/"/g, "&quot;")}"><svg><use href="#i-search"/></svg><span>${s}</span><svg class="sx-arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></li>`).join("")}
        ${cats.map((c) => `<li><a href="index.html?cat=${c.id}" data-sx-cat="${c.id}"><svg><use href="#i-grid"/></svg><span>${cn(c)}</span><small>${T("Категорія", "Category")}</small></a></li>`).join("")}</ul>
      ${prods.length ? `<section class="sx-sec">
        <div class="sx-head"><h3>${T("Товари", "Products")}</h3><span class="sx-count">${prods.length}</span></div>
        <div class="sx-list">${prods.slice(0, 6).map((p) => `<a class="sx-item" href="${productUrl(p)}"><span class="sx-item-img">${thumb(p)}</span><span class="sx-item-name">${nm(p)}</span><span class="sx-item-price">${priceHtml(p)}</span></a>`).join("")}</div>
        <button type="button" class="btn btn-brand btn-block sx-all" data-q="${q.replace(/"/g, "&quot;")}">${T(`Показати всі результати (${prods.length})`, `Show all results (${prods.length})`)}</button>
      </section>` : ""}`;
  }

  const current = () => (mq.matches ? pin.value : input.value);
  const render = () => (current().trim() ? renderResults(current()) : renderEmpty());

  // ---------- Відкрити / закрити ----------
  function place() {
    if (mq.matches) { panel.style.cssText = ""; return; }
    const r = form.getBoundingClientRect();
    const w = Math.max(r.width, 560);
    panel.style.top = r.bottom + 8 + "px";
    panel.style.left = Math.min(r.left, innerWidth - w - 16) + "px";
    panel.style.width = w + "px";
  }
  function open() {
    if (!panel.hidden) return;
    panel.hidden = false; shade.hidden = false;
    document.body.classList.add("sx-open");
    if (mq.matches) { pin.value = input.value; document.body.classList.add("locked"); setTimeout(() => pin.focus(), 30); }
    place(); render();
  }
  function close() {
    panel.hidden = true; shade.hidden = true;
    document.body.classList.remove("sx-open", "locked");
  }
  function go(q) {
    q = q.trim();
    if (!q) return;
    pushHist(q);
    close();
    if (isHome) { input.value = q; input.dispatchEvent(new Event("input", { bubbles: true })); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true })); }
    else location.href = `index.html?q=${encodeURIComponent(q)}`;
  }

  input.addEventListener("focus", open);
  input.addEventListener("click", open);
  input.addEventListener("input", () => { if (!mq.matches) render(); });
  pin.addEventListener("input", render);
  form.addEventListener("submit", (e) => { if (!panel.hidden || !isHome) { pushHist(input.value); } close(); }, true);
  panel.querySelector(".sx-field").addEventListener("submit", (e) => { e.preventDefault(); go(pin.value); });
  panel.querySelector(".sx-back").addEventListener("click", close);
  shade.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { close(); input.blur(); } });
  document.addEventListener("click", (e) => {
    if (panel.hidden || mq.matches) return; // на телефоні закриваємо кнопкою «Назад»
    if (!e.target.closest("#searchPanel, #searchForm")) close();
  });
  window.addEventListener("resize", () => { if (!panel.hidden) place(); });
  window.addEventListener("scroll", () => { if (!panel.hidden && !mq.matches) place(); }, { passive: true });

  body.addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]");
    if (q) { e.preventDefault(); go(q.dataset.q); return; }
    if (e.target.closest(".sx-clear")) { save("ogogo-search", []); renderEmpty(); return; }
    const c = e.target.closest("[data-sx-cat]");
    if (c && isHome && typeof goToCategory === "function") { e.preventDefault(); close(); input.value = ""; goToCategory(c.dataset.sxCat); }
  });
})();
