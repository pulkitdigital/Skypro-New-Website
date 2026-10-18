---
name: AeroElite Flight Academy
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1c32'
  on-primary-container: '#76849f'
  inverse-primary: '#b9c7e4'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#041942'
  on-tertiary-container: '#7283b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#b4c6f7'
  on-tertiary-fixed: '#041942'
  on-tertiary-fixed-variant: '#34466f'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  gutter-desktop: 2rem
  margin-desktop: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system embodies the disciplined precision, elite professionalism, and forward momentum of premier commercial aviation training. Built for ambitious student pilots, career changers, and military aviators transitioning to commercial airlines, the interface evokes institutional trust, high-altitude perspective, and aeronautical engineering sophistication.

The visual style blends **Corporate Modern** with **Aero-Minimalism and Subtle Glassmorphism**. Clean, expansive surfaces mimic clear horizon lines and flight deck instrument panels. High-contrast legibility ensures complex regulatory frameworks (DGCA requirements, hour-logging, multi-engine ratings) remain digestible and actionable. Thin aeronautical vector contours, flight telemetry accents, and golden insignia highlights ground the digital environment in the authentic prestige of global aviation.

## Colors

The palette balances authoritative deep naval tones with radiant flight-deck warning and beacon accents.

- **Primary (`#0A192F` - Cockpit Navy):** Serves as the primary anchor for dominant structural elements, dark mode hero containers, key branding marks, and high-emphasis headings.
- **Tertiary (`#0D2149` - Stratosphere Blue):** Works alongside the primary to deliver rich visual depth across card backdrops, header banners, and structured navigation panels.
- **Secondary (`#F59E0B` - Aviator Amber Gold):** Reserved for primary conversion hooks, golden wing insignias, flight step badges, active state indicators, and credential verification marks. Use sparingly to maintain luxury status and visual urgency without dilution.
- **Neutral (`#64748B` - Slate Horizon):** Powers technical specs, syllabus metadata, breadcrumb paths, and secondary informational text. 

Canvas surfaces utilize clean, crisp cool whites (`#FFFFFF` to `#F8FAFC`) with subtle blue-gray tinted borders (`#E2E8F0`) to ensure prolonged daylight reading comfort and surgical contrast.

## Typography

The typographic hierarchy establishes clear command and aerospace precision.

- **Headlines (Outfit):** Geometric, streamlined, and modern. Its open letterforms and controlled terminals give section headings the architectural clarity of modern air terminals and flight deck instrument designs.
- **Body Text (Plus Jakarta Sans):** Highly readable humanist geometric sans-serif that ensures long-form requirements, instructor biographies, and curriculum modules read smoothly across screens of all pixel densities.
- **Labels, Badges, & Metrics (Inter):** Neutral, robust, and clear at micro-scales. Configured with extended tracking for flight requirement metrics, DGCA codes, flight hours, and button calls to action.

## Layout & Spacing

The layout model runs on a structured **12-column fluid grid** system engineered for structured scanability and content density balance:

- **Desktop (1024px+):** 12-column grid, max-width `1280px`, `gutter-desktop` of `2rem` (32px), and page canvas `margin-desktop` of `4rem` (64px). Complex course grids and requirement timelines utilize symmetrical 3-column and 4-column module spans.
- **Tablet (768px - 1023px):** 8-column layout, `1.5rem` (24px) gutters, and `2rem` (32px) margins. Multi-column cards collapse gracefully to dual-column stacks.
- **Mobile (below 768px):** 4-column layout, `1rem` (16px) gutters, and `1.25rem` (20px) outer margin padding. Timelines and sequence pathways reflow into single-column vertical track lines.

Vertical section flow maintains an open, unconstrained rhythm with `space-2xl` intervals between content blocks to evoke the vastness of flight horizons.

## Elevation & Depth

Visual hierarchy uses a hybrid of **Tonal Layering** and **Crisp Aerospace Glassmorphism**:

1. **Base Tier (Ground Level):** Pure white (`#FFFFFF`) or tinted arctic slate (`#F8FAFC`) with no shadow, bounded by hairline dividers (`1px solid #E2E8F0`).
2. **Interactive Cards (Mid-Air Tier):** Soft ambient drop-shadow with an aero-blue tint: `0 8px 24px -4px rgba(10, 25, 47, 0.08)`. Hover states raise to `0 16px 32px -6px rgba(10, 25, 47, 0.14)` with subtle `-2px` Y-axis lift.
3. **Flight Deck Containers (Dark Tiers):** Navy backdrop (`#0A192F` to `#0D2149`) with hairline borders (`1px solid rgba(245, 158, 11, 0.25)`) and diffused amber luminescence for featured training packages.
4. **Frosted Navigations & Overlays:** Translucent surfaces (`rgba(255, 255, 255, 0.85)` on light, `rgba(10, 25, 47, 0.88)` on dark) layered with `12px` backdrop blur for sticky navigational headers and flight briefing modals.

## Shapes

The design system adopts a **Balanced Roundedness (Level 2)** style. Cards, interactive tiles, form containers, and modal dialogs use `0.5rem` (8px) corner radii. Structural feature containers and curriculum cards scale to `1rem` (16px) via `rounded-lg`. 

Badges, verification insignias, and status chips use full pill shapes (`rounded-full`) to reference flight gauges and pilot insignia wings.

## Components

### Buttons
- **Primary Aviator Button:** Solid Navy (`#0A192F`) fill with crisp white text (`#FFFFFF`), or Solid Gold (`#F59E0B`) fill with deep navy text (`#0A192F`). `0.5rem` radius, `0.75rem 1.75rem` padding, `label-lg` uppercase typography with slight letter spacing.
- **Secondary / Ghost Button:** Transparent background, `1.5px` border in `#0A192F` (or `rgba(255,255,255,0.4)` on dark surfaces), responsive amber hover fill transition.
- **Flight Action Icon Button:** Rounded circle with gold chevron/arrow indicator for carousel and timeline navigation.

### Badges & Insignias
- Circular DGCA/Medical step counters with navy numeric labels surrounded by a dual-ring border in Amber Gold (`#F59E0B`).
- Flight hour counter chips featuring a dark cockpit slate background and high-visibility neon/gold numeric typography.

### Input Fields & Application Forms
- Surfaces rendered in `#FFFFFF` with `#E2E8F0` border, `0.5rem` border radius, and `0.875rem 1rem` interior spacing.
- Focus state activates a distinct `2px` border in `#0A192F` accompanied by a soft amber focus ring (`rgba(245, 158, 11, 0.2)`).

### Cards & Profiles
- **Faculty / Instructor Cards:** Clean profile card featuring a centered circular or soft-square officer photo framed in a subtle navy-to-gold gradient outline, complete with military/commercial flight hours and type-rating badges.
- **Pathway & Requirement Cards:** Grid modules featuring top-aligned golden step tags, clear technical bulleting, and soft-elevation hover transitions.

### Aero Lines & Dividers
- Fine structural lines (`1px solid #E2E8F0`) accented with small 45-degree corner ticks or dashed radar-style dividers to separate multi-stage training pathways.