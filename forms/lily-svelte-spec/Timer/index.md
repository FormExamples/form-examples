# Timer

A headless countdown or elapsed-time display rendered as a semantic `<time>` element with `role="timer"`, `aria-label`, and `aria-live="polite"`.

## What it is

`Timer` is a headless Svelte 5 component that renders a `<time>` element with `role="timer"` and `aria-live="polite"`. It does not drive any timer logic itself — consumers compute and format the displayed time and pass it via the `children` snippet.

## What it does

- Renders `<time class="timer {className}" role="timer" aria-label={label} aria-live="polite">`.
- Renders the `children` snippet as the visible time text.
- Spreads additional HTML attributes onto the `<time>` (e.g. `datetime="PT5M30S"` for ISO 8601 duration).

## When to use it

- Session timeout warnings ("5:30 remaining").
- Countdowns for exams, cooking timers, checkout holds.
- Elapsed-time displays (e.g. stopwatch, call duration).
- Any accessible time display that should politely announce updates.

## When not to use it

- Don't use it to select a time value — use `TimeInput` or `TimePickerInput`.
- Don't use it for a static date — use a plain `<time>` element directly.
- Don't use it for brief transient notifications — use `Toast` with `role="status"`/`role="alert"`.
- Don't expect it to run a clock — consumers manage their own interval logic.

## How to use it

Import, supply `label`, and pass formatted time content through `children`. Optionally pass `datetime` via rest-props for machine-readable ISO 8601 durations (e.g. `PT5M30S` for 5m 30s).

## Props

- `class` — string, optional. Extra CSS class appended to `timer`.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — Snippet, required. Formatted display content.
- `...restProps` — any additional HTML attributes spread onto the `<time>` (e.g. `datetime`, `id`).

## Usage

```svelte
<script lang="ts">
  import Timer from "./Timer.svelte";
</script>

<Timer label="Countdown">05:30</Timer>
```

```svelte
<script lang="ts">
  import Timer from "./Timer.svelte";
</script>

<Timer label="Session timeout" datetime="PT5M30S">5:30</Timer>
```

```svelte
<script lang="ts">
  import Timer from "./Timer.svelte";

  let remaining = $state(300);
  $effect(() => {
    const id = setInterval(() => {
      if (remaining > 0) remaining--;
    }, 1000);
    return () => clearInterval(id);
  });
  const mm = $derived(Math.floor(remaining / 60).toString().padStart(2, "0"));
  const ss = $derived((remaining % 60).toString().padStart(2, "0"));
  const iso = $derived(`PT${Math.floor(remaining / 60)}M${remaining % 60}S`);
</script>

<Timer label="Time remaining" datetime={iso}>{mm}:{ss}</Timer>
```

```svelte
<script lang="ts">
  import Timer from "./Timer.svelte";

  let elapsed = $state(0);
  $effect(() => {
    const id = setInterval(() => elapsed++, 1000);
    return () => clearInterval(id);
  });
  const formatted = $derived(`${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
</script>

<Timer label="Call duration">{formatted}</Timer>
```

## Accessibility

- `role="timer"` identifies the element as a countdown/elapsed-time display.
- `aria-live="polite"` announces updates to screen readers without interrupting current speech; avoid wiring an aggressive interval unless needed.
- `aria-label` supplies the accessible name.
- Semantic `<time>` is ideal for machine-readable durations when `datetime` is provided.

## Related components

- `TimerButton` — a button that auto-clicks after a given amount of time.
- `Toast` — transient notification messages.
- `Progress` / `ProgressCircle` — show time-based progress visually.
- `Meter` — gauge for a scalar value within a range.
