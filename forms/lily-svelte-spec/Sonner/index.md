# Sonner

A headless toast notification region. Renders a named landmark with a polite live region so screen readers announce new toasts without interrupting current output.

## What it is

A Svelte 5 headless component that renders `<div class="sonner ...">` with `role="region"`, `aria-label`, and `aria-live="polite"`. The `children` snippet is where the consumer renders individual toast messages (typically with `role="status"` or `role="alert"`).

## What it does

- Declares the notification area as a named region.
- Sets `aria-live="polite"` so new content is announced after current speech.
- Renders `children` verbatim.
- Spreads `...restProps` onto the `<div>`.

Toast lifecycle (appearance, stacking, auto-dismiss, manual close) is entirely the consumer's responsibility.

## When to use it

- Global toast/notification anchor in a site or app shell.
- Confirmation messages ("Saved", "Deleted", "Link copied").
- Non-blocking system updates (connection restored, sync complete).

## When not to use it

- Urgent, must-acknowledge messages - use `AlertDialog`.
- Inline validation errors on forms - use `ErrorMessage`/`ErrorSummary`.
- Static status areas - use `Alert`.

## How to use it

1. Place a single `Sonner` somewhere near the root of the app shell.
2. Push toast elements into its `children` as they appear.
3. Remove them after their auto-dismiss timeout or on user dismissal.

## Props

- `class` (string, optional, default `""`) - merged with the base `sonner` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - toast notification content.
- `...restProps` - spread onto the `<div>`.

## Usage

Single toast:

```svelte
<script lang="ts">
    import Sonner from "./Sonner.svelte";
</script>

<Sonner label="Notifications">
    <div role="status">File saved successfully.</div>
</Sonner>
```

Stacked toasts driven by state:

```svelte
<script lang="ts">
    import Sonner from "./Sonner.svelte";
    let toasts = $state<{ id: number; message: string }[]>([]);
    let nextId = 0;
    function pushToast(message: string) {
        const id = ++nextId;
        toasts = [...toasts, { id, message }];
        setTimeout(() => (toasts = toasts.filter((t) => t.id !== id)), 3000);
    }
</script>

<button onclick={() => pushToast("Saved")}>Save</button>
<Sonner label="Alerts">
    {#each toasts as t (t.id)}
        <div role="status">{t.message}</div>
    {/each}
</Sonner>
```

With an assertive toast for errors:

```svelte
<script lang="ts">
    import Sonner from "./Sonner.svelte";
</script>

<Sonner label="Errors">
    <div role="alert">Could not connect to server.</div>
</Sonner>
```

Custom positioning via class:

```svelte
<script lang="ts">
    import Sonner from "./Sonner.svelte";
</script>

<Sonner label="Notifications" class="fixed-bottom-right">
    <div role="status">Link copied.</div>
</Sonner>
```

At app-shell root:

```svelte
<script lang="ts">
    import Sonner from "./Sonner.svelte";
    let toasts = $state([] as string[]);
</script>

<main>...</main>
<Sonner label="App notifications">
    {#each toasts as msg}<div role="status">{msg}</div>{/each}
</Sonner>
```

## Accessibility

- `role="region"` + `aria-label` creates a named landmark.
- `aria-live="polite"` keeps announcements non-interrupting.
- Individual toasts should use `role="status"` (non-urgent) or `role="alert"` (urgent) as appropriate.
- The `Sonner` region itself does not implement dismissal - consumers must add keyboard-reachable close buttons for persistent toasts.

References:
- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
- WAI-ARIA `region` role: https://www.w3.org/TR/wai-aria-1.2/#region

## Related components

- `Toast` - individual toast message.
- `Notification` - general-purpose notification element.
- `Alert` - static status message.
- `AlertDialog` - blocking urgent message.

---

Lily™ and Lily Design System™ are trademarks.
