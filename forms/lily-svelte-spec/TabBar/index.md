# TabBar

A headless tab list container with arrow-key navigation between `role="tab"` children.

## What it is

A Svelte 5 headless component that renders `<div class="tab-bar ...">` with `role="tablist"`, `aria-label`, and a `keydown` handler that cycles focus between descendant `[role='tab']` elements via Arrow keys and Home/End.

## What it does

- Declares the container as an ARIA tablist.
- Attaches an accessible name via `aria-label`.
- Implements horizontal keyboard navigation over descendants with `role="tab"`:
  - ArrowRight -> next tab (wraps to first)
  - ArrowLeft -> previous tab (wraps to last)
  - Home -> first tab
  - End -> last tab
- Renders `children` (expected to be `TabBarButton` elements or equivalents).
- Spreads `...restProps` onto the `<div>`.

Selection state is managed by the consumer.

## When to use it

- Tabbed panels for switching between content sections (settings, profiles, dashboards).
- Any place where horizontal keyboard navigation between a set of tabs is appropriate.

## When not to use it

- Vertical tab lists with different navigation semantics - you would need a variant with ArrowUp/ArrowDown (this component only listens to ArrowLeft/ArrowRight).
- Toolbars of actions - use `ToolBar` / `TaskBar`.
- Radio-style segment controls - use `SegmentGroup`.

## How to use it

1. Import `TabBar` and `TabBarButton`.
2. Provide a translated `label`.
3. Render one `TabBarButton` per tab; set `selected` on the active one and `controls` to the id of its tabpanel.
4. Render tabpanels (`role="tabpanel"`) in the consumer markup with matching ids.
5. Manage active-tab state yourself.

## Props

- `class` (string, optional, default `""`) - merged with the base `tab-bar` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - tab buttons.
- `...restProps` - spread onto the `<div>`.

## Usage

Basic tabs + tabpanels:

```svelte
<script lang="ts">
    import TabBar from "./TabBar.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
    let active = $state<"general" | "advanced">("general");
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
<section id="panel-general" role="tabpanel" hidden={active !== "general"}>General panel</section>
<section id="panel-advanced" role="tabpanel" hidden={active !== "advanced"}>Advanced panel</section>
```

Three-tab switch:

```svelte
<script lang="ts">
    import TabBar from "./TabBar.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
    const tabs = ["overview", "usage", "billing"] as const;
    let active = $state<typeof tabs[number]>("overview");
</script>

<TabBar label="Account">
    {#each tabs as t}
        <TabBarButton
            selected={active === t}
            controls={`panel-${t}`}
            onclick={() => (active = t)}
        >{t}</TabBarButton>
    {/each}
</TabBar>
```

With data-driven tabs:

```svelte
<script lang="ts">
    import TabBar from "./TabBar.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
    const items = [
        { id: "a", label: "Alpha" },
        { id: "b", label: "Beta" },
    ];
    let active = $state("a");
</script>

<TabBar label="Sections">
    {#each items as it}
        <TabBarButton
            selected={active === it.id}
            controls={`panel-${it.id}`}
            onclick={() => (active = it.id)}
        >{it.label}</TabBarButton>
    {/each}
</TabBar>
```

Plain-button children (still keyboard-navigable because arrow handling queries `[role='tab']`):

```svelte
<script lang="ts">
    import TabBar from "./TabBar.svelte";
</script>

<TabBar label="Minimal">
    <button role="tab" aria-selected="true" tabindex="0">One</button>
    <button role="tab" aria-selected="false" tabindex="-1">Two</button>
</TabBar>
```

With extra attributes on the tablist:

```svelte
<script lang="ts">
    import TabBar from "./TabBar.svelte";
    import TabBarButton from "../TabBarButton/TabBarButton.svelte";
</script>

<TabBar label="Views" id="views-tabs">
    <TabBarButton selected controls="p1">One</TabBarButton>
    <TabBarButton controls="p2">Two</TabBarButton>
</TabBar>
```

## Accessibility

- `role="tablist"` + `aria-label` announces the tab list.
- Each child `TabBarButton` provides `role="tab"`, `aria-selected`, `aria-controls`, and a roving `tabindex`.
- Arrow / Home / End navigation is built in.
- Consumers should ensure the associated tabpanels use `role="tabpanel"` with matching ids.

References:
- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

## Related components

- `TabBarButton` - the intended child.
- `SegmentGroup` - for radio-style single selection.
- `ToolBar`, `TaskBar` - toolbars of buttons.
