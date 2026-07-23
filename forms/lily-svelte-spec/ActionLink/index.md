# ActionLink

A prominent hyperlink styled as an action trigger (e.g. "Continue to next step", "Find a service"). Renders a semantic `<a>` with a required `href` and an optional `aria-label` override. Inspired by the NHS England action link pattern.

## What it is

A headless Svelte 5 component that outputs a single `<a>` element with the base class `action-link`. It is a navigational primitive, distinct from `Button` (which triggers in-page actions) and `BackLink` (which returns to a previous page).

## What it does

- Renders `<a class="action-link {className}" href={href}>`.
- Applies `aria-label={label}` when `label` is provided (for icon-only or ambiguous content).
- Spreads any additional HTML attributes onto the `<a>`.
- Renders children inside the link.

## When to use it

- For a prominent forward-navigation call to action embedded in page copy or a flow step.
- For key navigational nudges like "Start application", "Go to dashboard", "Find a GP".
- When link text alone is strong enough to stand in place of a button-styled CTA.

## When not to use it

- For in-page actions (save, delete, open dialog) — use `Button`.
- For returning to a previous page or flow step — use `BackLink`.
- For a prominent hero CTA — use `CallToAction`.
- For breadcrumbs, pagination, accordion links, contents links, tree links — use their dedicated components.
- For `mailto:` / `tel:` — use `EmailLink` / `TelLink`.

## How to use it

Import `ActionLink` from `./ActionLink.svelte`. Always provide `href`. Optionally add `label` when link text is insufficient (e.g. icon-only).

## Props

- `class` — string, default `""`. CSS class appended to `action-link`.
- `href` — string, required. Destination URL.
- `label` — string, optional. Accessible name applied via `aria-label` when provided.
- `children` — `Snippet`, required. Visible link content.
- `...restProps` — additional HTML attributes spread onto the `<a>`.

## Usage

### Basic action link

```svelte
<script lang="ts">
  import ActionLink from './ActionLink.svelte';
</script>

<ActionLink href="/next-step">Continue to next step</ActionLink>
```

### Accessible label override

```svelte
<script lang="ts">
  import ActionLink from './ActionLink.svelte';
</script>

<ActionLink href="/find" label="Find a GP surgery near you">
  Find a GP
</ActionLink>
```

### With tracking attribute

```svelte
<script lang="ts">
  import ActionLink from './ActionLink.svelte';
</script>

<ActionLink href="/apply" data-track="apply-cta">
  Start your application
</ActionLink>
```

### Opens in a new tab

```svelte
<script lang="ts">
  import ActionLink from './ActionLink.svelte';
</script>

<ActionLink href="https://example.org/report" target="_blank" rel="noopener" label="Open report in a new tab">
  Open full report
</ActionLink>
```

### Inside body copy

```svelte
<script lang="ts">
  import ActionLink from './ActionLink.svelte';
</script>

<p>Ready to begin? <ActionLink href="/signup">Create your account</ActionLink></p>
```

## Accessibility

- Implicit `link` role from `<a>`.
- `aria-label` overrides the accessible name only when provided, leaving the visible text as the name otherwise.
- Keyboard: **Tab** focuses the link; **Enter** activates it (native browser behavior).
- Focus styling is consumer-supplied.
- Visible link text should describe the destination.

## Related components

- `BackLink` — return-to-previous-page link.
- `CallToAction` — large prompt; renders `<a>` or `<button>` depending on `href`.
- `Button` — in-page action trigger.
- `BreadcrumbLink`, `PaginationLink`, `AccordionLink`, `ContentsLink`, `TreeLink` — context-specific links.
- `EmailLink`, `TelLink`, `DigitalObjectIdentifierLink` — scheme-specific links.

---

Lily™ and Lily Design System™ are trademarks.
