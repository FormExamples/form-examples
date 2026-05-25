# Tooltip

A conditionally rendered `<div role="tooltip">` that shows brief contextual text, designed to be linked to a trigger element via `aria-describedby` and controlled by a bindable `visible` flag.

## What it is

`Tooltip` is a headless Svelte 5 component that renders a `<div role="tooltip">` only when its bindable `visible` prop is true. It is not self-anchoring — it does not position itself or manage hover/focus logic; consumers wire visibility and placement externally.

## What it does

- When `visible` is true, renders `<div class="tooltip {className}" role="tooltip" id={id}>{label}</div>`.
- When `visible` is false, renders nothing (the element is fully removed from the DOM).
- Uses `$bindable` for `visible` so consumers can `bind:visible`.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Hover/focus tooltips that augment a control's label with a short description.
- Short explanations for icon-only buttons.
- Any place where the trigger element uses `aria-describedby` pointing at this tooltip's `id`.

## When not to use it

- Don't use it for required instructions — integrate that text into the UI or use `Hint` inside a `Field`.
- Don't use it for rich popover content — use `Popover` or `HoverCard`.
- Don't use it for form-field error messages — use `ErrorMessage`.
- Don't rely on it to appear on touch devices where hover doesn't exist — prefer visible hint text.

## How to use it

Import, bind `visible`, set an `id` and `aria-describedby` on the trigger that matches. Wire trigger's `onmouseenter` / `onmouseleave` / `onfocus` / `onblur` (and `Escape` to dismiss) to flip `visible`.

## Props

- `class` — string, optional. Extra CSS class appended to `tooltip`.
- `label` — string, required. The tooltip text content.
- `visible` — boolean, default `false`, bindable via `bind:visible`. Whether the tooltip is shown.
- `id` — string, optional. Used with `aria-describedby` on the trigger to link the tooltip.
- `...restProps` — any additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  let show = $state(false);
</script>

<button
  type="button"
  aria-describedby="tip"
  onmouseenter={() => (show = true)}
  onmouseleave={() => (show = false)}
  onfocus={() => (show = true)}
  onblur={() => (show = false)}
>
  Save
</button>
<Tooltip id="tip" label="Save your changes" bind:visible={show} />
```

```svelte
<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  let show = $state(false);

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Escape") show = false;
  }
</script>

<svelte:window {onkeydown} />

<button
  type="button"
  aria-describedby="del-tip"
  onmouseenter={() => (show = true)}
  onmouseleave={() => (show = false)}
>
  Delete
</button>
<Tooltip id="del-tip" label="Permanently deletes this item" bind:visible={show} />
```

```svelte
<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  let show = $state(false);
</script>

<span
  tabindex="0"
  aria-describedby="info"
  onfocus={() => (show = true)}
  onblur={() => (show = false)}
>
  ⓘ
</span>
<Tooltip id="info" label="More information" bind:visible={show} />
```

```svelte
<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  let show = $state(false);
</script>

<button
  type="button"
  aria-describedby="upgrade-tip"
  onmouseenter={() => (show = true)}
  onmouseleave={() => (show = false)}
>
  Upgrade
</button>
<Tooltip
  id="upgrade-tip"
  label="Available on the Pro plan"
  bind:visible={show}
  data-placement="top"
/>
```

## Accessibility

- `role="tooltip"` identifies the popup for screen readers.
- The trigger's `aria-describedby` must reference the tooltip's `id` so assistive technology associates them.
- Tooltip itself does not receive focus — focus stays with the trigger.
- Consumers should handle `Escape` to dismiss for keyboard users.
- Avoid placing essential information only in tooltips; surface it visibly when possible.

## Related components

- `Popover` — anchored floating content for richer UI.
- `HoverCard` — card content shown on hover.
- `Hint` — always-visible form-field guidance.
- `FloatingPanel` — floating panel above page content.
