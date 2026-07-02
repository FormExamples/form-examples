# SectionHeading

A styled heading introducing a major content section, with optional eyebrow and subtitle. This headless Svelte component renders a `<header>` containing optional eyebrow text, a heading at level 2-6, and optional subtitle text.

## What it is

A headless Svelte 5 component that renders a `<header>` block with an eyebrow paragraph, a configurable-level heading, and a subtitle paragraph. Category: typography / structure.

## What it does

- Renders a `<header>` with the base class `section-heading` plus consumer `class`.
- **Requires** `heading`.
- Renders a `<p class="section-heading-eyebrow">` above the heading when `eyebrow` is provided.
- Renders the heading element at `level` 2-6 (default 2) with the class `section-heading-heading`.
- Renders a `<p class="section-heading-subtitle">` below the heading when `subtitle` is provided.

## When to use it

- Introducing major page sections.
- Providing context with an eyebrow ("Category", "Updates") and supporting subtitle copy.

## When not to use it

- For page-level hero with a media element, use `Hero` or `HeroHeadline`.
- For inline page titles with byline, use `Headline`.

## Props

- `class` — string, default `""`.
- `heading` — string, **required**. Main heading text.
- `eyebrow` — string, optional.
- `subtitle` — string, optional.
- `level` — `2 | 3 | 4 | 5 | 6`, default `2`.

## Usage

```svelte
<script lang="ts">
  import SectionHeading from './SectionHeading.svelte';
</script>

<SectionHeading
  eyebrow="Updates"
  heading="Latest news"
  subtitle="What we shipped this week"
  level={2}
/>
```

## Accessibility

- Uses a heading element at the requested level for proper document outline.
- The `<header>` element provides the section's introductory grouping.

## Related components

- `Headline` — page headline with byline area.
- `Hero` / `HeroHeadline` — large hero introductions.

## References

- HTML heading levels: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
- Mozilla Protocol Design System: https://protocol.mozilla.org
