---
version: alpha
name: "H&M"
website: "https://www2.hm.com"
description: >-
  A Swedish fast-fashion retailer (the H&M Group, Inditex's main global competitor) whose marketing chrome runs entirely on pure black-and-white with the red H&M logo as the single held-in-reserve voltage — the red #e50010 is wired into 28 CSS variables as `--base-brand-logo`, `--base-favourite`, and `--product-sale`, but it never renders as a CTA background or as body chrome above the fold. HM Sans Regular and HM Sans Semi Bold (with the Hebrew HMSansHebrew-Regular variant for RTL locales) carry every body, label, button, and nav surface; uppercase 14px tracking-normal nav links dominate the page at frequency 36. The radius scale is zero — only a single 50% circle on the cart-count badge across all 802 scanned elements; every CTA, card, and tile renders as a pure-rectangle. A 612-occurrence near-black `--base-text` floor and a 14-occurrence white surface carry the entire chrome.

seo:
  title: "H&M Design System for React — monochrome chrome, HM Sans, red logo voltage, 16 components"
  metaDescription: "H&M's marketing chrome captured as a DESIGN.md spec. Pure monochrome above the fold, HM Sans Regular/Semi Bold across every tier, red #e50010 held for the logo and the sale palette only. Tokens for React, Next.js, and AI coding tools."
  highlights:
    - "Held-in-reserve red voltage — H&M red #e50010 is wired into 28 CSS vars (`--base-brand-logo`, `--base-favourite`, `--product-sale`, `--fds-color-fill-logo`) but never renders as a CTA fill or as body chrome above the fold"
    - "HM Sans across every tier — the proprietary humanist sans runs 14px / 400 nav links (uppercase) and 12px / 400 body, with HM Sans Semi Bold at weight 500 for the rare emphasis moment; the Hebrew variant HMSansHebrew-Regular handles RTL locales"
    - "Zero-corner geometry — only one borderRadius declared across 802 scanned elements (50% on the cart-count badge); every CTA, card, tile, and modal renders as a pure-rectangle"
    - "Single saturated red — the brand red #e50010 is the only chromatic moment in the structural palette; the secondary brand-Friday navy #374894, sustainability green, and cyber-Monday accents are scoped to seasonal-campaign tokens and don't share the page"
    - "Two-typeface system — HM Sans Regular at weight 400 for body / nav / labels, HM Sans Semi Bold at weight 500 for emphasis; no weight 700+ tier anywhere on the captured page"
  tags:
    - "E-commerce & Retail"
  lastUpdated: "2026-05-19"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    H&M's marketing chrome does something its Inditex rival ZARA also does, but with a single critical difference: it gives the entire above-fold chrome to black-and-white, then holds one held-in-reserve red voltage in a single wired CSS variable that lights up only the logo and the sale-price palette. The hero is a full-bleed runway-photography moment — a fashion editor's blurred-motion campaign shot, then a tiled grid of model close-ups in white-on-cream styling, then a product-card grid of cardigans, jackets, dresses, and skirts laid out flat against the canvas. The single chromatic moment in the page chrome is the red H&M wordmark in the top-right of the nav, sitting at native brand weight against the white canvas. Where ZARA holds zero voltage above the fold and lets the runway photography do every chromatic job, and where Uniqlo paints its hero red as a constant marketing fill, H&M splits the difference: zero accent in the body chrome, one held-in-reserve red on the logo and the sale chip.

    The DESIGN.md file packages the system into a machine-readable spec for React tooling. Inside: 17 color tokens drawn from a near-monochrome palette (pure #ffffff at frequency 14 as bg, pure #000000 at frequency 612 as text / border / icon — the dominant load-bearing structural color), three near-black variants for chat-widget overrides and pressed states, a 5-occurrence mid-grey #737373 for placeholder text, plus the H&M red #e50010 reserved for the brand logo and the sale palette. Twelve typography tokens span HM Sans Regular (weight 400) and HM Sans Semi Bold (weight 500) from 12px caption up to 14px uppercase nav-link; the Hebrew variant HMSansHebrew-Regular handles RTL locales like the Israeli site captured here. The radius scale is zero — only one 50% radius for the cart-count badge across 802 scanned elements.

    Feed this file to Claude or Cursor and it reproduces H&M's specific moves: monochrome chrome carrying every CTA / nav / label surface, red held in reserve for the logo and the sale chip only, HM Sans at weight 400 across body and nav with weight 500 reserved for the rare emphasis moment, 0px corners universally on every CTA / card / tile, and uppercase tracking-normal nav-links at 14px as the dominant typographic tier. The token references resolve cleanly — `{colors.canvas}` for the white floor, `{colors.ink}` for the black ink, `{colors.brand-red}` for the held-in-reserve logo color — so the AI never has to invent a value. The disciplined move worth borrowing is the held-in-reserve red pattern: a single chromatic voltage wired into 28 semantic CSS vars (`--base-brand-logo`, `--product-sale`, `--fds-color-fill-logo`, `--base-favourite`, `--base-notification`) but never used as a CTA background or as body chrome.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www2.hm.com"
      title: "H&M — official site"
      description: "H&M's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is H&M's primary brand color?"
      answer: "H&M's brand color is the red #e50010, wired into the CSS as `--base-brand-logo`, `--base-favourite`, `--base-notification`, `--product-sale`, `--product-scarcity`, `--fds-color-fill-logo`, `--fds-sale-palette-icon`, `--fds-color-text-discount`, `--fds-color-icon-discount`, plus 19 more brand-Friday and sale-palette vars — 28 declared semantic locations in total. Despite the variable count, the red appears 0 times as a background fill, 0 times as a text color, and 0 times as a border in the captured marketing chrome above the fold. It renders only on the H&M wordmark logo at the top-right of the nav and on the sale-price chip overlays on product tiles below the fold. The chrome itself is pure black-on-white; the red is held entirely in reserve for the logo and the sale palette."
    - id: "typography"
      title: "What typeface does H&M use, and what should I use as a substitute?"
      answer: "H&M's marketing site runs two members of the HM Sans family. HM Sans Regular at weight 400 carries body, nav links, button labels, and h2 headings (frequency 36 — the dominant tier). HM Sans Semi Bold at weight 500 carries the rare emphasis moments — section heading h2s and strong-emphasis spans. The Hebrew variant HMSansHebrew-Regular and HMSansHebrew-SemiBold appear in the captured Israeli-locale page as the RTL fallback. The full font stack walks `\"HM Sans Regular\", HMSansHebrew-Regular, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro, Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif` — the system supports Latin, Hebrew, and Japanese locales natively. There is no weight 700+ tier rendered on the captured page. The closest open-source substitute is Inter at weight 400 / 500; the metrics transfer cleanly."
    - id: "rounding"
      title: "What corner-radius scale does H&M use?"
      answer: "The radius scale is essentially zero. The captured page renders only one borderRadius value across 802 scanned elements: 50%, with a frequency of 1, used on the cart-count badge (the small numeric pill that shows how many items are in your bag). Every CTA renders as a pure-rectangle, every product card renders flush-corner, every modal corner sits at 0px. There is no 4px / 8px / 12px middle tier. The system is deliberately rectilinear — closer to ZARA's runway-magazine convention than to a retail-tile convention. The structural ckickability is signaled by background-color flips and hairline borders rather than by rounded corners."
    - id: "seasonal-campaign-tokens"
      title: "Why does H&M declare so many palette tokens for Black Friday, Cyber Monday, and Sale?"
      answer: "H&M's design system declares a full set of seasonal-campaign palettes as named variable groups: `--black-friday-palette-*` (5 vars covering background / text / interactive / logo), `--cyber-monday-palette-*` (also 5 vars, with the navy #374894 as the primary), `--sale-palette-*` (the H&M red #e50010 as the primary), `--deals-palette-*` (also red), `--gift-giving-palette-*` (uses black on white plus gold accents), and `--member-palette-*` (loyalty-tier vars). Each palette is a complete sub-theme — interactive color, text, border, primary, headline, logo — wired as a unified group so a Black Friday banner can apply `palette: black-friday` and re-skin every component without overriding individual tokens. Outside the seasonal-campaign surface, none of these palettes share the marketing chrome; the base chrome remains pure black-on-white."
    - id: "non-latin-typography"
      title: "Why does H&M wire Japanese and Hebrew fallback fonts into every font-family declaration?"
      answer: "H&M ships in 75+ markets with native typography for each locale. The font-family stack walks `\"HM Sans Regular\", HMSansHebrew-Regular, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro, Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif` — the system supports Latin (HM Sans Regular), Hebrew (HMSansHebrew-Regular), Japanese (ヒラギノ角ゴ Pro W3 / Hiragino Kaku Gothic Pro / Osaka / メイリオ / ＭＳ Ｐゴシック / MS PGothic), and generic sans fallback in a single stack. The Israeli site captured here renders the Hebrew variant; the Japanese site renders the Hiragino variants; the rest of the world falls through to HM Sans Regular. The font-tag-nav-xl-locale-ko-kr / -ja-jp / -ro-ro custom properties further declare per-locale font-size and font-stretch overrides — the system internationalizes typography much more aggressively than ZARA does."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own fashion-retail site?"
      answer: "Yes — the file is designed to be fed into Claude, Cursor, or any AI tool that reads structured design tokens. The agent will reproduce H&M's specific moves: monochrome chrome carrying every CTA / nav / label surface above the fold, red held in reserve for the logo and the sale chip only, HM Sans at weight 400 across body and nav with weight 500 reserved for emphasis, 0px corners universally, and uppercase tracking-normal nav-links at 14px as the dominant typographic tier. You can also reference the tokens directly: every hex, font name, radius, and spacing value is a quoted scalar you can paste into Tailwind config or CSS variables. The disciplined move worth borrowing is the held-in-reserve red pattern — a single chromatic voltage wired into 28 semantic CSS vars but never used as a CTA background or as body chrome. It only works if you have one chromatic mark (a logo, a heart-favourite icon, a sale chip) strong enough to carry the brand recognition without becoming a constant fill."

mockups:
  - "marketing-hero"
  - "media-grid"

colors:
  canvas: "#ffffff"
  ink: "#000000"
  ink-mid: "#737373"
  ink-soft: "#323232"
  hairline: "#e6e6e6"
  hairline-soft: "#d9d9d9"
  surface-low: "#f2f2f2"
  brand-red: "#e50010"
  brand-friday-navy: "#374894"
  warning-bronze: "#cc7d00"
  energy-yellow: "#ffed42"
  sale-orange: "#de6637"
  swatch-yellow: "#f0d700"

typography:
  display-md:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 17px
    letterSpacing: 0
  heading-md:
    fontFamily: "\"HM Sans Semi Bold\", HMSansHebrew-SemiBold, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 17px
    letterSpacing: 0
  body-md:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0
  body-sm:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  caption:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 14.28px
    letterSpacing: 0
  nav-link:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 17px
    letterSpacing: 0
  uppercase-md:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 17px
    letterSpacing: 0
  uppercase-sm:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 14.28px
    letterSpacing: 0
  emphasis-md:
    fontFamily: "\"HM Sans Semi Bold\", HMSansHebrew-SemiBold, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
  button-md:
    fontFamily: "\"HM Sans Regular\", HMSansHebrew-Regular, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0

rounded:
  none: "0px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "0px 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "0px 24px"
    height: "56px"
    borderColor: "{colors.ink}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "0px 16px"
    height: "48px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "0px 16px"
    height: "48px"
  brand-wordmark:
    backgroundColor: "transparent"
    textColor: "{colors.brand-red}"
    typography: "{typography.uppercase-md}"
    padding: "0px"
  hero-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "0px"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.heading-md}"
  body-paragraph:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  small-caps-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.uppercase-sm}"
  product-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px"
  sale-chip:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.canvas}"
    typography: "{typography.uppercase-sm}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
    height: "18px"
  cart-count-badge:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.canvas}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0px"
    height: "16px"
  favourite-icon:
    backgroundColor: "transparent"
    textColor: "{colors.brand-red}"
    typography: "{typography.body-md}"
    padding: "0px"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "48px 24px"
  category-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.uppercase-sm}"
    rounded: "{rounded.none}"
    padding: "16px 0px"
