Here’s a complete design plan in Markdown that you can treat as a working document for the **Adjacent Science** site. It builds from your existing HTML, the purple palette, and your choice of **IBM Plex Sans** for titles. Everything is structured so you can move directly into implementation.

---

# Adjacent Science — Design System Plan 

## 1. Concept

**Theme:** *Luminous intelligence* — science rendered with depth, precision, and quiet intensity.
**Mood:** Analytical but modern. Confident, minimal, data-driven.
**Analogy:** A deep-space interface for human understanding — dark indigo voids, glowing lines of insight.

The design language should feel like the GUI of a research lab: deliberate, uncluttered, and built around clarity of information.

---

## 2. Core palette

| Role               | Colour             | Hex       | Usage                      |
| ------------------ | ------------------ | --------- | -------------------------- |
| Background (main)  | Deep violet-black  | `#0D0820` | Body background            |
| Surface            | Indigo             | `#1B1037` | Cards, panels              |
| Overlay            | Muted royal purple | `#2E1B56` | Hover or overlay panels    |
| Primary accent     | Electric violet    | `#A044E3` | Buttons, key links         |
| Secondary accent   | Neon magenta       | `#E73FB3` | Gradients, active states   |
| Highlight          | Cold cyan          | `#4FC1E9` | Data highlights, icons     |
| Text (main)        | Off-white          | `#EAE2FF` | Body copy                  |
| Text (secondary)   | Lavender-grey      | `#B5A8E0` | Subtext                    |
| Disabled / divider | Muted purple-grey  | `#6E5C99` | Borders, subtle lines      |
| Success            | Aqua-green         | `#4FE9B5` | Data or analytics feedback |

**Gradients**

* `primary-gradient`: linear 135°, `#A044E3 → #E73FB3`
* `secondary-gradient`: linear 135°, `#4FC1E9 → #A044E3`

---

## 3. Typography

| Element            | Typeface          | Weight  | Style / Usage                          |
| ------------------ | ----------------- | ------- | -------------------------------------- |
| Headings (h1–h3)   | **IBM Plex Sans** | 600–700 | Distinctive, compact letter-spacing    |
| Body, nav, UI      | **Inter**         | 400–500 | Default system copy                    |
| Mono / data tables | **IBM Plex Mono** | 400     | Optional for code or small data labels |

### Typographic scale (rem-based)

| Level | Size     | Notes               |
| ----- | -------- | ------------------- |
| h1    | 2.4rem   | Hero titles         |
| h2    | 1.8rem   | Section titles      |
| h3    | 1.4rem   | Sub-section         |
| body  | 1rem     | Standard copy       |
| small | 0.875rem | Footnotes, captions |

Letter-spacing:

* Tighten headings by -0.015em.
* Line-height: 1.3–1.4 for headings, 1.6 for paragraphs.

### Text tone

Plainspoken, factual, no ornament. Break long sentences into clear clauses. Avoid slogans.

---

## 4. Layout and spacing

* **Container width:** max 1200px, padding 2rem sides.
* **Grid:** 12-column flex grid; sections spaced by 6–8rem vertically.
* **Whitespace:** generous; avoid visible box outlines where possible.
* **Cards:** slightly translucent surface (`rgba(46,27,86,0.6)`) with `backdrop-filter: blur(8px)`.
* **Shadows:** soft purple glow `0 0 20px rgba(160,68,227,0.2)` for depth.

---

## 5. Components

### Header / Navigation

* Background: semi-transparent overlay over `#0D0820`, blur 8px.
* Active link underline: 2px, gradient from `#A044E3 → #E73FB3`.
* Theme toggle icon: animate between sun and moon with opacity fades.

### Hero section

* Background: radial gradient from `#1B1037` to `#0D0820`.
* h1 uses **IBM Plex Sans 700**, text-fill gradient using `primary-gradient`.
* Subtitle (`Inter 400`, `#B5A8E0`) constrained to 60ch max width.

### Buttons

| State     | Background                   | Text      | Border              | Notes           |
| --------- | ---------------------------- | --------- | ------------------- | --------------- |
| Default   | `#A044E3`                    | `#EAE2FF` | none                | Slight shadow   |
| Hover     | gradient `#A044E3 → #E73FB3` | `#FFF`    | none                | Transition 0.2s |
| Active    | `#E73FB3`                    | `#FFF`    | none                | Pressed effect  |
| Secondary | transparent                  | `#4FC1E9` | `1px solid #4FC1E9` | For minor CTAs  |

Rounded corners: 8px; padding: 0.75rem 1.5rem.

### Cards

* Use subtle glow (`box-shadow: 0 0 12px rgba(160,68,227,0.15)`).
* Hover state: raise + blur increase + tint with `#2E1B56`.

### Links

* Base colour `#A044E3`, underline appears on hover.
* Focus ring: 2px cyan glow.

### Icons

* Stroke width 1.5px; colour `#B5A8E0`.
* Hover transitions to `#4FC1E9`.

---

## 6. Imagery and graphics

* **Visual motif:** abstract network patterns, line fields, and point constellations in semi-transparent cyan/magenta overlays.
* **Blend mode:** use `mix-blend-mode: screen` for light on dark.
* **Illustrations:** line-based, SVG only, low opacity (0.3–0.6).
* **Avoid photos** except for leadership profile; use subtle desaturation and violet tint overlays.

---

## 7. Motion and transitions

* Global transition: `all 0.2s ease-out`.
* Hover: scale up to 1.03.
* Button press: scale down to 0.97.
* Hero gradient: animated slow shift (CSS keyframes, 20s loop, subtle).

All motion should feel more like breathing than blinking—nothing bouncy.

---

## 8. Accessibility

* Minimum contrast ratio: 4.5:1 for all text.
* Use `prefers-reduced-motion` media query to disable animations.
* Keyboard focus visible at all times.
* Links clearly underlined or distinguished by hue and brightness.

---

## 9. System implementation

### Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

### CSS variables (suggested)

```css
:root {
  --bg: #0D0820;
  --surface: #1B1037;
  --accent: #A044E3;
  --accent2: #E73FB3;
  --highlight: #4FC1E9;
  --text: #EAE2FF;
  --text2: #B5A8E0;
  --muted: #6E5C99;
}
```

### Example

```css
body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

h1, h2, h3 {
  font-family: 'IBM Plex Sans', sans-serif;
  color: var(--text);
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}
a:hover { color: var(--accent2); }
```
