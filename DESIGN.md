---
name: DLCE Docs
description: A Docusaurus-inspired Docsify shell for the Dancing Line Community Edition Wiki.
colors:
  primary-blue: "#2c9cff"
  primary-blue-strong: "#147fd6"
  light-canvas: "#ffffff"
  light-sidebar: "#f7f8fa"
  light-border: "#e2e5e9"
  dark-canvas: "#18191a"
  dark-header: "#202122"
  dark-sidebar: "#1e1f20"
  dark-border: "#343638"
  dark-text: "#e3e4e6"
  dark-muted: "#a5a9af"
  dark-active: "#25384b"
  menu-shadow: "rgba(0, 0, 0, 0.18)"
  drawer-shadow: "rgba(0, 0, 0, 0.22)"
typography:
  display:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI, PingFang SC, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.75rem)"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI, PingFang SC, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI, PingFang SC, sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.35
  supporting:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI, PingFang SC, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI, PingFang SC, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.35
  micro:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Microsoft YaHei UI, PingFang SC, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  hairline: "3px"
  inset: "5px"
  sm: "6px"
  floating: "7px"
  md: "8px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  header-control:
    backgroundColor: "transparent"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.md}"
    size: "40px"
  sidebar-active:
    backgroundColor: "{colors.dark-border}"
    textColor: "{colors.primary-blue}"
    rounded: "{rounded.sm}"
    padding: "9px 38px 9px 12px"
  category-card:
    backgroundColor: "{colors.dark-sidebar}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: DLCE Docs

## Overview

**Creative North Star: "The Graphite Wayfinder"**

DLCE Docs is a restrained documentation workspace: graphite surfaces in dark mode, clean paper surfaces in light mode, and one established blue used to communicate location and action. Its structure deliberately follows the Docusaurus documentation model while retaining Docsify's content engine and URL behavior.

The interface is dense enough for a large Wiki but keeps the reading canvas quiet. Global sections live in the top bar, document relationships live in the left tree, and headings live in an independent right or mobile-bottom table of contents.

**Key Characteristics:**

- Persistent three-part wayfinding: global tabs, document tree, page outline.
- One blue accent with neutral layered surfaces.
- Compact controls, crisp dividers, and restrained motion.
- Theme- and language-aware UI without changing Markdown content.

## Colors

The palette uses a single clear blue against low-chroma neutral surfaces.

### Primary

- **Navigation Blue:** Marks current routes, links, focus, and interactive emphasis.
- **Navigation Blue Strong:** Provides readable link emphasis on light surfaces.

### Neutral

- **Paper Canvas / Soft Sidebar:** The light reading surface and its lightly differentiated rail.
- **Graphite Canvas / Header / Sidebar:** Three close dark values separate regions without heavy shadows.
- **Quiet Border:** Thin dividers define structure in both themes.
- **Muted Text:** Secondary labels and the page-outline rail.

### Named Rules

**The One-Accent Rule.** Blue communicates navigation and interaction; do not introduce unrelated accent colors for ordinary controls.

**The Semantic Notice Rule.** Pink-red is reserved for important warnings and sky-blue for informational notices, with theme-specific surfaces that preserve text contrast.

## Typography

**Display Font:** Segoe UI Variable Text with Segoe UI, Microsoft YaHei UI, and PingFang SC fallbacks  
**Body Font:** The same multilingual sans-serif stack  
**Character:** Functional, compact, and highly legible across Chinese and English. Hierarchy comes from weight, scale, and spacing rather than decorative type changes.

### Hierarchy

- **Display** (750, fluid 2rem–2.75rem, 1.15): Page H1 only.
- **Headline** (700, theme scale): H2 section boundaries.
- **Title** (650): Top tabs, sidebar roots, and card titles.
- **Body** (400, 16px, 1.65): Long-form Markdown, capped near 75 characters per line.
- **Label** (650, 14px): Controls and compact navigation labels.

### Named Rules

**The Reading-First Rule.** Use the display scale once per document; navigation never competes with the page H1.

## Layout

A 64px fixed header contains the unified menu button, flexible brand title, natural-width section tabs, and utility controls. The desktop document rail is 19rem wide. Pages with headings reserve a 16rem table-of-contents rail on wide screens. At 71rem and below, the page outline moves to the isolated bottom region of the left sidebar; at 48rem and below, global tabs move into the navigation drawer and the header drops to 58px.

Content uses fluid horizontal padding and a maximum reading width. The brand title expands naturally and ellipsizes only after tabs and utilities consume the available width.

## Elevation & Depth

The system is flat by default. Depth comes from tonal surface changes and 1px borders; only transient menus and the mobile drawer use soft ambient shadow.

**The Flat-By-Default Rule.** Do not add persistent card shadows to documentation navigation; use border and tone first.

## Shapes

Controls and nested panels use gently rounded 6–10px corners. Breadcrumb states use a pill silhouette. The DLCE icon keeps its transparent alpha and is always contained rather than placed on an invented background.

## Components

### Header Controls

- **Shape:** Compact rounded square (40px, 8px radius).
- **State:** Neutral at rest, tonal hover, visible keyboard focus.
- **Behavior:** The same menu control operates the desktop rail and mobile drawer. Its three lines morph into a close icon while expanded, synchronized with the rail's 220ms transform-only drawer transition. On mobile, an independent non-interactive shadow layer follows the drawer and crossfades over the same 220ms interval, reaching zero opacity once the rail is off-screen so no blur remains on the viewport edge.
- **Theme mode:** The compact theme control cycles through Auto, Light, and Dark, matching the main site. Auto follows `prefers-color-scheme` live, while explicit choices persist; its accessible label names both the resolved theme and the next mode.

