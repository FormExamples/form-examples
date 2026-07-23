# Expander

A button-triggered disclosure widget with `aria-expanded` and `aria-controls`. Shows and hides a labelled region of content.

## What it is

`Expander` is a richer alternative to the native `<details>` element. It uses a `<button>` trigger with `aria-expanded` and `aria-controls`, and a `<div role="region">` for the expandable content. The component generates a unique ID via `Math.random()` so the button's `aria-controls` and the content's `id` stay in sync.

## What it does

- Renders a wrapper `<div>` with a toggle `<button>` and conditionally rendered content region.
- Applies `aria-expanded` and `aria-controls` on the button.
- Applies `role="region"` and `aria-label` on the content region.
- Removes content from the DOM entirely when collapsed.
- Binds `expanded` via `$bindable()`.

## When to use it

- Expandable settings panels, FAQ items, on-page help.
- Any disclosure where you want a styled button trigger instead of the native `<summary>`.
- Cases where you need to sync the open state with external UI.

## When not to use it

- When native `<details>`/`<summary>` semantics are sufficient. Use `Details`.
- For grouped accordions. Use `AccordionList` / `AccordionListItem`.
- For generic containers without a button trigger. Use `Collapsible`.

## How to use it

Bind `expanded` and pass a label and children.

```svelte
<script lang="ts">
    import Expander from "./Expander.svelte";
    let expanded = $state(false);
</script>

<Expander label="Show details" bind:expanded>
    <p>Details here…</p>
</Expander>
```

## Props

| Prop       | Type       | Default | Description                                  |
| ---------- | ---------- | ------- | -------------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.       |
| `label`    | `string`   | required| Button label and region `aria-label`.        |
| `expanded` | `boolean`  | `false` | Whether the content is expanded. Bindable.   |
| `children` | `Snippet`  | required| Expandable content.                          |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the wrapper.   |

## Usage

### 1. Basic expander

```svelte
<Expander label="Show details" bind:expanded>
    <p>Details here...</p>
</Expander>
```

### 2. Advanced settings

```svelte
<Expander label="Advanced settings" bind:expanded={showAdvanced}>
    <form>…</form>
</Expander>
```

### 3. Open by default

```svelte
<Expander label="Terms" expanded>
    <p>Full terms of service…</p>
</Expander>
```

### 4. Multiple on a page

```svelte
<Expander label="What is included?">…</Expander>
<Expander label="How do I cancel?">…</Expander>
<Expander label="Is there a free trial?">…</Expander>
```

### 5. Controlled from outside

```svelte
<script lang="ts">
    import Expander from "./Expander.svelte";
    let expanded = $state(false);
</script>

<button type="button" onclick={() => expanded = !expanded}>External toggle</button>
<Expander label="Content" bind:expanded>
    <p>Controlled by the button above.</p>
</Expander>
```

## Accessibility

- `aria-expanded` on the button reflects the state.
- `aria-controls` links the button to the content region's generated ID.
- `role="region"` with `aria-label` makes the content a labelled landmark.
- Content is removed from the DOM when collapsed (screen readers will not expose it).

## Related components

- `Details` — native `<details>`/`<summary>` alternative.
- `Collapsible` — generic collapsible container.
- `AccordionList`, `AccordionListItem` — grouped disclosures.
- `HamburgerMenu` — mobile-style expander for navigation.

---

Lily™ and Lily Design System™ are trademarks.
