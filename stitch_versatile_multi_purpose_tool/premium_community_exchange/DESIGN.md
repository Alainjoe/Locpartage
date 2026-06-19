---
name: Premium Community Exchange
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#444651'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#747782'
  outline-variant: '#c4c6d2'
  surface-tint: '#3d5ca2'
  primary: '#002d70'
  on-primary: '#ffffff'
  primary-container: '#224489'
  on-primary-container: '#97b4ff'
  inverse-primary: '#b1c6ff'
  secondary: '#3e6a00'
  on-secondary: '#ffffff'
  secondary-container: '#b9f474'
  on-secondary-container: '#437000'
  tertiary: '#502400'
  on-tertiary: '#ffffff'
  tertiary-container: '#723600'
  on-tertiary-container: '#f7a165'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b1c6ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#224489'
  secondary-fixed: '#b9f474'
  secondary-fixed-dim: '#9ed75b'
  on-secondary-fixed: '#0f2000'
  on-secondary-fixed-variant: '#2e4f00'
  tertiary-fixed: '#ffdcc7'
  tertiary-fixed-dim: '#ffb787'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#723600'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  surface-card: '#FFFFFF'
  border-subtle: '#E9ECEF'
  text-main: '#1F2937'
  text-muted: '#6B7280'
  status-error: '#DC2626'
  status-warning: '#F59E0B'
  status-success-alt: '#16A34A'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max-width: 1280px
---

## Brand & Style

The design system is anchored in a **Corporate / Modern** aesthetic with strong **Minimalist** influences, specifically tailored for a high-trust, peer-to-peer rental marketplace. The visual narrative balances professional reliability with community-driven warmth. 

The interface prioritizes clarity and high-quality "breathing room" (whitespace) to reduce cognitive load during the rental process. This premium approach elevates the platform from a standard marketplace to a curated service, fostering trust between Quebecers. Visual elements use soft, architectural depth and generous internal scaling to feel expansive and accessible.

## Colors

The palette is strategically divided between trust-building authority and functional positivity. 
- **Primary Bleu (#224489):** Used for structural navigation, primary calls-to-action, and critical user journeys to instill a sense of security and establishment.
- **Secondary Vert (#8BC34A):** Employed as a functional accent for success states, availability indicators, and secondary "soft" actions.
- **Surface Strategy:** The background utilizes a very light grey (#F8F9FA) to allow white cards (#FFFFFF) to pop forward through subtle contrast rather than heavy shadows. 
- **Typography Contrast:** Use #1F2937 for maximum legibility in body and headers, reserving #6B7280 for metadata and descriptive captions.

## Typography

This design system utilizes **Inter** exclusively to achieve a systematic, utilitarian, and clean look that adapts perfectly to various pixel densities. 

The hierarchy is built on a tight scale that prioritizes readability for item descriptions and price points. Headings use a slight negative letter-spacing to appear more "compact" and premium. For mobile environments, large display titles are aggressively scaled down to ensure the rental interface remains functional without excessive scrolling.

## Layout & Spacing

The design system follows a strict **8px grid** for internal component spacing and a **Fluid-Fixed hybrid grid** for page layouts.

- **Desktop:** A 12-column grid with a maximum container width of 1280px. Gutters are fixed at 24px to ensure distinct separation between listing cards.
- **Mobile:** A 4-column fluid grid with 16px side margins. 
- **Rhythm:** Use multiples of 8px (16, 24, 32, 48, 64) for vertical section spacing to maintain a consistent cadence. The "Aérée" (airy) feel is achieved by using 64px or 80px gaps between major landing page sections.

## Elevation & Depth

Hierarchy is conveyed through **Tonal Layers** and **Ambient Shadows**. Instead of heavy black shadows, the system uses "Tinted Shadows"—low-opacity primary blue mixed with neutral grey to create a softer, more integrated look.

- **Level 0 (Background):** #F8F9FA.
- **Level 1 (Cards):** #FFFFFF with a 1px border (#E9ECEF).
- **Level 2 (Hover/Active):** A soft shadow (0px 4px 20px rgba(34, 68, 137, 0.08)) is applied to cards and buttons to indicate interactivity.
- **Level 3 (Modals/Overlays):** A more pronounced shadow (0px 12px 32px rgba(0, 0, 0, 0.12)) to separate critical actions from the background.

## Shapes

The shape language is defined by **pronounced, friendly radii**. Per the brief, primary containers like listing cards and modals use a **20px** radius to evoke a modern, approachable feel. Standard interactive elements like buttons and input fields utilize a **12px to 16px** radius. 

Small utility components (badges/tags) should be fully rounded (pill-shaped) to distinguish them from structural elements.

## Components

### Buttons
- **Primary:** Solid #224489, white text, 16px roundedness. High-emphasis for "Publier" or "Réserver."
- **Secondary:** Solid #8BC34A, white text. Used for "Disponibilité" or "Validation."
- **Outline:** Transparent background, 1.5px border #E9ECEF, text #1F2937. For low-priority actions.

### Input Fields
- White background, 16px roundedness, 1px #E9ECEF border. On focus, the border transitions to Primary Bleu with a 2px soft outer glow.

### Listing Cards
- 20px rounded corners, overflow hidden for top-aligned images. Content padding of 24px. Price displayed in `headline-md` at the bottom-right for immediate visibility.

### Status Badges
- **Available:** Background 10% of #8BC34A, text #16A34A (Success Alt).
- **Pending:** Background 10% of #F59E0B, text #F59E0B.
- **Roundedness:** Pill-shaped (999px) to contrast against rectangular cards.

### Navigation
- **Desktop Header:** Fixed position, #FFFFFF, subtle bottom border.
- **Mobile Bottom Bar:** Integrated icons with 12px labels, using Primary Bleu for the active state indicator.