# BeachBall

A loading / waiting indicator inspired by the macOS spinning beach-ball cursor. Renders a `<div role="status">` that exposes `aria-busy` and `aria-live="polite"`, with an inner `<span aria-hidden="true">` (only while active) for the consumer to animate.

## What it is

A headless Svelte 5 component for signalling that the system is busy. Category: loading / progress primitive, alongside `Loading`, `ProgressSpinner`, `ProgressCircle`, `Progress`, and `Skeleton`.

## What it does

- Renders `<div class="beach-ball {className}" role="status" aria-label={label} aria-busy={active} aria-live="polite" data-active={active}>`.
- When `active` is true, renders an inner `<span aria-hidden="true"></span>` as the animation target.
- `aria-busy` reflects the `active` prop so AT knows when the region is loading.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Passive indication that a background task is in progress.
- Inline indicator next to content that is being fetched.
- Full-region busy state where you want AT to announce the label politely.

## When not to use it

- For determinate progress — use `Progress` or `ProgressCircle`.
- For skeleton placeholders — use `Skeleton`.
- For a simple spinner with no beach-ball metaphor — use `ProgressSpinner` or `Loading`.
- For urgent "please wait" modal messages — use `AlertDialog` with `Loading` content.

## How to use it

Import `BeachBall` from `./BeachBall.svelte`. Always pass `label`. Toggle `active` to start/stop.

## Props

- `class` — string, default `""`. CSS class appended to `beach-ball`.
- `label` — string, required. Accessible description of what is loading.
- `active` — boolean, default `true`.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Always-on loading indicator

```svelte
<script lang="ts">
  import BeachBall from './BeachBall.svelte';
</script>

<BeachBall label="Fetching data" />
```

### Toggled by fetch state

```svelte
<script lang="ts">
  import BeachBall from './BeachBall.svelte';

  let loading = $state(true);

  $effect(() => {
    setTimeout(() => (loading = false), 2000);
  });
</script>

<BeachBall label="Processing request" active={loading} />
```

### Inline with content

```svelte
<script lang="ts">
  import BeachBall from './BeachBall.svelte';

  let saving = $state(false);
</script>

<p>Status: {saving ? 'Saving...' : 'Saved'} <BeachBall label="Saving" active={saving} /></p>
```

### With custom class and data hooks

```svelte
<BeachBall label="Loading results" class="large" data-testid="results-spinner" />
```

### Localized label

```svelte
<script lang="ts">
  import BeachBall from './BeachBall.svelte';

  const label = 'Cargando contenido';
</script>

<BeachBall {label} />
```

## Accessibility

- `role="status"` gives the region a polite live announcement.
- `aria-busy` reflects activity; screen readers can interpret it as "loading in progress".
- `aria-label` from the `label` prop describes what is loading.
- `data-active` is a CSS hook, not for AT.
- Not interactive; not keyboard reachable.

## Related components

- `Loading` — generic loading text/image/animation.
- `ProgressSpinner` — indeterminate spinner.
- `ProgressCircle` — circular (determinate) progress.
- `Progress` — linear progress bar.
- `Skeleton` — placeholder shimmer blocks.

---

Lily™ and Lily Design System™ are trademarks.
