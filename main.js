// Stripe Payment Links: paste live URLs below (see README). Empty = button stays on its mailto fallback.
var STRIPE_LINKS = {
  STRIPE_LINK_ONEPAGER: "",
  STRIPE_LINK_ONEPAGER_MONTHLY: "",
  STRIPE_LINK_MULTIPAGE: "",
  STRIPE_LINK_MULTIPAGE_MONTHLY: ""
};
document.querySelectorAll('[data-stripe-link]').forEach(function (a) {
  var u = STRIPE_LINKS[a.getAttribute('data-stripe-link')];
  if (u && /^https:\/\//.test(u)) { a.href = u; a.rel = 'noopener'; }
});
