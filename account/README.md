# `/account/` (Phase B)

Static shell for paying clients. No Cloudflare Worker, no Stripe secret keys, and no magic-link email.

Phase C will email a one-time sign-in link to the address on the Stripe Customer. The link expires in 15 minutes and works once. This folder does not send that email.

Rates in `fixtures.json` are copied from `plan-finder/index.html` (`window.PF_PRICES`, generated from prices.json). Inclusion bullets follow the 2026-10-23 customer-dashboard UX table (PRICE-SHEET). Check them with:

```
node account/check-fixtures.js
```

The page is `noindex, nofollow` and is not linked from the main nav or footer. `/owner/` is Phase B2 and is not in this folder.

Design’s A1–A6 addendum was not in the repo when this shell was built. The site, edit-request, add-on/upgrade, referral, and pay-once/buyout/yearly/Care cards are draft stubs for that polish.

Preview:

- `/account/` sign-in form
- `/account/?view=check-email`
- `/account/?view=expired` or `/account/?token=draft`
- `/account/?view=denied` pay-once with no Care
- `/account/?view=dashboard&fixture=nml-path2`
