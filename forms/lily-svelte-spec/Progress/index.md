# Progress

A headless progress indicator using the native HTML `<progress>` element. Supports both determinate (with `value`) and indeterminate (when `value` is undefined) progress.

## What it is

- Component: `Progress`
- HTML element: `<progress>`
- Role: implicit `progressbar`
- Category: status / progress indicator

## What it does

- Renders a native `<progress>` with `aria-label`.
- Accepts `value` (current) and `max` (total); when `value` is `undefined`, the native element displays as indeterminate.
- Forwards any other HTML attributes onto the `<progress>`.

## When to use it

- File uploads, form submissions, and long-running operations with measurable progress.
- Installation or multi-step wizards ("Step 3 of 5").
- Indeterminate loading where the total is unknown.

## When not to use it

- For an indeterminate spinner with no linear bar — use `ProgressSpinner`.
- For a circular percentage indicator — use `ProgressCircle`.
- For a measurement within a range that isn't about "progress toward completion" — use `Meter`.
- For a brief loading state inside a button or text — use `Loading` or `Skeleton`.

## How to use it

Import and supply an `aria-label`-worthy description via `label`. Set `value` for determinate progress, omit for indeterminate.

```svelte
import Progress from './Progress.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `progress`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: number, default `undefined`. Current value; `undefined` → indeterminate.
- `max`: number, default `100`. Maximum value (100% complete).
- `...restProps`: spread onto the `<progress>`.

## Usage

### Determinate progress at 50%

```svelte
<script lang="ts">
  import Progress from './Progress.svelte';
</script>

<Progress label="Upload progress" value={50} max={100} />
```

### Indeterminate loading

```svelte
<script lang="ts">
  import Progress from './Progress.svelte';
</script>

<Progress label="Loading" />
```

### Step-based progress (3 of 5)

```svelte
<script lang="ts">
  import Progress from './Progress.svelte';
</script>

<Progress label="Installation" value={3} max={5} />
```

### Animated progress from state

```svelte
<script lang="ts">
  import Progress from './Progress.svelte';

  let percent = $state(0);
  $effect(() => {
    const id = setInterval(() => {
      percent = Math.min(100, percent + 5);
      if (percent >= 100) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  });
</script>

<Progress label="Upload progress" value={percent} max={100} />
```

### With a test hook

```svelte
<Progress label="Sync" value={40} data-testid="sync-progress" />
```

## Accessibility

- `<progress>` implicitly has `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` managed by the browser.
- `aria-label` tells screen readers *what* is progressing.
- WCAG 2.2 AAA: consumer CSS must provide sufficient contrast for the progress bar.

## Related components

- `ProgressCircle` — circular progress indicator with explicit ARIA values.
- `ProgressSpinner` — indeterminate spinning indicator.
- `Meter` — non-progress measurement within a range.
- `Loading`, `Skeleton` — alternative loading affordances.

---

Lily™ and Lily Design System™ are trademarks.
