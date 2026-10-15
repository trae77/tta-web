// Stripe Payment Links: paste live URLs below (see README). Empty = button stays on its mailto fallback.
var STRIPE_LINKS = {
  STRIPE_LINK_ONEPAGER: "https://buy.stripe.com/9B6fZhcgd9xYaxK35O7ss00",
  STRIPE_LINK_ONEPAGER_MONTHLY: "https://buy.stripe.com/eVq9ATcgd11s7ly6i07ss01",
  STRIPE_LINK_MULTIPAGE: "https://buy.stripe.com/aFa28r0xveSidJWayg7ss02",
  STRIPE_LINK_MULTIPAGE_MONTHLY: "https://buy.stripe.com/5kQ14n6VT6lMeO07m47ss05"
};
document.querySelectorAll('[data-stripe-link]').forEach(function (a) {
  var u = STRIPE_LINKS[a.getAttribute('data-stripe-link')];
  if (u && /^https:\/\//.test(u)) { a.href = u; a.rel = 'noopener'; }
});
