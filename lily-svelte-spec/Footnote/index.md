# Footnote

A footnote provides supplementary information, citations, or clarifications that support the main content without cluttering it. Commonly used in articles, academic writing, legal documents, and documentation.

## What it is

A Svelte 5 component that renders an `<aside>` element with `role="note"` and a required unique `id`. The `id` is reused as the `aria-label`.

## What it does

- Renders `<aside id={id} role="note" aria-label={id} class="footnote ...">` wrapping the `children` snippet.
- Assigns the consumer-provided `id` as both the element `id` (for in-page links) and `aria-label`.
- Spreads additional HTML attributes onto the `<aside>`.

## When to use it

- Citations or references at the bottom of an article.
- Legal or regulatory clarifications linked from superscript reference markers.
- Academic notes that expand on a claim made in the main text.

## When not to use it

- For general supplementary content not tied to a reference marker. Use a plain `<aside>` or `Panel`.
- For grouped endnotes at the end of an article. Use `EndNotes`.
- For standalone citations that aren't a footnote. Use `Citation`.
- For inline hints near a form control. Use `Hint`.

## How to use it

Choose a stable unique id (e.g. `fn1`). Place a superscript link in the main content pointing at `#fn1`, and render `<Footnote id="fn1">...</Footnote>` where you want the note body.

## Props

- `class` (string, optional) - CSS class appended after the base `footnote` class.
- `id` (string, required) - Unique footnote identifier used for both element `id` and `aria-label`.
- `children` (Snippet, required) - Footnote content.
- `...restProps` - Additional HTML attributes spread onto the `<aside>`.

## Usage

```svelte
<script lang="ts">
    import Footnote from "./Footnote.svelte";
</script>

<p>This claim is supported by research.<a href="#fn1"><sup>1</sup></a></p>
<Footnote id="fn1">Source: Example et al., 2024</Footnote>
```

```svelte
<script lang="ts">
    import Footnote from "./Footnote.svelte";
</script>

<Footnote id="fn2">
    <a href="#ref2">2.</a> Example, A. (2024).
    <cite>Research Title</cite>. Journal Name.
</Footnote>
```

```svelte
<script lang="ts">
    import Footnote from "./Footnote.svelte";
    const notes = [
        { id: "fn1", text: "Data retrieved 2026-01-01." },
        { id: "fn2", text: "Adjusted for inflation." },
    ];
</script>

{#each notes as note}
    <Footnote id={note.id}>{note.text}</Footnote>
{/each}
```

```svelte
<script lang="ts">
    import Footnote from "./Footnote.svelte";
</script>

<Footnote id="fn-legal" class="legal-note" data-testid="legal">
    <p>Subject to change without notice.</p>
</Footnote>
```

```svelte
<script lang="ts">
    import Footnote from "./Footnote.svelte";
</script>

<article>
    <p>Water boils at 100&deg;C at sea level<a href="#fn-boil"><sup>1</sup></a>.</p>
    <Footnote id="fn-boil">At standard atmospheric pressure (101.325 kPa).</Footnote>
</article>
```

## Accessibility

- `role="note"` signals supplementary content to assistive technology.
- `aria-label` (set from `id`) provides the accessible name; prefer meaningful ids such as `fn-sources`.
- The `id` attribute is the in-page link target, enabling consumers to create superscript reference markers.
- No keyboard behaviour beyond that provided by interactive children (links, buttons).

## Related components

- `EndNotes` - a grouped section of endnote items at the end of an article.
- `Citation` - inline or block citation acknowledging another work.
- `Caption` - caption for a table or figure.
- `Hint` - contextual guidance next to a form control.
