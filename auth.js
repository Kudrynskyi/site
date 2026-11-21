// ================= Авторизація (демо) =================
// Вхід за номером телефону + SMS-код. Демо-код: 1234. Користувач — у localStorage «ogogo-user».

(function () {
  const KEY = "ogogo-user";
  const user = () => { const u = load(KEY, null); return u && u.phone ? u : null; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (d) => `+380 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`.trim();

  let step = "phone", digits = "", timer = null, left = 0, after = null;

  const root = document.createElement("div");
  root.className = "auth";
  root.hidden = true;
  root.innerHTML = `<div class="auth-backdrop" data-auth-close></div>
    <section class="auth-box" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <button type="button" class="auth-x" data-auth-close aria-label="Закрити"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg></button>
      <div class="auth-body"></div>
    </section>`;
  document.body.appendChild(root);
  const body = root.querySelector(".auth-body");

  function view() {
    clearInterval(timer);
    if (step === "phone") {
      body.innerHTML = `
        <div class="auth-badge" aria-hidden="true">%</div>
        <h2 id="authTitle">Вхід або реєстрація</h2>
        <p class="auth-sub">Персональні ціни, бонуси й історія замовлень — в одному акаунті</p>
        <label class="auth-field"><span>Номер телефону</span>
          <div class="auth-phone"><b translate="no">+380</b><input id="authPhone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="__ ___ __ __" maxlength="12" value="${digits ? fmt(digits).slice(5) : ""}"></div>
        </label>
        <p class="auth-err" role="alert"></p>
        <button type="button" class="btn btn-brand auth-go" data-auth-send>Отримати код</button>
        <p class="auth-fine">Продовжуючи, ви погоджуєтесь з умовами програми лояльності</p>`;
      const inp = body.querySelector("#authPhone");
      inp.addEventListener("input", () => {
        let d = inp.value.replace(/\D/g, "");
        if (d.startsWith("380")) d = d.slice(3); else if (d.startsWith("0")) d = d.slice(1);
        d = d.slice(0, 9);
        inp.value = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
        digits = d; err("");
      });
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
      setTimeout(() => inp.focus(), 50);
    } else if (step === "code") {
      body.innerHTML = `
        <button type="button" class="auth-back" data-auth-back>← Змінити номер</button>
        <h2 id="authTitle">Введіть код з SMS</h2>
        <p class="auth-sub">Надіслали на <b translate="no">${fmt(digits)}</b></p>
        <input id="authCode" class="auth-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" placeholder="••••" aria-label="Код з SMS">
        <p class="auth-hint">Демо-режим: код <b translate="no">1234</b></p>
        <p class="auth-err" role="alert"></p>
        <button type="button" class="auth-resend" data-auth-resend disabled></button>`;
      const inp = body.querySelector("#authCode");
      inp.addEventListener("input", () => { inp.value = inp.value.replace(/\D/g, "").slice(0, 4); if (inp.value.length === 4) check(inp.value); });
      left = 30; tick(); timer = setInterval(tick, 1000);
      setTimeout(() => inp.focus(), 50);
    } else if (step === "name") {
      body.innerHTML = `
        <div class="auth-badge ok" aria-hidden="true">✓</div>
        <h2 id="authTitle">Як до вас звертатися?</h2>
        <p class="auth-sub">Ім'я побачите в привітанні та на замовленнях</p>
        <label class="auth-field"><span>Ім'я</span><input id="authName" type="text" autocomplete="given-name" maxlength="30" placeholder="Наприклад, Олена" value="${esc((load("ogogo-checkout", {}).name || "").split(" ")[0])}"></label>
        <p class="auth-err" role="alert"></p>
        <button type="button" class="btn btn-brand auth-go" data-auth-finish>Готово</button>`;
      const inp = body.querySelector("#authName");
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") finish(); });
      setTimeout(() => inp.focus(), 50);
    }
  }

  function tick() {
    const b = body.querySelector("[data-auth-resend]");
    if (!b) return clearInterval(timer);
    if (left > 0) { b.disabled = true; b.textContent = `Надіслати ще раз через ${left} с`; left--; }
    else { b.disabled = false; b.textContent = "Надіслати код ще раз"; clearInterval(timer); }
  }
  const err = (m) => { const e = body.querySelector(".auth-err"); if (e) e.textContent = m; };

  function send() {
    if (digits.length !== 9) return err("Введіть 9 цифр номера після +380");
    step = "code"; view();
  }
  function check(code) {
    if (code !== "1234") { err("Невірний код. Спробуйте ще раз"); body.querySelector("#authCode").value = ""; return; }
    const known = load("ogogo-users", {})[digits];
    if (known) return done(known);
    step = "name"; view();
  }
  function finish() {
    const n = body.querySelector("#authName").value.trim();
    if (n.length < 2) return err("Вкажіть ім'я (від 2 літер)");
    const u = { phone: fmt(digits), name: n, since: Date.now() };
    const all = load("ogogo-users", {}); all[digits] = u; save("ogogo-users", all);
    done(u);
  }
  function done(u) {
    save(KEY, u);
    const co = load("ogogo-checkout", {});
    save("ogogo-checkout", { ...co, name: co.name || u.name, phone: co.phone || u.phone });
    close();
    if (typeof toast === "function") toast(`Вітаємо, ${u.name}! Персональні ціни увімкнено ✓`);
    changed();
    if (after) { const f = after; after = null; f(u); }
  }

  function open(cb) {
    after = typeof cb === "function" ? cb : null;
    step = "phone"; root.hidden = false; document.body.classList.add("locked"); view();
  }
  function close() { clearInterval(timer); root.hidden = true; if (!document.querySelector(".overlay:not([hidden])")) document.body.classList.remove("locked"); }
  function logout() { save(KEY, null); changed(); if (typeof toast === "function") toast("Ви вийшли з акаунту"); }

  // ---------- Відображення стану на сторінці ----------
  function paint() {
    const u = user();
    document.querySelectorAll('a.head-icon[href="profile.html"]').forEach((a) => {
      a.classList.toggle("authed", !!u);
      a.setAttribute("aria-label", u ? `Профіль: ${u.name}` : "Увійти в профіль");
      let i = a.querySelector(".head-ava");
      if (u) { if (!i) { i = document.createElement("span"); i.className = "head-ava"; i.setAttribute("translate", "no"); a.appendChild(i); } i.textContent = u.name[0].toUpperCase(); }
      else if (i) i.remove();
    });
    const hero = document.querySelector(".pf-hero");
    if (hero) {
      hero.querySelector(".pf-who").innerHTML = u
        ? `<b translate="no">${esc(u.name)}</b><small translate="no">${esc(u.phone)}</small>`
        : `<b>Гість</b><small>Увійдіть, щоб бачити замовлення, бонуси й персональні ціни</small>`;
      const av = hero.querySelector(".pf-avatar");
      av.innerHTML = u ? `<span translate="no">${esc(u.name[0].toUpperCase())}</span>` : `<span class="logo-o">О</span>`;
      av.classList.toggle("authed", !!u);
      const btn = hero.querySelector(".pf-login");
      btn.removeAttribute("data-soon");
      btn.toggleAttribute("data-login", !u); btn.toggleAttribute("data-logout", !!u);
      btn.className = u ? "btn btn-ghost pf-login" : "btn btn-brand pf-login";
      btn.textContent = u ? "Вийти" : "Увійти";
    }
  }
  function changed() { paint(); document.dispatchEvent(new CustomEvent("ogogo-auth", { detail: user() })); }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-auth-close]")) return close();
    if (e.target.closest("[data-auth-send]")) return send();
    if (e.target.closest("[data-auth-back]")) { step = "phone"; return view(); }
    if (e.target.closest("[data-auth-resend]")) { err(""); left = 30; tick(); timer = setInterval(tick, 1000); if (typeof toast === "function") toast("Код надіслано повторно"); return; }
    if (e.target.closest("[data-auth-finish]")) return finish();
    const l = e.target.closest("[data-login]");
    if (l) { e.preventDefault(); e.stopPropagation(); return open(); }
    if (e.target.closest("[data-logout]")) { e.preventDefault(); return logout(); }
  }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !root.hidden) close(); });
  window.addEventListener("storage", (e) => { if (e.key === KEY) changed(); });

  window.ogogoAuth = { user, open, logout };
  paint();
})();
