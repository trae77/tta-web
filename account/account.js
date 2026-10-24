/* Phase B static shell.
   No Stripe secret and no magic-link send.
   Phase C emails a one-time link to the Stripe Customer address. It expires in 15 minutes. */
(function () {
  "use strict";

  var STATUS = { active: "Active", past_due: "Past due", canceled: "Canceled" };
  var MAIL = "mailto:tta.dev.web@gmail.com";
  var dataPromise = null;

  function $(id) { return document.getElementById(id); }

  function money(n) {
    return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function load() {
    if (!dataPromise) {
      dataPromise = fetch("fixtures.json").then(function (res) {
        if (!res.ok) throw new Error("fixture");
        return res.json();
      });
    }
    return dataPromise;
  }

  function viewName() {
    return document.documentElement.getAttribute("data-view") || "login";
  }

  function listInto(ul, items) {
    ul.textContent = "";
    (items || []).forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
  }

  function setRate(el, amount, suffix) {
    el.textContent = "";
    el.appendChild(document.createTextNode(money(amount) + " "));
    var small = document.createElement("small");
    small.textContent = suffix;
    el.appendChild(small);
  }

  function planBullets(plan, fixture) {
    var lead = [];
    if (fixture.rateMode === "owner" && plan.ownerLead) lead = plan.ownerLead;
    else if (fixture.rateMode !== "owner" && plan.path2Lead) lead = plan.path2Lead;
    return lead.concat(plan.bullets || []);
  }

  function ownerSuffix(plan) {
    return plan.ownerLabel && plan.ownerLabel !== plan.label ? " (" + plan.ownerLabel + ")" : "";
  }

  function mailLink(label) {
    var a = document.createElement("a");
    a.href = MAIL + "?subject=" + encodeURIComponent(label);
    a.textContent = "Email us";
    return a;
  }

  function emailRow(label, text) {
    var div = document.createElement("div");
    div.className = "email-row";
    var strong = document.createElement("strong");
    strong.textContent = label;
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(text + " "));
    p.appendChild(mailLink(label));
    div.appendChild(strong);
    div.appendChild(p);
    return div;
  }

  function fillLinks(data) {
    var ul = $("fixture-links");
    if (!ul) return;
    ul.textContent = "";
    data.fixtures.forEach(function (fixture) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "?view=dashboard&fixture=" + encodeURIComponent(fixture.id);
      a.textContent = fixture.previewLabel;
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function fillDenied(data) {
    var note = $("denied-care");
    if (!note) return;
    note.textContent = "Draft: pay-once with no Care or other subscription stays outside this portal. Add Care is " + money(data.careMonthly) + "/mo. Email us. No checkout in this preview.";
  }

  function render(data) {
    var params = new URLSearchParams(location.search);
    var id = params.get("fixture") || "nml-path2";
    var fixture = null;
    data.fixtures.forEach(function (item) { if (item.id === id) fixture = item; });
    var plan = fixture && data.plans[fixture.planKey];
    var banner = $("dash-draft");
    if (!fixture || !plan) {
      banner.textContent = "This draft fixture is not on file. Pick one under Draft preview below.";
      $("plan-card").hidden = true;
      return;
    }
    $("plan-card").hidden = false;
    banner.textContent = "Draft fixture. Not a live account. Billing, edits, and plan changes are not connected.";

    $("plan-name").textContent = plan.label;
    var pill = $("plan-status");
    pill.textContent = STATUS[fixture.status] || fixture.status;
    pill.className = "pill " + (STATUS[fixture.status] ? fixture.status : "");

    var phase = $("plan-phase");
    var next = $("plan-next");
    var rate = $("plan-rate");
    if (fixture.rateMode === "prepay") {
      phase.textContent = "Yearly prepay";
      setRate(rate, plan.prepay, "for the year");
      next.hidden = false;
      next.textContent = "After the prepaid year: " + money(plan.ownerMonthly) + "/mo" + ownerSuffix(plan) + ".";
    } else if (fixture.rateMode === "owner") {
      phase.textContent = "Site-owner rate";
      setRate(rate, plan.ownerMonthly, "/mo");
      next.hidden = true;
      next.textContent = "";
    } else {
      phase.textContent = "Months 1–12";
      setRate(rate, plan.path2Monthly, "/mo");
      next.hidden = false;
      next.textContent = "From month 13: " + money(plan.ownerMonthly) + "/mo" + ownerSuffix(plan) + ".";
    }

    var packs = $("plan-packs");
    if (!fixture.packs.length) {
      packs.hidden = true;
      packs.textContent = "";
    } else {
      packs.hidden = false;
      listInto(packs, fixture.packs.map(function (key) {
        var pack = data.packs[key];
        return pack ? pack.label + " " + money(pack.monthly) + "/mo" : key;
      }));
    }

    listInto($("included"), planBullets(plan, fixture));

    var packBox = $("pack-included");
    packBox.textContent = "";
    fixture.packs.forEach(function (key) {
      var pack = data.packs[key];
      if (!pack) return;
      var h = document.createElement("h3");
      h.textContent = pack.label;
      var ul = document.createElement("ul");
      listInto(ul, pack.bullets);
      packBox.appendChild(h);
      packBox.appendChild(ul);
    });

    $("guarantee").textContent = data.guarantee;

    var site = $("site-url");
    var siteNote = $("site-note");
    if (fixture.siteUrl) {
      site.textContent = fixture.siteUrl;
      siteNote.textContent = "Draft fixture address, not a client site. The live address will come from the account record.";
    } else {
      site.textContent = "—";
      siteNote.textContent = "No site address on this fixture. The live address will come from the account record.";
    }

    var editNote = $("edit-status");
    if (fixture.status === "active") {
      editNote.hidden = true;
      editNote.textContent = "";
    } else {
      editNote.hidden = false;
      editNote.textContent = "Status: " + (STATUS[fixture.status] || fixture.status) + ". Email us before requesting edits.";
    }

    var addons = $("addon-body");
    addons.textContent = "";
    if (!fixture.packs.length) {
      var empty = document.createElement("p");
      empty.textContent = "No industry pack on this account.";
      addons.appendChild(empty);
    } else {
      var ul = document.createElement("ul");
      listInto(ul, fixture.packs.map(function (key) {
        var pack = data.packs[key];
        return pack ? pack.label + " — " + money(pack.monthly) + "/mo" : key;
      }));
      addons.appendChild(ul);
    }
    var addonLead = document.createElement("p");
    addonLead.textContent = "To add or change a pack, or to upgrade or downgrade, email us. No checkout in this preview.";
    addons.appendChild(addonLead);

    var rows = $("email-rows");
    rows.textContent = "";
    if (fixture.payOnce === "one" || fixture.payOnce === "multi") {
      var amount = fixture.payOnce === "multi" ? data.payOnce.multiPage : data.payOnce.onePage;
      var which = fixture.payOnce === "multi" ? "multi-page" : "one-page";
      rows.appendChild(emailRow("Pay-once", "Status: pay-once " + which + " site (" + money(amount) + ") with " + plan.label + "."));
    } else {
      rows.appendChild(emailRow("Pay-once", "Status: not pay-once. This account is on " + plan.label + "."));
    }
    rows.appendChild(emailRow("Early buyout", "Status: not offered in this portal."));
    if (fixture.rateMode === "prepay") {
      rows.appendChild(emailRow("Yearly prepay", "Status: yearly prepay, " + money(plan.prepay) + " for the year."));
    } else {
      rows.appendChild(emailRow("Yearly prepay", "Status: not on yearly prepay."));
    }
    if (fixture.planKey === "care") {
      rows.appendChild(emailRow("Add Care", "Status: Care is the current plan, " + money(plan.ownerMonthly) + "/mo."));
    } else {
      rows.appendChild(emailRow("Add Care", "Status: Care is included with " + plan.label + ". Care only is " + money(data.careMonthly) + "/mo."));
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var login = $("login-form");
    if (login) {
      login.addEventListener("submit", function (event) {
        event.preventDefault();
        var email = login.email.value.trim();
        var err = $("login-error");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          err.textContent = "Enter the email we have on file.";
          return;
        }
        err.textContent = "";
        location.href = "?view=check-email";
      });
    }

    var edit = $("edit-form");
    if (edit) {
      edit.addEventListener("submit", function (event) {
        event.preventDefault();
        var result = $("edit-result");
        if (edit.what.value.trim().length < 5) {
          result.className = "err";
          result.textContent = "Tell us what to change.";
          return;
        }
        result.className = "draft-note";
        result.textContent = "Draft: nothing was sent. Email tta.dev.web@gmail.com or call +1 720-477-8603.";
      });
    }

    var view = viewName();
    if (view !== "login") {
      var heading = document.querySelector("#view-" + (view === "check-email" ? "check" : view) + " h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
    }

    load().then(function (data) {
      fillLinks(data);
      if (view === "denied") fillDenied(data);
      if (view === "dashboard") render(data);
    }).catch(function () {
      var el = $("fixture-error");
      if (!el) return;
      el.hidden = false;
      el.textContent = "The plan fixture did not load. Refresh this page.";
    });
  });
})();
