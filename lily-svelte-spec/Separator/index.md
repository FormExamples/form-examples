# Separator

A headless horizontal divider that renders a semantic `<hr>` with `role="separator"` and an optional accessible label.

## What it is

A Svelte 5 headless primitive that renders exactly one void `<hr class="separator ...">` element with `role="separator"` and optional `aria-label`.

## What it does

- Creates a semantic horizontal rule with an explicit `role="separator"`.
- Applies an optional `aria-label` (the component writes `aria-label={undefined}` when the prop is not supplied, so the attribute is omitted).
- Spreads `...restProps` onto the `<hr>`.
- Has no children - `<hr>` is a void element.

## When to use it

- Between sections of text, menu items, or form groups.
- Between unrelated tiles, cards, or list sections.
- Any place you want a semantically announced break, not just a visual line.

## When not to use it

- For purely decorative spacing - use margin/padding in CSS.
- Between columns or panels that can be resized - use `Splitter`.
- Between grid tracks in a layout - keep it presentational.
- Inside `<hr>`-forbidden contexts (for example, inside `<tr>`).

## How to use it

1. Import from its source file.
2. Optionally pass a translated `label` to describe the break.
3. Add any CSS via class or style spread.

## Props

- `class` (string, optional, default `""`) - merged with the base `separator` class.
- `label` (string, optional, default `undefined`) - applied to `aria-label` when provided.
- `...restProps` - any additional attributes spread onto `<hr>`.

## Usage

Simple separator:

```svelte
<script lang="ts">
    import Separator from "./Separator.svelte";
</script>

<p>First section</p>
<Separator />
<p>Second section</p>
```

Labeled separator:

```svelte
<script lang="ts">
    import Separator from "./Separator.svelte";
</script>

<Separator label="End of introduction" />
```

Separator with data attribute for CSS:

```svelte
<script lang="ts">
    import Separator from "./Separator.svelte";
</script>

<Separator label="Section break" data-section="divider" />
```

Between menu items:

```svelte
<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";
    import Separator from "./Separator.svelte";
</script>

<Menu label="Actions">
    <MenuItem>Open</MenuItem>
    <MenuItem>Save</MenuItem>
    <Separator label="Destructive actions" />
    <MenuItem>Delete</MenuItem>
</Menu>
```

Custom styling with class:

```svelte
<script lang="ts">
    import Separator from "./Separator.svelte";
</script>

<Separator class="thick" />
```

## Accessibility

- Explicit `role="separator"` is rendered (even though `<hr>` implies it) so it is consistently announced by assistive technologies.
- Supply a meaningful `aria-label` only when the break's purpose is not obvious from context; otherwise omit.

References:
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
- MDN `<hr>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr

## Related components

- `Splitter` - focusable separator between resizable regions.
- `Resizable` - resizable region.
- `Footer` / `Header` - top-level landmark structures.
