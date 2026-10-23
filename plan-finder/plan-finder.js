// 60-Second Growth & Plan Finder. Every price/link comes from window.PF_PRICES (generated from prices.json).
(function () {
  var P = window.PF_PRICES, API = "https://booking.ttawebdev.com/contact", SITEKEY = "0x4AAAAAAFh5dVP0HqGzfQ4T";
  var f = document.getElementById("pf"), err = document.getElementById("pf-err"), next = document.getElementById("pf-next"), back = document.getElementById("pf-back");
  var steps = [].slice.call(f.querySelectorAll("section[data-step]")), cur = 0, tsId = null;
  var $ = function (n) { return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  window.pfTs = function () { if (window.turnstile && tsId === null && !steps[4].hidden) tsId = turnstile.render("#pf-ts", { sitekey: SITEKEY }); };
  function val(n) { var e = f.querySelector('[name="' + n + '"]:checked'); return e ? e.value : ""; }
  function vals(n) { return [].map.call(f.querySelectorAll('[name="' + n + '"]:checked'), function (e) { return e.value; }); }
  function tierNum() { var t = 0; [].forEach.call(f.querySelectorAll('[name=pain]:checked'), function (e) { t = Math.max(t, +e.dataset.tier); }); if (!t && val("pages") === "multi") t = 1; return t; }
  function needsBot() { var t = 0; [].forEach.call(f.querySelectorAll('[name=pain]:checked'), function (e) { t = Math.max(t, +e.dataset.tier); }); return t >= 2; }
  function order() { return needsBot() ? [0, 1, 2, 3, 4] : [0, 1, 2, 4]; }
  f.querySelector('[name=tools][value=none]').addEventListener("change", function (e) { if (e.target.checked) [].forEach.call(f.querySelectorAll('[name=tools]:not([value=none])'), function (x) { x.checked = false; }); });
  [].forEach.call(f.querySelectorAll('[name=tools]:not([value=none])'), function (x) { x.addEventListener("change", function () { if (x.checked) f.querySelector('[name=tools][value=none]').checked = false; }); });
  function show(i) {
    cur = i; var o = order(), pos = o.indexOf(i);
    steps.forEach(function (s, k) { s.hidden = k !== i; });
    document.getElementById("pf-bar").style.width = ((pos + 1) / o.length * 100) + "%";
    document.getElementById("pf-stepno").textContent = "Step " + (pos + 1) + " of " + o.length;
    back.hidden = pos === 0; next.textContent = i === 4 ? "See my plan" : "Next"; err.textContent = "";
    if (i === 4) window.pfTs();
    window.scrollTo(0, 0);
  }
  function check(i) {
    var s = steps[i], bad = null;
    [].forEach.call(s.querySelectorAll("input[required]"), function (e) {
      if (bad) return;
      if (e.type === "radio") { if (!val(e.name)) bad = "Please pick an option for: " + e.closest("fieldset").querySelector("legend").textContent; }
      else if (e.value.trim().length < 2) bad = "Please fill in: " + (e.placeholder || e.closest("fieldset").querySelector("legend").textContent);
    });
    if (!bad && i === 4) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) bad = "Enter a valid email.";
      var d = f.phone.value.replace(/\D/g, ""); if (!bad && f.phone.value.trim() && (d.length < 10 || d.length > 15)) bad = "Enter a valid phone number, or leave it blank.";
    }
    err.textContent = bad || ""; return !bad;
  }
  function rec() {
    var keys = ["website", "getfound", "nml", "tg"], t = tierNum(), k = keys[t], p = P.plans[k];
    var own = val("site") === "own", once = val("pay") === "once", pre = val("pay") === "prepay", multi = val("pages") === "multi" || t > 0;
    var r = { key: k, plan: p, own: own, once: once, pre: pre, multi: multi, extras: [] };
    if (val("site") === "rescue") r.extras.push(t >= 1 ? ["Website rescue", "Waived on " + p.name, null] : (once ? ["Website rescue", $(P.rescue), P.rescueLink] : ["Website rescue (plan member)", $(P.rescuePlan), P.rescuePlanLink]));
    if (val("logo") === "no") r.extras.push(once ? ["Logo and brand kit", $(P.logo) + " (" + $(P.logoPlan) + " with Care or a plan)", P.logoLink] : ["Logo and brand kit (plan member)", $(P.logoPlan), P.logoPlanLink]);
    var tools = vals("tools"), tgFree = t === 3 ? 1 : 0;
    tools.forEach(function (x) {
      if (x === "quotes" || x === "maint") {
        if (tgFree) { tgFree = 0; r.extras.push([x === "quotes" ? "Quotes, invoices and pay links" : "Maintenance plan signups", "Included in Total Growth", null]); return; }
        r.extras.push(x === "quotes" ? ["Quotes, invoices and pay links", $(P.quotesSetup) + " setup + " + $(P.quotes) + "/mo", null] : ["Maintenance plan signups", $(P.maintSetup) + " setup + " + $(P.maint) + "/mo", null]);
      }
      if (x === "ordering") r.extras.push(["Online ordering", $(P.orderingSetup) + " setup + " + $(P.ordering) + "/mo (we'll scope it with you)", null]);
    });
    var tr = (f.trade.value || "").toLowerCase(), m = r.once ? " (with Care or any plan)" : "";
    if (/restaurant|cafe|caf\u00e9|coffee|pizza|bakery|diner|grill|bar\b|brew|food|taco|sushi|kitchen|catering|bistro/.test(tr) || tools.indexOf("ordering") > -1)
      r.extras.push(["Restaurant Pack" + m, $(P.packRestSetup) + " + " + $(P.packRest) + "/mo: online ordering, private events page, TV menu boards and eGift card page", P.packRestLink || null]);
    if (/contract|hvac|plumb|roof|landscap|electric|remodel|handyman|paint|construct|concrete|fenc|pest|clean|garage|floor|solar|pool|tree|lawn|mason|drywall|cabinet|window|gutter|siding|heat|cool|septic|excavat/.test(tr))
      r.extras.push(["Contractor Pack" + m, $(P.packContractor) + " one time: financing page, careers page, quote/estimate form, Local Services Ads and call tracking setup", P.packContractorLink || null]);
    return r;
  }
  function summary(r) {
    var p = r.plan, L = [];
    L.push("PLAN FINDER submission (ttawebdev.com/plan-finder/)");
    L.push("Recommended: " + p.name + (r.once ? " | wants PAY ONCE" : r.pre ? " | wants ANNUAL PREPAY " + $(p.prepay) : r.own ? " | owns site, owner rate from day 1" : " | $0 down monthly"));
    L.push("Trade: " + f.trade.value.trim() + " | Customers: " + val("interact"));
    L.push("Website: " + val("site") + " | Domain: " + val("domain") + " | Logo ready: " + val("logo"));
    L.push("Pain points: " + (vals("pain").join(", ") || "none checked"));
    L.push("Back-office: " + (vals("tools").join(", ") || "-") + " | Site size: " + (val("pages") === "multi" ? "multi-page" : "one-page"));
    if (needsBot()) { L.push("Top questions: 1) " + f.q1.value.trim() + " 2) " + f.q2.value.trim() + " 3) " + f.q3.value.trim()); L.push("#1 action: " + (val("action") || "-")); }
    L.push("Payment preference: " + (r.once ? "pay once" : r.pre ? "annual prepay (15% off)" : "$0 down monthly"));
    if (f.referred_by && f.referred_by.value.trim()) L.push("Referred by: " + f.referred_by.value.trim());
    r.extras.forEach(function (e) { L.push("Extra: " + e[0] + " " + e[1]); });
    return L.join("\n").slice(0, 1990);
  }
  function result(r, sent) {
    var p = r.plan, h = "", buildAmt = r.multi ? P.build.multi : P.build.one, buildLink = r.multi ? P.build.multiLink : P.build.oneLink;
    h += '<div class="result"><p class="eyebrow">Your recommended plan</p><h2>' + esc(p.name) + "</h2>";
    if (r.once) {
      h += '<p class="price">' + $(buildAmt) + " <small>once</small></p><p>" + esc(P.payonce) + "</p>";
      h += '<p class="ctas"><a class="btn" href="' + buildLink + '">Pay ' + $(buildAmt) + " for your " + (r.multi ? "multi-page" : "one-page") + " site</a></p>";
      h += "<p>Then pick one: self-host it for free, or add Care for " + $(P.care) + "/mo" + (r.key !== "website" ? ", or the " + esc(p.ownerName) + " plan at " + $(p.owner) + "/mo to get the " + esc(p.name) + " tools" : "") + ".</p>";
      h += '<p class="ctas"><a class="btn ghost" href="' + P.careLink + '">Add Care ' + $(P.care) + "/mo</a>" + (r.key !== "website" ? '<a class="btn ghost" href="' + p.ownerLink + '">' + esc(p.ownerName) + " " + $(p.owner) + "/mo</a>" : "") + "</p>";
    } else if (r.pre) {
      h += '<p class="price">' + $(p.prepay) + " <small>/year, 15% off</small></p><p>Counts as all 12 payments, so the site is 100% yours right away. From year 2: " + $(p.owner) + "/mo" + (r.key === "website" ? " (Care)" : "") + ". Covered by the 30-day guarantee; no 6-month minimum.</p>";
      h += '<p class="ctas"><a class="btn" href="' + p.prepayLink + '">Pay ' + $(p.prepay) + " for the year</a></p>";
    } else if (r.own) {
      h += '<p class="price">' + $(p.owner) + " <small>/mo</small></p><p>You already own your site, so you get the site-owner rate (" + esc(p.ownerName) + ") from day 1.</p>";
      h += '<p class="ctas"><a class="btn" href="' + p.ownerLink + '">Start ' + esc(p.ownerName) + " at " + $(p.owner) + "/mo</a></p>";
    } else {
      h += '<p class="price">' + $(p.down) + " <small>/mo, $0 down</small></p><p>Months 1&ndash;12: " + $(p.down) + "/mo. Month 13 on: " + $(p.owner) + "/mo" + (r.key === "website" ? " (Care)" : "") + ". You own the site after " + P.ownAfter + " paid payments. " + P.minMonths + "-month minimum, then month-to-month.</p>";
      h += '<p class="ctas"><a class="btn" href="' + p.link + '">Start ' + esc(p.name) + " for $0 down</a></p>";
    }
    h += "<p><strong>You save " + $(p.saveMo) + "/mo (" + $(p.saveYr) + "/yr)</strong> versus buying the same pieces elsewhere (" + $(p.comp) + "/mo at the low end of published prices). <a href=\"../compare/#savings\">See the math</a></p>";
    if (r.extras.length) { h += "<h3>Also for you</h3><ul>"; r.extras.forEach(function (e) { h += "<li>" + esc(e[0]) + ": " + (e[2] ? '<a href="' + e[2] + '">' + esc(e[1]) + "</a>" : esc(e[1])) + "</li>"; }); h += "</ul>"; }
    h += "<p><small>" + esc(P.guarantee) + " " + esc(P.ownerRate) + "</small></p>";
    h += sent ? "<p><strong>Got it! William will reach out within one business day.</strong></p>" : "<p><strong>We couldn't send your answers automatically.</strong> Please email tta.dev.web@gmail.com or call 720-477-8603.</p>";
    h += "</div>";
    var box = document.getElementById("pf-result"); box.innerHTML = h; box.hidden = false; f.hidden = true;
    document.getElementById("pf-bar").style.width = "100%"; document.getElementById("pf-stepno").textContent = "Done"; window.scrollTo(0, 0);
  }
  back.addEventListener("click", function () { var o = order(); show(o[Math.max(0, o.indexOf(cur) - 1)]); });
  f.addEventListener("submit", function (e) {
    e.preventDefault(); if (!check(cur)) return;
    var o = order(); if (cur !== 4) { show(o[o.indexOf(cur) + 1]); return; }
    var tok = window.turnstile && tsId !== null ? turnstile.getResponse(tsId) : "";
    if (!tok) { err.textContent = "Please complete the human check, then press See my plan."; return; }
    var r = rec(); next.disabled = true; err.textContent = "Sending...";
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.name.value, email: f.email.value, phone: f.phone.value, business: f.business.value, message: summary(r), website: f.website.value, turnstile: tok }) })
      .then(function (x) { return x.json().catch(function () { return {}; }).then(function (j) { return x.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (ok) { next.disabled = false; if (!ok && window.turnstile && tsId !== null) turnstile.reset(tsId); result(r, ok); });
  });
  show(0);
})();