---

## Overview

H&M's marketing chrome does something its Inditex rival ZARA also does, but with a single critical difference. **Held-in-reserve red.** The above-fold chrome runs on pure black-and-white — every CTA, every nav-link, every body paragraph, every product-tile caption — and the single chromatic moment in the page chrome is the H&M red wordmark in the top-right of the nav. The red `{colors.brand-red}` (#e50010) is wired into 28 semantic CSS variables (`--base-brand-logo`, `--base-favourite`, `--base-notification`, `--product-sale`, `--product-scarcity`, `--fds-color-fill-logo`, `--fds-sale-palette-icon`, `--fds-color-text-discount`, plus 19 more), but it renders as a background fill exactly zero times in the captured marketing chrome above the fold. Where Uniqlo paints its entire hero red as a constant brand fill, and where ZARA holds zero voltage and lets the runway photography do every chromatic job, H&M splits the difference: black-on-white chrome with one chromatic voltage held in reserve for the logo, the heart-favourite icon, and the sale-price chip.

The system's CSS variable density is the strongest signal that H&M treats its design system as a load-bearing engineering artifact. The captured page exposes over 350 `--fds-*` and `--base-*` custom properties (the FDS — Fashion Design System — prefix is internal H&M Group nomenclature shared with sister brands COS, &OtherStories, Arket, Monki, and Weekday). Each palette is declared as a complete sub-theme: `--black-friday-palette-*` for the Black Friday surface, `--cyber-monday-palette-*` for the navy-blue Cyber Monday surface, `--gift-giving-palette-*` for the gift-card pages, `--member-palette-*` for the loyalty-tier chrome, `--sale-palette-*` and `--deals-palette-*` for the sale-price layouts. The base chrome remains pure black-on-white; the seasonal-campaign chrome is what introduces the chromatic shifts.

