# Copilot Instructions for S1933.github.io

Portfolio personnel de Jean-Philippe Déïs Nuel — Markdown Engineer. Site statique hébergé sur GitHub Pages.

## Project Overview

- Static GitHub Pages site, zero build, no framework, no npm
- Single page (`index.html`) + external CSS + JS
- Content language: **French**
- Theme: terminal-flavored, dark/light toggle (persisted in `localStorage`)

## File Structure

```
index.html           → Entry point, semantic HTML5
assets/css/style.css  → All styles, CSS custom properties for theming
assets/js/main.js     → Theme toggle, GitHub API fetch, scroll-spy, rate-limit fallback
.github/copilot-instructions.md
```

## Coding Guidelines

### HTML
- Valid HTML5, semantic elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- `lang="fr"` on `<html>`
- `meta viewport`, `meta description`, `color-scheme: dark light`
- Content in French; no placeholder/Lorem ipsum
- No inline `<style>` or `<script>` blocks

### CSS
- Custom properties in `:root` for theming
- `[data-theme="light"]` override block for light theme
- Monospace for headings/labels (`--font-mono`), sans-serif for body (`--font-sans`)
- `prefers-reduced-motion` respected
- No preprocessor, no utility framework

### JS
- Vanilla JS, IIFE-wrapped, `'use strict'`
- Theme toggle persists to `localStorage`, respects `prefers-color-scheme` on first visit
- GitHub API fetch with 1h `localStorage` cache and hardcoded featured fallback
- `IntersectionObserver` for scroll-spy nav
- No external dependencies

## Best Practices

- Test with `python3 -m http.server 8000` before committing
- Validate dark/light toggle persists across page loads
- Verify mobile layout at 375px
- Ensure `prefers-reduced-motion` disables animations
- All external links use `rel="noopener"`
- Keep diffs minimal — touch only what's needed
