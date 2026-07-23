# Listbox

Listbox is a headless Svelte 5 component that presents a list of selectable options using the WAI-ARIA `listbox` role with full keyboard navigation. It renders a `<div role="listbox">` and moves focus between child `role="option"` elements via ArrowDown, ArrowUp, Home, and End.

## What it is

An accessible list container that implements the WAI-ARIA listbox pattern. It observes keydown events on the container and uses the DOM `querySelectorAll("[role='option']")` to discover focusable options. Consumers are responsible for rendering option elements with `role="option"` and `tabindex="-1"`, and for managing selection state.

## What it does

- Renders a `<div>` with `class="listbox"` plus any consumer-provided CSS class.
- Applies `role="listbox"` and `aria-label` from the required `label` prop.
- Binds an internal `listRef` to the DOM element so keyboard handling can enumerate options.
- Handles these keys (wrapping at boundaries):
  - `ArrowDown` — focus the next option, wrapping to the first.
  - `ArrowUp` — focus the previous option, wrapping to the last.
  - `Home` — focus the first option.
  - `End` — focus the last option.
- Spreads `...restProps` onto the `<div>` for consumer customization.

## When to use it

- Lists of selectable items in settings panels, filters, pickers, or multi-select interfaces.
- Any scenario where the user must pick one or more items from a visible, keyboard-navigable list.
- Bespoke selection widgets that do not fit a native `<select>` (e.g., rich option content, multi-select with checkboxes).

## When not to use it

- Do not use when a native `<select>` would suffice — use `Select` or `SelectWithExtras`.
- Do not use for interactive menus that trigger actions — use `Menu` or `DropdownMenu`.
- Do not use for navigation — use `NavigationMenu`, `TreeNav`, or `BreadcrumbNav`.
- Do not use for a list of links — use a list with `<a>` tags.

## How to use it

Render `Listbox` as a container, pass an accessible `label`, and include child elements with `role="option"` and `tabindex="-1"`. Manage selection externally via `aria-selected`.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `listbox` class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `children` (Snippet, required) — option elements (should have `role="option"` and `tabindex="-1"`).
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic listbox with multiple options and keyboard navigation

```svelte
<script lang="ts">
    import Listbox from "./Listbox.svelte";
</script>

<Listbox label="Fruits">
    <div role="option" tabindex="-1">Apple</div>
    <div role="option" tabindex="-1">Banana</div>
    <div role="option" tabindex="-1">Cherry</div>
    <div role="option" tabindex="-1">Durian</div>
</Listbox>
```

Users can move focus with ArrowDown/ArrowUp (wrapping) and jump to the first/last with Home/End.

### Listbox with dynamic selection state

```svelte
<script lang="ts">
    import Listbox from "./Listbox.svelte";
    let colors = ["Red", "Green", "Blue"];
    let selected = $state("Red");
</script>

<Listbox label="Select a color">
    {#each colors as color}
        <div
            role="option"
            tabindex="-1"
            aria-selected={selected === color}
            onclick={() => (selected = color)}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selected = color;
                }
            }}
        >
            {color}
        </div>
    {/each}
</Listbox>
<p>Selected: {selected}</p>
```

### Multi-select listbox with aria-multiselectable

```svelte
<script lang="ts">
    import Listbox from "./Listbox.svelte";
    let fruits = ["Apple", "Banana", "Cherry"];
    let chosen = $state<Set<string>>(new Set());

    function toggle(fruit: string) {
        if (chosen.has(fruit)) chosen.delete(fruit);
        else chosen.add(fruit);
        chosen = new Set(chosen);
    }
</script>

<Listbox label="Choose fruits" aria-multiselectable="true">
    {#each fruits as fruit}
        <div
            role="option"
            tabindex="-1"
            aria-selected={chosen.has(fruit)}
            onclick={() => toggle(fruit)}
        >
            {fruit}
        </div>
    {/each}
</Listbox>
```

### Listbox with rich option content

```svelte
<script lang="ts">
    import Listbox from "./Listbox.svelte";
    let people = [
        { id: 1, name: "Alice", role: "Engineer" },
        { id: 2, name: "Bob", role: "Designer" },
    ];
    let selectedId = $state(1);
</script>

<Listbox label="Assign to person">
    {#each people as person}
        <div
            role="option"
            tabindex="-1"
            aria-selected={selectedId === person.id}
            onclick={() => (selectedId = person.id)}
        >
            <strong>{person.name}</strong>
            <em>{person.role}</em>
        </div>
    {/each}
</Listbox>
```

### Listbox with consumer-focused first option

```svelte
<script lang="ts">
    import Listbox from "./Listbox.svelte";
    import { onMount } from "svelte";

    let firstOption: HTMLDivElement | undefined;
    onMount(() => firstOption?.focus());
</script>

<Listbox label="Options">
    <div bind:this={firstOption} role="option" tabindex="-1">Option 1</div>
    <div role="option" tabindex="-1">Option 2</div>
    <div role="option" tabindex="-1">Option 3</div>
</Listbox>
```

## Accessibility

- `role="listbox"` identifies the container as a listbox widget.
- `aria-label` provides the accessible name.
- Options must use `role="option"` and `tabindex="-1"` to participate in roving focus.
- Keyboard: ArrowDown/ArrowUp/Home/End (wrapping supported).
- Consumers should set `aria-selected` on the currently-selected option(s).
- Compliant with WAI-ARIA 1.2 Listbox Pattern and WCAG 2.2 AAA when focus indicators are provided.

## Related components

- `Combobox` — a text input combined with a dropdown list.
- `Select` — a native `<select>` dropdown.
- `SelectWithExtras` — an enhanced select dropdown with search or groups.
- `Menu` / `MenuItem` — a menu list for actions.
- `DropdownMenu` — a menu that opens below a trigger button.
- `CheckboxGroup` — a group of checkboxes for multi-select.
- `RadioGroup` — a group of radios for single-select.

---

Lily™ and Lily Design System™ are trademarks.