Typography is HM Sans across every tier — a two-family system. **HM Sans Regular** at weight 400 carries body, nav links, button labels, and h2 headings (frequency 36, the dominant typographic moment across the captured page). **HM Sans Semi Bold** at weight 500 carries the rare emphasis treatments — section heading h2s and strong-emphasis spans. The Hebrew variants HMSansHebrew-Regular and HMSansHebrew-SemiBold handle RTL locales (the captured page is the Israeli site, so Hebrew renders natively). There is no weight 700+ tier on the page; even hero headings render at 14px / weight 400.

**Key Characteristics:**
- Zero brand voltage above the fold in body chrome — `{colors.canvas}` #ffffff and `{colors.ink}` #000000 carry every CTA, nav, and label surface.
- Held-in-reserve red `{colors.brand-red}` (#e50010) wired into 28 semantic CSS vars (`--base-brand-logo`, `--product-sale`, `--fds-color-fill-logo`, `--base-favourite`, `--base-notification`) but used only on the logo wordmark, the heart-favourite icon, the sale-chip overlays, and the cart-count badge.
- Two-family HM Sans system — HM Sans Regular at weight 400 for body / nav / labels, HM Sans Semi Bold at weight 500 for the rare emphasis moment; no weight 700+ tier on the captured page.
- 0px corners universally — only one borderRadius declared across 802 scanned elements (50% on the cart-count badge); every CTA, card, tile, modal sits at flush-corner.
- Multi-locale typography — HMSansHebrew-Regular for RTL locales plus a Japanese-fallback stack (ヒラギノ角ゴ Pro W3 / Hiragino Kaku Gothic Pro / Osaka / メイリオ / ＭＳ Ｐゴシック / MS PGothic) wired into every font-family declaration.
- Seasonal-campaign palettes — Black Friday, Cyber Monday (`{colors.brand-friday-navy}` #374894 as primary), Sale, Deals, Gift-Giving, Member each declared as a complete sub-theme; outside the seasonal surface, none share the chrome.
- Pure black `{colors.ink}` at frequency 612 — the dominant load-bearing structural color (305 as text, 305 as border, 2 as bg).

## Colors

### Structural (carries the chrome)

- **Ink** (`{colors.ink}` — #000000): frequency 612. Used as text (305), border (305), bg (2). Wired as `--base-text`, `--base-primary-interactive`, `--high-contrast-dark`, `--fds-color-text-default`, `--default-palette-text`, `--inverted-palette-background`, plus 90+ other semantic locations. The dominant load-bearing structural color across the page — the body-text default on white surfaces and the border-default on every input and card edge.
- **Canvas** (`{colors.canvas}` — #ffffff): frequency 14. Used as text (1), bg (12), border (1). Wired as `--base-background-default`, `--default-palette-background`, `--fds-color-background-default`, `--base-background-card`, `--fds-color-fill-secondary`, plus 50+ other locations. The page floor and the dominant card surface.
- **Ink Mid** (`{colors.ink-mid}` — #737373): frequency 10. Used as text (5), border (5). Wired as `--base-text-placeholder`, `--base-secondary-interactive`, `--fds-color-text-subtle`, `--fds-color-icon-subtle`, `--base-tertiary-interactive-disabled`. The placeholder-text and de-emphasized secondary tier.
- **Ink Soft** (`{colors.ink-soft}` — #323232): frequency 1. Used as shadow (1). Wired as `--fds-color-fill-primary-pressed`, `--fds-on-dark-image-palette-primary-pressed`, plus 7 pressed-state variants. The pressed-state fill for primary CTAs and the lone shadow color on the page.

### Hairlines

- **Hairline** (`{colors.hairline}` — #e6e6e6): frequency 1. Used as bg (1). Wired as `--fds-color-fill-disabled`, `--fds-color-fill-info`, `--fds-color-fill-primary-inverse-pressed`, `--base-interactive-disabled`, `--fds-color-utility-skeleton-gradient-stop`. The skeleton-loader fill and the disabled-state surface tone.
- **Hairline Soft** (`{colors.hairline-soft}` — #d9d9d9): wired as `--base-decoration-secondary`, `--fds-color-border-inverse-subtle`, `--base-background-row-alternate`, `--base-tertiary-interactive`, `--product-membership`. The alternate-row background for tables and the secondary-tier interactive surface.
- **Surface Low** (`{colors.surface-low}` — #f2f2f2): wired as `--fds-color-fill-secondary-hover`, `--fds-color-background-sunken`, `--fds-color-fill-primary-inverse-hover`, `--fds-color-utility-skeleton-background`, `--fds-color-icon-inverse-subtle`. The hover-fill for secondary surfaces and the skeleton-background tone.

### Brand (held in reserve)

- **Brand Red** (`{colors.brand-red}` — #e50010): frequency 0 in captured body chrome. Wired as `--base-brand-logo`, `--base-favourite`, `--base-notification`, `--product-sale`, `--product-scarcity`, `--fds-color-fill-logo`, `--fds-sale-palette-icon`, `--fds-color-text-discount`, `--fds-color-icon-discount`, `--sale-palette-headline`, `--sale-palette-text`, `--sale-palette-logo`, `--deals-palette-logo`, plus 15 more — 28 declared semantic locations in total. The brand voltage, held entirely in reserve for the logo wordmark, the heart-favourite icon, the sale-price chip overlays, the cart-count badge, and the inline notification dots.

### Seasonal-campaign (scoped to sub-themes)

- **Brand-Friday Navy** (`{colors.brand-friday-navy}` — #374894): wired as `--cyber-monday-palette-interactive`, `--cyber-monday-palette-logo`, `--cyber-monday-palette-headline`, `--cyber-monday-palette-interactive-active`. The Cyber Monday sub-theme primary color; never appears in base chrome.
- **Warning Bronze** (`{colors.warning-bronze}` — #cc7d00): wired as `--fds-color-icon-warning`, `--fds-color-border-warning`, `--fds-color-text-warning`, `--fds-global-color-swatch-bronze`, `--tag-swatch-bronze`. The inline-warning tone and the bronze color-swatch tag for products.
- **Energy Yellow** (`{colors.energy-yellow}` — #ffed42): wired as `--energy-class-b` (an EU energy-rating label color), `--color-kakao-yellow`, `--fds-global-color-vendors-kakao-default`. Reserved for the EU energy-rating sticker on appliances and for the Kakao social-login button.
- **Sale Orange** (`{colors.sale-orange}` — #de6637): wired as `--deals-palette-primary` (in some markets) and the Sale-Banner accent. The secondary sale-palette color when the brand red is too saturated for a campaign.
- **Swatch Yellow** (`{colors.swatch-yellow}` — #f0d700): wired as `--color-kakao-yellow-active`, `--fds-global-color-swatch-yellow`, `--tag-swatch-yellow`, `--fds-global-color-vendors-kakao-active`. The product color-swatch tag for yellow garments.

## Typography

### Font Family

The system runs **HM Sans** for every body, nav, label, button, and heading surface — a two-weight proprietary humanist sans wired into the CSS. The full font stack walks `"HM Sans Regular", HMSansHebrew-Regular, "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, メイリオ, Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif`. The Hebrew variant HMSansHebrew-Regular handles RTL locales; the Japanese-fallback stack handles CJK locales; the rest of the world falls through to HM Sans Regular.

HM Sans is a two-family system: **HM Sans Regular** at weight 400 carries body, nav, button labels, and h2 headings (frequency 36 — the dominant tier). **HM Sans Semi Bold** at weight 500 carries the rare emphasis treatments — section heading h2s and strong-emphasis spans. There is no weight 700+ tier rendered on the page.

The system also declares **HM Slussen** in `--fds-text-nav-xl-*` vars for the extra-large navigation tier (when the system needs a heavier display weight on specific locales like ro-RO Romanian); the captured page does not render this tier.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-md}` | 14px | 400 | 17px | Hero heading ("Summer 2026: The vibrant edit"), h2 section titles |
| `{typography.heading-md}` | 14px | 500 | 17px | Section heading emphasis tier (HM Sans Semi Bold) |
| `{typography.body-md}` | 14px | 400 | 20px | Default running text, button labels, primary CTA copy |
| `{typography.body-sm}` | 12px | 400 | 16px | Footer copy, product-tile metadata, body paragraphs |
| `{typography.caption}` | 12px | 400 | 14.28px | Micro-metadata, sub-labels, dates |
| `{typography.nav-link}` | 14px | 400 | 17px | Top-nav links — uppercase, frequency 36 (the dominant tier) |
| `{typography.uppercase-md}` | 14px | 400 | 17px | h2 / h3 small-caps labels, category-tile headings — uppercase |
| `{typography.uppercase-sm}` | 12px | 400 | 14.28px | Small-caps labels, sale-chip text — uppercase |
| `{typography.emphasis-md}` | 12px | 500 | 16px | Emphasized labels (HM Sans Semi Bold) |
| `{typography.button-md}` | 14px | 400 | 16px | Primary CTA label |

### Principles

Body weight is uniformly **400**. Emphasis flips to weight 500 via the HM Sans Semi Bold family — never via a font-weight override on HM Sans Regular. There is no weight 700+ tier on the page; even the hero heading ("Summer 2026: The vibrant edit") renders at 14px / weight 400, deliberately quiet so the runway photography carries the visual weight.

Tracking is uniformly normal across every tier. Text-transform flips to uppercase on the nav-link, the small-caps label, the category-tile heading, and the sale-chip — those four roles carry the bulk of the page's typographic chrome at 14px / weight 400 / uppercase.

### Note on Font Substitutes

HM Sans is proprietary. **Inter** at weight 400 / 500 is the closest open-source substitute; the metrics transfer cleanly and the humanist proportions read close to HM Sans at the 12-14px body sizes. For the Hebrew RTL locale, **Heebo** is the closest open-source substitute for HMSansHebrew-Regular. The Japanese-fallback stack (Hiragino Kaku Gothic Pro / Osaka / Meiryo / MS PGothic) is what H&M ships, so no substitution is required for CJK locales.

## Layout

### Spacing System

- **Base unit:** 8px (with 16px as the dominant module).
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 48px · `{spacing.3xl}` 64px.
- **Section padding (vertical):** 8px is the dominant module (frequency 40 in the captured page), with 16px as the secondary step (10 occurrences). Larger section breaks step to 48-64px.
- **Card internal padding:** 0px on product tiles (the photography fills the tile edge-to-edge); 16px on the cookie banner and inline marketing tiles.
- **Nav padding:** 0x16 horizontal on the link items, with a 48-56px overall nav height.

### Grid & Container

- **Top nav:** white surface with the H&M red wordmark at the top-right, the hamburger menu icon at the left, and SHOPPING BAG / WISHLIST / LOG IN / HELP as right-aligned uppercase links.
- **Hero:** edge-to-edge runway-photography video with no overlay copy — the brand recognition carries entirely through the photography.
- **Editorial grid:** 2-column model close-ups in the upper editorial band, followed by a 6-column product-tile grid showing cardigans, jackets, dresses, skirts laid flat against the canvas, then a 2-column editorial band of styled-model shots.
- **Product-tile grid:** flush-corner tiles at 0px corner, with a small-caps caption beneath each product photo at 12px / weight 400 / uppercase.

### Rhythm

The page alternates between **edge-to-edge runway photography** (the hero), **constrained product grids** (the 6-column tile gallery), and **editorial styled-model bands** (the 2-column campaign moments). There is no atmospheric gradient between bands; every section terminates on the same pure-white canvas, and depth comes from the photography itself rather than from any background-color shift. The H&M red wordmark sits in the top-right of the nav as the single chromatic anchor for the entire page.

## Elevation

The system declares a `--base-z-axis-shadow` token mapped to pure white (#ffffff) — an explicit declaration that shadows do not exist on this surface, since the shadow tone matches the canvas. The captured page renders zero drop shadows on any surface: every CTA, every product tile, every modal sits flush on the canvas without any elevation cue beyond a hairline border or a tonal lift.

- **Flat (no shadow):** every above-fold surface — nav, hero, product tiles, editorial bands, footer. The shadow tone is declared as pure white explicitly, which mathematically eliminates the possibility of a visible shadow.
- **Hairline outlines:** `{colors.ink}` (#000000) at low opacity marks the CTA-secondary border and the input-field edge. Pure black is the only border tone in the chrome.
- **Tonal lift:** `{colors.surface-low}` (#f2f2f2) is the slightly-cool surface tone for the cookie banner and the chat-widget hover-fill, lifted off the pure-white canvas by ~3% lightness contrast.

## Shapes

The radius scale is **essentially zero**:

- `{rounded.none}` 0px — the universal corner treatment. Every CTA, every product tile, every input, every modal, every card sits at 0px. The only borderRadius value rendered on the captured page is the 50% radius for the cart-count badge.
- `{rounded.full}` 9999px — used only on the cart-count badge and the heart-favourite icon hit area, rendered as a full circle via 50% radius rather than a declared token.

There is no 2px / 4px / 8px / 12px / 16px middle tier. The system is deliberately rectilinear — a runway-magazine convention rather than a retail-tile convention. The H&M wordmark itself is set in a custom geometric serif (the historical Mårten Andersson lockup) and renders without any radius treatment at all.

## Components

**`button-primary`** — The signature CTA. Pure-black `{colors.ink}` fill, white text, `{rounded.none}` 0px corners, 0x24 padding, 56px height. The "ADD TO BAG" and "SHOP NOW" copy are the canonical instances — uppercase, 14px HM Sans Regular at weight 400.

**`button-secondary`** — White fill with black text and a 1px black border, `{rounded.none}` 0px corners. Used for "Sign in" and tertiary "Learn more" CTAs in the marketing tiles.

**`top-nav`** — White `{colors.canvas}` surface, 48px height, 0x16 padding, `{typography.nav-link}` link labels. The H&M red wordmark sits at the top-right; the hamburger menu icon sits at the left.

**`nav-link`** — Transparent background, ink text in `{typography.nav-link}` (14px / 400 / uppercase / 17px line-height), 0x16 padding, 48px height. SHOPPING BAG (with cart-count appended), WISHLIST, LOG IN, HELP, and the category-bar items (WOMEN, MEN, DIVIDED, BABY, KIDS, HOME, BEAUTY).

**`brand-wordmark`** — Transparent background, `{colors.brand-red}` (#e50010) text in a custom geometric serif. The single chromatic moment in the page chrome — sits in the top-right of the nav.

**`hero-heading`** — Ink text on transparent, `{typography.display-md}` (14px / 400 / 17px line-height). The "Summer 2026: The vibrant edit" copy and other hero h2 labels — deliberately quiet so the runway photography carries the visual weight.

**`section-heading`** — Ink text, `{typography.heading-md}` (14px / 500 / HM Sans Semi Bold / 17px line-height). The emphasis tier for section h2s.

**`body-paragraph`** — Default ink text at `{typography.body-sm}` (12px / 400 / 16px line-height). Footer copy, modal body text, product-tile metadata.

**`small-caps-label`** — Ink text, `{typography.uppercase-sm}` (12px / 400 / uppercase). The dominant section-label treatment in the editorial grids and the product-tile captions.

**`product-tile`** — White `{colors.canvas}` fill, ink text, `{rounded.none}` 0px corners, 0px padding (the photography fills the tile edge-to-edge). The 6-column product-tile grid below the editorial bands.

**`sale-chip`** — `{colors.brand-red}` (#e50010) fill, white text, `{rounded.none}` 0px corners, 2x6 padding, 18px height. The "SALE" / "-30%" overlays on product tiles — one of only three places the brand red renders on the page.

**`cart-count-badge`** — `{colors.brand-red}` fill, white text in `{typography.caption}`, `{rounded.full}` 50% radius (the only non-zero radius in the system), 16px height. The numeric pill that shows how many items are in your bag.

**`favourite-icon`** — Transparent background, `{colors.brand-red}` heart icon. Wired as `--base-favourite` — the third chromatic moment on the page besides the wordmark and the sale chip.

**`footer`** — White `{colors.canvas}` floor, ink text at `{typography.body-sm}` (12px / 400), 48x24 padding. The link grid columns sit on the white floor with 12px / 400 / sentence-case copy. No contrast band against the canvas — the footer continues the page floor.

**`category-tile`** — White fill, ink text in `{typography.uppercase-sm}` (12px / 400 / uppercase), `{rounded.none}` 0px corners, 16x0 padding. The category-bar items housed inside the top-nav.

## Do's and Don'ts

**Do** hold the brand red `{colors.brand-red}` (#e50010) for the logo, the heart-favourite icon, the sale chip, and the cart-count badge only. The 28 semantic CSS vars wire the red into more locations than the chrome actually uses; the discipline is in keeping the red rare so the wordmark recognition stays singular.

**Do** render every CTA as a pure-rectangle 0px-corner block. The "ADD TO BAG" / "SHOP NOW" buttons at 56px height with 0px corners are the canonical instances; adding even a 4px corner would shift the chrome toward retail-tile and away from runway-editorial.

**Do** use HM Sans Regular at weight 400 across body and nav, and reserve HM Sans Semi Bold at weight 500 for the rare emphasis moment. Switching to a font-weight override on HM Sans Regular (e.g. font-weight 700 on the Regular family) would skip the proprietary Semi Bold metrics and render in synthetic-bold, which the system explicitly avoids.

**Do** declare the full multi-locale font stack (`"HM Sans Regular", HMSansHebrew-Regular, ヒラギノ角ゴ Pro W3, …`) on every font-family rule. The system supports Latin, Hebrew, and Japanese natively in a single stack; truncating to just `HM Sans Regular, sans-serif` would break the RTL and CJK locales.

**Don't** apply `{colors.brand-red}` (#e50010) as a CTA background or as body text. It is wired into 28 semantic vars but renders as a background fill exactly zero times in the captured chrome above the fold; a red primary CTA would dilute the brand-wordmark voltage.

**Don't** introduce a 4px or 8px corner radius tier. The system renders at 0px universally (only one 50% radius occurrence on the cart-count badge across 802 scanned elements). Adding rounded corners to CTAs or cards would feel borrowed from a retail-tile aesthetic (Amazon, Wayfair) rather than from H&M's runway-editorial chrome.

**Don't** mix Cyber Monday navy `{colors.brand-friday-navy}` (#374894), sale-orange `{colors.sale-orange}` (#de6637), or the warning-bronze `{colors.warning-bronze}` (#cc7d00) into the base chrome. Each is scoped to a specific seasonal-campaign palette (`--cyber-monday-palette-*`, `--deals-palette-*`, warning states); rendering them outside their sub-theme breaks the palette-recognition convention.

**Don't** use the energy-yellow `{colors.energy-yellow}` (#ffed42) as a brand accent. It is wired as `--energy-class-b` (an EU energy-rating label color) and `--color-kakao-yellow` (the Kakao social-login button); using it on a chip or a CTA would falsely suggest a regulatory or third-party authentication context.

## Known Gaps

- **Hover and focus states:** the captured surface is the Israeli (Hebrew RTL) homepage. Hover treatments for the nav-link / CTA / product-tile are not exposed; the CSS declares `--fds-color-fill-secondary-hover` and `--fds-color-fill-primary-inverse-hover` on the muted-grey surface tone, but those are subordinate UI overrides only.
- **Product-detail-page (PDP) chrome:** the captured DESIGN.md covers the homepage entry state only. The PDP renders price-strikethrough red, fit-finder dropdowns, color-swatch tags, and size-selector chips that carry additional component-specific tokens not represented here.
- **Seasonal-campaign palettes:** Black Friday, Cyber Monday (`{colors.brand-friday-navy}` #374894), Sale, Deals, Gift-Giving, and Member each have their own complete sub-theme palette in CSS — primary, headline, interactive, logo, background — but the captured marketing chrome does not render any seasonal sub-theme. Those surfaces ship for limited windows (Black Friday week, Cyber Monday, sale events).
- **Sub-brand palettes:** the H&M Group ships under multiple labels (H&M, COS, & Other Stories, Arket, Monki, Weekday, Afound, Sellpy) and the FDS (Fashion Design System) declarations include shared and label-specific overrides; this spec captures the H&M-brand layer only.
- **Locale typography overrides:** the system declares per-locale font-family and font-size overrides (e.g. `--fds-text-nav-xl-locale-ja-jp-default-size-font-size-pt: 28.5`, `--fds-text-nav-m-locale-ko-kr-default-size-font-size-rem: 1.25rem`, `--fds-text-nav-xl-locale-ro-ro-font-family: HM Slussen`). The captured surface is the Israeli (he-IL) locale; the Korean, Japanese, Romanian, and Greek locale overrides are not represented here.
- **Motion:** the runway-hero auto-plays at full bleed; transitions on the hover-zoom of product tiles and on the modal entry/exit carry timing curves declared in JS rather than CSS. The spec captures end-state values only.
- **Dark mode:** H&M declares a partial `*-dark` and `*-inverse` token tier (`--fds-on-dark-image-palette-*`, `--inverted-palette-*`, `--high-contrast-dark`), suggesting an internal dark-image overlay treatment for product photography, but the marketing chrome itself does not flip to dark mode.
