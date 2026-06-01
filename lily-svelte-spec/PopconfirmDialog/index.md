# PopconfirmDialog

A popover dialog with confirm and cancel buttons. This headless Svelte component renders an `alertdialog` with required title and button labels and generates stable ids for aria-labelledby / aria-describedby.

## What it is

A headless Svelte 5 component inspired by [Ant Design Popconfirm](https://ant.design/components/popconfirm). Distinct from a fully modal `AlertDialog`, this is intended for an inline confirmation popover. Category: dialogs.

## What it does

- Renders a `<div class="popconfirm-dialog" role="alertdialog" aria-modal="false">`.
- Applies `aria-labelledby` to the title and (when present) `aria-describedby` to the description.
- Toggles the `hidden` attribute by `open`.
- Renders cancel and confirm buttons with `type="button"` and consumer-supplied labels.
- Generates stable ids using `crypto.randomUUID()` (fallback to a random string).

## When to use it

- Confirming a small, low-friction action (delete, reset, send) from a button or icon.
- Inline confirmations that should not block the rest of the UI.

## When not to use it

- For high-stakes or modal confirmations, use `AlertDialog` or `Dialog`.
- For destructive flows that need a full form, use `Form` inside `Dialog`.

## Props

- `class` — string, default `""`. CSS class appended to `popconfirm-dialog`.
- `open` — boolean, default `false`. Whether the dialog is open.
- `title` — string, **required**. Dialog heading text.
- `description` — string, optional. Body text.
- `confirmLabel` — string, **required**. Confirm button text.
- `cancelLabel` — string, **required**. Cancel button text.
- `onconfirm` — `(event: MouseEvent) => void`, optional.
- `oncancel` — `(event: MouseEvent) => void`, optional.
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import PopconfirmDialog from './PopconfirmDialog.svelte';

  let open = $state(false);

  function confirm() { /* … */ open = false; }
  function cancel() { open = false; }
</script>

<PopconfirmDialog
  open={open}
  title="Delete this item?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onconfirm={confirm}
  oncancel={cancel}
/>
```

## Accessibility

- `role="alertdialog"`, `aria-modal="false"`, `aria-labelledby` always set, `aria-describedby` set when a description is provided.
- Consumers should manage focus into the dialog when it opens and back to the trigger when it closes.

## Related components

- `AlertDialog` — fully modal urgent message dialog.
- `Dialog` — generic modal/non-modal dialog.
- `Popover` — generic anchored content panel.

## References

- Ant Design Popconfirm: https://ant.design/components/popconfirm
- WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
