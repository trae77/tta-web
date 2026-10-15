# TTA website

Static site (index.html, styles.css, main.js, chat/). No build step. Host on GitHub Pages.

## Stripe Payment Links (placeholders)
Paid tier buttons carry `data-stripe-link="STRIPE_LINK_*"` and fall back to a mailto until set.
Paste live Payment Link URLs (live Stripe Payment Link URLs) into `STRIPE_LINKS` at the top of `main.js`:
- STRIPE_LINK_ONEPAGER ($200 one-time)
- STRIPE_LINK_ONEPAGER_MONTHLY ($200 + $29/mo for care and the free AI chatbot, no hosting)
- STRIPE_LINK_MULTIPAGE ($450 one-time)
- STRIPE_LINK_MULTIPAGE_MONTHLY ($450 + $49/mo with hosting, care, and the free AI chatbot)
Do not use test links on the live site.

## Zelle
Not included yet. Add later once the Zelle email/phone to show is decided.

## Canonical URL
Replace `CANONICAL_URL_PLACEHOLDER` in index.html (canonical + og:url) with the final URL.

## Chat
`chat/chat-widget.js` answers only from `chat-facts.json`.

## Portfolio
Tiles are generic templates from trae77/client-site-templates and the chat demo, not client work.
