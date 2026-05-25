# Statistic

A numeric value display with title, prefix, and suffix. This headless Svelte component renders a `role="group"` container with a title and a value, optionally wrapped by `prefix` and `suffix` snippets.

## What it is

A headless Svelte 5 component inspired by [Ant Design Statistic](https://ant.design/components/statistic). The consumer formats the value as a string (number formatting, localization). Category: data display.

## What it does

- Renders a `<div class="statistic" role="group" aria-label={…}>`.
- Renders `<div class="statistic-title">{title}</div>` and `<div class="statistic-value">…</div>`.
- Renders `<span class="statistic-prefix">` and `<span class="statistic-suffix">` only when those snippets are provided.
- Default `aria-label` is `"{title}: {value}"` and can be overridden via the `label` prop.

## When to use it

- Dashboards, KPIs, and summary cards.
- Anywhere a numeric value benefits from a label and optional units or symbols.

## When not to use it

- For tabular numeric data, use `DataTable`.
- For real-time charts, use a chart component.

## Props

- `class` — string, default `""`. CSS class appended to `statistic`.
- `title` — string, **required**. Label/heading text.
- `value` — string, **required**. Pre-formatted value text.
- `label` — string, optional. `aria-label` override (default: `"{title}: {value}"`).
- `prefix` — `Snippet`, optional. Element before the value.
- `suffix` — `Snippet`, optional. Element after the value.
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import Statistic from './Statistic.svelte';
</script>

<Statistic title="Active users" value="1,234" />

<Statistic title="Revenue" value="42">
  {#snippet prefix()}$ {/snippet}
  {#snippet suffix()} M{/snippet}
</Statistic>
```

## Accessibility

- `role="group"` plus `aria-label` ensures screen readers announce the title and value as a pair.
- Override `label` for richer announcements (e.g., spelled-out numbers or localized phrasing).

## Related components

- `Meter`, `Progress` — graphical numeric indicators.
- `Badge` — small label for counts.
- `DataTable` — tabular data display.

## References

- Ant Design Statistic: https://ant.design/components/statistic
