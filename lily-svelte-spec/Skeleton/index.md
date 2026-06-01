# Skeleton

A headless loading placeholder. Hidden from screen readers with `aria-hidden="true"` and marked as busy with `aria-busy="true"`.

## What it is

A Svelte 5 headless primitive rendering a single `<div>` placeholder with `aria-hidden="true"` and `aria-busy="true"`. The consumer supplies any inner shapes (lines, circles, blocks) via the optional `children` snippet.

## What it does

- Renders a single `<div class="skeleton ...">` placeholder.
- Applies `aria-hidden="true"` so the skeleton is not announced.
- Applies `aria-busy="true"` to signal that content is loading.
- Renders optional `children` (for example, skeleton line shapes) or an empty `<div>` when none are provided.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- As a placeholder while list items, cards, or articles are loading.
- To preserve layout and reduce perceived latency during data fetches.
- Anywhere a spinner would be too intrusive.

## When not to use it

- For indeterminate status messages aimed at screen readers - use `Loading` or `ProgressSpinner`.
- For determinate progress - use `Progress` or `ProgressCircle`.
- For content that is already loaded - skeletons should be temporary.

## How to use it

1. Import the component.
2. Optionally render child shapes inside for row and card-like layouts.
3. Replace the skeleton with real content once loading completes.
4. Style via the `.skeleton` class.

## Props

- `class` (string, optional, default `""`) - merged after the base `skeleton` class.
- `children` (Snippet, optional) - placeholder shapes.
- `...restProps` - spread onto the `<div>` (for example, `style`, `id`).

## Usage

Empty skeleton box:

```svelte
<script lang="ts">
    import Skeleton from "./Skeleton.svelte";
</script>

<Skeleton style="width:200px; height:20px;" />
```

Skeleton with line shapes:

```svelte
<script lang="ts">
    import Skeleton from "./Skeleton.svelte";
</script>

<Skeleton>
    <div class="skeleton-line" style="height:16px; width:80%"></div>
    <div class="skeleton-line" style="height:16px; width:60%"></div>
    <div class="skeleton-line" style="height:16px; width:90%"></div>
</Skeleton>
```

Skeleton card:

```svelte
<script lang="ts">
    import Skeleton from "./Skeleton.svelte";
</script>

<Skeleton>
    <div style="height:120px" class="skeleton-media"></div>
    <div style="height:14px; width:70%" class="skeleton-line"></div>
    <div style="height:14px; width:40%" class="skeleton-line"></div>
</Skeleton>
```

Conditional render:

```svelte
<script lang="ts">
    import Skeleton from "./Skeleton.svelte";
    let loading = $state(true);
</script>

{#if loading}
    <Skeleton style="height:80px"></Skeleton>
{:else}
    <article>Loaded!</article>
{/if}
```

List of skeleton rows:

```svelte
<script lang="ts">
    import Skeleton from "./Skeleton.svelte";
</script>

{#each { length: 5 } as _}
    <Skeleton style="height:32px; margin:4px 0"></Skeleton>
{/each}
```

## Accessibility

- `aria-hidden="true"` removes the placeholder from the accessibility tree.
- `aria-busy="true"` tells assistive tech the area is loading.
- Consumers should ensure real content replaces the skeleton promptly.

References:
- WAI-ARIA `aria-busy`: https://www.w3.org/WAI/ARIA/apg/states/aria-busy/
- MDN `aria-hidden`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden

## Related components

- `Loading` - announced loading indicator.
- `Progress`, `ProgressCircle`, `ProgressSpinner` - progress indicators.
