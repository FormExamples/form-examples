# Popover

A headless conditional dialog overlay that displays contextual information or actions near its trigger element. Only mounts in the DOM when `open` is `true`.

## What it is

- Component: `Popover`
- HTML element: `<div role="dialog">` (conditionally rendered)
- Role: `dialog`
- Category: overlay / floating content

## What it does

- Renders a `<div role="dialog">` with `aria-label` only when the bindable `open` is `true`.
- Does nothing when closed — no hidden DOM, no animation hooks.
- Supports `bind:open` for two-way toggling from the trigger.
- Spreads additional attributes onto the dialog `<div>`.

## When to use it

- Contextual panels anchored to a trigger button, such as inline help, quick actions, or preview cards.
- Rich interactive content (forms, buttons) that should appear on demand — richer than a tooltip.

## When not to use it

- For a simple hover/focus descriptor with no interactive content — use `Tooltip`.
- For a hover card tied to a link or avatar — use `HoverCard`.
- For a modal confirmation that blocks the rest of the UI — use `Dialog` or `AlertDialog`.
- For a top-of-page announcement — use `Banner` or `Notification`.
- For a side-slide panel — use `Drawer` or `Sheet`.

## How to use it

The consumer is responsible for the trigger, the open/close logic, Escape handling, and focus management. The component only toggles visibility and applies ARIA.

```svelte
import Popover from './Popover.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `popover`.
- `label`: string, required. Accessible name for the dialog via `aria-label`.
- `open`: boolean, default `false`. Bindable with `bind:open`.
- `children`: Snippet, required. Popover content.
- `...restProps`: spread onto the `<div>`.

## Usage

### Toggle from a button

```svelte
<script lang="ts">
  import Popover from './Popover.svelte';

  let open = $state(false);
</script>

<button type="button" onclick={() => (open = !open)}>Toggle info</button>
<Popover label="Additional information" bind:open>
  <p>Here is some contextual information.</p>
  <button type="button" onclick={() => (open = false)}>Close</button>
</Popover>
```

### Open on hover, close on Escape

```svelte
<script lang="ts">
  import Popover from './Popover.svelte';

  let open = $state(false);
  function onKey(e: KeyboardEvent) { if (e.key === "Escape") open = false; }
</script>

<svelte:window onkeydown={onKey} />

<button
  type="button"
  onmouseenter={() => (open = true)}
  onmouseleave={() => (open = false)}
>
  Details
</button>
<Popover label="Details" bind:open>
  <p>Quick preview content.</p>
</Popover>
```

### With a form inside

```svelte
<script lang="ts">
  import Popover from './Popover.svelte';

  let open = $state(false);
  let email = $state("");
</script>

<button type="button" onclick={() => (open = true)}>Invite</button>
<Popover label="Send invitation" bind:open>
  <form onsubmit={(e) => { e.preventDefault(); open = false; }}>
    <label>Email <input type="email" bind:value={email} /></label>
    <button type="submit">Send</button>
    <button type="button" onclick={() => (open = false)}>Cancel</button>
  </form>
</Popover>
```

### Controlled open state

```svelte
<script lang="ts">
  import Popover from './Popover.svelte';

  let open = $state(true);
</script>

<Popover label="Welcome" {open}>
  <p>Welcome aboard!</p>
</Popover>
```

### Extra attributes for positioning hooks

```svelte
<Popover label="Menu" bind:open data-anchor="top-right" />
```

## Accessibility

- `role="dialog"` + `aria-label` expose the popover as a named dialog region.
- Consumer must implement Escape-to-close behavior and, where appropriate, focus trapping and restore-on-close — the component intentionally does not impose these.
- Consider moving focus into the popover on open and back to the trigger on close.

## Related components

- `Popup` — near-identical general-purpose overlay dialog.
- `Tooltip` — hover/focus descriptor for simple non-interactive text.
- `HoverCard` — rich hover-triggered card.
- `Dialog`, `AlertDialog`, `FileDialog` — modal alternatives.
- `Drawer`, `Sheet`, `SlideOutDrawer` — edge-anchored panels.
- `FloatingPanel` — free-floating panel variant.
