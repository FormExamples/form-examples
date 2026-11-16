# PinInputDiv

A headless PIN input that renders a group of single-character numeric inputs for PINs, verification codes, and one-time passwords (OTPs). Focus auto-advances on digit entry and retreats on Backspace.

## What it is

- Component: `PinInputDiv`
- HTML element: `<div role="group">` containing multiple `<input>` fields
- Role: `group`
- Category: segmented form input

## What it does

- Renders `length` (default 4) single-character `<input>` fields with `inputmode="numeric"` and `maxlength="1"`.
- Accepts only digits 0–9; non-numeric input is rejected.
- Auto-advances focus to the next field on digit entry.
- Backspace clears the current field or moves focus back and clears the previous field.
- Left / Right arrows move focus between fields.
- Maintains an internal `digits` array and exposes a combined string via `bind:value`.
- Names each digit input with the consumer's `digitLabel(position, length)` (for example `"Digit 2 of 4"`); without it each input takes the group `label`.

## When to use it

- Two-factor authentication code entry (SMS, authenticator apps).
- Email verification codes.
- Secure PIN entry for checkout, unlock, or access flows.

## When not to use it

- For a single password field — use `PasswordInput` or `PasswordInputOrTextInputDiv`.
- For a long alphanumeric token — use `TextInput`.
- For a numeric quantity — use `NumberInput`.
- When the expected length is variable at runtime — the `length` prop is captured at initialization.

## How to use it

Import, bind `value`, and pick a `length`.

```svelte
import PinInputDiv from './PinInputDiv.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `pin-input-div`.
- `label`: string, required. Accessible label for the group via `aria-label`.
- `length`: number, default `4`. Number of digit inputs. Captured at initialization; do not change dynamically.
- `value`: string, default `""`. Combined digit string; bindable.
- `disabled`: boolean, default `false`. Disables all inputs.
- `...restProps`: spread onto the group `<div>`.

## Usage

### 4-digit PIN

```svelte
<script lang="ts">
  import PinInputDiv from "./PinInputDiv.svelte";

  let pin = $state("");
</script>

<PinInputDiv
  label="Enter PIN"
  bind:value={pin}
/>
```

### 6-digit verification code

```svelte
<script lang="ts">
  import PinInputDiv from "./PinInputDiv.svelte";

  let code = $state("");
</script>

<PinInputDiv
  label="Verification Code"
  length={6}
  bind:value={code}
/>
```

### Submit when complete

```svelte
<script lang="ts">
  import PinInputDiv from "./PinInputDiv.svelte";

  let code = $state("");
  $effect(() => {
    if (code.length === 6) {
      // call verify endpoint
    }
  });
</script>

<PinInputDiv
  label="One-time code"
  length={6}
  bind:value={code}
/>
```

### Disabled after submission

```svelte
<script lang="ts">
  import PinInputDiv from "./PinInputDiv.svelte";

  let code = $state("123456");
  let submitting = $state(true);
</script>

<PinInputDiv
  label="One-time code"
  length={6}
  bind:value={code}
  disabled={submitting}
/>
```

### Localized group label

```svelte
<PinInputDiv
  label="Código de verificación"
  length={6}
/>
```

## Accessibility

- `role="group"` with `aria-label` identifies the collection as a PIN entry group.
- Each digit input's `aria-label` is `digitLabel(position, length)` when the consumer supplies it, else the group `label`; the component has no English default, so the positional wording is localised by the consumer.
- `inputmode="numeric"` triggers a numeric soft keyboard on mobile devices.
- Keyboard: Backspace, Left / Right arrows, and digit entry behave as users expect.
- WCAG 2.2 AAA: consumer CSS must provide a visible focus indicator on each field.

## Related components

- `PasswordInput`, `PasswordInputOrTextInputDiv` — password fields.
- `NumberInput` — single numeric input.
- `TextInput` — arbitrary text input.

---

Lily™ and Lily Design System™ are trademarks.
