# TabBarButton

A headless tab button intended to sit inside a `TabBar`. Renders `<button role="tab">` with `aria-selected`, `aria-controls`, and roving `tabindex`.

## What it is

A Svelte 5 headless component that renders a single `<button class="tab-bar-button ...">` with:

- `role="tab"`
- `aria-selected={selected}`
- `aria-controls={controls}`
- `tabindex={selected ? 0 : -1}` (roving tabindex)

## What it does

- Declares itself as a tab.
- Reflects selection state via `aria-selected`.
- Links to its tabpanel via `aria-controls` (required id of the panel element).
- Uses roving tabindex so only the active tab participates in Tab order.
- Renders `children` as the visible label.
- Spreads `...restProps` onto the `<button>` (for example, `onclick`).

## When to use it

- Exclusively inside `TabBar` (or any `role="tablist"` container).
- As the clickable tab header that switches content panels.

## When not to use it

- Outside a tablist - use `Button` or `ToggleButton`.
- For tab-like radio selection without panel association - use `SegmentGroupItem`.

## How to use it

1. Import alongside `TabBar`.
2. Set `selected` on the currently active tab.
3. Pass the id of the corresponding tabpanel as `controls`.
4. Attach an `onclick` to update which tab is active.

## Props

- `class` (string, optional, default `""`) - merged with the base `tab-bar-button` class.
- `selected` (boolean, optional, default `false`) - current active tab; drives `aria-selected` and roving `tabindex`.
- `controls` (string, required) - id of the associated tabpanel element.
- `children` (Snippet, required) - tab label content.
- `...restProps` - spread onto the `<button>`.

## Usage

Basic pair of tabs:

```svelte
<script lang="ts">
    import TabBar from "../TabBar/TabBar.svelte";
    import TabBarButton from "./TabBarButton.svelte";
    let active = $state("general");
</script>

<TabBar label="Settings">
    <TabBarButton
        selected={active === "general"}
        controls="panel-general"
        onclick={() => (active = "general")}
    >General</TabBarButton>
    <TabBarButton
        selected={active === "advanced"}
        controls="panel-advanced"
        onclick={() => (active = "advanced")}
    >Advanced</TabBarButton>
</TabBar>
```

Tabs with icons:

```svelte
<script lang="ts">
    import TabBar from "../TabBar/TabBar.svelte";
    import TabBarButton from "./TabBarButton.svelte";
    let active = $state("home");
</script>

<TabBar label="App">
    <TabBarButton
        selected={active === "home"}
        controls="p-home"
        onclick={() => (active = "home")}
    >
        <span aria-hidden="true">🏠</span> Home
    </TabBarButton>
    <TabBarButton
        selected={active === "profile"}
        controls="p-profile"
        onclick={() => (active = "profile")}
    >
        <span aria-hidden="true">👤</span> Profile
    </TabBarButton>
</TabBar>
```

Mapped from a list:

```svelte
<script lang="ts">
    import TabBar from "../TabBar/TabBar.svelte";
    import TabBarButton from "./TabBarButton.svelte";
    const items = ["overview", "activity", "settings"];
    let active = $state("overview");
</script>

<TabBar label="Profile">
    {#each items as it}
        <TabBarButton
            selected={active === it}
            controls={`p-${it}`}
            onclick={() => (active = it)}
        >{it}</TabBarButton>
    {/each}
</TabBar>
```

With panels matching the `controls` id:

```svelte
<script lang="ts">
    import TabBar from "../TabBar/TabBar.svelte";
    import TabBarButton from "./TabBarButton.svelte";
    let active = $state("a");
</script>

<TabBar label="Data">
    <TabBarButton selected={active === "a"} controls="panel-a" onclick={() => (active = "a")}>A</TabBarButton>
    <TabBarButton selected={active === "b"} controls="panel-b" onclick={() => (active = "b")}>B</TabBarButton>
</TabBar>
<section id="panel-a" role="tabpanel" hidden={active !== "a"}>A</section>
<section id="panel-b" role="tabpanel" hidden={active !== "b"}>B</section>
```

Disabled/non-interactive via attribute spread:

```svelte
<script lang="ts">
    import TabBar from "../TabBar/TabBar.svelte";
    import TabBarButton from "./TabBarButton.svelte";
</script>

<TabBar label="Docs">
    <TabBarButton selected controls="p1">Intro</TabBarButton>
    <TabBarButton controls="p2" disabled>Advanced (coming soon)</TabBarButton>
</TabBar>
```

## Accessibility

- `role="tab"` + `aria-selected` + `aria-controls` implement the Tabs pattern.
- Roving tabindex ensures only one tab is in the tab order.
- Enter and Space activate the button natively.
- Arrow / Home / End are handled by the parent `TabBar`.

References:
- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

## Related components

- `TabBar` - the required parent.
- `SegmentGroupItem` - radio-style alternative.
- `Button` - generic button.
