# MeasurementSystemView

MeasurementSystemView is a headless Svelte 5 display component that shows a measurement system name in a `<span>` element. A measurement system is a collection of units and rules for measuring physical quantities, such as "metric", "imperial", or "SI".

## What it is

A thin, unstyled `<span>` wrapper that renders a measurement-system name with an optional `aria-label` for additional context. It is the read-only companion to `MeasurementSystemInput`.

## What it does

- Renders a `<span>` with `class="measurement-system-view"` plus any consumer-provided CSS class.
- Displays the required `value` prop as text content.
- Applies `aria-label` from the optional `label` prop.
- Spreads `...restProps` onto the `<span>`.

## When to use it

- Displaying the user's current measurement-system preference on a settings summary.
- Showing a stored measurement system next to a label in a description list or card.
- Confirming the system associated with a stored measurement in a review step.

## When not to use it

- Do not use when the value should be editable — use `MeasurementSystemInput`.
- Do not use for free-form text — use `BodyText` or a plain `<span>`.
- Do not use for a specific measurement value — use `MeasurementInstanceView`.

## How to use it

Import the component, pass a `value` string, and optionally provide a `label` for screen-reader context (useful for abbreviations like "SI").

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `value` (string, required) — the measurement system name to display.
- `label` (string, optional) — accessible name via `aria-label`.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<span>`.

## Usage

### Simple system display

```svelte
<script lang="ts">
    import MeasurementSystemView from "./MeasurementSystemView.svelte";
</script>

<MeasurementSystemView value="metric" />
```

### With an accessible label expanding an abbreviation

```svelte
<script lang="ts">
    import MeasurementSystemView from "./MeasurementSystemView.svelte";
</script>

<MeasurementSystemView value="SI" label="International System of Units" />
```

### Inside a description list

```svelte
<script lang="ts">
    import MeasurementSystemView from "./MeasurementSystemView.svelte";
</script>

<dl>
    <dt>Preferred system</dt>
    <dd><MeasurementSystemView value="metric" /></dd>
</dl>
```

### Bound from state

```svelte
<script lang="ts">
    import MeasurementSystemView from "./MeasurementSystemView.svelte";
    let system = $state("imperial");
</script>

<p>Current system: <MeasurementSystemView value={system} /></p>
```

### With a consumer CSS class

```svelte
<script lang="ts">
    import MeasurementSystemView from "./MeasurementSystemView.svelte";
</script>

<MeasurementSystemView class="system-badge" value="metric" />

<style>
    :global(.system-badge) {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75rem;
        padding: 0.125rem 0.375rem;
        border: 1px solid currentColor;
        border-radius: 9999px;
    }
</style>
```

## Accessibility

- `aria-label` optionally provides context beyond the displayed name.
- Text content is inherently accessible to screen readers.
- Compliant with WCAG 2.2 AAA when the consumer provides sufficient colour contrast.

## Related components

- `MeasurementSystemInput` — paired input for entering the same system name.
- `MeasurementInstanceView` / `MeasurementInstanceInput` — a specific measurement value.
- `MeasurementUnitView` / `MeasurementUnitInput` — individual unit.
- `BodyText` — general text block.
