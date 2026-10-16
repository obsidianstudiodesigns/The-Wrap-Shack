# The Wrap Shack

Landing page for The Wrap Shack ("Real Shawarma's"), a street-food business in Rispark on Swartkoppies Road, near Mall of the South, Johannesburg South. They sell beef, chicken and lamb shawarmas, smash burgers, steak rolls, kebabs and loaded fries, trade at night markets across Gauteng and do function hire (with The Funky Chip).

Live: https://obsidianstudiodesigns.github.io/The-Wrap-Shack/

## What's on the site

- `index.html`: hero, menu bento (7 dishes, each opens a pre-written WhatsApp order), lamb feature, "why us", Find the Shack (address, directions, map, market pop-ups), function hire form, closing call-to-action
- The function form has no backend. It checks the fields, then opens WhatsApp to 074 080 8080 with the booking details written out.
- `privacy.html` (POPIA), `terms.html` (ECTA s43 disclosure, prices, orders, events, allergens), `404.html`
- SEO and sharing: canonical URLs, Open Graph and Twitter tags with `og-image.jpg` (1200 x 630) for WhatsApp previews, Restaurant JSON-LD, `sitemap.xml`, `robots.txt`, favicon set and web manifest

## Content sources

- Logo: `logo.jpg` from the client. The round badge is cut out for the header and favicons.
- Colours, tagline ("Not just a wrap, it's an attack!") and menu from the client's banner and flyer.
- Menu photos: the client's own photos from the Facebook page (shawarma, pita pocket, smash burger, cheesy steak roll, hero roll, kebab skewers, shawarma spit).
- Generated photoreal images (Figma AI): hero shawarma, loaded fries, lamb shawarma and the night-market scene.
- Facebook posts: address, contact (Chris, 074 080 8080), lamb launch, functions and events, and the markets they trade at.

## To confirm with The Wrap Shack before promoting the site

- **Prices.** The flyer has blank price slots, so no prices are shown. The menu tells people to ask for today's prices.
- **Trading hours** and the exact street number (marked `TO CONFIRM` in the HTML).
- Payment methods, legal status and VAT number for the ECTA disclosure in `terms.html`.
- The market list comes from past Facebook posts. Update it if they stop trading somewhere.
- No reviews or testimonials are on the site. Add real ones if the client supplies them.

## Tools

- `tools/make-assets.py`: builds the web images, badge and favicons from `research/` (local only, not committed), `logo.jpg` and `flyer.jpeg`
- `tools/make-pages.py`: writes the legal pages and 404 from one template
- `tools/og.html` + `tools/make-og.sh`: renders `og-image.jpg` with headless Chrome

## Local preview

```bash
python -m http.server 5193
```

## Deploying

GitHub Pages serves the `main` branch root. Commit and push to `main`.

Website designed by [Obsidian Studio Designs](https://obsidianstudiodesigns.co.za/).
