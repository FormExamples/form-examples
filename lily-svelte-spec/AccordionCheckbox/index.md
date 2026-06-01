# AccordionCheckbox

A compound disclosure widget that pairs a checkbox option with a revealable panel. The user sees a checkbox option; checking the box reveals an accordion panel of additional content beneath it. Multiple `AccordionCheckbox` instances stacked vertically form a list of independent toggleable options.

Unlike `Details`, which uses a `<summary>` toggle, this component uses a real form control. The `checked` prop is the source of truth and is bindable, so the parent can drive or react to the state.

## When to use it

- Conditional follow-up questions in a form ("I have additional comments" → text-area-input)
- Opt-in disclosures that hide non-essential detail until requested
- A vertical list of independent expandable options

## When not to use it

- Use `Details` when the trigger is a non-form summary toggle.
- Use `SwitchButton` when the toggle does not reveal additional content.
- Use `RadioGroup` when only one option may be active.
- Use `AccordionList` / `AccordionListItem` when only one of many panels may be open at a time.

## Props

- `label`: `string` (required) — the checkbox label text.
- `checked`: `boolean` (default: `false`, bindable) — whether the checkbox is checked and the panel is revealed.
- `id`: `string` (optional) — base id used for the checkbox (`<id>-checkbox`) and panel (`<id>-panel`); auto-generated when omitted.
- `children`: `Snippet` (required) — content shown when checked.
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## How to use it

```svelte
<script lang="ts">
    import AccordionCheckbox from "./AccordionCheckbox.svelte";

    let comments = $state(false);
</script>

<AccordionCheckbox label="I have additional comments" bind:checked={comments}>
    <textarea aria-label="Your comments"></textarea>
</AccordionCheckbox>
```

## Accessibility

- `aria-controls` on the checkbox references the panel id.
- `aria-expanded` on the checkbox reflects the checked state.
- `role="region"` + `aria-labelledby` on the panel announces it as a labeled region tied to the checkbox.
- The native `hidden` attribute on the panel removes it from the accessibility tree when unchecked.

## Keyboard

- `Tab` — moves focus onto the checkbox.
- `Space` — toggles the checkbox (native), revealing or hiding the panel.

## Related components

- `Details` — disclosure widget using `<details>` / `<summary>`.
- `Collapsible` — generic collapsible container.
- `CheckboxInput` — single checkbox without a revealable panel.
- `AccordionList` / `AccordionListItem` — accordion list where one panel may open at a time.
