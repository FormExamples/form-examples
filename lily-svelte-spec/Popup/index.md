# Popup

A headless conditional overlay dialog that temporarily appears over the main content for information, prompts, or actions. Only mounts in the DOM when `open` is `true`.

## What it is

- Component: `Popup`
- HTML element: `<div role="dialog">` (conditionally rendered)
- Role: `dialog`
- Category: overlay / floating content

## What it does

- Renders a `<div role="dialog">` with `aria-label` only when the bindable `open` is `true`.
- Unmounts completely when closed.
- Supports `bind:open` for two-way binding.
- Spreads additional attributes onto the dialog `<div>`.

## When to use it

- Confirmations, prompts, and short user decisions that don't require a full modal dialog.
- Contextual actions surfaced above other content.
- Inline forms or controls that should overlay the page temporarily.

## When not to use it

- For a small descriptor tied to a trigger by proximity — use `Tooltip` or `Popover`.
- For blocking modal prompts — use `Dialog` or `AlertDialog`.
- For persistent top-of-page messages — use `Banner`, `SuperBanner`, or `Notification`.
- For side-anchored panels — use `Drawer`, `Sheet`, or `SlideOutDrawer`.

## How to use it

The consumer controls the trigger, the open/close logic, Escape handling, and focus management.

```svelte
import Popup from './Popup.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `popup`.
- `label`: string, required. Accessible name for the dialog via `aria-label`.
- `open`: boolean, default `false`. Bindable with `bind:open`.
- `children`: Snippet, required. Popup content.
- `...restProps`: spread onto the `<div>`.

## Usage

### Confirmation popup

```svelte
<script lang="ts">
  import Popup from './Popup.svelte';

  let open = $state(false);
</script>

<button type="button" onclick={() => (open = true)}>Delete</button>
<Popup label="Confirm deletion" bind:open>
  <p>Are you sure you want to proceed?</p>
  <button type="button" onclick={() => (open = false)}>Yes</button>
  <button type="button" onclick={() => (open = false)}>No</button>
</Popup>
```

### Toggle trigger

```svelte
<script lang="ts">
  import Popup from './Popup.svelte';

  let open = $state(false);
</script>

<button type="button" onclick={() => (open = !open)}>Toggle popup</button>
<Popup label="Info" bind:open>
  <p>Popup content.</p>
</Popup>
```

### Escape to close

```svelte
<script lang="ts">
  import Popup from './Popup.svelte';

  let open = $state(true);
  function onKey(e: KeyboardEvent) { if (e.key === "Escape") open = false; }
</script>

<svelte:window onkeydown={onKey} />

<Popup label="Welcome" bind:open>
  <p>Press Escape to close.</p>
</Popup>
```

### With inline form

```svelte
<script lang="ts">
  import Popup from './Popup.svelte';

  let open = $state(false);
  let tag = $state("");
</script>

<button type="button" onclick={() => (open = true)}>Add tag</button>
<Popup label="New tag" bind:open>
  <form onsubmit={(e) => { e.preventDefault(); open = false; }}>
    <label>Name <input type="text" bind:value={tag} /></label>
    <button type="submit">Add</button>
    <button type="button" onclick={() => (open = false)}>Cancel</button>
  </form>
</Popup>
```

### With positioning hook

```svelte
<Popup label="Menu" bind:open data-anchor="top-center" />
```

## Accessibility

- `role="dialog"` + `aria-label` expose the popup as a named dialog region.
- Consumer must implement Escape-to-close, focus trap, and focus restoration as appropriate.
- Consider moving focus to the popup on open and restoring it to the trigger on close.

## Related components

- `Popover` — near-identical floating dialog variant.
- `Dialog`, `AlertDialog`, `FileDialog` — fully modal alternatives.
- `Tooltip`, `HoverCard` — simpler hover/focus overlays.
- `Drawer`, `Sheet`, `SlideOutDrawer`, `FloatingPanel` — other overlay patterns.
