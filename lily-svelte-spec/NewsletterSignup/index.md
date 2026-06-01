# NewsletterSignup

An email subscription form composition with idle, submitting, success, and error states. This headless Svelte component renders a `<form>` with an email input, submit button, and conditionally-hidden status/alert paragraphs for success and error messages.

## What it is

A headless Svelte 5 component that renders a `<form>` with an email field, submit button, and visually offset status messages. Category: forms / data collection.

## What it does

- Renders a `<form>` with the base class `newsletter-signup` plus consumer `class`.
- **Requires** `label`, `emailLabel`, and `submitLabel`.
- Sets `aria-label` from `label` and `data-state` from `state`.
- Disables the input and submit button when `state === "submitting"`.
- Renders a success `<p role="status" aria-live="polite">` that is hidden unless `state === "success"`.
- Renders an error `<p role="alert">` that is hidden unless `state === "error"`.
- Forwards `onsubmit`.

## When to use it

- Email subscription / newsletter signup blocks on landing pages.
- Lightweight email collection with success/error feedback.

## When not to use it

- For multi-field forms, use `Form` and individual fields.

## Props

- `class` — string, default `""`. CSS class appended to `newsletter-signup`.
- `label` — string, **required**. `aria-label` for the form.
- `heading` — string, optional.
- `description` — string, optional.
- `emailLabel` — string, **required**. Visible label for the email input.
- `emailPlaceholder` — string, optional.
- `submitLabel` — string, **required**. Submit button text.
- `state` — `"idle" | "submitting" | "success" | "error"`, default `"idle"`.
- `successMessage` — string, optional.
- `errorMessage` — string, optional.
- `onsubmit` — `(event: SubmitEvent) => void`, optional.
- `...restProps` — additional HTML attributes spread onto the `<form>`.

## Usage

```svelte
<script lang="ts">
  import NewsletterSignup from './NewsletterSignup.svelte';

  let state = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
</script>

<NewsletterSignup
  label="Subscribe to newsletter"
  heading="Stay informed"
  description="Monthly product updates."
  emailLabel="Email address"
  emailPlaceholder="you@example.com"
  submitLabel="Subscribe"
  successMessage="Thanks for subscribing!"
  errorMessage="Something went wrong. Please try again."
  {state}
  onsubmit={(e) => { e.preventDefault(); state = 'submitting'; /* … */ }}
/>
```

## Accessibility

- The `<form>` exposes `aria-label`.
- Success message uses `role="status"` and `aria-live="polite"`.
- Error message uses `role="alert"`.
- Both status messages remain in the DOM and toggle the native `hidden` attribute.

## References

- WAI-ARIA `role="status"`: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA `role="alert"`: https://www.w3.org/TR/wai-aria-1.2/#alert
- Mozilla Protocol Design System: https://protocol.mozilla.org
