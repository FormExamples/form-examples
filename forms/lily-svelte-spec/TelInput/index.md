# TelInput

A headless telephone-number input that renders a native `<input type="tel">` with `autocomplete="tel"`, `aria-label`, and bindable `value` for use in contact forms, registration flows, and profile editors.

## What it is

`TelInput` is a Svelte 5 component that wraps `<input type="tel">` and exposes a bindable string value. It provides accessible labeling via `aria-label` and enables browser/password-manager autofill through `autocomplete="tel"`. It is the editable half of the `TelInput` ↔ `TelLink` pair.

## What it does

- Renders `<input type="tel">` with base class `tel-input`.
- Uses `aria-label={label}` for the accessible name (no visible `<label>` is rendered).
- Sets `autocomplete="tel"` to enable autofill.
- Binds the `value` prop via `bind:value` for two-way data flow.
- Forwards `required` and `disabled` attributes.
- Spreads additional HTML attributes onto the `<input>` (e.g. `placeholder`, `pattern`, `maxlength`).

## When to use it

- Contact forms that collect a phone number.
- Registration / sign-up flows with a phone verification step.
- Profile editors where the user updates their telephone number.
- Any form that benefits from mobile telephony keyboard hints.

## When not to use it

- Don't use it to display a click-to-call phone number — use `TelLink` instead.
- Don't use it for generic text — use `TextInput`.
- Don't use it for email addresses — use `EmailInput`.
- Don't use it for SMS / OTP one-time codes — use `PinInputDiv`.

## How to use it

Import the component, bind `value`, and pass a translated `label`. Extend with pattern/placeholder via rest-props as needed.

## Props

- `class` — string, optional. Extra CSS class appended to `tel-input`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. The telephone number value.
- `required` — boolean, default `false`. Whether the field is required.
- `disabled` — boolean, default `false`. Whether the field is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<input>` (e.g. `placeholder`, `pattern`, `maxlength`, `id`).

## Usage

```svelte
<script lang="ts">
  import TelInput from "./TelInput.svelte";

  let phone = $state("");
</script>

<TelInput label="Phone number" bind:value={phone} />
```

```svelte
<script lang="ts">
  import TelInput from "./TelInput.svelte";

  let mobile = $state("");
</script>

<TelInput label="Mobile" bind:value={mobile} required />
```

```svelte
<script lang="ts">
  import TelInput from "./TelInput.svelte";

  let phone = $state("+1-555-0100");
</script>

<TelInput
  label="Office phone"
  bind:value={phone}
  placeholder="+1-555-0000"
  pattern="[+0-9 -]+"
  maxlength={20}
/>
```

```svelte
<script lang="ts">
  import TelInput from "./TelInput.svelte";

  let phone = $state("+1-555-0100");
  let readOnly = $state(true);
</script>

<TelInput label="Contact number" bind:value={phone} disabled={readOnly} />
<button type="button" onclick={() => (readOnly = !readOnly)}>
  {readOnly ? "Edit" : "Lock"}
</button>
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered.
- `autocomplete="tel"` helps assistive autofill and password managers.
- `required` and `disabled` states are communicated to assistive technology natively.
- Native `<input type="tel">` gives a numeric-leaning soft keyboard on mobile.

## Related components

- `TelLink` — paired view/link component for click-to-call telephone links.
- `EmailInput` / `EmailLink` — analogous Input/Link pair for email.
- `TextInput` — generic single-line text input.
- `UrlInput` — for URL entry.

---

Lily™ and Lily Design System™ are trademarks.
