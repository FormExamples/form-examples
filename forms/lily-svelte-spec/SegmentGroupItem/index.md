# SegmentGroupItem

A single option within a `SegmentGroup`, rendered as `<button role="radio">` with `aria-checked` and a roving `tabindex`.

## What it is

`SegmentGroupItem` renders one `<button class="segment-group-item ...">` with `role="radio"`, `aria-checked`, `data-value`, and `tabindex` toggled by the `checked` prop (0 when checked, -1 otherwise).

## What it does

- Declares itself as a radio option inside a radio group.
- Reflects selection state via `aria-checked={checked}`.
- Exposes the option's value via the `data-value` attribute for CSS/JS targeting.
- Uses roving `tabindex` so only the checked segment receives Tab focus.
- Forwards `disabled` and spreads `...restProps` onto the `<button>`.

The component does not change its own state; the consumer handles clicks.

## When to use it

- As a child of `SegmentGroup` to build segmented controls.
- When you need a button-like radio with visual selection state.

## When not to use it

- As a standalone button (use `Button` or `ToggleButton`).
- Outside a `role="radiogroup"` container.
- When multiple items can be selected - use `ToggleGroup`/`CheckboxGroup` instead.

## How to use it

1. Import alongside `SegmentGroup`.
2. Set `checked` on the currently selected item.
3. Pass `value` for identification.
4. Wire `onclick` (via restProps) to update your state.

## Props

- `class` (string, optional, default `""`) - merged with the base `segment-group-item` class.
- `checked` (boolean, optional, default `false`) - whether this item is selected; written to `aria-checked` and drives roving `tabindex`.
- `value` (string, optional, default `""`) - written to `data-value`.
- `disabled` (boolean, optional, default `false`).
- `children` (Snippet, required) - label content.
- `...restProps` - spread onto the `<button>` (for example, `onclick`).

## Usage

Basic selected/unselected pair:

```svelte
<script lang="ts">
    import SegmentGroup from "../SegmentGroup/SegmentGroup.svelte";
    import SegmentGroupItem from "./SegmentGroupItem.svelte";
    let view = $state("grid");
</script>

<SegmentGroup label="View">
    <SegmentGroupItem
        checked={view === "grid"}
        value="grid"
        onclick={() => (view = "grid")}
    >Grid</SegmentGroupItem>
    <SegmentGroupItem
        checked={view === "list"}
        value="list"
        onclick={() => (view = "list")}
    >List</SegmentGroupItem>
</SegmentGroup>
```

Dynamic options:

```svelte
<script lang="ts">
    import SegmentGroup from "../SegmentGroup/SegmentGroup.svelte";
    import SegmentGroupItem from "./SegmentGroupItem.svelte";
    const sizes = ["S", "M", "L"] as const;
    let size = $state<typeof sizes[number]>("M");
</script>

<SegmentGroup label="Size">
    {#each sizes as s}
        <SegmentGroupItem
            checked={size === s}
            value={s}
            onclick={() => (size = s)}
        >{s}</SegmentGroupItem>
    {/each}
</SegmentGroup>
```

Disabled option:

```svelte
<script lang="ts">
    import SegmentGroup from "../SegmentGroup/SegmentGroup.svelte";
    import SegmentGroupItem from "./SegmentGroupItem.svelte";
</script>

<SegmentGroup label="Tier">
    <SegmentGroupItem checked value="free">Free</SegmentGroupItem>
    <SegmentGroupItem value="pro">Pro</SegmentGroupItem>
    <SegmentGroupItem value="enterprise" disabled>Enterprise</SegmentGroupItem>
</SegmentGroup>
```

With icons or complex children:

```svelte
<script lang="ts">
    import SegmentGroup from "../SegmentGroup/SegmentGroup.svelte";
    import SegmentGroupItem from "./SegmentGroupItem.svelte";
    let mode = $state("light");
</script>

<SegmentGroup label="Theme">
    <SegmentGroupItem checked={mode === "light"} value="light" onclick={() => (mode = "light")}>
        <span aria-hidden="true">☀️</span> Light
    </SegmentGroupItem>
    <SegmentGroupItem checked={mode === "dark"} value="dark" onclick={() => (mode = "dark")}>
        <span aria-hidden="true">🌙</span> Dark
    </SegmentGroupItem>
</SegmentGroup>
```

Keyboard-arrow handling (consumer-provided on the parent):

```svelte
<script lang="ts">
    import SegmentGroup from "../SegmentGroup/SegmentGroup.svelte";
    import SegmentGroupItem from "./SegmentGroupItem.svelte";
    const opts = ["a", "b", "c"];
    let sel = $state("a");
    function onkeydown(e: KeyboardEvent) {
        const i = opts.indexOf(sel);
        if (e.key === "ArrowRight") sel = opts[(i + 1) % opts.length];
        if (e.key === "ArrowLeft") sel = opts[(i - 1 + opts.length) % opts.length];
    }
</script>

<SegmentGroup label="Options" {onkeydown}>
    {#each opts as o}
        <SegmentGroupItem checked={sel === o} value={o} onclick={() => (sel = o)}>{o}</SegmentGroupItem>
    {/each}
</SegmentGroup>
```

## Accessibility

- `role="radio"` with `aria-checked` correctly models single-select inside a `role="radiogroup"`.
- Roving `tabindex` keeps only one item in the tab order.
- `disabled` is forwarded natively.
- Consumers should add arrow-key navigation on the parent for full radiogroup conformance.

## Related components

- `SegmentGroup` - the required parent.
- `RadioInput` - native `<input type="radio">`.
- `ToggleButton` / `ToggleGroup` - multi-select toggle equivalent.
