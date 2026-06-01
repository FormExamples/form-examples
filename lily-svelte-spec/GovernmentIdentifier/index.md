# GovernmentIdentifier

An identifier section with a parent agency logo, agency name, and required government links. This headless Svelte component renders a `<section>` landmark with a nested `<nav>` for the required links.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Identifier pattern. Category: site identity / footers.

## What it does

- Renders a `<section>` with the base class `government-identifier` plus consumer `class`.
- Applies the **required** `aria-label` to the section.
- Renders a `<div class="government-identifier-masthead">` containing the optional logo image, the **required** agency name (linked via `<a>` if `agencyHref` is provided, otherwise wrapped in `<span>`), and the optional description.
- Renders a `<nav class="government-identifier-links" aria-label={label}>` for required-links children when `children` is supplied.
- Spreads `...restProps` onto the `<section>`.

## When to use it

- At the bottom of a government website, near the footer, to identify the parent agency and surface required links (FOIA, accessibility, privacy, etc.).

## When not to use it

- For navigation around the site, use `NavigationMenu` or `Sidebar`.
- For the top-of-page identification banner, use `GovernmentBanner`.

## Props

- `class` — string, default `""`. CSS class appended to `government-identifier`.
- `label` — string, **required**. Section `aria-label` (also reused by the nested `<nav>`).
- `agencyName` — string, **required**. Parent agency name.
- `agencyHref` — string, optional. When provided, agency name is rendered as an `<a>`.
- `logoUrl` — string, optional. Agency logo src.
- `logoAlt` — string, default `""`. Agency logo alt text.
- `description` — string, optional. Description text.
- `children` — `Snippet`, optional. Required-links nav content.
- `...restProps` — additional HTML attributes spread onto the `<section>`.

## Usage

```svelte
<script lang="ts">
  import GovernmentIdentifier from './GovernmentIdentifier.svelte';
</script>

<GovernmentIdentifier
  label="Agency identifier"
  agencyName="U.S. Department of Example"
  agencyHref="https://example.gov"
  description="An official website of the U.S. Department of Example"
>
  <a href="/about">About</a>
  <a href="/accessibility">Accessibility</a>
  <a href="/foia">FOIA requests</a>
</GovernmentIdentifier>
```

## Accessibility

- The `<section>` is a labelled landmark via `aria-label`.
- The required-links region is a `<nav>` with `aria-label` so assistive technology can list it among navigation landmarks.
- Provide accurate `logoAlt`. For purely decorative logos, pass an empty string.

## Related components

- `GovernmentBanner` — top-of-page identification banner.
- `Footer` — page footer container.

## References

- USWDS Identifier: https://designsystem.digital.gov/components/identifier/
