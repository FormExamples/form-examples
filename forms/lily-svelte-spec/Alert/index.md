# Alert

A status message for important information or feedback. Renders a `<div>` as an ARIA live region so screen readers announce it automatically, with severity type exposed via `data-type` for consumer styling.

## What it is

A headless Svelte 5 component for info, success, warning, and error messages. Category: feedback / live-region primitive, alongside `Banner`, `Toast`, `Notification`, and `AlertDialog`.

## What it does

- Renders `<div class="alert {className}" role={role} aria-live={ariaLive} aria-atomic="true" data-type={type}>`.
- Default `role="alert"` (assertive) with auto-derived `aria-live="assertive"`; if `role="status"` is passed, derives `aria-live="polite"`.
- `live` prop explicitly overrides `aria-live` if supplied.
- Optionally renders `<p><strong>{heading}</strong></p>` above the body when `heading` is provided — intentionally not a heading element so the consumer controls document outline.
- Spreads additional attributes onto the `<div>`.

## When to use it

- For inline status messaging that must be announced (form errors, save confirmations).
- For critical error callouts that need immediate attention (`type="error"`, `role="alert"`).
- For polite notifications that shouldn't interrupt (`role="status"`).

## When not to use it

- For modal acknowledgment dialogs — use `AlertDialog`.
- For page-level dismissible site messages — use `Banner`.
- For transient auto-dismissing toasts — use `Toast` / `Sonner`.
- For a form error summary across multiple fields — use `ErrorSummary`.
- For a single inline field error — use `ErrorMessage`.

## How to use it

Import `Alert` from `./Alert.svelte`. Pass the severity `type` for styling and choose `role="alert"` for urgent content or `role="status"` for polite.

## Props

- `class` — string, default `""`. CSS class appended to `alert`.
- `type` — `"info" | "success" | "warning" | "error"`, default `"info"`. Severity, exposed as `data-type`.
- `heading` — string, optional. Heading text rendered as `<p><strong>`.
- `role` — `"alert" | "status"`, default `"alert"`.
- `live` — `"assertive" | "polite" | "off"`, optional. Overrides derived `aria-live`.
- `children` — `Snippet`, required. Alert content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Simple info alert

```svelte
<script lang="ts">
  import Alert from './Alert.svelte';
</script>

<Alert>Something happened.</Alert>
```

### Error alert with heading

```svelte
<script lang="ts">
  import Alert from './Alert.svelte';
</script>

<Alert type="error" heading="Error">
  Something went wrong. Please try again.
</Alert>
```

### Polite status message

```svelte
<script lang="ts">
  import Alert from './Alert.svelte';
</script>

<Alert role="status" type="success" heading="Saved">
  Your changes were saved.
</Alert>
```

### Dynamic, reactively shown alert

```svelte
<script lang="ts">
  import Alert from './Alert.svelte';

  let error = $state<string | null>(null);
  function submit() {
    error = 'Unable to connect to the server.';
  }
</script>

<button onclick={submit}>Submit</button>
{#if error}
  <Alert type="error" heading="Connection failed">{error}</Alert>
{/if}
```

### Warning with explicit live override

```svelte
<script lang="ts">
  import Alert from './Alert.svelte';
</script>

<Alert type="warning" role="status" live="assertive" heading="Session expiring">
  You will be logged out in 1 minute.
</Alert>
```

## Accessibility

- `role="alert"` → `aria-live="assertive"`: screen readers interrupt and announce immediately.
- `role="status"` → `aria-live="polite"`: announced when the user is idle.
- `aria-atomic="true"` ensures the whole region is re-read on content change.
- `data-type` is a styling hook, not an ARIA signal.
- Use `heading` instead of `<h1>`–`<h6>` so document outline remains consumer-controlled.

## Related components

- `AlertDialog` — modal variant requiring user acknowledgment.
- `Banner` — dismissible page-level message.
- `Toast` / `Sonner` — transient auto-dismissed notifications.
- `Notification` — brief event or update message.
- `ErrorMessage`, `ErrorSummary` — form error presentation.
- `InformationCallout`, `WarningCallout` — static emphasis callouts.

---

Lily™ and Lily Design System™ are trademarks.
