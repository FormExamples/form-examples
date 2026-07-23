# Meter

Meter is a headless Svelte 5 component that displays a scalar measurement within a known range using the native HTML `<meter>` element. It supports optional thresholds for `low`, `high`, and `optimum` values — useful for disk usage, battery level, password strength, performance scores, or any bounded numeric measurement.

## What it is

A thin wrapper around the native `<meter>` element. Because `<meter>` has built-in semantics in every modern browser and assistive technology, this component simply forwards the standard attributes and adds an `aria-label`.

## What it does

- Renders a `<meter>` with `class="meter"` plus any consumer-provided CSS class.
- Forwards `value`, `min`, `max`, `low`, `high`, and `optimum` to the native element.
- Applies `aria-label` from the required `label` prop.
- Renders the `value` as text content inside the element to serve as a fallback for unsupported browsers.
- Spreads `...restProps` onto the `<meter>`.

## When to use it

- Disk space or storage usage indicators.
- Battery level, memory consumption, CPU utilization.
- Password strength meters.
- Performance scores, quiz results, or any bounded measurement with meaningful thresholds.

## When not to use it

- Do not use for indeterminate or determinate progress of a task — use `Progress` or `ProgressCircle`.
- Do not use for a slider control — use `RangeInput` or `Slider`.
- Do not use for unbounded values — `<meter>` requires a known range.
- Do not use as a form input — `<meter>` is display-only.

## How to use it

Import the component, pass a `label`, a `value`, and the `min`/`max` bounds. Optionally add `low`, `high`, and `optimum` thresholds for richer semantics.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `meter` class.
- `value` (number, required) — the current measured value.
- `min` (number, optional, default `0`) — the minimum bound of the range.
- `max` (number, optional, default `100`) — the maximum bound of the range.
- `low` (number, optional) — the upper bound of the low-range threshold.
- `high` (number, optional) — the lower bound of the high-range threshold.
- `optimum` (number, optional) — the optimal value within the range.
- `label` (string, required) — accessible name applied via `aria-label`.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<meter>`.

## Usage

### Basic disk usage meter

```svelte
<script lang="ts">
    import Meter from "./Meter.svelte";
</script>

<Meter label="Disk space" value={45} max={100} />
```

### Battery with thresholds

```svelte
<script lang="ts">
    import Meter from "./Meter.svelte";
    let battery = $state(20);
</script>

<Meter
    label="Battery"
    value={battery}
    min={0}
    max={100}
    low={25}
    high={75}
    optimum={100}
/>
```

### Password strength meter

```svelte
<script lang="ts">
    import Meter from "./Meter.svelte";
    let strength = $state(3);
</script>

<Meter
    label="Password strength"
    value={strength}
    min={0}
    max={5}
    low={1}
    high={4}
    optimum={5}
/>
```

### Meter with a custom CSS class

```svelte
<script lang="ts">
    import Meter from "./Meter.svelte";
</script>

<Meter class="meter-wide" label="Quota" value={72} max={100} />

<style>
    :global(.meter-wide) {
        width: 100%;
        height: 1rem;
    }
</style>
```

### Meter bound to dynamic state

```svelte
<script lang="ts">
    import Meter from "./Meter.svelte";
    let used = $state(30);
</script>

<Meter label="Memory used" value={used} min={0} max={100} />

<button type="button" onclick={() => (used = Math.min(100, used + 10))}>
    Use more memory
</button>
```

## Accessibility

- `aria-label` provides the accessible name for the meter.
- Native `<meter>` exposes built-in `role="meter"` semantics and the current/min/max values to assistive technology.
- Text content inside the element serves as a fallback for unsupported browsers.
- Not interactive — no keyboard behaviour.
- Compliant with WAI-ARIA `meter` role and WCAG 2.2 AAA when consumer-supplied colour contrast is sufficient for any custom styling.

## Related components

- `Progress` — a horizontal progress bar for task completion (native `<progress>`).
- `ProgressCircle` — circular progress indicator.
- `ProgressSpinner` — indeterminate spinning indicator.
- `RangeInput` — a slider input for selecting values in a range.
- `Sparkline` — a small inline chart for trends.
- `Gauge`/`Dial` — circular/rotary value selectors (`Dial`).

---

Lily™ and Lily Design System™ are trademarks.
