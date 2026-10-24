/* Confirm account fixtures match plan-finder PF_PRICES and the shell stays secret-free. */
var fs = require("fs");
var path = require("path");

var root = path.resolve(__dirname, "..");
var html = fs.readFileSync(path.join(root, "plan-finder/index.html"), "utf8");
var start = html.indexOf("window.PF_PRICES=");
var end = html.indexOf("</script>", start);
if (start < 0 || end < 0) throw new Error("PF_PRICES missing");
var js = html.slice(start + "window.PF_PRICES=".length, end).trim().replace(/;$/, "");
var prices = Function("return " + js)();
var data = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures.json"), "utf8"));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

var map = {
  starter: prices.plans.website,
  "get-found": prices.plans.getfound,
  "never-miss-a-lead": prices.plans.nml,
  "total-growth": prices.plans.tg,
  "all-in": prices.plans.allin
};

Object.keys(map).forEach(function (key) {
  var plan = data.plans[key];
  var src = map[key];
  assert(plan, "missing plan " + key);
  assert(plan.label === src.name, key + " label");
  assert(plan.path2Monthly === src.down, key + " path2");
  assert(plan.ownerMonthly === src.owner, key + " owner");
  assert(plan.prepay === src.prepay, key + " prepay");
});

assert(data.plans.care.ownerMonthly === prices.care, "care rate");
assert(data.plans.care.path2Monthly == null, "care has no path2 rate");
assert(data.plans.starter.ownerMonthly === prices.care, "starter month 13 is Care");
assert(data.plans.starter.ownerLabel === "Care", "starter owner label");
assert(data.careMonthly === prices.care, "careMonthly");
assert(data.payOnce.onePage === prices.build.one, "pay once one-page");
assert(data.payOnce.multiPage === prices.build.multi, "pay once multi-page");
assert(data.packs.trades.monthly === prices.packTrades, "trades pack");
assert(data.packs.restaurant.monthly === prices.packRest, "restaurant pack");
assert(data.guarantee === prices.guarantee, "guarantee wording");

var ids = {};
assert(data.fixtures.some(function (f) { return f.id === "nml-path2"; }), "default fixture");
data.fixtures.forEach(function (fixture) {
  assert(!ids[fixture.id], "duplicate fixture " + fixture.id);
  ids[fixture.id] = true;
  var plan = data.plans[fixture.planKey];
  assert(plan, "unknown plan " + fixture.planKey);
  assert(["path2", "owner", "prepay"].indexOf(fixture.rateMode) >= 0, "rateMode " + fixture.id);
  assert(["active", "past_due", "canceled"].indexOf(fixture.status) >= 0, "status " + fixture.id);
  assert(fixture.payOnce == null || fixture.payOnce === "one" || fixture.payOnce === "multi", "payOnce " + fixture.id);
  assert(fixture.siteUrl == null || fixture.siteUrl === "https://example.com", "siteUrl " + fixture.id);
  if (fixture.rateMode === "path2") assert(typeof plan.path2Monthly === "number", "path2 amount " + fixture.id);
  if (fixture.rateMode === "owner") assert(typeof plan.ownerMonthly === "number", "owner amount " + fixture.id);
  if (fixture.rateMode === "prepay") assert(typeof plan.prepay === "number", "prepay amount " + fixture.id);
  if (fixture.planKey === "starter") assert(fixture.rateMode !== "owner", "starter owner is the Care plan");
  assert(fixture.packs.length <= 2, "max 2 packs");
  fixture.packs.forEach(function (key) { assert(data.packs[key], "unknown pack " + key); });
});

function walkBullets(node, label) {
  if (Array.isArray(node)) {
    node.forEach(function (item) { walkBullets(item, label); });
    return;
  }
  if (node && typeof node === "object") {
    Object.keys(node).forEach(function (key) {
      if (key === "bullets" || key === "path2Lead" || key === "ownerLead") walkBullets(node[key], label + "." + key);
    });
    return;
  }
  if (typeof node === "string") {
    assert(!/\$\d/.test(node), "dollar amount in bullet " + label + ": " + node);
    assert(!/\bADA\b|\bWCAG\b/.test(node), "certification claim in " + label);
  }
}
walkBullets(data.plans, "plans");
walkBullets(data.packs, "packs");

var forbidden = [/sk_live/, /sk_test/, /rk_live/, /rk_test/, /whsec_/, /price_[A-Za-z0-9]/, /prod_[A-Za-z0-9]/, /buy\.stripe\.com/, /api\.stripe\.com/, /href=["']\/owner/];
function scan(file) {
  var text = fs.readFileSync(file, "utf8");
  forbidden.forEach(function (re) {
    assert(!re.test(text), file + " matches " + re);
  });
}
fs.readdirSync(__dirname).forEach(function (name) {
  if (name === "check-fixtures.js") return;
  scan(path.join(__dirname, name));
});

var page = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
assert(/noindex,\s*nofollow/.test(page), "noindex");
assert(page.indexOf("Manage billing &amp; plan") >= 0, "portal CTA");
assert(page.indexOf("+1 720-477-8603") >= 0, "phone");
assert(page.indexOf("15 minutes") >= 0, "magic-link expiry");

var robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
assert(/Disallow:\s*\//.test(robots), "robots disallow");
assert(!/Allow:\s*\/account/.test(robots), "robots must not allow /account");

function walkHtml(dir) {
  fs.readdirSync(dir).forEach(function (name) {
    var full = path.join(dir, name);
    if (name === "node_modules" || name === ".git") return;
    var stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (path.resolve(full) === path.resolve(__dirname)) return;
      walkHtml(full);
      return;
    }
    if (!/\.html$/.test(name)) return;
    var text = fs.readFileSync(full, "utf8");
    assert(text.indexOf("/account/") < 0 && text.indexOf("account/") < 0, "nav link to account in " + full);
  });
}
walkHtml(root);

console.log("account fixtures match PF_PRICES (" + data.fixtures.length + " fixtures)");
