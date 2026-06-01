# EditableForm

A `<form>` wrapper for inline editing. Renders only when `editing` is `true`, submits on Enter, cancels on Escape.

## What it is

`EditableForm` is a headless form wrapper that appears only while `editing` is `true` and exits edit mode automatically on submit or cancel. It calls `event.preventDefault()` on submit so the consumer can handle saves without a page navigation. Escape toggles `editing` back to `false` and invokes `oncancel`.

## What it does

- Conditionally renders a `<form>` only when `editing` is `true`.
- Applies `aria-label` for the accessible name and `tabindex="-1"` for programmatic focus.
- Intercepts submit: prevents default, sets `editing = false`, then calls `onsubmit`.
- Intercepts Escape: sets `editing = false`, then calls `oncancel`.

## When to use it

- Inline edit forms for records that need a proper submit/cancel lifecycle.
- Renaming items, editing profile fields, updating settings in place.
- Any edit flow where you want Enter to save and Escape to cancel.

## When not to use it

- For a single editable string. Use `Editable` instead.
- For page-level forms that persist visibility. Use `Form` directly.
- When you need a full modal surface. Use `Dialog` + `Form`.

## How to use it

Bind `editing` and handle `onsubmit`. Place any inputs and action buttons inside.

```svelte
<script lang="ts">
    import EditableForm from "./EditableForm.svelte";
    let editing = $state(false);
    function save(event: SubmitEvent) { /* … */ }
</script>

<button type="button" onclick={() => editing = true}>Edit</button>
<EditableForm label="Edit profile" bind:editing onsubmit={save}>
    <input name="name" />
    <button type="submit">Save</button>
</EditableForm>
```

## Props

| Prop        | Type                              | Default | Description                                   |
| ----------- | --------------------------------- | ------- | --------------------------------------------- |
| `class`     | `string`                          | `""`    | CSS class appended to the base class.        |
| `label`     | `string`                          | required| Accessible name via `aria-label`.             |
| `editing`   | `boolean`                         | `false` | Whether the form is in edit mode. Bindable.   |
| `onsubmit`  | `(event: SubmitEvent) => void`    | `undefined` | Called after a submit completes.          |
| `oncancel`  | `() => void`                      | `undefined` | Called when Escape cancels editing.       |
| `children`  | `Snippet`                         | required| Form content (inputs, buttons).               |
| `...rest`   | `unknown`                         | —       | Additional HTML attributes on the `<form>`.   |

## Usage

### 1. Basic editable form

```svelte
<EditableForm label="Edit profile" bind:editing onsubmit={save}>
    <input name="name" value={name} />
    <button type="submit">Save</button>
</EditableForm>
```

### 2. With explicit Cancel button and `oncancel`

```svelte
<EditableForm
    label="Rename item"
    bind:editing
    onsubmit={rename}
    oncancel={revert}
>
    <input name="title" value={title} />
    <button type="submit">OK</button>
    <button type="button" onclick={() => editing = false}>Cancel</button>
</EditableForm>
```

### 3. Inline toggle pattern

```svelte
<script lang="ts">
    import EditableForm from "./EditableForm.svelte";
    let editing = $state(false);
    let name = $state("Alice");
</script>

{#if !editing}
    <span>{name}</span>
    <button type="button" onclick={() => editing = true}>Edit</button>
{/if}
<EditableForm label="Edit name" bind:editing onsubmit={e => { name = new FormData(e.target).get("name") as string; }}>
    <input name="name" value={name} />
    <button type="submit">Save</button>
</EditableForm>
```

### 4. Multiple fields

```svelte
<EditableForm label="Address" bind:editing onsubmit={save}>
    <input name="street" />
    <input name="city" />
    <input name="postcode" />
    <button type="submit">Save</button>
</EditableForm>
```

### 5. Escape cancels

```svelte
<EditableForm label="Edit" bind:editing oncancel={() => console.log("cancelled")}>
    <input name="title" />
    <button type="submit">Save</button>
</EditableForm>
<!-- Pressing Escape sets editing=false and calls oncancel. -->
```

## Accessibility

- `<form>` with `aria-label` names the form for assistive technology.
- `tabindex="-1"` allows focusing the form programmatically when entering edit mode.
- Enter submits natively from any child input; Escape cancels.

## Related components

- `Editable` — inline edit of a single string value.
- `Form`, `Field` — standard form composition primitives.
- `Dialog` — for full-screen modal edits.
