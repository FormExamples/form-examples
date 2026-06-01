# Icon

An icon wrapper that provides proper accessibility semantics for icon content. Supports both meaningful icons (announced by screen readers) and decorative icons (hidden from assistive tech). The consumer provides the actual icon content (text, SVG, or other markup) as children.

## What it is

A Svelte 5 component that renders `<span class="icon ...">` wrapping the `children` snippet. ARIA semantics flip depending on whether the icon is meaningful (has a `label`) or decorative.

## What it does

- Renders `<span class="icon ...">` around the `children` snippet.
- When `decorative` is true: sets `aria-hidden="true"` and omits the role.
- When `decorative` is false: sets `role="img"` and applies `aria-label={label}` (undefined if no label given).
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Wrapping inline icon glyphs (text characters, emoji, SVG markup) to ensure correct accessibility semantics.
- Declaring whether an icon conveys meaning (then it needs a label) or is decorative.

## When not to use it

- For emoji with a specific text label. Use `Emoji`.
- For a single decorative character inside body text. Use `Character`.
- For images with full alt text. Use `Image`.
- For QR codes. Use `QrCodeImage`.

## How to use it

Pass a `label` when the icon conveys meaning that should be announced; pass `decorative` when the icon only decorates an adjacent label.

## Props

- `class` (string, optional) - CSS class appended after the base `icon` class.
- `label` (string, optional) - Accessible name via `aria-label` for meaningful icons.
- `decorative` (boolean, default `false`) - Hides the icon from assistive tech when true.
- `children` (Snippet, required) - Icon content.
- `...restProps` - Additional HTML attributes spread onto the `<span>`.

## Usage

```svelte
<script lang="ts">
    import Icon from "./Icon.svelte";
</script>

<Icon label="Close">x</Icon>
```

```svelte
<script lang="ts">
    import Icon from "./Icon.svelte";
</script>

<button aria-label="Save">
    <Icon decorative>*</Icon>
    Save
</button>
```

```svelte
<script lang="ts">
    import Icon from "./Icon.svelte";
</script>

<Icon label="Search">
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" />
        <line x1="21" y1="21" x2="16" y2="16" stroke="currentColor" />
    </svg>
</Icon>
```

```svelte
<script lang="ts">
    import Icon from "./Icon.svelte";
</script>

<Icon label="Warning" class="warning-icon" data-testid="warning">
    ⚠
</Icon>
```

```svelte
<script lang="ts">
    import Icon from "./Icon.svelte";
    const items = [
        { glyph: "★", label: "Favourite" },
        { glyph: "✎", label: "Edit" },
        { glyph: "✕", label: "Remove" },
    ];
</script>

<ul>
    {#each items as it}
        <li>
            <button aria-label={it.label}>
                <Icon decorative>{it.glyph}</Icon>
            </button>
        </li>
    {/each}
</ul>
```

## Accessibility

- Meaningful icons: `role="img"` + `aria-label` announce the icon as a named image.
- Decorative icons: `aria-hidden="true"` removes them from the accessibility tree.
- Consumer is responsible for choosing the correct mode; mixing them (e.g. providing both `label` and `decorative`) would be contradictory - prefer one or the other.

## Related components

- `Emoji` - emoji with explicit accessible name.
- `Character` - single character display element.
- `Image` - full image component with required alt text.
- `ScreenReaderSpan` - visually hidden text for screen readers.
- `Flair` - small inline label/emphasis element.
