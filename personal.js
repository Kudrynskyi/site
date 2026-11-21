// ================= Персоналізація головної =================
// Сигнали (лише в цьому браузері): переглянуті товари, обране, кошик, пошук, відкриті категорії.
// З них рахуємо інтерес до категорій → порядок категорій, «Для вас», «Нещодавно переглянуте».

(function () {
  const strip = document.getElementById("pzStrip");
  if (!strip) return;

  // запам'ятовуємо відкриті категорії
  if (typeof goToCategory === "function") {
    const orig = goToCategory;
    window.goToCategory = goToCategory = function (id) {
      const a = load("ogogo-cats", {}); a[id] = (a[id] || 0) + 1; save("ogogo-cats", a);
      return orig(id);
    };
  }

  const name = (p) => p.name;
  function signals() {
    const viewed = load("ogogo-viewed", []).map(byId).filter(Boolean);
    const wish = load("ogogo-wish", []).map(byId).filter(Boolean);
    const cart = load("ogogo-cart", {});
    const inCart = Object.keys(cart).map(byId).filter(Boolean);
    const searches = load("ogogo-search", []);
    const cats = load("ogogo-cats", {});
    return { viewed, wish, cart, inCart, searches, cats };
  }

  function affinity(s) {
    const score = {};
    const add = (c, w) => (score[c] = (score[c] || 0) + w);
    s.viewed.forEach((p, i) => add(p.cat, 3 - Math.min(i, 2) * 0.5));
    s.wish.forEach((p) => add(p.cat, 4));
    s.inCart.forEach((p) => add(p.cat, 5));
    Object.entries(s.cats).forEach(([c, n]) => add(c, Math.min(n, 3) * 2));
    s.searches.forEach((q) => products.forEach((p) => { if (p.name.toLowerCase().includes(q.toLowerCase().slice(0, 4))) add(p.cat, 1.5); }));
    return score;
  }

  const PAIRS = { kitchen: ["clean", "home"], clean: ["kitchen", "beauty"], home: ["season", "beauty"], beauty: ["clean", "home"], kids: ["office", "season"], office: ["kids"], garden: ["tools"], tools: ["garden"], pets: ["home"], season: ["home", "kids"] };

  function picks(s, score) {
    const seen = new Set([...s.inCart.map((p) => p.id)]);
    const anchor = s.viewed[0] || s.wish[0] || s.inCart[0];
    const out = [];
    const push = (p, why) => { if (p && !seen.has(p.id)) { seen.add(p.id); out.push({ p, why }); } };
    // схожі на переглянуте (та сама категорія)
    s.viewed.slice(0, 3).forEach((v) => products.filter((p) => p.cat === v.cat && p.id !== v.id).forEach((p) => push(p, `Схоже на «${name(v)}»`)));
    // обране: знижки на збережене
    s.wish.filter((p) => p.old).forEach((p) => push(p, "З обраного — зараз зі знижкою"));
    // доповнення до кошика
    s.inCart.forEach((c) => (PAIRS[c.cat] || []).forEach((cat) => products.filter((p) => p.cat === cat).sort((a, b) => b.rating - a.rating).slice(0, 2).forEach((p) => push(p, `Пасує до «${name(c)}»`))));
    // улюблені категорії
    Object.entries(score).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([cat]) =>
      products.filter((p) => p.cat === cat).sort((a, b) => discount(b) - discount(a)).forEach((p) => push(p, `Бо вам цікаві «${catById(cat).name}»`)));
    // заповнити популярним
    products.filter((p) => p.hit).concat(products.slice().sort((a, b) => b.reviews - a.reviews)).forEach((p) => push(p, "Популярне зараз"));
    return { list: out.slice(0, 10), anchor };
  }

  function pcard({ p, why }) {
    return `<div class="pz-item">${productCard(p)}<p class="pz-why"><svg viewBox="0 0 24 24"><path d="M12 2.5l1.9 5.4 5.6 1.6-5.6 1.7L12 16.5l-1.9-5.3-5.6-1.7 5.6-1.6Z" fill="currentColor"/></svg>${why}</p></div>`;
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 5 ? "Доброї ночі" : h < 12 ? "Доброго ранку" : h < 18 ? "Добрий день" : "Добрий вечір";
  }

  function render() {
    const s = signals();
    const score = affinity(s);
    const has = Object.keys(score).length > 0;
    const top = Object.entries(score).sort((a, b) => b[1] - a[1]).map(([c]) => c);

    // 1) привітання + швидкі категорії
    const name0 = (load("ogogo-checkout", {}).name || "").trim().split(/\s+/)[0];
    const quick = (has ? top : ["season", "kitchen", "home", "kids"]).slice(0, 4).map(catById).filter(Boolean);
    strip.innerHTML = `
      <div class="pz-hello">
        <div><h2>${greeting()}${name0 ? `, <span translate="no">${name0}</span>` : ""}!</h2>
          <p>${has ? "Ми підібрали товари й категорії на основі ваших переглядів і покупок" : "Переглядайте товари — і ми підберемо добірку саме для вас"}</p></div>
        <div class="pz-quick">${quick.map((c) => { const p = products.find((x) => x.cat === c.id); return `<button type="button" class="pz-chip" data-cat-go="${c.id}"><img src="${imgSrc(p)}" alt="">${c.name}</button>`; }).join("")}</div>
      </div>`;

    // 2) персональний порядок категорій
    const list = document.getElementById("categoryList");
    if (list && has) {
      const tiles = [...list.children];
      tiles.sort((a, b) => (score[b.dataset.catGo] || 0) - (score[a.dataset.catGo] || 0));
      tiles.forEach((t, i) => { list.appendChild(t); t.classList.toggle("pz-top", i < 3 && score[t.dataset.catGo] > 0); });
      const title = list.parentElement.querySelector(".section-title");
      if (title) title.textContent = "Категорії для вас";
    }

    // 3) «Для вас»
    const { list: rec } = picks(s, score);
    document.getElementById("pzFor").innerHTML = `
      <div class="pz-head"><h2 class="section-title">${has ? "Рекомендуємо для вас" : "Популярне зараз"}</h2>${has ? `<button type="button" class="pz-reset" data-pz-reset>Скинути рекомендації</button>` : ""}</div>
      <div class="scroller pz-row">${rec.map(pcard).join("")}</div>`;

    // 4) «Нещодавно переглянуте»
    const rv = document.getElementById("pzRecent");
    rv.hidden = s.viewed.length === 0;
    rv.innerHTML = s.viewed.length ? `
      <div class="pz-head"><h2 class="section-title">Нещодавно переглянуте</h2><button type="button" class="pz-reset" data-pz-clear-viewed>Очистити</button></div>
      <div class="scroller pz-recent">${s.viewed.slice(0, 8).map((p) => `
        <a class="pz-mini" href="${productUrl(p)}"><span class="pz-mini-img"><img src="${imgSrc(p)}" alt="">${p.old ? `<em>−${discount(p)}%</em>` : ""}</span><span class="pz-mini-name">${p.name}</span><b>${money(p.price)}</b></a>`).join("")}</div>` : "";
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-pz-reset]")) { ["ogogo-viewed", "ogogo-cats", "ogogo-search"].forEach((k) => save(k, k === "ogogo-cats" ? {} : [])); render(); if (typeof toast === "function") toast("Рекомендації скинуто"); return; }
    if (e.target.closest("[data-pz-clear-viewed]")) { save("ogogo-viewed", []); render(); return; }
    // після дій у картках — оновити добірку (кошик/обране змінились)
    if (e.target.closest("#pzFor [data-quick-add], #pzFor [data-add], #pzFor [data-inc], #pzFor [data-dec], #pzFor [data-wish]")) setTimeout(render, 0);
  });
  window.addEventListener("storage", render);
  render();
})();
