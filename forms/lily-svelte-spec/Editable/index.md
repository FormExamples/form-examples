# Editable

An inline-editable text control: a `<div class="editable">` holding a native `<button>` in display mode and an `<input type="text">` in edit mode. Press Enter to confirm, Escape to cancel.

## What it is

`Editable` is a headless inline-edit primitive. In display mode it shows the current value inside a native `<button type="button" class="editable-button">`. Activating it (a click, or the button's own Enter and Space) swaps the button for an `<input>` that edits an internal draft value. Enter commits the draft back to `value`; Escape reverts the draft and returns to display mode.

## What it does

- Renders a `<div class="editable">` holding either a `<button class="editable-button">` (display) or an `<input class="editable-input">` (edit); focus follows the swap.
- Uses an internal draft `$state` so cancelling reverts without losing the original.
- Binds both `value` (committed value) and `editing` (mode flag) via `$bindable()`.
- Handles Enter (commit), Space (start editing), and Escape (cancel).
- Respects `disabled` by disabling the button.

## When to use it

- Inline editable profile fields, titles, captions, list item names.
- Settings entries that allow quick edits without navigating away.
- Any place where click-to-edit is a better UX than a separate form.

## When not to use it

- When the edit must go through a form with validation and a Save button. Use `EditableForm` or a plain `Form`.
- For multi-line text. Wrap a `TextAreaInput` inside an `EditableForm` instead.
- For selection values. Use `Select`, `Combobox`, or `RadioGroup`.

## How to use it

Bind `value` and provide an accessible `label`.

```svelte
<script lang="ts">
  import Editable from "./Editable.svelte";
  let name = $state("Alice");
</script>

<Editable
  label="Name"
  bind:value={name}
/>
```

## Props

| Prop       | Type      | Default  | Description                                 |
| ---------- | --------- | -------- | ------------------------------------------- |
| `class`    | `string`  | `""`     | CSS class appended to the base class.       |
| `value`    | `string`  | `""`     | Current committed value. Bindable.          |
| `label`    | `string`  | required | Accessible name via `aria-label`.           |
| `editing`  | `boolean` | `false`  | Whether in edit mode. Bindable.             |
| `disabled` | `boolean` | `false`  | Whether editing is disabled.                |
| `...rest`  | `unknown` | —        | Additional HTML attributes on the root div. |

## Usage

### 1. Basic inline edit

```svelte
<script lang="ts">
  import Editable from "./Editable.svelte";
  let title = $state("Untitled");
</script>

<Editable
  label="Title"
  bind:value={title}
/>
```

### 2. External editing control

```svelte
<script lang="ts">
  import Editable from "./Editable.svelte";
  let value = $state("Alice");
  let editing = $state(false);
</script>

<Editable
  label="Name"
  bind:value
  bind:editing
/>
<button
  type="button"
  onclick={() => (editing = true)}>Edit</button
>
```

### 3. Disabled

```svelte
<Editable
  label="Read-only name"
  value="System"
  disabled
/>
```

### 4. Multiple editables in a list

```svelte
{#each items as item}
  <Editable
    label={`Name for ${item.id}`}
    bind:value={item.name}
  />
{/each}
```

### 5. React to commits

```svelte
<script lang="ts">
  import Editable from "./Editable.svelte";
  let value = $state("Alice");
  $effect(() => {
    saveToServer(value);
  });
</script>

<Editable
  label="Name"
  bind:value
/>
```

## Accessibility

- Display mode: a native `<button>` with `aria-label`; disabled when `disabled` is true.
- Edit mode: native `<input>` with `aria-label`.
- Keyboard: Enter commits (both modes), Space starts edit, Escape cancels.

## Related components

- `EditableForm` — form-wrapped inline editing with Save/Cancel semantics.
- `TextInput`, `TextAreaInput` — plain text inputs for explicit forms.
- `Field` — label + input + error pattern.

---

Lily™ and Lily Design System™ are trademarks.
