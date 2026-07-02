# AlertDialog

A modal dialog for urgent messages requiring user acknowledgment. Uses the native HTML `<dialog>` element with `role="alertdialog"` and `aria-modal="true"`. Distinguished from the regular `Dialog` by the alertdialog role, which signals to assistive technologies that the content demands attention.

## What it is

A headless Svelte 5 component rendering a `<dialog>` only while `open` is true. Category: overlay / dialog primitive, a sibling of `Dialog`, `FileDialog`, `Sheet`, and `Drawer`.

## What it does

- Conditionally renders `<dialog class="alert-dialog {className}" open role="alertdialog" aria-modal="true">` when `open === true`.
- Always emits `aria-labelledby` pointing to the inner title paragraph; the id is generated per instance via `$props.id()` so multiple dialogs in the same document do not collide.
- Emits `aria-describedby` pointing to the description paragraph only when `description` is provided (also a per-instance id).
- `open` prop is `$bindable(false)` so consumers can close it via `bind:open`.
- Renders the title as `<p><strong>{title}</strong></p>` (not a heading element, to leave outline control to the consumer) and the optional description as a `<p>`. Action buttons come from children.
- Known limitation: the consumer is responsible for focus trapping and Escape-key handling.

## When to use it

- Confirming irreversible destructive actions ("Delete this item?").
- Warning about unsaved changes before leaving.
- Critical error messaging that must block interaction.

## When not to use it

- For non-critical modals — use `Dialog`.
- For auto-dismissing notifications — use `Toast` / `Sonner`.
- For inline status messaging — use `Alert`.
- For file browsing — use `FileDialog`.
- For drawers and sheets — use `Drawer` / `Sheet`.

## How to use it

Import `AlertDialog` from `./AlertDialog.svelte`. Bind `open` to local state. Pass `title` (required) and optional `description`. Supply action buttons as children.

## Props

- `class` — string, default `""`. CSS class appended to `alert-dialog`.
- `open` — boolean, default `false`, bindable.
- `title` — string, required. Heading text, referenced by `aria-labelledby`.
- `description` — string, optional. Message text, referenced by `aria-describedby`.
- `children` — `Snippet`, required. Action buttons / additional content.
- `...restProps` — additional HTML attributes spread onto the `<dialog>`.

## Usage

### Confirm destructive action

```svelte
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';
  import Button from '../Button/Button.svelte';

  let showDialog = $state(false);
  function confirm() {
    showDialog = false;
  }
</script>

<Button onclick={() => (showDialog = true)}>Delete</Button>

<AlertDialog
  bind:open={showDialog}
  title="Confirm Deletion"
  description="This action cannot be undone."
>
  <Button onclick={confirm}>Yes, delete</Button>
  <Button onclick={() => (showDialog = false)}>Cancel</Button>
</AlertDialog>
```

### Simple acknowledgment

```svelte
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';
  import Button from '../Button/Button.svelte';

  let showAlert = $state(true);
</script>

<AlertDialog bind:open={showAlert} title="Session Expired">
  <Button onclick={() => (showAlert = false)}>OK</Button>
</AlertDialog>
```

### With Escape key handling

```svelte
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';
  import Button from '../Button/Button.svelte';

  let open = $state(false);

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window {onkeydown} />

<AlertDialog bind:open title="Unsaved changes" description="Leave without saving?">
  <Button onclick={() => (open = false)}>Stay</Button>
  <Button onclick={() => { open = false; history.back(); }}>Leave</Button>
</AlertDialog>
```

### Driven by external condition

```svelte
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';
  import Button from '../Button/Button.svelte';

  let error = $state<string | null>(null);
  let showErr = $derived(error !== null);
</script>

<AlertDialog open={showErr} title="Network error" description={error ?? ''}>
  <Button onclick={() => (error = null)}>Dismiss</Button>
</AlertDialog>
```

## Accessibility

- `role="alertdialog"` communicates urgency to assistive technologies.
- `aria-modal="true"` signals modal behavior.
- `aria-labelledby` references the title paragraph; `aria-describedby` references the description when present.
- Consumer must implement focus trap inside the dialog and Escape-key close.
- Follows the WAI-ARIA Alert and Message Dialogs Pattern.

## Related components

- `Dialog` — non-critical modal dialog.
- `FileDialog` — file-browsing dialog.
- `Alert` — inline urgent message, not modal.
- `Drawer`, `Sheet` — edge-anchored overlay panels.
