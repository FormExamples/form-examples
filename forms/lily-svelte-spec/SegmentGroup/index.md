# SegmentGroup

A headless container for a set of mutually exclusive segment options, rendered as a `role="radiogroup"`. Intended to hold `SegmentGroupItem` children (or any `role="radio"` buttons).

## What it is

`SegmentGroup` renders a single `<div class="segment-group ...">` with `role="radiogroup"` and `aria-label`. It wraps `children` (typically `SegmentGroupItem` elements).

## What it does

- Groups mutually exclusive options semantically via `role="radiogroup"`.
- Attaches the accessible name via `aria-label`.
- Renders `children` as-is and spreads `...restProps` onto the root `<div>`.

It does NOT implement arrow-key navigation or selection state. Consumers manage which child is selected and can add keyboard handlers if desired.

## When to use it

- View-mode toggles (Grid / List / Gallery).
- Display-density selectors (Compact / Comfortable / Spacious).
- Filter pills that pick exactly one option.
- Any single-select UI that should be announced as a group of mutually exclusive radios.

## When not to use it

- Multi-select chip rows - use `TagGroup` or `CheckboxGroup`.
- Standard form radio buttons with labels - use `RadioGroup` and `RadioInput`.
- Tabs that switch content panels - use `TabBar` / `TabBarButton`.
- Arbitrary toggles - use `ToggleGroup`.

## How to use it

1. Import both `SegmentGroup` and `SegmentGroupItem`.
2. Provide a translated `label` on the group.
3. Render one `SegmentGroupItem` per option, setting `checked` on the currently selected one.
4. Handle clicks on each `SegmentGroupItem` to update your selection state.

## Props

- `class` (string, optional, default `""`) - merged with the base `segment-group` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - segment items.
- `...restProps` - spread onto the root `<div>`.

## Usage

Composition with `SegmentGroupItem`:

```svelte
<script lang="ts">
    import SegmentGroup from "./SegmentGroup.svelte";
    import SegmentGroupItem from "../SegmentGroupItem/SegmentGroupItem.svelte";
    let mode = $state<"grid" | "list">("grid");
</script>

<SegmentGroup label="Display mode">
    <SegmentGroupItem
        checked={mode === "grid"}
        value="grid"
        onclick={() => (mode = "grid")}
    >Grid</SegmentGroupItem>
    <SegmentGroupItem
        checked={mode === "list"}
        value="list"
        onclick={() => (mode = "list")}
    >List</SegmentGroupItem>
</SegmentGroup>
```

Three-option density picker:

```svelte
<script lang="ts">
    import SegmentGroup from "./SegmentGroup.svelte";
    import SegmentGroupItem from "../SegmentGroupItem/SegmentGroupItem.svelte";
    let density = $state<"compact" | "cozy" | "comfortable">("cozy");
    const options = ["compact", "cozy", "comfortable"] as const;
</script>

<SegmentGroup label="Density">
    {#each options as d}
        <SegmentGroupItem
            checked={density === d}
            value={d}
            onclick={() => (density = d)}
        >{d}</SegmentGroupItem>
    {/each}
</SegmentGroup>
```

With a disabled option:

```svelte
<script lang="ts">
    import SegmentGroup from "./SegmentGroup.svelte";
    import SegmentGroupItem from "../SegmentGroupItem/SegmentGroupItem.svelte";
    let plan = $state("free");
</script>

<SegmentGroup label="Plan">
    <SegmentGroupItem checked={plan === "free"} value="free" onclick={() => (plan = "free")}>Free</SegmentGroupItem>
    <SegmentGroupItem checked={plan === "pro"} value="pro" onclick={() => (plan = "pro")}>Pro</SegmentGroupItem>
    <SegmentGroupItem checked={plan === "enterprise"} value="enterprise" disabled>Enterprise</SegmentGroupItem>
</SegmentGroup>
```

Inside a form with hidden input:

```svelte
<script lang="ts">
    import SegmentGroup from "./SegmentGroup.svelte";
    import SegmentGroupItem from "../SegmentGroupItem/SegmentGroupItem.svelte";
    let view = $state("grid");
</script>

<form>
    <SegmentGroup label="View">
        <SegmentGroupItem checked={view === "grid"} value="grid" onclick={() => (view = "grid")}>Grid</SegmentGroupItem>
        <SegmentGroupItem checked={view === "list"} value="list" onclick={() => (view = "list")}>List</SegmentGroupItem>
    </SegmentGroup>
    <input type="hidden" name="view" value={view} />
</form>
```

Plain-button children (no `SegmentGroupItem`):

```svelte
<script lang="ts">
    import SegmentGroup from "./SegmentGroup.svelte";
</script>

<SegmentGroup label="View">
    <button role="radio" aria-checked="true">Grid</button>
    <button role="radio" aria-checked="false">List</button>
</SegmentGroup>
```

## Accessibility

- `role="radiogroup"` makes the container a named group of mutually exclusive radios.
- `aria-label` is required.
- Children should have `role="radio"` and `aria-checked`.
- Arrow-key navigation is not built in; `SegmentGroupItem` uses roving `tabindex` based on `checked`.

References:
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

## Related components

- `SegmentGroupItem` - the intended child.
- `RadioGroup` / `RadioInput` - native form radios.
- `ToggleGroup` - similar pattern for toggle buttons.
- `CheckboxGroup` - multi-select equivalent.

---

Lily™ and Lily Design System™ are trademarks.
