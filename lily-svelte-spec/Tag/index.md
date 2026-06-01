# Tag

A headless inline tag for labels, categories, keywords, or status indicators. Rendered as a `<span>` with `role="status"` and an accessible label.

## What it is

A Svelte 5 headless component that renders `<span class="tag ...">` with `role="status"` and `aria-label`. The visible text is supplied via the `children` snippet.

## What it does

- Renders an inline tag element.
- Applies `role="status"` - which is an implicit polite live region. New content inside the tag will be announced by screen readers.
- Applies `aria-label` so screen readers read an expanded phrase beyond the visible text (for example, "Priority: High" instead of just "High").
- Spreads `...restProps` onto the `<span>`.

## When to use it

- Category or topic chips on a blog post or article.
- Status chips (Active, Pending, Done).
- Keywords in a metadata area.
- Any short label that groups or classifies content.

## When not to use it

- Removable chips backed by a button - compose with a real `<button>` child or use `TagInput` for typed entry.
- Live, assertive alerts - use `Alert` or `role="alert"`.
- Multi-item tag strips - use `TagGroup` to wrap several tags.
- Counters or score badges - use `Badge`.

## How to use it

1. Import the component.
2. Supply a translated `label`.
3. Put visible text in `children`.

## Props

- `class` (string, optional, default `""`) - merged with the base `tag` class.
- `label` (string, required) - accessible label via `aria-label`.
- `children` (Snippet, required) - visible tag content.
- `...restProps` - spread onto the `<span>`.

## Usage

Simple category tag:

```svelte
<script lang="ts">
    import Tag from "./Tag.svelte";
</script>

<Tag label="Category">Design</Tag>
```

Status tag:

```svelte
<script lang="ts">
    import Tag from "./Tag.svelte";
</script>

<Tag label="Status">Active</Tag>
```

Descriptive label:

```svelte
<script lang="ts">
    import Tag from "./Tag.svelte";
</script>

<Tag label="Priority: High">High</Tag>
```

Multiple tags (consider wrapping with `TagGroup`):

```svelte
<script lang="ts">
    import Tag from "./Tag.svelte";
    import TagGroup from "../TagGroup/TagGroup.svelte";
</script>

<TagGroup label="Technologies">
    <Tag label="Technology">Svelte</Tag>
    <Tag label="Technology">TypeScript</Tag>
    <Tag label="Technology">Vite</Tag>
</TagGroup>
```

Inline within text:

```svelte
<script lang="ts">
    import Tag from "./Tag.svelte";
</script>

<p>This post is filed under <Tag label="Topic">Accessibility</Tag>.</p>
```

## Accessibility

- `role="status"` makes the tag an implicit polite live region; dynamic updates to its content will be announced.
- `aria-label` provides an expanded phrase for screen readers.
- Ensure color contrast is sufficient if you render styled tags in consumer CSS.

References:
- WAI-ARIA `status` role: https://www.w3.org/TR/wai-aria-1.2/#status

## Related components

- `TagGroup` - container for multiple tags.
- `TagInput` - text input for creating tags.
- `Badge` - count/status badge.
- `Flair` - decorative highlight.
