# Flair

A small inline element used to add visual emphasis, categorization, or status labelling to content. Commonly used as tags, badges, or short labels in forums, social platforms, and dashboards (for example: "Moderator", "Urgent", "New").

## What it is

A Svelte 5 component that renders a single `<span>` with the base class `flair`. It is content-agnostic: consumers pass any inline markup as the `children` snippet. Accessibility behaviour adapts to whether a `label` prop is provided.

## What it does

- Renders `<span class="flair ...">` wrapping the `children` snippet.
- When `label` is provided, applies `aria-label={label}` so the flair announces as a named element.
- When `label` is omitted, applies `aria-hidden="true"` so screen readers skip the flair as decorative content.
- Spreads any additional HTML attributes onto the span.

## When to use it

- Adding a small contextual label next to a user name, title, or content item.
- Indicating a role ("Admin", "Mod"), status ("New", "Beta"), or category.
- Decorative inline highlights where purely visual emphasis is needed (omit `label`).

## When not to use it

- For substantive status messages that require live announcements. Use `Alert` or `Notification`.
- For count-style labels with numeric meaning. Use `Badge`.
- For removable keyword categorisation. Use `Tag` or `TagGroup`.
- For display of a single character glyph. Use `Character`.

## How to use it

Wrap inline text or markup in `<Flair>...</Flair>`. Provide a `label` only when the flair conveys meaning that should be announced; leave it off to make the flair decorative.

## Props

- `class` (string, optional) - CSS class appended after the base `flair` class.
- `label` (string, optional) - Accessible name announced by screen readers. When omitted, the flair is marked `aria-hidden="true"`.
- `children` (Snippet, required) - Inline flair content.
- `...restProps` - Additional HTML attributes spread onto the `<span>`.

## Usage

```svelte
<script lang="ts">
    import Flair from "./Flair.svelte";
</script>

<Flair>New</Flair>
```

```svelte
<script lang="ts">
    import Flair from "./Flair.svelte";
</script>

<p>Posted by Alex <Flair label="Role: moderator">MOD</Flair></p>
```

```svelte
<script lang="ts">
    import Flair from "./Flair.svelte";
    const items = ["New", "Sale", "Limited"];
</script>

{#each items as item}
    <Flair label={`Tag: ${item}`}>{item}</Flair>
{/each}
```

```svelte
<script lang="ts">
    import Flair from "./Flair.svelte";
</script>

<h2>Release notes <Flair class="beta-flag">beta</Flair></h2>
```

```svelte
<script lang="ts">
    import Flair from "./Flair.svelte";
</script>

<Flair label="Status: urgent" data-testid="urgent-flair">
    <strong>!</strong> Urgent
</Flair>
```

## Accessibility

- Passing `label` sets `aria-label` and makes the flair announceable.
- Omitting `label` sets `aria-hidden="true"`, so screen readers skip decorative flair.
- No keyboard interaction: flair is a passive inline display element.
- Ensure sufficient contrast in consumer CSS for visual users.

## Related components

- `Badge` - count/status label, typically circular or pill-shaped.
- `Tag` - keyword label for categorisation, often removable.
- `TagGroup` - group of tags.
- `Character` - single-character inline display.
- `ScreenReaderSpan` - visually hidden text for screen readers only.

---

Lily™ and Lily Design System™ are trademarks.
