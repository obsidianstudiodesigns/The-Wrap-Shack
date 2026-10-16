"""Build the web images, logo badge and favicon set for The Wrap Shack site.

Sources:
  research/fb/   photos downloaded from The Wrap Shack Facebook page
  research/gen/  photoreal images generated for the site (Figma AI)
  logo.jpg       the client's badge logo
  flyer.jpeg     the client's menu banner

Run from the project root:  python tools/make-assets.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
FB = ROOT / "research" / "fb"
GEN = ROOT / "research" / "gen"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

CHAR = (20, 13, 11)


def save_webp(img, path, quality=80):
    img.convert("RGB").save(path, "WEBP", quality=quality, method=6)


def fit_width(img, width):
    if img.width <= width:
        return img
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def crop_ratio(img, ratio, focus_y=0.5, focus_x=0.5):
    """Crop to width/height = ratio around a focus point."""
    w, h = img.size
    if w / h > ratio:
        nw = round(h * ratio)
        left = round((w - nw) * focus_x)
        return img.crop((left, 0, left + nw, h))
    nh = round(w / ratio)
    top = round((h - nh) * focus_y)
    return img.crop((0, top, w, top + nh))


# Menu photos from Facebook: (source, output name, crop ratio, focus_y)
MENU = [
    ("wrapshack-07", "shawarma", 4 / 3, 0.5),
    ("wrapshack-05", "pita-shawarma", 1, 0.45),
    ("wrapshack-06", "smash-burger", 1, 0.4),
    ("wrapshack-04", "steak-roll", 16 / 9, 0.5),
    ("wrapshack-03", "hero-roll", 3 / 4, 0.4),
    ("wrapshack-02", "kebab", 1, 0.5),
]
for src, name, ratio, fy in MENU:
    img = crop_ratio(Image.open(FB / f"{src}.jpg"), ratio, fy)
    save_webp(fit_width(img, 900), OUT / f"{name}.webp", quality=78)

# The shawarma spit, tall.
spit = crop_ratio(Image.open(FB / "wrapshack-01.jpg"), 9 / 16, 0.35)
save_webp(fit_width(spit, 520), OUT / "spit.webp", quality=78)

# Generated images.
hero = Image.open(GEN / "hero-shawarma.png")
save_webp(hero, OUT / "hero-shawarma.webp", quality=80)
save_webp(fit_width(hero, 560), OUT / "hero-shawarma-sm.webp", quality=76)
save_webp(fit_width(Image.open(GEN / "loaded-fries.png"), 900), OUT / "loaded-fries.webp", quality=78)
lamb = Image.open(GEN / "lamb.png")
save_webp(lamb, OUT / "lamb.webp", quality=78)
save_webp(fit_width(lamb, 760), OUT / "lamb-sm.webp", quality=74)
market = Image.open(GEN / "night-market.png")
save_webp(market, OUT / "night-market.webp", quality=78)
save_webp(fit_width(market, 760), OUT / "night-market-sm.webp", quality=74)

# The client's menu banner, for the "menu board" view.
save_webp(fit_width(Image.open(ROOT / "flyer.jpeg"), 734), OUT / "menu-board.webp", quality=82)


def badge(diameter, radius=97, center=(251, 250)):
    """The round badge from logo.jpg, transparent outside the circle."""
    src = Image.open(ROOT / "logo.jpg").convert("RGBA")
    cx, cy = center
    disc = src.crop((cx - radius, cy - radius, cx + radius, cy + radius))
    scale = 4
    size = radius * 2
    mask = Image.new("L", (size * scale, size * scale), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * scale - 1, size * scale - 1), fill=255)
    disc.putalpha(mask.resize((size, size), Image.LANCZOS))
    return disc.resize((diameter, diameter), Image.LANCZOS)


# Inner black disc only (flame, fork and spatula): reads best at small sizes.
inner = lambda d: badge(d, radius=80)

inner(160).save(OUT / "badge.png", optimize=True)
inner(160).save(OUT / "badge.webp", "WEBP", quality=90, method=6)

inner(32).save(ROOT / "favicon-32.png", optimize=True)
inner(16).save(ROOT / "favicon-16.png", optimize=True)
inner(48).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


def on_char(size, pad):
    base = Image.new("RGBA", (size, size), CHAR + (255,))
    b = inner(size - 2 * pad)
    base.alpha_composite(b, (pad, pad))
    return base.convert("RGB")


on_char(180, 14).save(ROOT / "apple-touch-icon.png", optimize=True)
on_char(192, 16).save(ROOT / "icon-192.png", optimize=True)
on_char(512, 72).save(ROOT / "icon-512.png", optimize=True)

print("assets written to", OUT)
