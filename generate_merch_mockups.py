#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
HundApp – Merch Mockup Generator
===============================================================================
Rebuilds the four product mockups referenced by merch.html:

    merch/tshirt-mockup.png     merch/hoodie-mockup.png
    merch/mug-mockup.png        merch/stickers-mockup.png

The mockups are flat vector-style renders drawn with Pillow using the official
HundApp brand palette, so they can always be regenerated from source instead of
depending on binary design files that are not in the repository.

Usage:  python3 generate_merch_mockups.py
===============================================================================
"""

import math
import os

from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Brand palette (matches styles.css / the print originals in merch-*.svg)
# ---------------------------------------------------------------------------
FOREST = (27, 67, 50)        # #1B4332  Skogsgrön (Forest Pine)
FOREST_DEEP = (20, 49, 37)   # #143125  Shadow tone for folds
PINE_SOFT = (30, 58, 47)     # #1E3A2F  Hoodie body
GOLD = (244, 211, 94)        # #F4D35E  Gold accent
GOLD_DEEP = (229, 184, 66)   # #E5B842  Embroidery thread
CREAM = (250, 247, 242)      # #FAF7F2  Warm oat / sand
WHITE = (255, 255, 255)
INK = (32, 56, 48)           # #203830
MUTED = (148, 163, 155)

SIZE = 800
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "merch")

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size, bold=True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


# ---------------------------------------------------------------------------
# Shared drawing helpers
# ---------------------------------------------------------------------------
def canvas():
    """Flat sand backdrop with a soft radial wash behind the product."""
    img = Image.new("RGB", (SIZE, SIZE), CREAM)
    wash = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(wash)
    for i in range(60):
        r = 420 - i * 5
        alpha = int(10 * (1 - i / 60))
        d.ellipse([SIZE / 2 - r, 400 - r, SIZE / 2 + r, 400 + r], fill=(27, 67, 50, alpha))
    img.paste(wash, (0, 0), wash)
    return img


def paw(draw, cx, cy, scale, color, rotate=0.0):
    """Draw the HundApp paw mark (4 toes + pad), centred on (cx, cy)."""
    toes = [(-0.62, -0.42), (-0.21, -0.68), (0.21, -0.68), (0.62, -0.42)]
    for tx, ty in toes:
        x = cx + tx * scale * math.cos(rotate) - ty * scale * math.sin(rotate)
        y = cy + tx * scale * math.sin(rotate) + ty * scale * math.cos(rotate)
        rx, ry = 0.185 * scale, 0.235 * scale
        draw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=color)
    px, py = cx, cy + 0.28 * scale
    pr = 0.42 * scale
    draw.ellipse([px - pr, py - pr * 0.86, px + pr, py + pr * 0.98], fill=color)


def emblem(draw, cx, cy, scale, paw_color, text_color, label="HUNDAPP"):
    """Paw mark with the wordmark underneath – the standard chest emblem."""
    paw(draw, cx, cy, scale, paw_color)
    f = font(int(scale * 0.42))
    w = draw.textlength(label, font=f)
    draw.text((cx - w / 2, cy + scale * 0.95), label, font=f, fill=text_color)


def text_c(draw, cx, y, s, f, fill):
    draw.text((cx - draw.textlength(s, font=f) / 2, y), s, font=f, fill=fill)


def save(img, name):
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, name)
    img.save(path, "PNG", optimize=True)
    print(f"  wrote {path}  ({os.path.getsize(path) / 1024:.0f} KB)")


# ---------------------------------------------------------------------------
# 1. T-shirt
# ---------------------------------------------------------------------------
def tshirt():
    img = canvas()
    d = ImageDraw.Draw(img)
    cx = SIZE // 2

    body = [(300, 190), (500, 190), (560, 700), (240, 700)]
    sleeve_l = [(300, 190), (170, 300), (215, 380), (300, 330)]
    sleeve_r = [(500, 190), (630, 300), (585, 380), (500, 330)]

    d.polygon(sleeve_l, fill=FOREST_DEEP)
    d.polygon(sleeve_r, fill=FOREST_DEEP)
    d.polygon(body, fill=FOREST)
    d.polygon([(300, 190), (500, 190), (500, 214), (300, 214)], fill=FOREST_DEEP)

    # Collar
    d.pieslice([cx - 78, 168, cx + 78, 262], 0, 180, fill=CREAM)
    d.arc([cx - 78, 168, cx + 78, 262], 0, 180, fill=GOLD, width=6)

    # Side seams + hem shading
    d.line([(318, 230), (272, 690)], fill=FOREST_DEEP, width=4)
    d.line([(482, 230), (528, 690)], fill=FOREST_DEEP, width=4)
    d.rectangle([240, 672, 560, 700], fill=FOREST_DEEP)

    emblem(d, cx, 380, 92, GOLD, WHITE)
    text_c(d, cx, 520, "TASSAVTRYCK", font(30), WHITE)
    text_c(d, cx, 560, "· 220 GSM EKOLOGISK BOMULL ·", font(17), (196, 220, 205))

    # Price tag
    d.rounded_rectangle([596, 606, 742, 660], 14, fill=WHITE, outline=GOLD_DEEP, width=3)
    text_c(d, 669, 620, "299 KR", font(22), FOREST)
    save(img, "tshirt-mockup.png")


# ---------------------------------------------------------------------------
# 2. Hoodie / sweatshirt
# ---------------------------------------------------------------------------
def hoodie():
    img = canvas()
    d = ImageDraw.Draw(img)
    cx = SIZE // 2

    body = [(285, 230), (515, 230), (575, 700), (225, 700)]
    sleeve_l = [(285, 230), (150, 350), (200, 440), (290, 380)]
    sleeve_r = [(515, 230), (650, 350), (600, 440), (510, 380)]

    d.polygon(sleeve_l, fill=FOREST_DEEP)
    d.polygon(sleeve_r, fill=FOREST_DEEP)
    d.polygon(body, fill=PINE_SOFT)

    # Hood
    d.pieslice([cx - 150, 108, cx + 150, 320], 180, 360, fill=PINE_SOFT)
    d.pieslice([cx - 112, 150, cx + 112, 316], 180, 360, fill=FOREST_DEEP)
    d.arc([cx - 150, 108, cx + 150, 320], 180, 360, fill=GOLD_DEEP, width=5)

    # Drawstrings
    d.line([(cx - 34, 296), (cx - 40, 392)], fill=GOLD_DEEP, width=7)
    d.line([(cx + 34, 296), (cx + 40, 392)], fill=GOLD_DEEP, width=7)
    d.ellipse([cx - 48, 386, cx - 32, 402], fill=GOLD)
    d.ellipse([cx + 32, 386, cx + 48, 402], fill=GOLD)

    # Kangaroo pocket
    d.rounded_rectangle([295, 540, 505, 660], 16, fill=FOREST_DEEP)
    d.line([(295, 566), (505, 566)], fill=PINE_SOFT, width=4)

    # Ribbed cuffs & hem
    d.rectangle([225, 672, 575, 700], fill=FOREST_DEEP)
    d.rectangle([150, 340, 205, 372], fill=FOREST_DEEP)
    d.rectangle([595, 340, 650, 372], fill=FOREST_DEEP)

    emblem(d, cx, 400, 74, GOLD_DEEP, WHITE)
    text_c(d, cx, 496, "SKOGSPROMENAD", font(24), WHITE)
    save(img, "hoodie-mockup.png")


# ---------------------------------------------------------------------------
# 3. Enamel mug with wrap print
# ---------------------------------------------------------------------------
def mug():
    img = canvas()
    d = ImageDraw.Draw(img)

    # Handle (drawn first so the body overlaps it)
    d.ellipse([560, 330, 720, 500], outline=FOREST, width=26)

    body_box = [215, 265, 585, 610]
    d.rounded_rectangle(body_box, 26, fill=WHITE, outline=MUTED, width=2)

    # Enamel rim + base band
    d.rounded_rectangle([205, 248, 595, 300], 24, fill=FOREST)
    d.rounded_rectangle([215, 566, 585, 610], 20, fill=FOREST)
    d.rectangle([215, 300, 585, 566], fill=WHITE)

    # Subtle cylinder shading
    for i, a in enumerate((14, 9, 6)):
        d.rectangle([215 + i * 4, 300, 250 + i * 4, 566], fill=(238, 240, 238))
        d.rectangle([560 - i * 4, 300, 585 - i * 4, 566], fill=(238, 240, 238))

    paw(d, 400, 392, 52, FOREST)
    text_c(d, 400, 468, "BÄSTA HUNDVÄNNEN", font(28), FOREST)
    text_c(d, 400, 508, "· HUNDAPP ·", font(19), GOLD_DEEP)

    # Steam
    for x in (330, 400, 470):
        d.arc([x - 16, 150, x + 16, 230], 200, 340, fill=(196, 208, 202), width=6)

    text_c(d, 400, 650, "350 ml · Skogsemaljmugg med tryck runt om", font(20), INK)
    save(img, "mug-mockup.png")


# ---------------------------------------------------------------------------
# 4. Die-cut sticker sheet
# ---------------------------------------------------------------------------
def stickers():
    img = canvas()
    d = ImageDraw.Draw(img)

    # Sticker 1 – gold roundel
    d.ellipse([90, 120, 400, 430], fill=GOLD, outline=WHITE, width=10)
    paw(d, 245, 250, 58, FOREST)
    text_c(d, 245, 330, "HUND", font(34), FOREST)
    text_c(d, 245, 368, "I BILEN", font(34), FOREST)

    # Sticker 2 – forest shield
    d.polygon([(560, 130), (730, 130), (730, 300), (645, 380), (560, 300)], fill=FOREST, outline=WHITE)
    paw(d, 645, 235, 56, GOLD)
    text_c(d, 645, 316, "HUNDAPP", font(22), WHITE)

    # Sticker 3 – white paw oval
    d.ellipse([150, 480, 430, 700], fill=WHITE, outline=GOLD_DEEP, width=8)
    paw(d, 290, 590, 62, FOREST)

    # Sticker 4 – mint rectangle tag
    d.rounded_rectangle([470, 500, 740, 690], 22, fill=(219, 238, 224), outline=WHITE, width=8)
    text_c(d, 605, 545, "SKOGS-", font(30), FOREST)
    text_c(d, 605, 583, "MÄSTAREN", font(30), FOREST)
    paw(d, 605, 650, 26, FOREST)

    text_c(d, 400, 742, "Stansade vinyldekaler · Väderbeständiga · 4 motiv", font(20), INK)
    save(img, "stickers-mockup.png")


if __name__ == "__main__":
    print("🎨 HundApp – generating merch mockups into merch/")
    tshirt()
    hoodie()
    mug()
    stickers()
    print("✅ Done – 4 mockups written.")
