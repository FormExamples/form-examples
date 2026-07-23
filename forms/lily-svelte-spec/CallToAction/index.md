# CallToAction

A prominent prompt encouraging user action. Renders as an `<a>` when `href` is provided (for navigation like "Sign Up Now") or as a `<button type="button">` when `href` is omitted (for in-page actions like "Get Started"). This dual-mode approach preserves correct semantics.

## What it is

A headless Svelte 5 component that picks between `<a>` and `<button>`. Category: prominent action / hero primitive, alongside `ActionLink`, `Button`, and `Hero`.

## What it does

- If `href` is provided: renders `<a class="call-to-action-link {className}" href aria-label={label}>`.
- If `href` is absent: renders `<button type="button" class="call-to-action-button {className}" disabled={disabled} aria-label={label} onclick={onclick}>`.
- `disabled` applies only in button mode (links cannot be natively disabled).
- Spreads additional HTML attributes onto the rendered element.

## When to use it

- A prominent CTA on a landing page, hero section, or pricing page.
- When the CTA destination or action is the visually dominant element on the section.

## When not to use it

- For a small in-copy link — use `ActionLink`.
- For standard page buttons — use `Button`.
- For a "go back" affordance — use `BackLink`.
- For navigating breadcrumbs — use `BreadcrumbLink`.

## How to use it

Import `CallToAction` from `./CallToAction.svelte`. Set `href` for navigation or `onclick` for actions. Provide children as the visible label.

## Props

- `class` — string, default `""`. CSS class appended to either `call-to-action-link` or `call-to-action-button`.
- `href` — string, optional. If set, renders `<a>`.
- `label` — string, optional. Accessible name via `aria-label`.
- `disabled` — boolean, default `false`. Button mode only.
- `onclick` — `(event: MouseEvent) => void`, optional. Button mode only.
- `children` — `Snippet`, required. CTA label.
- `...restProps` — additional HTML attributes spread onto the `<a>` or `<button>`.

## Usage

### Navigation CTA

```svelte
<script lang="ts">
  import CallToAction from './CallToAction.svelte';
</script>

<CallToAction href="/signup">Sign Up Now</CallToAction>
```

### Action CTA

```svelte
<script lang="ts">
  import CallToAction from './CallToAction.svelte';

  function start() {
    console.log('starting...');
  }
</script>

<CallToAction onclick={start}>Get Started</CallToAction>
```

### With icon override label (icon-only link)

```svelte
<script lang="ts">
  import CallToAction from './CallToAction.svelte';
</script>

<CallToAction href="/join" label="Join the program">
  <span aria-hidden="true">➜</span>
</CallToAction>
```

### Disabled button CTA

```svelte
<script lang="ts">
  import CallToAction from './CallToAction.svelte';

  let loading = $state(true);
</script>

<CallToAction disabled={loading} onclick={() => (loading = false)}>
  {loading ? 'Loading...' : 'Continue'}
</CallToAction>
```

### In a hero section

```svelte
<script lang="ts">
  import CallToAction from './CallToAction.svelte';
</script>

<section>
  <h1>Ready to begin?</h1>
  <p>Start your free trial today.</p>
  <CallToAction href="/trial" data-track="hero-cta">Start free trial</CallToAction>
</section>
```

## Accessibility

- Correct semantics for each usage: links for navigation, buttons for in-page actions.
- `aria-label` overrides the accessible name when provided.
- Native keyboard handling: Enter activates link/button; Space activates button only.
- `disabled` is meaningful only for the button mode.

## Related components

- `ActionLink` — smaller inline forward-navigation link.
- `Button` — standard in-page button.
- `BackLink` — return-to-previous-page link.
- `Hero`, `HeroHeadline` — contexts where CTAs typically live.
- `SliderButton` — confirmation gesture button.

---

Lily™ and Lily Design System™ are trademarks.
