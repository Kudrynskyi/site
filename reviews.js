// ================= Відгуки на сторінці товару =================
// Демо-відгуки генеруються детерміновано з id товару; власні відгуки — в localStorage («ogogo-reviews»).

(function () {
  const NAMES = ["Олена К.", "Андрій М.", "Ірина С.", "Тарас П.", "Марія Л.", "Дмитро В.", "Світлана Г.", "Олег Р.", "Наталія Б.", "Юрій Т.", "Катерина Д.", "Василь Н.", "Оксана Ф.", "Богдан Ш."];
  const TEXTS = {
    5: ["Чудова якість за свої гроші, рекомендую!", "Беру вже вдруге — усе як в описі.", "Забрала в магазині того ж дня, дуже зручно.", "Перевершило очікування, вживу виглядає ще краще.", "Користуюсь щодня, жодних нарікань.", "Купили на подарунок — усі в захваті."],
    4: ["Загалом задоволений, але упаковка могла б бути кращою.", "Добре співвідношення ціни та якості.", "Хороший товар, трохи менший, ніж здавалося на фото.", "Усе добре, єдине — хотілося б більше кольорів."],
    3: ["Нормально, але очікував більшого.", "За акційною ціною — ок, за повною не взяв би.", "Свою функцію виконує, без вау-ефекту."],
    2: ["Якість так собі, швидко втратило вигляд.", "Не зовсім те, що в описі."],
    1: ["Не підійшло, повернув без проблем — дякую магазину.", "Розчарований, на жаль."],
  };
  const MONTHS = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];

  const mine = () => load("ogogo-reviews", {});
  const fmtDate = (t) => { const d = new Date(t); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

  function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

  function dist(p) {
    const w = [1, 2, 3, 4, 5].map((k) => Math.exp(-((k - p.rating) ** 2) / 0.9));
    const sum = w.reduce((a, b) => a + b, 0);
    return w.map((x) => x / sum);
  }

  function demo(p) {
    if (!p.reviews) return [];
    const r = rng(p.id * 7 + 3), w = dist(p), n = Math.min(p.reviews, 18), now = Date.now();
    const out = [];
    for (let i = 0; i < n; i++) {
      let x = r(), k = 0; while (k < 4 && x > w[k]) { x -= w[k]; k++; }
      const rating = k + 1, pool = TEXTS[rating];
      out.push({ id: `d${i}`, name: NAMES[Math.floor(r() * NAMES.length)], rating, text: pool[Math.floor(r() * pool.length)],
        date: now - Math.floor((i * 6 + r() * 6 + 1) * 86400000), helpful: Math.floor(r() * 30), verified: r() > 0.25 });
    }
    return out;
  }

  let P, all = [], filter = 0, sort = "new", shown = 4;
  const voted = new Set();

  function summary() {
    const own = mine()[P.id] || [];
    const total = P.reviews + own.length;
    const avg = total ? (P.rating * P.reviews + own.reduce((a, x) => a + x.rating, 0)) / total : 0;
    const w = dist(P);
    const counts = [1, 2, 3, 4, 5].map((k, i) => Math.round(w[i] * P.reviews) + own.filter((x) => x.rating === k).length);
    return { total, avg, counts };
  }

  function starRow(n) { return `<span class="stars rv-stars" aria-label="Оцінка ${n} з 5">${[1, 2, 3, 4, 5].map((i) => `<svg class="${i <= n ? "on" : ""}"><use href="#i-star"/></svg>`).join("")}</span>`; }

  function render() {
    const box = document.getElementById("pdpReviews");
    if (!box) return;
    const own = (mine()[P.id] || []).map((x) => ({ ...x, mine: true, verified: false }));
    all = own.concat(demo(P));
    const { total, avg, counts } = summary();
    const title = document.querySelector("#reviews .section-title");
    if (title) title.innerHTML = `Відгуки${total ? ` <span class="rv-count">${total}</span>` : ""}`;

    if (!total) {
      box.innerHTML = `<div class="rv-empty"><p>Відгуків ще немає. Будьте першим!</p><button class="btn btn-brand" data-rv-write>Залишити відгук</button></div>`;
      return;
    }
    let list = all.filter((x) => !filter || (filter === 3 ? x.rating <= 3 : x.rating === filter));
    if (sort === "new") list.sort((a, b) => b.date - a.date);
    if (sort === "useful") list.sort((a, b) => b.helpful - a.helpful);
    if (sort === "high") list.sort((a, b) => b.rating - a.rating || b.date - a.date);
    if (sort === "low") list.sort((a, b) => a.rating - b.rating || b.date - a.date);
    const max = Math.max(...counts, 1);
    const chip = (v, label) => `<button type="button" class="rv-chip${filter === v ? " on" : ""}" data-rv-filter="${v}">${label}</button>`;

    box.innerHTML = `
      <div class="rv-layout">
        <aside class="rv-sum">
          <div class="rv-big"><b>${avg.toFixed(1)}</b><div>${starRow(Math.round(avg))}<small>${total} ${plural(total, "відгук", "відгуки", "відгуків")}</small></div></div>
          <div class="rv-bars">${[5, 4, 3, 2, 1].map((k) => `<button type="button" class="rv-bar" data-rv-filter="${k}"><span>${k}</span><svg><use href="#i-star"/></svg><i><em style="width:${(counts[k - 1] / max) * 100}%"></em></i><small>${counts[k - 1]}</small></button>`).join("")}</div>
          <button class="btn btn-brand rv-write" data-rv-write>Залишити відгук</button>
        </aside>
        <div class="rv-main">
          <div class="rv-tools">
            <div class="rv-chips">${chip(0, "Усі")}${chip(5, "5 ★")}${chip(4, "4 ★")}${chip(3, "3 ★ і нижче")}</div>
            <label class="sort-box"><svg><use href="#i-sort"/></svg><select id="rvSort" aria-label="Сортування відгуків">
              <option value="new" ${sort === "new" ? "selected" : ""}>Спочатку нові</option>
              <option value="useful" ${sort === "useful" ? "selected" : ""}>Найкорисніші</option>
              <option value="high" ${sort === "high" ? "selected" : ""}>Високі оцінки</option>
              <option value="low" ${sort === "low" ? "selected" : ""}>Низькі оцінки</option>
            </select></label>
          </div>
          ${list.length ? `<ul class="rv-list">${list.slice(0, shown).map((x) => `
            <li class="rv-item">
              <div class="rv-head"><span class="rv-ava">${x.name[0]}</span><div><b translate="no">${x.name}</b><small>${fmtDate(x.date)}</small></div>${x.verified ? `<span class="rv-ver">Купив(ла) в Огого</span>` : x.mine ? `<span class="rv-ver rv-mine">Ваш відгук</span>` : ""}</div>
              ${starRow(x.rating)}
              <p>${x.text.replace(/</g, "&lt;")}</p>
              ${x.mine ? "" : `<button type="button" class="rv-help${voted.has(x.id) ? " on" : ""}" data-rv-help="${x.id}">Корисно · ${x.helpful + (voted.has(x.id) ? 1 : 0)}</button>`}
            </li>`).join("")}</ul>` : `<p class="muted rv-none">Немає відгуків з такою оцінкою</p>`}
          ${list.length > shown ? `<button class="btn btn-ghost rv-more" data-rv-more>Показати ще ${Math.min(6, list.length - shown)}</button>` : ""}
        </div>
      </div>`;
    document.getElementById("rvSort").addEventListener("change", (e) => { sort = e.target.value; shown = 4; render(); });
  }

  // ---------- Форма ----------
  let pick = 0;
  function openForm() {
    const m = document.getElementById("reviewModal");
    pick = 0;
    m.querySelector("#rvName").value = (load("ogogo-checkout", {}).name || "").trim();
    m.querySelector("#rvText").value = "";
    m.querySelector(".rv-err").textContent = "";
    paintPick();
    m.querySelector(".rv-prod").innerHTML = `<img src="${imgSrc(P)}" alt=""><span>${P.name}</span>`;
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.getElementById("overlay").hidden = false; document.body.classList.add("locked");
  }
  function paintPick() {
    const labels = ["", "Жахливо", "Погано", "Нормально", "Добре", "Чудово"];
    document.querySelectorAll("#rvPick button").forEach((b) => b.classList.toggle("on", Number(b.dataset.rvPick) <= pick));
    document.getElementById("rvPickLabel").textContent = pick ? labels[pick] : "Оберіть оцінку";
  }
  function submit() {
    const m = document.getElementById("reviewModal");
    const name = m.querySelector("#rvName").value.trim() || "Покупець";
    const text = m.querySelector("#rvText").value.trim();
    const err = m.querySelector(".rv-err");
    if (!pick) { err.textContent = "Поставте оцінку від 1 до 5"; return; }
    if (text.length < 10) { err.textContent = "Напишіть хоча б кілька слів (від 10 символів)"; return; }
    const all = mine(); (all[P.id] = all[P.id] || []).unshift({ id: `m${Date.now()}`, name, rating: pick, text, date: Date.now(), helpful: 0 });
    save("ogogo-reviews", all);
    filter = 0; sort = "new"; shown = 4;
    if (typeof closeAll === "function") closeAll();
    render();
    if (typeof toast === "function") toast("Дякуємо! Відгук опубліковано ✓");
    document.getElementById("reviews").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-rv-filter],[data-rv-more],[data-rv-help],[data-rv-write],[data-rv-pick],[data-rv-submit],#pdpRating");
    if (!t || !P) return;
    const d = t.dataset;
    if (t.id === "pdpRating") { if (P.reviews) document.getElementById("reviews").scrollIntoView({ behavior: "smooth", block: "start" }); else openForm(); }
    else if (d.rvFilter !== undefined) { const v = Number(d.rvFilter); filter = !v || filter === v ? 0 : (v <= 2 ? 3 : v); shown = 4; render(); }
    else if ("rvMore" in d) { shown += 6; render(); }
    else if (d.rvHelp) { voted.has(d.rvHelp) ? voted.delete(d.rvHelp) : voted.add(d.rvHelp); render(); }
    else if ("rvWrite" in d) openForm();
    else if (d.rvPick) { pick = Number(d.rvPick); paintPick(); document.querySelector("#reviewModal .rv-err").textContent = ""; }
    else if ("rvSubmit" in d) submit();
  });

  window.renderReviews = function (p) {
    P = p; render();
    if (location.hash === "#reviews") requestAnimationFrame(() => document.getElementById("reviews").scrollIntoView({ block: "start" }));
  };
})();
