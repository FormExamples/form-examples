# HoverCard

A hover card that displays supplementary content when triggered - typically by hover or focus on an external trigger element. Renders a container with `role="tooltip"` when `open` is true.

## What it is

A Svelte 5 component that conditionally renders `<div class="hover-card ..." role="tooltip" aria-label={label}>` when `open` is true. The `open` prop is bindable via `$bindable(false)`.

## What it does

- When `open` is true, renders a `<div role="tooltip">` with `aria-label` and the `children` snippet.
- When `open` is false, renders nothing at all.
- Spreads additional HTML attributes onto the `<div>`.
- Does not manage hover/focus/Escape - consumers wire those events on the trigger element and toggle `open`.

## When to use it

- User profile previews shown on hover over an avatar or name.
- Link previews or term definitions on hover/focus.
- Contextual help surfaces triggered by a question-mark button.

## When not to use it

- For a short descriptive tooltip where the consumer wants automatic positioning. Use `Tooltip`.
- For click-triggered floating menus. Use `Popover` or `DropdownMenu`.
- For full modal dialogs. Use `Dialog` or `AlertDialog`.
- For persistent contextual panels. Use `Popover` or `FloatingPanel`.

## How to use it

Bind `open` to consumer state, and toggle it from the trigger's `onmouseenter`/`onmouseleave`/`onfocus`/`onblur` (or `onclick`) events. Wire the trigger to the card via `aria-describedby` pointing at an id you set on the card.

## Props

- `class` (string, optional) - CSS class appended after the base `hover-card` class.
- `label` (string, required) - Accessible name via `aria-label`.
- `open` (boolean, default `false`) - Whether the card is rendered. Bindable via `bind:open`.
- `children` (Snippet, required) - Card content.
- `...restProps` - Additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
    import HoverCard from "./HoverCard.svelte";
    let open = $state(false);
</script>

<button
    onmouseenter={() => (open = true)}
    onmouseleave={() => (open = false)}
    onfocus={() => (open = true)}
    onblur={() => (open = false)}
    aria-describedby="user-card"
>Hover me</button>

<HoverCard id="user-card" label="User info" bind:open>
    <p>Profile details here</p>
</HoverCard>
```

```svelte
<script lang="ts">
    import HoverCard from "./HoverCard.svelte";
    let open = $state(false);
    const user = { name: "Alex", role: "Admin" };
</script>

<a
    href="/users/alex"
    onmouseenter={() => (open = true)}
    onmouseleave={() => (open = false)}
>{user.name}</a>

<HoverCard label={`Profile: ${user.name}`} bind:open>
    <p>{user.name}</p>
    <p>{user.role}</p>
</HoverCard>
```

```svelte
<script lang="ts">
    import HoverCard from "./HoverCard.svelte";
    let open = $state(false);
    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") open = false;
    }
</script>

<svelte:window on:keydown={onKey} />
<button
    onfocus={() => (open = true)}
    onblur={() => (open = false)}
>Help</button>
<HoverCard label="Help" bind:open>
    <p>Press Escape to dismiss.</p>
</HoverCard>
```

```svelte
<script lang="ts">
    import HoverCard from "./HoverCard.svelte";
    let open = $state(false);
</script>

<HoverCard
    label="Terms glossary"
    bind:open
    class="glossary-card"
    data-testid="glossary"
>
    <dl>
        <dt>API</dt><dd>Application Programming Interface</dd>
    </dl>
</HoverCard>
```

```svelte
<script lang="ts">
    import HoverCard from "./HoverCard.svelte";
    let openFor = $state<string | null>(null);
    const items = ["A", "B", "C"];
</script>

{#each items as item}
    <button
        onmouseenter={() => (openFor = item)}
        onmouseleave={() => (openFor = null)}
    >{item}</button>
    {#if openFor === item}
        <HoverCard label={`Info about ${item}`} open={true}>
            <p>Details about {item}</p>
        </HoverCard>
    {/if}
{/each}
```

## Accessibility

- `role="tooltip"` marks the element as supplementary descriptive content.
- `aria-label` names the content.
- Consumers should link the trigger to the card via `aria-describedby`.
- When closed, the card is not in the DOM and cannot be reached by Tab.
- Consumer manages Escape-to-close and focus/hover event wiring.

## Related components

- `Tooltip` - shorter tooltip popups.
- `Popover` - click-triggered floating content.
- `FloatingPanel` - generic floating region container.
- `Popup` - temporary overlay content.
- `Dialog` / `AlertDialog` - modal dialogs.
