# BackLink

A navigation link for returning to a previous page or step. Renders a semantic `<a>` with a required `href` and optional `aria-label` override. Inspired by the GOV.UK back link pattern.

## What it is

A headless Svelte 5 component outputting a single `<a class="back-link">`. Category: navigational link primitive, alongside `ActionLink` and `BreadcrumbLink`.

## What it does

- Renders `<a class="back-link {className}" href={href} aria-label={label}>`.
- `aria-label` is emitted only when `label` is provided.
- Spreads additional attributes onto the `<a>`.

## When to use it

- At the top of a page in a multi-step flow to return to the prior step.
- To navigate up to a parent or index page.
- Wherever users expect a one-click "back" affordance that is more reliable than the browser back button.

## When not to use it

- For browser history `history.back()` — use a `Button` with an onclick handler (or, if you accept noscript fallbacks, combine both).
- For forward navigation — use `ActionLink`.
- For full breadcrumb hierarchy — use `BreadcrumbNav` and related components.

## How to use it

Import `BackLink` from `./BackLink.svelte`. Always pass `href`. Optionally provide `label` when the visible text is brief.

## Props

- `class` — string, default `""`. CSS class appended to `back-link`.
- `href` — string, required. Destination URL.
- `label` — string, optional. Accessible name override.
- `children` — `Snippet`, required. Visible link content.
- `...restProps` — additional HTML attributes spread onto the `<a>`.

## Usage

### Basic back link

```svelte
<script lang="ts">
  import BackLink from './BackLink.svelte';
</script>

<BackLink href="/previous-page">Back to previous page</BackLink>
```

### With accessible label override

```svelte
<script lang="ts">
  import BackLink from './BackLink.svelte';
</script>

<BackLink href="/dashboard" label="Return to dashboard">Back</BackLink>
```

### In a multi-step form

```svelte
<script lang="ts">
  import BackLink from './BackLink.svelte';
</script>

<BackLink href="/checkout/shipping" data-step="payment">Go back to shipping</BackLink>
```

### With rel and tracking

```svelte
<script lang="ts">
  import BackLink from './BackLink.svelte';
</script>

<BackLink href="/" rel="up" data-track="home-back">Back to home</BackLink>
```

### Reactive href

```svelte
<script lang="ts">
  import BackLink from './BackLink.svelte';

  let previous = $state('/step-1');
</script>

<BackLink href={previous}>Back</BackLink>
```

## Accessibility

- Implicit `link` role.
- Pair a visible icon (if added by the consumer) with text or an `aria-label` that states the destination.
- Keyboard: native Tab/Enter handling.
- Place at the top of the page, before the main heading, for predictability.

## Related components

- `ActionLink` — forward action link.
- `BreadcrumbLink`, `BreadcrumbNav` — hierarchical trail navigation.
- `SkipLink` — hidden keyboard shortcut to main content.
- `Button` — for history-based back using JavaScript.
