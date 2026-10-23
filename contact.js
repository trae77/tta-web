// Quote form -> booking.ttawebdev.com/contact (Turnstile protected, emails tta.dev.web@gmail.com)
(function () {
  var API = "https://booking.ttawebdev.com/contact", SITEKEY = "0x4AAAAAAFh5dVP0HqGzfQ4T";
  var f = document.getElementById("quote-form"); if (!f) return;
  var st = document.getElementById("q-status"), btn = f.querySelector("button[type=submit]"), tsId = null;
  window.ttaQuoteTs = function () { if (window.turnstile && tsId === null) tsId = turnstile.render("#q-ts", { sitekey: SITEKEY, theme: "auto" }); };
  if (window.turnstile) window.ttaQuoteTs();
  function say(msg, ok) { st.textContent = msg; st.className = "qstatus " + (ok ? "ok" : "err"); }
  function bad(el, msg) { el.setAttribute("aria-invalid", "true"); el.focus(); say(msg, false); return false; }
  function check() {
    [].forEach.call(f.querySelectorAll("[aria-invalid]"), function (e) { e.removeAttribute("aria-invalid"); });
    if (f.name.value.trim().length < 2) return bad(f.name, "Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) return bad(f.email, "Enter a valid email.");
    var d = f.phone.value.replace(/\D/g, ""); if (f.phone.value.trim() && (d.length < 10 || d.length > 15)) return bad(f.phone, "Enter a valid phone number, or leave it blank.");
    if (f.message.value.trim().length < 5) return bad(f.message, "Tell us a little about what you need.");
    return true;
  }
  f.addEventListener("submit", function (e) {
    e.preventDefault(); if (!check()) return;
    var tok = window.turnstile && tsId !== null ? turnstile.getResponse(tsId) : "";
    if (!tok) { say("Please complete the human check, then press Send.", false); return; }
    btn.disabled = true; say("Sending...", true);
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.name.value, email: f.email.value, phone: f.phone.value, business: f.business.value, message: f.message.value, website: f.website.value, turnstile: tok }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) {
        if (x.ok && x.j.ok) { f.reset(); say("Thanks! Your request was sent. We'll reply within one business day.", true); }
        else { if (x.j.field && f[x.j.field]) f[x.j.field].setAttribute("aria-invalid", "true"); say(x.j.error || "Something went wrong. Please email tta.dev.web@gmail.com or call 720-477-8603.", false); }
      })
      .catch(function () { say("Couldn't reach the server. Please email tta.dev.web@gmail.com or call 720-477-8603.", false); })
      .then(function () { btn.disabled = false; if (window.turnstile && tsId !== null) turnstile.reset(tsId); });
  });
})();
