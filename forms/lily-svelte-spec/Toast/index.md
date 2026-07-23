# Toast

A headless notification toast rendered as a `<div>` with ARIA live-region semantics (`role="status"` / `aria-live="polite"` by default, or `role="alert"` / `aria-live="assertive"` when `urgent`).

## What it is

`Toast` is a headless Svelte 5 component that wraps its children in a `<div>` with live-region attributes suitable for brief, transient messages. It does not manage timing, dismissal, or stacking — consumers own that behavior.

## What it does

- Renders `<div class="toast {className}" role={urgent ? "alert" : "status"} aria-live={urgent ? "assertive" : "polite"} aria-label={label}>`.
- Renders the `children` snippet inside.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Success confirmations ("Saved successfully").
- Informational updates ("3 new messages").
- Non-blocking error messages with `urgent`.
- Feedback after user-initiated actions.

## When not to use it

- Don't use it for modal messages requiring acknowledgment — use `AlertDialog`.
- Don't use it for persistent page banners — use `Banner` or `SuperBanner`.
- Don't use it for inline form errors — use `ErrorMessage` or `ErrorSummary`.
- Don't use it when the message must trap focus — use `Dialog`.

## How to use it

Import, optionally pass `label`, and set `urgent` for assertive announcements. Consumers control when to mount and unmount the toast.

## Props

- `class` — string, optional. Extra CSS class appended to `toast`.
- `label` — string, optional. Accessible label via `aria-label`.
- `urgent` — boolean, default `false`. When true, uses `role="alert"` and `aria-live="assertive"`.
- `children` — Snippet, required. Toast message content.
- `...restProps` — any additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
  import Toast from "./Toast.svelte";
</script>

<Toast label="Success">Your changes have been saved.</Toast>
```

```svelte
<script lang="ts">
  import Toast from "./Toast.svelte";
</script>

<Toast label="Error" urgent>Something went wrong.</Toast>
```

```svelte
<script lang="ts">
  import Toast from "./Toast.svelte";

  let visible = $state(false);

  function notify() {
    visible = true;
    setTimeout(() => (visible = false), 3000);
  }
</script>

<button type="button" onclick={notify}>Save</button>

{#if visible}
  <Toast label="Info">Saved 3 items.</Toast>
{/if}
```

```svelte
<script lang="ts">
  import Toast from "./Toast.svelte";

  const messages = $state<Array<{ id: number; text: string; urgent: boolean }>>([]);
  let nextId = 1;

  function add(text: string, urgent = false) {
    const id = nextId++;
    messages.push({ id, text, urgent });
    setTimeout(() => {
      const i = messages.findIndex((m) => m.id === id);
      if (i >= 0) messages.splice(i, 1);
    }, 4000);
  }
</script>

<button type="button" onclick={() => add("Saved", false)}>Save</button>
<button type="button" onclick={() => add("Failed", true)}>Fail</button>

{#each messages as m (m.id)}
  <Toast label={m.urgent ? "Error" : "Info"} urgent={m.urgent}>{m.text}</Toast>
{/each}
```

## Accessibility

- Default `role="status"` + `aria-live="polite"` announces at the next graceful opportunity.
- `urgent` flips both `role` and `aria-live` together, giving `alert`/`assertive` for time-sensitive messages.
- `aria-label` optionally supplies a descriptive name for the live region.
- Because screen readers announce on mount, avoid repeatedly re-rendering the same toast without a new id.

## Related components

- `Sonner` — toast notification manager.
- `Notification` — brief event/update message component.
- `Banner` / `SuperBanner` — persistent top-of-page messages.
- `AlertDialog` — modal urgent dialog requiring acknowledgment.

---

Lily™ and Lily Design System™ are trademarks.
