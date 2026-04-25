# DESIGN_SPEC.md — Inema Arts Centre Website

> Read this file at the start of every Claude Code session before writing any code.

---

## What is Inema Arts Centre

A contemporary art gallery and community space in Kigali, Rwanda. Founded in 2009. It is pluralistic — no single house style. Artists work in sculpture, painting, mixed media, collage, and installation. The work is deeply Rwandan and East African in subject matter but globally literate in technique. Raw, joyful, serious, communal.

The website should feel like walking into the gallery: white walls, art doing the talking, nothing competing with the work. But with motion — the site should feel alive.

---

## Tech Stack

- **Framework**: Next.js 14 (app router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Smooth scroll**: Lenis (@studio-freight/lenis)
- **Fonts**: Google Fonts via next/font — Playfair Display + Inter
- **Canvas/generative**: Plain canvas API (no Three.js unless explicitly added later)

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Teal | `#1BBFA0` | Primary accent, italic text, tags, CTAs, separators |
| Purple | `#8B3FE8` | Secondary accent, tags, floating shapes |
| Red | `#E8402A` | Tertiary accent, tags, bottom bar |
| Amber | `#F5A623` | Quaternary accent, floating shapes only |
| Black | `#111111` | Body text, nav, dark cards |
| Deep dark | `#0d0d1a` | Dark card backgrounds |
| Off-white | `#f5f0eb` | Light card backgrounds |
| White | `#ffffff` | Page background, hero background |
| Muted | `#bbbbbb` | Subtext, hero location line |
| Faint | `#eeeeee` | Borders, dividers |

Never use pure `#000000`. Never use Bootstrap blue or generic grays not in this palette.

---

## Typography

### Display text (headings, card titles, editorial)
- Font: **Playfair Display**
- Weight: 400 (regular) only — never bold Playfair
- Italic: used for accent words, always colored `#1BBFA0`
- Hero h1: 64px, line-height 0.97
- Card titles: 22px, line-height 1.15
- Section quotes: 28px, line-height 1.1

### UI text (nav, labels, tags, subtitles, CTAs)
- Font: **Inter**
- Weights: 300 (light) and 400 (regular) only — never 500+ for UI
- Nav links: 11px, weight 300, uppercase, letter-spacing 0.12em
- Tags/pills: 10px, weight 400, uppercase, letter-spacing 0.08em
- Subtitles: 10–11px, weight 300, uppercase, letter-spacing 0.1–0.14em
- CTAs: 11px, weight 400, uppercase, letter-spacing 0.13em, border-bottom only (no button box)

---

## Layout

- Max content width: none — full bleed
- Grid gap: 10px throughout card grid
- Card border-radius: 14px throughout
- Page background: `#ffffff`
- No drop shadows anywhere
- No gradients on solid-color cards (gradients allowed only inside canvas/generative elements)

---

## Components & Sections (in order)

### 1. Nav
- Left: "Inema Arts Centre" — Playfair Display 13px, uppercase, letter-spacing 0.1em, `#111`
- Right: "Exhibitions", "Artists", "Visit", "Shop" — Inter 11px, weight 300, uppercase, `#999`
- "Book ↗" in `#1BBFA0`
- Border bottom: `0.5px solid #eee`
- No background blur, no sticky (for now)

### 2. Hero
- Full viewport height, white background
- **Portrait** (`/public/blue-shirt.png`):
  - Already has transparent background
  - `mix-blend-mode: multiply` — white in the image disappears into the page
  - Right-anchored, bottom of hero, height ~95vh
  - Ambient float: `translateY(-16px)` over 9s, ease-in-out, infinite
  - Mouse parallax: portrait shifts subtly toward cursor. Max tilt 1.5deg, max shift 12px. Use Framer Motion `useMotionValue` + `useTransform`
- **Title**: "Art that moves you." — "moves" is `<em>` in italic `#1BBFA0`
- **Particle canvas**: behind everything. 60 dots in palette colors, slow drift, opacity 0.06–0.18
- On scroll: title fades + slides up via `useScroll` + `useTransform`

### 3. Ticker
- Single scrolling line between hero and cards
- Border top + bottom: `0.5px solid #eee`
- Content: "Recycled Futures · Open Studio Fridays · Artist Residency 2026 · Mixed Media · Sculpture · Painting · Community Space · Kigali Rwanda"
- `·` separators colored `#1BBFA0`
- Inter 10px, weight 300, uppercase, letter-spacing 0.14em, color `#ccc`
- Pure CSS animation, 22s linear infinite, seamless loop

### 4. CardGrid
- 3-column grid, 10px gap, 10px padding
- **Video hover behavior** (key feature):
  - Each card has a `<video>` element: autoplay, muted, loop, playsInline
  - On mouseenter: video plays, fades in over 0.4s via Framer Motion
  - On mouseleave: video pauses, fades out
  - Video paths: `/public/videos/card1.mp4`, `card2.mp4`, `card3.mp4`
- **Scroll entrance**: all cards use Framer Motion `whileInView`, stagger 0.15s, slide up 30px + fade in

Card specs:
- **Card 1**: 280px tall, bg `#0d0d1a`. Tag: "Now on view" bg `#8B3FE8`. Title: "Recycled Futures". Subtitle: "Sculpture · Mixed media"
- **Card 2**: 280px tall, bg `#1BBFA0`. Rotating SVG spiral (25s CSS). Tag: "Signature work". Title: "The spiral series"
- **Card 3**: 280px tall, bg `#111`. Scrolling crowd of tiny figures across top. Tag: "Community" bg `#E8402A`. Title: "Where Kigali creates". Subtitle: "Every Friday · Free entry"

### 5. CanvasSection
- 2-column row below CardGrid, 10px gap
- **Left box** (1/3 width, 200px tall, bg `#0a0a0a`, border-radius 14px):
  - Canvas API: 18 colored rectangles floating + rotating, wrapping edges
  - Colors from palette, opacity 0.12–0.32
  - Label: "Fragments in motion" — Playfair Display 18px white, bottom-left
- **Right box** (2/3 width, bg `#f5f0eb`, border-radius 14px):
  - "Art belongs to everyone." — Playfair Display 28px, "everyone." italic `#1BBFA0`
  - "Apply now ↗" button: bg `#111`, white text, border-radius 24px
  - Floating shapes behind text at very low opacity (CSS animation only)

### 6. Footer row
- 2-column grid, 10px gap
- **Left**: bg `#8B3FE8`. Label: "Visit us". Text: "KG 14 Ave, Kigali". Sub: "Open daily 9am – 6pm"
- **Right**: bg `#E8402A`. Label: "Shop". Text: "Own a piece of Kigali". CTA: "Browse shop ↗"

---

## Animation Principles

- **Everything that enters the viewport should animate in** — no element just "appears"
- Entrance: slide up 20–30px + fade in, duration 0.6s, ease out
- Stagger between sibling cards: 0.15s
- Scroll parallax: portrait at 0.85x scroll speed
- Ambient motion (floating, drifting) should be slow and subtle — never distracting
- Hero text exits on scroll: fades + slides up
- Hover on cards: video fades in at 0.4s — this is the signature interaction
- Lenis handles scroll smoothness — do not fight it with Framer Motion scroll listeners directly. Use `lenis.on('scroll', cb)` to feed offset into a Framer `MotionValue` if needed

---

## What to avoid

- No Bootstrap, no MUI, no component libraries
- No drop shadows
- No gradients on flat colored cards
- No bold Playfair Display
- No Inter weight 500 or higher in UI
- No sticky nav (yet)
- No page transitions (yet)
- No dark mode (yet)
- Never use `#000000` — use `#111111`
- Never center-align body text
- Never use generic gray (`#888`, `#666`) — use palette colors or `#bbb` / `#aaa` for muted

---

## File structure

```
app/
  layout.tsx       ← Lenis wrapper, font loading
  page.tsx         ← imports all section components
components/
  Nav.tsx
  Hero.tsx
  Ticker.tsx
  CardGrid.tsx
  CanvasSection.tsx
  Footer.tsx
lib/
  useLenis.ts      ← custom hook: initializes Lenis, exposes instance
public/
  blue-shirt.png   ← portrait, already transparent background
  videos/
    card1.mp4      ← drop in later
    card2.mp4
    card3.mp4
```

---

## Vibe reference

- **nga.gov** — white space, editorial typography, art as the hero
- **Framer Motion** — for all entrance and hover animations
- **Lenis** — for the silky scroll feel
- The site should feel like the gallery itself: white, quiet, intentional — but with the energy of Inema's actual work. Things move. Art breathes.
