// ================= Футер: підписка на новини =================
(function () {
  const form = document.getElementById("footerSub");
  if (!form) return;
  const en = typeof LANG !== "undefined" && LANG === "en";
  const msg = document.getElementById("fsubMsg");
  const show = (text, ok) => { msg.textContent = text; msg.classList.toggle("ok", ok); msg.classList.toggle("err", !ok); };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("fsubEmail").value.trim();
    const agree = document.getElementById("fsubAgree").checked;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return show(en ? "Please enter a valid email" : "Введіть коректний email", false);
    if (!agree) return show(en ? "Please accept the privacy policy" : "Погодьтеся з політикою конфіденційності", false);
    try { localStorage.setItem("ogogo-sub", email); } catch (err) {}
    form.reset();
    show(en ? "You're subscribed! This is a demo — no emails are sent 🙂" : "Ви підписані! Це демо — листи не надсилаються 🙂", true);
  });
  // «Застосунок з'явиться згодом» на сторінках, де немає власного обробника
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".footer [data-soon]");
    if (!t) return;
    e.preventDefault();
    if (typeof toast === "function") toast(en ? "The app is coming soon 🙂" : t.dataset.soon);
  });
})();
