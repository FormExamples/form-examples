# ProgressCircle

A headless circular progress indicator. Renders a `<div>` with progress ARIA attributes so consumers can style it as a ring, arc, or any custom circular visualization.

## What it is

- Component: `ProgressCircle`
- HTML element: `<div>` with progress ARIA attributes
- Role: `Progress` (as set in the source; treated by assistive tech as a custom region carrying `aria-valuenow` / `valuemin` / `valuemax`)
- Category: status / progress indicator

## What it does

- Renders a `<div>` with `aria-label`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Renders optional `children` inside — typically a percentage label or inner SVG.
- Exposes no visual styling — the consumer provides the circular rendering via CSS, SVG, or library output.

## When to use it

- Dashboard widgets that show a percentage complete as a ring.
- Uploads, sync status, and goal progress where a circular visualization fits the layout.
- When you want to combine a numeric center-label with the ring progress.

## When not to use it

- For linear progress bars — use `Progress`.
- For indeterminate loading — use `ProgressSpinner`.
- For measurement within a range (not "progress") — use `Meter`.

## How to use it

Import and pass `value`, `min`, `max`, and a `label`. Supply inner content for a center label.

```svelte
import ProgressCircle from './ProgressCircle.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `progress-circle`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: number, default `0`. Current progress value.
- `min`: number, default `0`. Minimum value.
- `max`: number, default `100`. Maximum value.
- `children`: Snippet, optional. Inner content (e.g. percentage text).
- `...restProps`: spread onto the `<div>`.

## Usage

### With percentage text inside

```svelte
<script lang="ts">
  import ProgressCircle from './ProgressCircle.svelte';
</script>

<ProgressCircle label="Upload" value={75}>
  <span>75%</span>
</ProgressCircle>
```

### Without inner content

```svelte
<script lang="ts">
  import ProgressCircle from './ProgressCircle.svelte';
</script>

<ProgressCircle label="Loading" value={30} />
```

### Custom range

```svelte
<script lang="ts">
  import ProgressCircle from './ProgressCircle.svelte';
</script>

<ProgressCircle label="Steps complete" value={3} min={0} max={5}>
  <span>3 / 5</span>
</ProgressCircle>
```

### Animated value

```svelte
<script lang="ts">
  import ProgressCircle from './ProgressCircle.svelte';

  let percent = $state(0);
  $effect(() => {
    const id = setInterval(() => {
      percent = Math.min(100, percent + 10);
      if (percent >= 100) clearInterval(id);
    }, 400);
    return () => clearInterval(id);
  });
</script>

<ProgressCircle label="Sync progress" value={percent}>
  <span>{percent}%</span>
</ProgressCircle>
```

### With an inner SVG ring

```svelte
<script lang="ts">
  import ProgressCircle from './ProgressCircle.svelte';

  let value = $state(60);
  const r = 40, c = 2 * Math.PI * r;
</script>

<ProgressCircle label="Goal" value={value}>
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r={r} fill="none" stroke="#eee" stroke-width="8" />
    <circle
      cx="50" cy="50" r={r} fill="none" stroke="currentColor" stroke-width="8"
      stroke-dasharray={c}
      stroke-dashoffset={c * (1 - value / 100)}
      transform="rotate(-90 50 50)"
    />
  </svg>
  <span>{value}%</span>
</ProgressCircle>
```

## Accessibility

- `aria-label`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` together communicate state to assistive technology.
- Non-interactive; no keyboard handling.
- Ensure sufficient contrast between the ring and its background via consumer CSS.

## Related components

- `Progress` — native linear progress bar.
- `ProgressSpinner` — indeterminate spinner.
- `Meter` — range-bound measurement.
