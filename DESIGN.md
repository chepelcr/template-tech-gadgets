# Tech Gadgets — design plan

**Concept: Diseño industrial.** The store is a well-made device. Pages are
device faces built from modules — panels with a raised edge, recessed windows,
keys that press in — and the catalog reads like a spec sheet. The one bold
thing is a small radio on a plinth in the hero: its knobs turn toward the
pointer and its LED powers on once.

Serves: electronics and accessories shops, phone and computer repair, gaming
and smart-home sellers.

## Palette

| Token | Hex | Role |
|---|---|---|
| shell | `#E6E5E0` | page |
| panel | `#D3D1CA` | modules, recessed toolbars |
| dial | `#FAFAF8` | raised surfaces, windows, fields |
| graphite | `#2A2C2F` | headings, dark modules, the device |
| signal | `#E5601A` | the store's accent (org primary): keys, highlights |
| signal text | `#9C3A0B` | the accent as text (offers, small labels) |
| LED | `#2F8A42` | in-stock status |
| ink | `#1B1C1E` | body text, ink on the signal key |

Contrast (computed): graphite on shell 11.1:1 · on panel 9.2:1 · on dial
13.4:1 · signal text on shell 5.5:1 · on panel 4.6:1 · ink on signal 4.9:1 ·
soft ink `#55585C` on shell 5.7:1 · LED on shell 3.4:1 (indicator, always
paired with words). White on signal is 3.5:1, so the key uses dark ink.

## Type

**Schibsted Grotesk** only, 400–800, tabular figures everywhere (prices,
counts, the basket readout). Display 700 with tight tracking; no monospace
labels, no all-caps eyebrows.

## Layout

```
HOME
┌ module-raised (radius 36) ──────────────────────────────────────────┐
│ ● badge                     ┌──── radio on a plinth (three.js) ────┐ │
│ Equipos que funcionan       │  grille   [ dial window ]   (knob)    │ │
│ como deben                  │  ░░░░░░░  ● LED      (knob)           │ │
│ [Ver el catálogo] [Agendar] └────────────── ┌ CMS photo "screen" ┐ ┘ │
└──────────────────────────────────────────────────────────────────────┘
 Índice: category keys (thumb · name · count) ×5
 En el banco de pruebas: module grid 4×2 (offers first)
 benefits: one module split in three, key icons
 story module · graphite CTA module
CATALOG: title + count │ toolbar module: search · type segments · sort ·
grid/list │ category keys (scroll) · "solo ofertas" switch │ grouped modules
PRODUCT: photo on a plinth (7) │ name, text, spec sheet (category, LED
availability, duration, price) and the add key (5)
```

## Signature

`src/scenes/device.ts` (three.js 0.186, lazy chunk): rounded-box radio,
canvas-textured grille and dial, two knobs, an LED. Renders only when
something changes (pointer, the LED ramp, a resize), only while visible, at a
capped pixel ratio; everything is disposed on unmount. `DeviceArt` (SVG) is the
same drawing for reduced motion, `?webgl=0`, modest devices and failures.

Other motion answers an action: keys press in 1 px, the basket readout ticks
when something is added, sheets slide. No section fade-ups.

## Changed from the generic default

- Left the "near-black + acid accent" tech cliché: light shell, graphite,
  one signal orange.
- No gradient hero, no stats strip, no glassmorphism cards.
- Grid ⇄ list in the catalog: the list is a dense spec row with LED status.
- Category keys instead of image tiles with overlaid text.
