# ProgressSpinner

A headless indeterminate loading indicator. Renders a `<div>` with `role="status"` and `aria-live="polite"` so the loading state is announced without interrupting.

## What it is

- Component: `ProgressSpinner`
- HTML element: `<div>`
- Role: `status`
- Category: status / indeterminate progress

## What it does

- Renders a `<div role="status" aria-live="polite">` with `aria-label`.
- Optionally renders `children` (e.g. a "Loading…" text node).
- Provides no animation — the consumer supplies spinner visuals via CSS.

## When to use it

- Indeterminate loading where the duration is unknown (data fetching, async init).
- As an inline indicator on a card, row, or section being populated.
- When a linear progress bar is inappropriate because there is no known "total".

## When not to use it

- For determinate progress — use `Progress` or `ProgressCircle`.
- For skeleton placeholders — use `Skeleton`.
- For a loading button or short text — use `Loading`.
- For urgent announcements — use `Notification` with `urgent` or `Alert`.

## How to use it

Import and provide a descriptive `label`. The spinner does not rotate by itself — consumer CSS supplies the animation.

```svelte
import ProgressSpinner from './ProgressSpinner.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `progress-spinner`.
- `label`: string, required. Accessible name via `aria-label`.
- `children`: Snippet, optional. Inner content, e.g. visible "Loading…" text.
- `...restProps`: spread onto the `<div>`.

## Usage

### Simple spinner

```svelte
<script lang="ts">
  import ProgressSpinner from './ProgressSpinner.svelte';
</script>

<ProgressSpinner label="Loading data" />
```

### Spinner with visible text

```svelte
<script lang="ts">
  import ProgressSpinner from './ProgressSpinner.svelte';
</script>

<ProgressSpinner label="Loading search results">
  <span>Loading...</span>
</ProgressSpinner>
```

### Conditionally mounted

```svelte
<script lang="ts">
  import ProgressSpinner from './ProgressSpinner.svelte';

  let busy = $state(true);
</script>

{#if busy}
  <ProgressSpinner label="Fetching" />
{:else}
  <p>Done.</p>
{/if}
```

### Inside a button label

```svelte
<script lang="ts">
  import ProgressSpinner from './ProgressSpinner.svelte';

  let submitting = $state(false);
</script>

<button type="button" disabled={submitting}>
  {#if submitting}
    <ProgressSpinner label="Saving">Saving…</ProgressSpinner>
  {:else}
    Save
  {/if}
</button>
```

### Localized label

```svelte
<ProgressSpinner label="Cargando datos">
  <span>Cargando…</span>
</ProgressSpinner>
```

## Accessibility

- `role="status"` + `aria-live="polite"` make text changes inside the spinner announced politely.
- `aria-label` describes *what* is loading.
- Non-interactive; no keyboard handling.
- Consumer CSS must honor `prefers-reduced-motion` for the spinning animation.

## Related components

- `Progress`, `ProgressCircle` — determinate progress indicators.
- `Loading` — broader loading container.
- `Skeleton` — placeholder shapes for content that's loading.
- `Notification`, `Alert` — for announcing loading state with more context.
