# DateTimeView

A read-only display of a formatted date and time. This headless Svelte component renders a native `<time>` element with the machine-readable `datetime` attribute set to an ISO 8601 value, while displaying a consumer-formatted human-readable string.

## What it is

A headless Svelte 5 component that renders a single `<time>` element. Category: data display / dates.

## What it does

- Renders a `<time>` element with the base class `date-time-view` plus consumer `class`.
- Sets the `datetime` attribute to the ISO 8601 `value` for assistive tech and crawlers.
- Displays in priority order: `children` snippet → `format` string → raw `value`.
- Applies `aria-label` when `label` is provided.
- Spreads `...restProps` onto the underlying `<time>`.

## When to use it

- Showing publish, update, or event timestamps.
- Tagging metadata in articles, comments, and feeds.
- Anywhere a machine-readable datetime is required alongside a human-readable display.

## When not to use it

- For an editable date input, use `DateInput` or `DateField`.
- For displaying just a date range, use `DateRange`.
- For a content review marker, use `ReviewDate`.

## How to use it

Import `DateTimeView` and pass an ISO 8601 `value`. Format the display string yourself (e.g., with `Intl.DateTimeFormat`) and pass it as `format`. Required prop: `value`.

## Props

- `class` — string, default `""`. CSS class appended to `date-time-view`.
- `value` — string, required. ISO 8601 datetime.
- `format` — string, optional. Pre-formatted display text.
- `label` — string, optional. Accessible label override.
- `children` — `Snippet`, optional. Custom display content (overrides `format`).
- `...restProps` — additional HTML attributes spread onto the `<time>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import DateTimeView from './DateTimeView.svelte';

  const iso = '2026-01-31T10:00:00Z';
  const formatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
</script>

<DateTimeView value={iso} format={formatted} label="Published" />
```

### With custom children

```svelte
<DateTimeView value="2026-01-31T10:00:00Z">
  <strong>Today</strong>
</DateTimeView>
```

## Accessibility

- Implicit `<time>` element semantics; the `datetime` attribute is read by assistive tech.
- Provide a meaningful `label` (e.g., "Published date") when context is unclear from surrounding markup.

## Related components

- `DateInput` — input for entering a date.
- `DateRange` — display of a date range.
- `ReviewDate` — content review date display.

## References

- MDN `<time>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601: https://en.wikipedia.org/wiki/ISO_8601
