# Dialog

A modal or non-modal dialog built on the native `<dialog>` element with a bindable `open` state and Escape-to-close handling.

## What it is

`Dialog` conditionally renders a `<dialog>` element with `aria-label`, optional `aria-modal`, and an Escape key listener. When `open` is `false` the element is fully removed from the DOM. The component drives the element's `open` attribute directly rather than calling `.showModal()`.

## What it does

- Renders `<dialog open>` only when `open` is `true`.
- Applies `aria-label` for the accessible name.
- Applies `aria-modal="true"` when `modal` is `true`.
- Closes on Escape by setting `open = false`.
- Allows programmatic focus via `tabindex="-1"`.

## When to use it

- Confirmations, alerts, forms that require focused attention.
- Settings dialogs, details views, multi-step tasks that interrupt the main flow.
- Modal or non-modal secondary surfaces over the main page.

## When not to use it

- For urgent error alerts that cannot be dismissed. Use `AlertDialog` instead.
- For file pickers or file operations. Use `FileDialog` instead.
- For side-sliding panels or drawers. Use `Drawer` or `Sheet`.

## How to use it

Bind `open` to a state variable and toggle it with a trigger.

```svelte
<script lang="ts">
    import Dialog from "./Dialog.svelte";
    let open = $state(false);
</script>

<button type="button" onclick={() => open = true}>Open dialog</button>
<Dialog label="Confirm action" bind:open>
    <p>Are you sure?</p>
    <button type="button" onclick={() => open = false}>Close</button>
</Dialog>
```

## Props

| Prop       | Type       | Default  | Description                                   |
| ---------- | ---------- | -------- | --------------------------------------------- |
| `class`    | `string`   | `""`     | CSS class appended to the base class.        |
| `open`     | `boolean`  | `false`  | Whether the dialog is visible. Bindable.      |
| `label`    | `string`   | required | Accessible name via `aria-label`.             |
| `modal`    | `boolean`  | `true`   | Whether the dialog is modal (`aria-modal`).   |
| `children` | `Snippet`  | required | Dialog body content.                          |
| `...rest`  | `unknown`  | —        | Additional HTML attributes on the `<dialog>`. |

## Usage

### 1. Confirmation dialog

```svelte
<script lang="ts">
    import Dialog from "./Dialog.svelte";
    let open = $state(false);
    function confirm() { /* … */ open = false; }
</script>

<Dialog label="Confirm action" bind:open>
    <p>Are you sure you want to proceed?</p>
    <button type="button" onclick={() => open = false}>Cancel</button>
    <button type="button" onclick={confirm}>Confirm</button>
</Dialog>
```

### 2. Non-modal notice

```svelte
<Dialog label="Notification" bind:open={showNotice} modal={false}>
    <p>Your file has been saved.</p>
</Dialog>
```

### 3. Form inside a dialog

```svelte
<Dialog label="Create account" bind:open>
    <form onsubmit={handleSubmit}>
        <input name="name" required />
        <button type="submit">Create</button>
    </form>
</Dialog>
```

### 4. Multiple dialogs

```svelte
<Dialog label="Step 1" bind:open={step1Open}>…</Dialog>
<Dialog label="Step 2" bind:open={step2Open}>…</Dialog>
```

### 5. Escape to close (built in)

```svelte
<Dialog label="Press Escape to close" bind:open>
    <p>Hit Escape to close this dialog.</p>
</Dialog>
```

## Accessibility

- Implicit `role="dialog"` from `<dialog>`, with `aria-label` and optional `aria-modal="true"`.
- Escape key closes the dialog.
- `tabindex="-1"` allows programmatic focus management. Focus trapping is the consumer's responsibility when needed.

## Related components

- `AlertDialog` — dialog for urgent, must-acknowledge messages.
- `FileDialog` — dialog for file operations.
- `Drawer`, `Sheet` — edge-aligned panels.
- `Popover`, `Popup`, `HoverCard` — lighter-weight floating surfaces.

---

Lily™ and Lily Design System™ are trademarks.
