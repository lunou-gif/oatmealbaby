# OatmealBaby website

Static site for the OatmealBaby Every-Season Sleep Sack, hosted on GitHub Pages.

## How to edit
- **Price, colors, sizes, checkout link, email** → top of `shop.js` (the `SHOP` block).
- **Text** → `index.html`.
- **Look** → `style.css`.
- **Photos** → `images/`.

## Turning on checkout
1. In Stripe, create a Payment Link for the sleep sack ($59). Add custom fields for Color / Size / Style, and turn on shipping-address collection.
2. Paste the link into `checkoutUrl` in `shop.js`.
3. Commit and push. The site updates in about a minute.

Until then, if `contactEmail` is set, the Buy button opens a pre-filled order email. If neither is set, it shows "Coming soon".
