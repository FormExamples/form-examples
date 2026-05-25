# Carousel

A headless carousel container that provides a semantic `<div>` with `role="region"` and `aria-roledescription="carousel"` so assistive technologies announce it properly. The component is intentionally passive — consumers bring slide content, navigation controls, and any autoplay or slide-state logic.

## What it is

Carousel is a Svelte 5 component that renders a labelled region containing arbitrary slides. It does not track an active slide, render next/previous buttons, or handle timing. Consumers compose their own slide markup (typically `<div role="group" aria-roledescription="slide">` elements) and control navigation externally.

## What it does

- Emits a `<div role="region" aria-roledescription="carousel">` wrapper.
- Names the region via `aria-label` (required `label` prop).
- Renders user-provided slide content via `children`.
- Spreads `restProps` onto the wrapping `<div>`.

## When to use it

- Cycling through image galleries, product showcases, testimonials, or featured content.
- When you need semantic landmark for a rotating content region.
- When you want full visual and behavioural control over slides and their controls.

## When not to use it

- For a static list of items — use a regular list or grid.
- For horizontally scrolling but non-cyclic content — use `HorizontalScroller` or `ScrollArea`.
- For a step-driven story or scrollytelling experience — use `Scroller` instead.

## How to use it

Wrap slides inside `<Carousel label="...">`. Label is required and describes the carousel's content. Provide slide navigation (previous/next buttons, pagination dots) as siblings or children that manage visibility.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | Accessible name for the carousel region. |
| `children` | `Snippet` | required | Slide content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<div>`. |

## Usage

```svelte
<script lang="ts">
    import Carousel from "./Carousel.svelte";
</script>

<Carousel label="Photo gallery">
    <div role="group" aria-roledescription="slide" aria-label="Slide 1 of 3">
        <img src="/photos/1.jpg" alt="Mountain sunset" />
    </div>
    <div role="group" aria-roledescription="slide" aria-label="Slide 2 of 3">
        <img src="/photos/2.jpg" alt="Coastline" />
    </div>
    <div role="group" aria-roledescription="slide" aria-label="Slide 3 of 3">
        <img src="/photos/3.jpg" alt="Forest" />
    </div>
</Carousel>
```

```svelte
<script lang="ts">
    import Carousel from "./Carousel.svelte";

    let slides = $state([
        { id: 1, caption: "First" },
        { id: 2, caption: "Second" },
        { id: 3, caption: "Third" }
    ]);
    let index = $state(0);

    function next() { index = (index + 1) % slides.length; }
    function previous() { index = (index - 1 + slides.length) % slides.length; }
</script>

<Carousel label="Featured">
    {#each slides as slide, i}
        <div role="group" aria-roledescription="slide" hidden={i !== index}>
            <p>{slide.caption}</p>
        </div>
    {/each}
    <button type="button" onclick={previous}>Previous</button>
    <button type="button" onclick={next}>Next</button>
</Carousel>
```

```svelte
<script lang="ts">
    import Carousel from "./Carousel.svelte";
</script>

<Carousel label="Testimonials">
    <blockquote role="group" aria-roledescription="slide">“Outstanding service.” — Alice</blockquote>
    <blockquote role="group" aria-roledescription="slide">“Highly recommend.” — Bob</blockquote>
</Carousel>
```

## Accessibility

- `role="region"` plus `aria-roledescription="carousel"` is the recommended WAI-ARIA pattern.
- `aria-label` gives the region a name distinct from any page text.
- Consumers must ensure slides are individually navigable (e.g. labelled `aria-label="Slide X of Y"`) and that navigation controls are keyboard-operable.

## Related components

- `HorizontalScroller` — non-carousel horizontal scrolling.
- `Scroller`, `ScrollerVideo` — scrollytelling variants.
- `Tour`, `TourList`, `TourListItem` — step-by-step guided content.