### Navigation

- **Top tabs:** Natural-width labels with a 3px active underline. Each tab links to its language-aware section directory (for example, `/social/` or `/en/social/`), where the generated section landing page replaces the aliased fallback document rather than selecting the first document. Cross-origin links and entries that own a submenu leave the primary tab group and appear in the right utility cluster before language, repository, and theme controls. Their triggers share the language control's compact styling; desktop submenus always open downward. In the mobile drawer, direct auxiliary links rejoin the two-column primary navigation grid. Languages and the repository control remain in the compact utility row below it, followed by every submenu expanded as its own full-width row. Submenu links keep readable intrinsic widths in one line and become independently horizontally scrollable when they exceed the drawer, without widening the page. The drawer owns vertical overflow, so additional links and menus remain reachable without compressed labels or clipped popovers. Additional language and auxiliary entries flow from their Markdown or dictionary sources without layout rewrites. Language changes preserve the current section or page when its Markdown exists, otherwise they resolve to the configured home page for the target language instead of opening a 404.
- **Document tree:** Parent Markdown pages may also own collapsible child pages. Sibling groups behave as an accordion: opening one closes the other open group at the same depth with a measured 220ms height, spacing, and opacity transition. Selecting a sibling parent page completes that same transition before the route changes; initial load and browser history restoration remain immediate. Every link uses a shared 2.75rem Flex row so text and arrow controls remain vertically centered. Links use regular-weight text and rounded neutral-gray hover panels rather than underlines. The panel is an opacity layer with a perceptible 180ms fade and the text color transitions independently; neither position, scale, nor weight changes. Reduced-motion mode retains a 120ms opacity/color fade. Selected links retain the gray panel and use the blue accent for text. A parent link and its arrow button share one hover state. Docsify section queries such as `?id=...` do not alter the selected Markdown page; selection and `aria-current` are synchronized from the query-free document route after every render.
- **Page outline:** H2/H3 links never remain inside the document tree; they occupy the right rail or isolated sidebar footer.
- **Breadcrumb:** Hidden on the Wiki home page and on a single-document tab's root document. Every page beneath a tab that owns a generated overview starts with a home icon linked to the language-aware Wiki home, followed by the tab overview and the complete sidebar ancestry (for example, Home > Game Docs > Custom Post-processing > V2). Nested routes inside a single-document tab retain Home plus their document ancestry. The Custom Post-processing parent document alone uses a short render gate before Docsify replaces its article; the completed-render task releases it after inserting the breadcrumb above H1, preventing that page's heading-only first frame without delaying other documents. Intermediate links use regular-weight body color and the same neutral pill hover as Home; only the current page keeps the blue active pill.

### Category Cards

- **Shape:** Compact bordered 10px container with a document icon, title, and directional arrow; the title is the complete accessible link name, with no redundant action subtitle.
- **Layout:** Two columns on wide screens and one column on mobile.
- **Source:** Category pages use immediate child Markdown links; top-tab landing pages use the section sidebar's first-level entries. Both stay synchronized with the language-specific sidebar. A section with exactly one first-level Markdown document skips the generated overview and routes directly to that document.

### Inputs / Fields

- **Style:** Full-width search field on a tonal sidebar surface with an 8px radius.
- **Focus:** Blue border plus a low-opacity blue focus ring.

### Notices

- **Standard:** Neutral surface with the same 4px theme-blue left rule used by semantic notices; all notice variants span the full Markdown content column, matching the surrounding body copy.
- **Important:** Dark rose or pale rose surface with strong readable foreground.
- **Information:** Dark blue or pale blue surface with matching semantic border.

### Markdown Tables

- **Grid:** A complete 1px neutral border surrounds the table and separates every header and body cell.
- **Themes:** Light mode uses a cool light-gray grid and header surface; dark mode raises border luminance against graphite row surfaces without competing with the blue navigation accent.
- **Responsive:** Wide tables remain horizontally scrollable. Theme-generated stacked mobile rows keep one outer border and horizontal cell separators without doubled edges.
- **Mobile row sizing:** Below 30em, every stacked cell uses a two-column grid for the generated header label and one generated value wrapper. Both columns remain in normal flow, so the taller side determines the shared row height; links, line breaks, and other value nodes stay grouped in column two instead of auto-flowing back into the label column.

### Document Pagination

- **Wide layout:** Previous and next document cards may share a row and preserve their directional text alignment.
- **Narrow layout:** Below 48em, pagination becomes one full-width column in reading order. Both cards share the same horizontal edges; previous remains left-aligned and next remains right-aligned within its own row.

## Do's and Don'ts

### Do:

- **Do** keep global, document, and in-page navigation visually separate.
- **Do** obtain UI strings from the language dictionaries at the repository root and in each language directory.
- **Do** preserve the established blue and transparent DLCE artwork.
- **Do** use short 150–220ms state transitions and respect reduced-motion settings.

### Don't:

- **Don't** place H2/H3 links back inside the Markdown page tree.
- **Don't** hard-code new interface copy in navigation logic.
- **Don't** add gradients, decorative background effects, or unrelated accent colors.
- **Don't** hide the unified menu control with the sidebar it controls.
