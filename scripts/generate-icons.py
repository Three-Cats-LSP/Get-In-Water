#!/usr/bin/env python3
"""Crop the left yellow cat from the source art and build app/web icons."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SRC = ROOT / "App Icon" / "three-cats-source.png"
DARK_BG = (3, 12, 24)
LIGHT_BG = (245, 247, 249)


def remove_near_white(im: Image.Image, tolerance: int = 28) -> Image.Image:
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= 255 - tolerance and g >= 255 - tolerance and b >= 255 - tolerance:
                px[x, y] = (r, g, b, 0)
    return rgba


def crop_left_cat(im: Image.Image) -> Image.Image:
    w, h = im.size
    left = int(w * 0.02)
    right = int(w * 0.318)
    top = int(h * 0.06)
    bottom = int(h * 0.94)
    cropped = im.crop((left, top, right, bottom))
    cropped = remove_near_white(cropped)
    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
    cw, ch = cropped.size
    side = max(cw, ch)
    square = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    square.paste(cropped, ((side - cw) // 2, (side - ch) // 2), cropped)
    return square


def render_icon(cat: Image.Image, size: int, bg: tuple[int, int, int]) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg + (255,))
    inset = int(size * 0.08)
    inner = size - inset * 2
    scaled = cat.resize((inner, inner), Image.LANCZOS)
    canvas.paste(scaled, (inset, inset), scaled)
    return canvas.convert("RGB")


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.exists():
        print(f"Missing source image: {src}", file=sys.stderr)
        return 1

    cat = crop_left_cat(Image.open(src))
    outputs = {
        "icon-512v2.png": render_icon(cat, 512, DARK_BG),
        "icon-192v2.png": render_icon(cat, 192, DARK_BG),
        "icon-512.png": render_icon(cat, 512, DARK_BG),
        "icon-192.png": render_icon(cat, 192, DARK_BG),
        "icon-512-light.png": render_icon(cat, 512, LIGHT_BG),
        "icon-192-light.png": render_icon(cat, 192, LIGHT_BG),
    }
    for name, image in outputs.items():
        path = ROOT / name
        image.save(path, "PNG", optimize=True)
        print("wrote", path.name, image.size)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
