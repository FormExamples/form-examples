# Combobox

A headless combobox that combines a text input with a dropdown listbox for autocomplete or type-ahead experiences. The `value` (input text) and `open` (dropdown visibility) are both bindable. Escape closes the dropdown.

## What it is

Combobox renders a wrapper `<div>` containing:

- `<input type="text" role="combobox" aria-label aria-expanded aria-controls aria-autocomplete="list">`, and
- a conditionally rendered `<div role="listbox" id={listboxId} aria-label>` containing the consumer's options.

A unique `listboxId` is generated for the `aria-controls` relationship. Consumers implement filtering and option rendering themselves.

## What it does

- Renders an ARIA combobox input and an ARIA listbox.
- Two-way binds `value` (string) and `open` (boolean).
- Closes the listbox on Escape.
- Links input and listbox via `aria-controls`.

## When to use it

- Filtering a long list of options (countries, users, tags).
- Autocomplete search experiences where users type and select.
- Any input where suggestions should appear inline.

## When not to use it

- For a fully static dropdown — use `Select` or `SelectWithExtras`.
- For a command palette — use `Command`.
- For free text without suggestions — use `TextInput`.

## How to use it

Bind `value` for filtering. Bind `open` to control visibility. Provide `role="option"` descendants as children; set `tabindex="-1"` on options and manage selection on click.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | `aria-label` for both input and listbox. |
| `value` | `string` | `""` (bindable) | Current text input value. |
| `open` | `boolean` | `false` (bindable) | Whether the listbox is visible. |
| `children` | `Snippet` | required | Option elements rendered in the listbox. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the wrapper `<div>`. |

## Usage

```svelte
<script lang="ts">
    import Combobox from "./Combobox.svelte";

    let value = $state("");
    let open = $state(false);
    const options = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
    let filtered = $derived(
        options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
    );
</script>

<Combobox label="Pick a fruit" bind:value bind:open>
    {#each filtered as option}
        <div
            role="option"
            tabindex="-1"
            onclick={() => {
                value = option;
                open = false;
            }}
        >
            {option}
        </div>
    {/each}
</Combobox>
```

```svelte
<script lang="ts">
    import Combobox from "./Combobox.svelte";

    let q = $state("");
    let open = $state(false);
</script>

<Combobox label="Search users" bind:value={q} bind:open>
    {#if q.trim().length === 0}
        <div role="option" tabindex="-1">Start typing to search...</div>
    {:else}
        <div role="option" tabindex="-1">No results for "{q}"</div>
    {/if}
</Combobox>
```

```svelte
<script lang="ts">
    import Combobox from "./Combobox.svelte";

    let open = $state(false);
    let value = $state("");
</script>

<Combobox label="Tags" bind:value bind:open>
    <div role="option" tabindex="-1">design</div>
    <div role="option" tabindex="-1">svelte</div>
    <div role="option" tabindex="-1">accessibility</div>
</Combobox>

<button type="button" onclick={() => (open = !open)}>Toggle dropdown</button>
```

```svelte
<script lang="ts">
    import Combobox from "./Combobox.svelte";

    let value = $state("");
    let open = $state(false);
    const items = ["Alpha", "Beta", "Gamma"];
</script>

<Combobox label="Phase" bind:value bind:open>
    {#each items as item}
        <div role="option" tabindex="-1">{item}</div>
    {/each}
</Combobox>
```

## Accessibility

- `role="combobox"` on the input, `role="listbox"` on the dropdown, linked by `aria-controls`.
- `aria-expanded` reflects `open`.
- `aria-autocomplete="list"` tells assistive tech that suggestions come via a list.
- Escape closes the dropdown. Consider adding Arrow key navigation to options in your implementation.

## Related components

- `Command` — search-focused command palette variant.
- `Listbox` — standalone selectable list.
- `Select`, `SelectWithExtras` — `<select>`-based alternatives.
