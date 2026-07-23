# WarningCallout

A headless callout box highlighting a warning message. It renders an `<aside>` element with `role="alert"` so screen readers announce the content immediately. The component is unstyled; consumers provide all visual treatment.

## What it is

An unstyled, semantic warning container. It wraps arbitrary children in an `<aside>` and applies `role="alert"` (which implicitly sets `aria-live="assertive"`), meaning the content is announced by assistive tech as soon as it appears or changes.

## What it does

- Renders `<aside role="alert">` with an optional `aria-label`.
- Renders any children passed via the `children` snippet slot.
- Spreads any additional HTML attributes onto the `<aside>`.

## When to use it

- Showing an alert about a potential issue that is not a full-page blocker (e.g., "Unsaved changes will be lost").
- Surfacing soft validation warnings that do not prevent form submission.
- Highlighting caution inside a form or card layout.

## When not to use it

- For page-level persistent advisories — use `Banner` or `MedicalBanner`.
- For dismissible, transient notifications — use `Toast` or `Sonner`.
- For error summaries — use `ErrorSummary`.
- For informational, non-urgent content — use `InformationCallout`.
- For must-acknowledge blocking messages — use `AlertDialog`.

## How to use it

Import the component, pass content through the default `children` snippet, and optionally set `label` to distinguish multiple warnings on a page. Because `role="alert"` is assertive, avoid rendering this component on every page load if the content is static; doing so causes repeated announcements.

## Props

| Prop        | Type       | Default     | Description                                                           |
| ----------- | ---------- | ----------- | --------------------------------------------------------------------- |
| `class`     | `string`   | `""`        | Additional CSS class appended to the base class name.                 |
| `label`     | `string`   | `undefined` | Optional `aria-label` to distinguish multiple alerts.                 |
| `children`  | `Snippet`  | —           | Required. Warning content.                                            |
| `...rest`   | —          | —           | Spread onto the `<aside>`.                                            |

## Usage

```svelte
<script lang="ts">
    import WarningCallout from "./WarningCallout.svelte";
</script>

<WarningCallout label="Session warning">
    <p>Your session is about to expire.</p>
</WarningCallout>
```

```svelte
<script lang="ts">
    import WarningCallout from "./WarningCallout.svelte";
</script>

<WarningCallout>
    <p>Unsaved changes will be lost when you navigate away.</p>
</WarningCallout>
```

```svelte
<script lang="ts">
    import WarningCallout from "./WarningCallout.svelte";

    let show = $state(false);
</script>

<button type="button" onclick={() => (show = !show)}>Toggle warning</button>

{#if show}
    <WarningCallout label="Validation warning">
        <p>Some fields contain unusual values. Please review before submitting.</p>
    </WarningCallout>
{/if}
```

```svelte
<script lang="ts">
    import WarningCallout from "./WarningCallout.svelte";
</script>

<WarningCallout label="Storage warning" data-testid="storage-warning">
    <h2>Storage almost full</h2>
    <p>You have used 95% of your available storage. Delete files to free up space.</p>
</WarningCallout>
```

```svelte
<script lang="ts">
    import WarningCallout from "./WarningCallout.svelte";
</script>

<WarningCallout class="warning-callout--inline" label="Rate limit">
    <p>You are approaching your API rate limit.</p>
</WarningCallout>
```

## Accessibility

- `role="alert"` is implicit `aria-live="assertive"` + `aria-atomic="true"`. Screen readers announce the content immediately when it appears or changes.
- `<aside>` is a complementary landmark semantically appropriate for side-of-flow content.
- Because `role="alert"` is assertive, do not include the component unconditionally on page load for static content — render it conditionally when the warning becomes relevant.
- Consumer CSS should provide a high-contrast visual treatment that does not rely on color alone (add an icon or text prefix).
- Keep content concise; screen readers repeat the entire alert region on change.

## Related components

- `Alert` — general status message, non-assertive variants possible via `aria-live="polite"`.
- `AlertDialog` — modal for urgent messages requiring acknowledgment.
- `InformationCallout` — non-urgent informational callout.
- `ErrorMessage` — single-field inline error.
- `ErrorSummary` — list of errors at the top of a form.
- `Banner` / `MedicalBanner` — page-level banners.
- `Toast` / `Sonner` — transient, dismissible notifications.

---

Lily™ and Lily Design System™ are trademarks.
