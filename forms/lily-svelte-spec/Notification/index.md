# Notification

A headless notification message container that delivers timely updates to users about events, actions, and state changes. It wraps its content in a live region so screen readers announce the message without interrupting (polite) or immediately (assertive) as needed.

## What it is

- Component: `Notification`
- HTML element: `<div>`
- Role: `status` by default; switches to `alert` when `urgent`
- Category: announcement / live region

## What it does

- Renders a `<div>` wrapping its children.
- Announces content to assistive technology via ARIA live regions.
- Switches both `role` and `aria-live` simultaneously based on the `urgent` flag:
  - `urgent={false}` → `role="status"` + `aria-live="polite"` (waits for idle).
  - `urgent={true}` → `role="alert"` + `aria-live="assertive"` (interrupts).
- Optionally applies a consumer-supplied `aria-label` to the region.
- Spreads any additional attributes onto the wrapper `<div>`.

## When to use it

- Success confirmations after a save, update, or submit.
- Error or failure messages that the user must be aware of (use `urgent`).
- Informational updates such as "3 new messages" or "Copied to clipboard".

## When not to use it

- For purely decorative or static content — plain HTML is fine.
- For modal confirmations that block interaction — use `Dialog` or `AlertDialog`.
- For a prominent top-of-page message bar — use `Banner` or `SuperBanner`.
- For stacked auto-dismissing toasts — use `Toast` / `Sonner`.

## How to use it

Import and wrap your message. The component does not manage its own lifecycle — the consumer controls when it mounts and unmounts.

```svelte
import Notification from './Notification.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `notification`.
- `label`: string, optional. Accessible name for the live region via `aria-label`.
- `urgent`: boolean, default `false`. When `true`, uses `role="alert"` + `aria-live="assertive"`.
- `children`: Snippet, required. The message content.
- `...restProps`: spread onto the `<div>`.

## Usage

### Polite success notification

```svelte
<script lang="ts">
  import Notification from './Notification.svelte';
</script>

<Notification label="Success">Your changes have been saved.</Notification>
```

### Urgent error notification

```svelte
<script lang="ts">
  import Notification from './Notification.svelte';
</script>

<Notification label="Error" urgent>
  Something went wrong. Please try again.
</Notification>
```

### Without an accessible label

```svelte
<script lang="ts">
  import Notification from './Notification.svelte';
</script>

<Notification>3 new messages</Notification>
```

### Conditionally mounted

```svelte
<script lang="ts">
  import Notification from './Notification.svelte';

  let saved = $state(false);
  function save() { saved = true; setTimeout(() => (saved = false), 3000); }
</script>

<button onclick={save}>Save</button>
{#if saved}
  <Notification label="Save confirmation">Saved successfully.</Notification>
{/if}
```

### Rich content inside a notification

```svelte
<script lang="ts">
  import Notification from './Notification.svelte';
</script>

<Notification label="Update available" urgent>
  <strong>Update available:</strong>
  <a href="/changelog">See what's new</a>
</Notification>
```

## Accessibility

- `role="status"` / `aria-live="polite"` announces without interrupting ongoing speech.
- `role="alert"` / `aria-live="assertive"` interrupts; reserve for urgent, user-actionable messages.
- `aria-label` provides a region name; omit if the content itself is already descriptive.
- Live regions announce changes only when the element is in the DOM as text changes; mounting a fresh notification per message is the simplest pattern.

## Related components

- `Toast`, `Sonner` — auto-dismissing notification variants.
- `Banner`, `SuperBanner`, `MedicalBanner` — prominent persistent page-level messages.
- `Alert`, `AlertDialog` — inline status messages and modal urgent dialogs.
- `ErrorSummary` — aggregated form validation errors.

---

Lily™ and Lily Design System™ are trademarks.
