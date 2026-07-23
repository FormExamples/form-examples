# Collapsible

A headless disclosure widget built on native `<details>` and `<summary>`. Users click the summary text to expand or collapse the contained content. The `open` prop is bindable for two-way control.

## What it is

Collapsible renders:

```html
<details bind:open>
  <summary>{summary}</summary>
  {children}
</details>
```

No custom ARIA is required — native `<details>`/`<summary>` handle expanded/collapsed semantics, keyboard interaction, and screen-reader announcements.

## What it does

- Renders a `<details>` with the given `summary` and `children`.
- Two-way binds the `open` boolean via Svelte's `bind:open`.
- Spreads `restProps` onto the `<details>`.

## When to use it

- FAQ entries, advanced settings, progressive disclosure patterns.
- Any single-section show/hide that benefits from native browser support.
- When you want built-in keyboard handling without writing custom ARIA.

## When not to use it

- For multi-section accordions that should collapse siblings — consider building with multiple `<details>` or use the `AccordionList` composition.
- For modal content or overlays — use `Dialog` or `Drawer`.
- When summary contains interactive elements that must be focusable — nesting interactive controls inside `<summary>` is discouraged.

## How to use it

Provide a required `summary` string and children content. Optionally bind `open` to observe or control state.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `summary` | `string` | required | Text of the toggle trigger. |
| `open` | `boolean` | `false` (bindable) | Whether the content is expanded. |
| `children` | `Snippet` | required | Revealed content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<details>`. |

## Usage

```svelte
<script lang="ts">
    import Collapsible from "./Collapsible.svelte";
</script>

<Collapsible summary="More info">
    <p>Hidden content revealed when expanded.</p>
</Collapsible>
```

```svelte
<script lang="ts">
    import Collapsible from "./Collapsible.svelte";

    let showAdvanced = $state(false);
</script>

<Collapsible summary="Advanced settings" bind:open={showAdvanced}>
    <p>Advanced options here.</p>
</Collapsible>
<p>Advanced is {showAdvanced ? "shown" : "hidden"}.</p>
```

```svelte
<script lang="ts">
    import Collapsible from "./Collapsible.svelte";
</script>

<Collapsible summary="What is a cookie?">
    <p>A small piece of data stored by your browser.</p>
</Collapsible>
<Collapsible summary="Why do we use them?">
    <p>To remember preferences and keep you signed in.</p>
</Collapsible>
```

```svelte
<script lang="ts">
    import Collapsible from "./Collapsible.svelte";

    let open = $state(true);
</script>

<Collapsible summary="Notes" bind:open>
    <ul>
        <li>Item A</li>
        <li>Item B</li>
    </ul>
</Collapsible>
```

## Accessibility

- Native `<details>`/`<summary>` expose the disclosure pattern to assistive tech without additional ARIA.
- Enter and Space toggle the disclosure when `<summary>` is focused.
- Keep the summary text descriptive; avoid nesting focusable controls inside `<summary>`.

## Related components

- `Details` — lower-level thin wrapper around `<details>`/`<summary>`.
- `Expander` — similar pattern with different semantics.
- `AccordionList`, `AccordionListItem` — grouped collapsible sections.

---

Lily™ and Lily Design System™ are trademarks.
