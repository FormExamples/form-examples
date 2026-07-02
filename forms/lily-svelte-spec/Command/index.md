# Command

A headless command palette that provides a searchable list of actions or items. It renders a search region containing a text input and a listbox for results. The search `value` is bindable so consumers can filter results dynamically.

## What it is

Command renders:

- `<div role="search" aria-label={label}>` as the outer region,
- `<input type="search" aria-label={label} autocomplete="off" bind:value>` for search, and
- `<div role="listbox" aria-label={label}>` for results.

The consumer provides filtering and item rendering.

## What it does

- Renders a search landmark containing a search input and a listbox.
- Two-way binds `value` for the search text.
- Sets `autocomplete="off"` so browser autocomplete does not interfere.

## When to use it

- Ctrl+K style quick-launch command palettes.
- Searchable menus, action runners.
- Searchable list pickers where search is the primary interaction.

## When not to use it

- Free text suggestions inline with another form — use `Combobox`.
- Static dropdown selects — use `Select`.
- Menu triggered from a button — use `DropdownMenu`.

## How to use it

Bind `value` to filter your command list. Render `<div role="option">` children; implement keyboard navigation between options as needed.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | `aria-label` for the search region, input, and listbox. |
| `placeholder` | `string` | `undefined` | Search input placeholder. |
| `value` | `string` | `""` (bindable) | Current search text. |
| `children` | `Snippet` | required | Items inside the listbox. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the outer `<div>`. |

## Usage

```svelte
<script lang="ts">
    import Command from "./Command.svelte";

    let q = $state("");
    const commands = [
        { id: "new", name: "New file" },
        { id: "open", name: "Open file" },
        { id: "save", name: "Save" }
    ];
    let filtered = $derived(
        commands.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
    );
</script>

<Command label="Command palette" placeholder="Search commands..." bind:value={q}>
    {#each filtered as c (c.id)}
        <div role="option" tabindex="-1">{c.name}</div>
    {/each}
</Command>
```

```svelte
<script lang="ts">
    import Command from "./Command.svelte";

    let q = $state("");
</script>

<Command label="Help" placeholder="Type to search help..." bind:value={q}>
    {#if q.trim().length === 0}
        <div role="option" tabindex="-1">Start typing to see suggestions.</div>
    {/if}
</Command>
```

```svelte
<script lang="ts">
    import Command from "./Command.svelte";

    let q = $state("");
    const items = ["Dashboard", "Settings", "Profile", "Logout"];
</script>

<Command label="Navigate" bind:value={q}>
    {#each items.filter((i) => i.toLowerCase().includes(q.toLowerCase())) as item}
        <div
            role="option"
            tabindex="-1"
            onclick={() => {
                console.log("Navigate:", item);
            }}
        >
            {item}
        </div>
    {/each}
</Command>
```

```svelte
<script lang="ts">
    import Command from "./Command.svelte";

    let q = $state("");
    let showPalette = $state(false);
</script>

<button type="button" onclick={() => (showPalette = true)}>Open palette (Ctrl+K)</button>

{#if showPalette}
    <Command label="Palette" placeholder="Search..." bind:value={q}>
        <div role="option" tabindex="-1">Open settings</div>
        <div role="option" tabindex="-1">Toggle theme</div>
    </Command>
{/if}
```

## Accessibility

- `role="search"` wraps the input and listbox as a landmark.
- `role="listbox"` names the results container.
- Provide keyboard navigation (ArrowUp/ArrowDown) between options yourself.

## Related components

- `Combobox` — inline text input with suggestions.
- `Menu`, `DropdownMenu`, `ContextMenu` — action lists with different triggers.
- `SearchInput` — bare search input.
