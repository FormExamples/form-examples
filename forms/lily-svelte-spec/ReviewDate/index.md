# ReviewDate

A semantic, headless display for a review, audit, or next-review date that combines a human-readable label with a machine-readable `datetime` attribute on the HTML `<time>` element.

## What it is

`ReviewDate` is a Svelte 5 headless component that renders a single `<time class="review-date ...">` element carrying an `aria-label` and a required ISO 8601 `datetime` attribute. The visible text is supplied via the `children` snippet.

## What it does

- Renders `<time datetime="...">` with the required `datetime` prop.
- Applies `aria-label` so screen readers announce a full, consumer-provided description.
- Renders the `children` snippet inside the `<time>` for human-readable display (for example, a localized formatted date).
- Spreads `...restProps` onto the `<time>` element.

No formatting is performed - both the machine-readable ISO string and the human-readable text are supplied by the consumer.

## When to use it

- Dashboards showing last-audit or next-review dates.
- Compliance, governance, or content-lifecycle widgets.
- Scheduling views that must expose a machine-parseable date for browsers, parsers, and assistive technology.
- Any place where both readability and machine semantics matter.

## When not to use it

- Date input fields - use `DateInput` or `DateField`.
- Date range display with two endpoints - use `DateRange`.
- Timestamps that are purely decorative and never need machine semantics (a plain `<span>` is fine).
- Countdown timers - use `Timer`.

## How to use it

1. Import `ReviewDate` from its source file.
2. Provide a translated `label` (required) describing the date's meaning ("Last review", "Next audit", ...).
3. Provide a `datetime` string in ISO 8601 (`"2026-06-15"`, `"2026-06-15T09:30:00Z"`, ...).
4. Provide the visible text in the `children` snippet - typically a locale-formatted string.

## Props

- `class` (string, optional, default `""`) - merged with the base `review-date` class.
- `label` (string, required) - applied to `aria-label` on the `<time>` element.
- `datetime` (string, required) - machine-readable ISO 8601 date/time for the `datetime` attribute.
- `children` (Snippet, required) - human-readable display text for the date.
- `...restProps` - any additional HTML attributes spread onto `<time>`.

## Usage

Simple review date:

```svelte
<script lang="ts">
    import ReviewDate from "./ReviewDate.svelte";
</script>

<ReviewDate label="Next review" datetime="2026-06-15">June 15, 2026</ReviewDate>
```

With a locale-formatted string:

```svelte
<script lang="ts">
    import ReviewDate from "./ReviewDate.svelte";
    const iso = "2026-04-18";
    const formatted = new Date(iso).toLocaleDateString("en-GB");
</script>

<ReviewDate label="Last audit" datetime={iso}>{formatted}</ReviewDate>
```

With extra data attributes for CSS:

```svelte
<script lang="ts">
    import ReviewDate from "./ReviewDate.svelte";
</script>

<ReviewDate label="Due date" datetime="2026-12-31" data-urgency="high">
    Dec 31, 2026
</ReviewDate>
```

In a summary row:

```svelte
<script lang="ts">
    import ReviewDate from "./ReviewDate.svelte";
    import SummaryListItem from "../SummaryListItem/SummaryListItem.svelte";
</script>

<SummaryListItem term="Next review">
    <ReviewDate label="Next review" datetime="2026-09-01">September 1, 2026</ReviewDate>
</SummaryListItem>
```

Conditional localized output:

```svelte
<script lang="ts">
    import ReviewDate from "./ReviewDate.svelte";
    let { iso, locale }: { iso: string; locale: string } = $props();
</script>

<ReviewDate label="Review date" datetime={iso}>
    {new Intl.DateTimeFormat(locale).format(new Date(iso))}
</ReviewDate>
```

## Accessibility

- Uses the semantic `<time>` element so assistive tech and browsers can parse the date.
- `datetime` MUST be a valid ISO 8601 value for correct machine semantics.
- `aria-label` is required and should describe the meaning of the date, not just repeat the visible text ("Last reviewed on ..." rather than just "June 15, 2026").

References:
- HTML `<time>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- ISO 8601: https://en.wikipedia.org/wiki/ISO_8601

## Related components

- `DateInput`, `DateField`, `DateTimeLocalInput` - entering date values.
- `DateRange` - displaying a start-to-end range.
- `Byline` - author and timestamp block.
- `SummaryListItem` - key/value rows that often contain a `ReviewDate`.

---

Lily™ and Lily Design System™ are trademarks.
