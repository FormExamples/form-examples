# PasswordInputOrTextInputDiv

A headless password input with an optional show/hide toggle button. The wrapper `<div>` contains an `<input>` whose `type` dynamically switches between `"password"` and `"text"`, plus a toggle button with `aria-pressed` state.

## What it is

- Component: `PasswordInputOrTextInputDiv`
- HTML element: `<div>` containing `<input>` and an optional `<button>`
- Role: wrapper div + native input + toggle button
- Category: form input with visibility toggle

## What it does

- Renders a single input field that swaps between obscured and visible text.
- Renders a toggle `<button>` with `aria-label` and `aria-pressed` reflecting visibility.
- Maintains internal `visible` state; toggle is controlled by the component, not a prop.
- Always applies `autocomplete="current-password"` on the input for password-manager support.
- Supports `bind:value` on the wrapper to two-way bind the password value.
- Allows hiding the toggle via `showToggle={false}`.

## When to use it

- Sign-in and password-entry forms where users benefit from verifying typed characters.
- Mobile or touch contexts where typo rates are high.
- Any time you want the equivalent of `PasswordInput` plus a reveal affordance.

## When not to use it

- When the reveal affordance is prohibited by policy — use `PasswordInput` instead.
- For PINs / OTPs — use `PinInputDiv`.
- For non-password text entry — use `TextInput`.

## How to use it

Import and bind a string `value`. Customize the toggle label for localization.

```svelte
import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `password-input-or-text-input-div`.
- `label`: string, required. Accessible name for the password input (on the `<input>`, via `aria-label`).
- `value`: string, default `""`. Bindable.
- `showToggle`: boolean, default `true`. Whether to render the show/hide button.
- `toggleLabel`: string, default `"Show password"`. Accessible label for the toggle button (also its visible text).
- `required`: boolean, default `false`.
- `disabled`: boolean, default `false`.
- `...restProps`: spread onto the wrapper `<div>`, not the `<input>`.

## Usage

### Default with toggle

```svelte
<script lang="ts">
  import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';

  let password = $state("");
</script>

<PasswordInputOrTextInputDiv label="Password" bind:value={password} />
```

### Without the toggle

```svelte
<script lang="ts">
  import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';

  let password = $state("");
</script>

<PasswordInputOrTextInputDiv label="Password" bind:value={password} showToggle={false} />
```

### Localized toggle label

```svelte
<script lang="ts">
  import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';

  let password = $state("");
</script>

<PasswordInputOrTextInputDiv
  label="Mot de passe"
  bind:value={password}
  toggleLabel="Afficher le mot de passe"
/>
```

### Required and disabled variants

```svelte
<script lang="ts">
  import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';

  let password = $state("");
</script>

<PasswordInputOrTextInputDiv label="Password" bind:value={password} required />
<PasswordInputOrTextInputDiv label="Password" value="••••••••" disabled />
```

### In a sign-in form

```svelte
<script lang="ts">
  import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';

  let password = $state("");
  function signIn(e: SubmitEvent) { e.preventDefault(); /* auth */ }
</script>

<form onsubmit={signIn}>
  <PasswordInputOrTextInputDiv label="Password" bind:value={password} required />
  <button type="submit">Sign in</button>
</form>
```

## Accessibility

- `aria-label` on the `<input>` names the field.
- `aria-label` + `aria-pressed` on the toggle button communicate its purpose and current state.
- Toggling updates `aria-pressed` so screen readers announce the new state.
- WCAG 2.2 AAA: consumer CSS must provide a visible focus indicator for both the input and the toggle button.

## Related components

- `PasswordInput` — plain password field with no toggle.
- `PinInputDiv` — segmented PIN / OTP entry.
- `TextInput` — standard text input.
- `Field`, `Label`, `Hint`, `ErrorMessage` — labeling and messaging wrappers.

---

Lily™ and Lily Design System™ are trademarks.
