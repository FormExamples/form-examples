# Select

A headless dropdown select that wraps the native HTML `<select>` element with an accessible label and bindable value.

## What it is

A Svelte 5 component that renders `<select class="select ...">` with `aria-label`, `bind:value`, `required`, and `disabled`. The dropdown options are provided by the consumer as `<option>` children (the `Option` component or plain `<option>` tags).

## What it does

- Renders a native `<select>` element.
- Exposes `value` via `$bindable("")` for two-way binding.
- Passes `required` and `disabled` through.
- Accepts arbitrary `<option>` descendants through `children`.
- Spreads `...restProps` onto the `<select>`.

Inherits all native keyboard, type-ahead, and form-submission behavior.

## When to use it

- Short lists of predefined values (countries, priorities, statuses, categories).
- Any form field where a native select is appropriate (mobile-friendly, accessible, and simple).
- Single-select lists that do not need search or multi-select.

## When not to use it

- Searchable lists - use `Combobox` or `SelectWithExtras` with custom logic.
- Multi-select - native `<select multiple>` is possible but not the primary use of this component.
- Rich option UI (icons, badges, groups) alongside the select control - use `SelectWithExtras`.
- Very long lists (hundreds of entries) - consider `Listbox` or `Combobox` with virtualization.

## How to use it

1. Import `Select` and optionally the `Option` component.
2. Pass a translated `label`.
3. Use `bind:value` for two-way data flow.
4. Provide `<option>` children (plain or via `Option`).

## Props

- `class` (string, optional, default `""`) - merged with the base `select` class.
- `label` (string, required) - accessible name via `aria-label`.
- `value` (string, optional, default `""`, bindable).
- `required` (boolean, optional, default `false`).
- `disabled` (boolean, optional, default `false`).
- `children` (Snippet, required) - `<option>` elements.
- `...restProps` - spread onto `<select>`.

## Usage

Basic select with plain options:

```svelte
<script lang="ts">
    import Select from "./Select.svelte";
    let country = $state("");
</script>

<Select label="Country" bind:value={country}>
    <option value="">Select...</option>
    <option value="us">United States</option>
    <option value="gb">United Kingdom</option>
</Select>
```

Select with `Option` children:

```svelte
<script lang="ts">
    import Select from "./Select.svelte";
    import Option from "../Option/Option.svelte";
    let priority = $state("");
</script>

<Select label="Priority" bind:value={priority} required>
    <Option value="">Select priority...</Option>
    <Option value="low">Low</Option>
    <Option value="high">High</Option>
</Select>
```

Disabled select:

```svelte
<script lang="ts">
    import Select from "./Select.svelte";
    let status = $state("active");
</script>

<Select label="Status" bind:value={status} disabled>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
</Select>
```

Dynamic options from data:

```svelte
<script lang="ts">
    import Select from "./Select.svelte";
    const categories = [
        { id: "news", name: "News" },
        { id: "sports", name: "Sports" },
        { id: "tech", name: "Technology" },
    ];
    let category = $state("news");
</script>

<Select label="Category" bind:value={category}>
    {#each categories as c}
        <option value={c.id}>{c.name}</option>
    {/each}
</Select>
```

With change handler via restProps:

```svelte
<script lang="ts">
    import Select from "./Select.svelte";
    let lang = $state("en");
</script>

<Select
    label="Language"
    bind:value={lang}
    onchange={() => console.log("picked:", lang)}
>
    <option value="en">English</option>
    <option value="fr">French</option>
    <option value="de">German</option>
</Select>
```

## Accessibility

- Native `<select>` carries full keyboard support (Tab, arrow keys, Space/Enter, type-ahead, Home/End, Escape).
- `aria-label` provides the accessible name (there is no visible `<label>` in this component).
- For richer dropdowns consider `Combobox` or `Listbox`.

References:
- MDN `<select>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

## Related components

- `Option` - option element wrapper.
- `SelectWithExtras` - select with `before`/`after` snippets.
- `Combobox` - text input with filterable dropdown.
- `Listbox` - keyboard-driven option list.

---

Lily™ and Lily Design System™ are trademarks.
