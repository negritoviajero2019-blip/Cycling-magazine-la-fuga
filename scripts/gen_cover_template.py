"""
Plantilla estándar de carátulas de La Fuga (1600x900).

Guarda los parámetros de diseño acordados con el usuario el 21 de
septiembre de 2026: tamaño/posición del bloque de texto respecto a la
foto, tamaño de fuente, tipografía, y el nuevo lockup "LA FUGA /
CYCLING MAGAZINE" en la esquina inferior izquierda. Ajustado el mismo
día (2026-09-21, cover de Omar Andrade) a tamaños de texto más
grandes/con más presencia sobre la foto, y a degradado 100% opaco en
la zona sólida (antes 235/255, causaba "ghosting" de texto ya horneado
en fotos base). Este archivo es la referencia — cada script de
carátula por artículo debe copiar esta función en vez de reinventar el
layout.

Uso:
    from gen_cover_template import render_cover
    render_cover(
        src_path=...,          # foto de origen (cualquier tamaño; se recorta a 16:9)
        out_path=...,
        crop_top=...,          # offset vertical del recorte (ajustar por foto)
        label="ULTIMA HORA",   # etiqueta de categoría, arriba a la izquierda
        title_lines=[("EVENEPOEL GANA", "white"), ("SU CUARTA CRONO", "lime"), ...],
        subtitle_lines=["...", "..."],
    )
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 900
LIME = (183, 255, 60)
WHITE = (255, 255, 255)
SUBGRAY = (223, 226, 219)
BG = (13, 16, 12)

FONT_ANTON = "/Users/negritoviajero2019/Desktop/cycling-magazine/public/fonts/Anton-Regular.ttf"
FONT_INTER = "/Users/negritoviajero2019/Desktop/cycling-magazine/public/fonts/Inter-Regular.ttf"

COLORS = {"white": WHITE, "lime": LIME, "gray": SUBGRAY}


def _draw_text_isolated(target, xy, text, font, fill):
    """Dibuja cada línea en su propia capa transparente antes de compositar —
    evita el bug de Pillow/FreeType con glifos compuestos (p.ej. 'Č') sobre
    lienzos RGBA grandes derivados de una foto real."""
    bbox = font.getbbox(text)
    pad = 20
    w = bbox[2] - bbox[0] + pad * 2
    h = bbox[3] - bbox[1] + pad * 2
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text((pad - bbox[0], pad - bbox[1]), text, font=font, fill=fill)
    target.alpha_composite(layer, (int(xy[0] - pad), int(xy[1] - pad)))


def render_cover(
    src_path,
    out_path,
    label,
    title_lines,
    subtitle_lines,
    crop_top=100,
    anton_size=104,
    gradient_solid_end_frac=0.58,
    gradient_fade_end_frac=0.80,
):
    src = Image.open(src_path).convert("RGB")
    sw, sh = src.size
    crop_h = round(sw * 9 / 16)
    crop = src.crop((0, crop_top, sw, crop_top + crop_h))
    canvas = crop.resize((W, H), Image.LANCZOS).convert("RGBA")

    # degradado oscuro izquierda -> foto visible a la derecha. 100%
    # opaco en la zona sólida: a 235/255 el texto ya horneado en la
    # foto base (p.ej. una carátula previa reusada como fuente) se
    # alcanza a transparentar ("ghosting") por debajo del texto nuevo.
    gradient = Image.new("L", (W, 1), color=0)
    solid_end = int(W * gradient_solid_end_frac)
    fade_end = int(W * gradient_fade_end_frac)
    for x in range(W):
        if x < solid_end:
            a = 255
        elif x < fade_end:
            t = (x - solid_end) / (fade_end - solid_end)
            a = int(255 * (1 - t))
        else:
            a = 0
        gradient.putpixel((x, 0), a)
    gradient = gradient.resize((W, H))
    overlay = Image.new("RGBA", (W, H), BG + (255,))
    overlay.putalpha(gradient)
    canvas = Image.alpha_composite(canvas, overlay)

    # degradado superior, igualmente opaco, para que la etiqueta de
    # categoría respire y cubra cualquier texto horneado arriba
    top_grad = Image.new("L", (1, H), color=0)
    for y in range(H):
        a = 255 if y < 130 else max(0, int(255 * (1 - (y - 130) / 160)))
        top_grad.putpixel((0, y), a)
    top_grad = top_grad.resize((W, H))
    top_overlay = Image.new("RGBA", (W, H), BG + (255,))
    top_overlay.putalpha(top_grad)
    canvas = Image.alpha_composite(canvas, top_overlay)

    draw = ImageDraw.Draw(canvas)
    indent = int(W * 0.07)

    # ---- etiqueta de categoría + línea divisora a todo lo ancho ----
    label_font = ImageFont.truetype(FONT_INTER, 28)
    _draw_text_isolated(canvas, (indent, 50), label, label_font, LIME)
    label_w = label_font.getbbox(label)[2] + 28
    line_y = 50 + 15
    draw.line([(indent + label_w, line_y), (W - indent, line_y)], fill=(*LIME, 140), width=2)

    # ---- título (más grande, más presencia sobre la foto) ----
    title_font = ImageFont.truetype(FONT_ANTON, anton_size)
    y = 118
    line_h = int(anton_size * 1.02)
    for text, color_name in title_lines:
        _draw_text_isolated(canvas, (indent, y), text, title_font, COLORS[color_name])
        y += line_h

    y += 22
    draw.rectangle([indent, y, indent + 120, y + 7], fill=LIME)
    y += 40

    # ---- subtítulo ----
    sub_font = ImageFont.truetype(FONT_INTER, 32)
    for line in subtitle_lines:
        _draw_text_isolated(canvas, (indent, y), line, sub_font, SUBGRAY)
        y += 46

    # ---- lockup de marca, esquina inferior izquierda ----
    brand_font = ImageFont.truetype(FONT_ANTON, 36)
    brand_y = H - 100
    _draw_text_isolated(canvas, (indent, brand_y), "LA FUGA", brand_font, WHITE)
    rule_y = brand_y + 48
    draw.rectangle([indent, rule_y, indent + 74, rule_y + 3], fill=LIME)
    sub_brand_font = ImageFont.truetype(FONT_INTER, 16)
    _draw_text_isolated(canvas, (indent, rule_y + 11), "C Y C L I N G   M A G A Z I N E", sub_brand_font, SUBGRAY)

    final = canvas.convert("RGB")
    final.save(out_path, quality=92)
    return final.size
