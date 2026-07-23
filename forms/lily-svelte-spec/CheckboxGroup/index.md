# CheckboxGroup

A headless fieldset container that groups related checkboxes under the WAI-ARIA `group` role with an accessible label. It supports a group-level `disabled` state (via the native `<fieldset disabled>` attribute, which cascades to all child inputs).

## What it is

CheckboxGroup renders a `<fieldset role="group" aria-label={label}>`. It is a structural wrapper — it does not manage checkbox state, filtering, or a "select all" control. Consumers supply native `<input type="checkbox">` elements (or `CheckboxInput` components) and manage selection themselves.

Note: despite the project-level description mentioning "Select all" and "indeterminate" support, the current source is a passive semantic wrapper only.

## What it does

- Renders `<fieldset role="group" aria-label={label}>`.
- Forwards the `disabled` attribute to the fieldset so native cascading applies.
- Spreads `restProps` onto the fieldset.

## When to use it

- Grouping related multi-select options (features, toppings, categories, tags).
- When a single accessible label should describe a set of checkboxes.
- When all checkboxes in the group should be disabled together.

## When not to use it

- For a single checkbox — use `CheckboxInput` alone.
- When only one option may be selected — use `RadioGroup`.
- For a list of tasks — use `CheckList` + `CheckListItem`.

## How to use it

Wrap checkbox inputs inside `<CheckboxGroup label="...">`. The component is intentionally minimal; use `<label>` wrappers around inputs so each option has a visible label.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | Accessible name for the group. |
| `disabled` | `boolean` | `false` | Disables the group via `<fieldset disabled>`. |
| `children` | `Snippet` | required | Checkbox elements. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<fieldset>`. |

## Usage

```svelte
<script lang="ts">
    import CheckboxGroup from "./CheckboxGroup.svelte";
</script>

<CheckboxGroup label="Features">
    <label><input type="checkbox" name="features" value="wifi" /> Wi-Fi</label>
    <label><input type="checkbox" name="features" value="bluetooth" /> Bluetooth</label>
    <label><input type="checkbox" name="features" value="gps" /> GPS</label>
</CheckboxGroup>
```

```svelte
<script lang="ts">
    import CheckboxGroup from "./CheckboxGroup.svelte";
</script>

<CheckboxGroup label="Toppings" disabled>
    <label><input type="checkbox" value="cheese" /> Cheese</label>
    <label><input type="checkbox" value="olives" /> Olives</label>
</CheckboxGroup>
```

```svelte
<script lang="ts">
    import CheckboxGroup from "./CheckboxGroup.svelte";

    let selected = $state<string[]>([]);
    const options = ["Email", "SMS", "Push"];

    function toggle(option: string) {
        selected = selected.includes(option)
            ? selected.filter((o) => o !== option)
            : [...selected, option];
    }
</script>

<CheckboxGroup label="Notifications">
    {#each options as option}
        <label>
            <input
                type="checkbox"
                checked={selected.includes(option)}
                onchange={() => toggle(option)}
            />
            {option}
        </label>
    {/each}
</CheckboxGroup>
```

```svelte
<script lang="ts">
    import CheckboxGroup from "./CheckboxGroup.svelte";
    import CheckboxInput from "../CheckboxInput/CheckboxInput.svelte";

    let wifi = $state(false);
    let bluetooth = $state(false);
</script>

<CheckboxGroup label="Connectivity">
    <CheckboxInput label="Wi-Fi" bind:checked={wifi} />
    <CheckboxInput label="Bluetooth" bind:checked={bluetooth} />
</CheckboxGroup>
```

## Accessibility

- `role="group"` with `aria-label` creates an explicit group landmark.
- Using `<fieldset disabled>` cascades the disabled state to every nested form control.
- Include a visible label on each option for visual users (e.g. wrap the input in a `<label>`).

## Related components

- `CheckboxInput` — bare checkbox input with `aria-label`.
- `CheckList`, `CheckListItem` — ordered list of tasks with checkboxes.
- `RadioGroup`, `RadioInput` — single-select equivalents.

---

Lily™ and Lily Design System™ are trademarks.
