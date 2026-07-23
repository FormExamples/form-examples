# MedicalBanner

MedicalBanner is a headless Svelte 5 component for displaying prominent medical information messages at the top of a page. It renders a `<div role="region">` with `aria-live="polite"`, `data-type` for variants, and `data-context="medical"`. It can optionally be dismissed by the user.

## What it is

A landmark region for medical alerts, clinical notifications, and patient-record summaries. It carries `aria-live="polite"` so screen readers announce updates, and an internal `visible` state allows the banner to be dismissed when `dismissible` is `true`.

## What it does

- Renders a `<div>` with `class="medical-banner"` plus any consumer-provided CSS class.
- Applies `role="region"`, `aria-live="polite"`, and `aria-label` from the required `label` prop.
- Applies `data-type` (`"info" | "success" | "warning" | "error"`, default `"info"`) and `data-context="medical"` for consumer CSS targeting.
- Renders the required `children` snippet as banner content.
- When `dismissible` is `true`, renders a `<button type="button">` with `aria-label={closeLabel}` that sets `visible = false` and calls the optional `onclose` callback.
- Spreads `...restProps` onto the `<div>`.
- Hides itself (conditional `{#if visible}`) once dismissed.

## When to use it

- Displaying patient alerts, clinical notifications, and medical record summaries at the top of a page.
- Announcing globally-relevant medical information that must be acknowledged or dismissed.
- Hosting nested `MedicalBannerBox`, `MedicalBannerBoxForAdvice`, and `MedicalBannerBoxForDanger` layout regions.

## When not to use it

- Do not use for non-medical banners — use `Banner` instead.
- Do not use for urgent modal-blocking alerts — use `AlertDialog`.
- Do not use for inline field errors — use `ErrorMessage` or `ErrorSummary`.
- Do not use for transient toast-style notifications — use `Toast` or `Sonner`.

## How to use it

Wrap medical banner content in `MedicalBanner`, nest `MedicalBannerBox` (for layout) and/or `MedicalBannerBoxForAdvice` / `MedicalBannerBoxForDanger` for specific content kinds.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `medical-banner` class.
- `label` (string, required) — accessible name via `aria-label`.
- `type` (`"info" | "success" | "warning" | "error"`, optional, default `"info"`) — applied as `data-type`.
- `dismissible` (boolean, optional, default `false`) — enables the close button.
- `onclose` (`() => void`, optional) — callback fired when the banner is dismissed.
- `closeLabel` (string, optional) — accessible label applied to the close button.
- `children` (Snippet, required) — banner content.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Nested composition with advice and danger sections

```svelte
<script lang="ts">
    import MedicalBanner from "./MedicalBanner.svelte";
    import MedicalBannerBox from "../MedicalBannerBox/MedicalBannerBox.svelte";
    import MedicalBannerBoxForDanger from "../MedicalBannerBoxForDanger/MedicalBannerBoxForDanger.svelte";
    import MedicalBannerBoxForAdvice from "../MedicalBannerBoxForAdvice/MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBanner label="Patient record summary" type="info">
    <MedicalBannerBox>
        <MedicalBannerBoxForDanger label="Allergies">
            <p>Penicillin</p>
        </MedicalBannerBoxForDanger>
        <MedicalBannerBoxForAdvice label="Care contacts">
            <p>GP: Dr. Rivera</p>
        </MedicalBannerBoxForAdvice>
    </MedicalBannerBox>
</MedicalBanner>
```

### Dismissible medical banner with a close handler

```svelte
<script lang="ts">
    import MedicalBanner from "./MedicalBanner.svelte";
    function logDismiss() {
        console.log("banner dismissed");
    }
</script>

<MedicalBanner
    label="Infection control advisory"
    type="warning"
    dismissible
    closeLabel="Dismiss advisory"
    onclose={logDismiss}
>
    <p>Follow hand-hygiene protocol.</p>
</MedicalBanner>
```

### Warning variant

```svelte
<script lang="ts">
    import MedicalBanner from "./MedicalBanner.svelte";
</script>

<MedicalBanner label="Critical lab result" type="warning">
    <p>Potassium outside reference range.</p>
</MedicalBanner>
```

### Error variant with nested layout

```svelte
<script lang="ts">
    import MedicalBanner from "./MedicalBanner.svelte";
    import MedicalBannerBox from "../MedicalBannerBox/MedicalBannerBox.svelte";
</script>

<MedicalBanner label="System unavailable" type="error">
    <MedicalBannerBox>
        <p>EHR is offline. Contact support.</p>
    </MedicalBannerBox>
</MedicalBanner>
```

### Success variant

```svelte
<script lang="ts">
    import MedicalBanner from "./MedicalBanner.svelte";
</script>

<MedicalBanner label="Record saved" type="success">
    <p>Record submitted at 14:35.</p>
</MedicalBanner>
```

## Accessibility

- `role="region"` makes the banner a landmark identifiable by screen readers.
- `aria-live="polite"` announces content changes without interrupting the user.
- `aria-label` provides the banner's accessible name.
- The close button exposes its purpose via `aria-label={closeLabel}`.
- `data-type` and `data-context="medical"` are CSS hooks for consumer styling.
- Keyboard: Tab to focus the close button; Enter/Space to dismiss.
- Compliant with WCAG 2.2 AAA when consumer provides sufficient focus indicators and contrast.

## Related components

- `MedicalBannerBox` — layout container with `data-context="medical"` used inside `MedicalBanner`.
- `MedicalBannerBoxForAdvice` — advice-level region (`data-type="advice"`).
- `MedicalBannerBoxForDanger` — danger-level region (`data-type="danger"`).
- `Banner` / `BannerBox` — non-medical banner equivalents.
- `SuperBanner` — a high-priority application-wide banner.
- `Alert`, `AlertDialog`, `Toast`, `Notification` — other status-message patterns.

---

Lily™ and Lily Design System™ are trademarks.
