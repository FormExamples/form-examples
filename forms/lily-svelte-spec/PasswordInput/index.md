# PasswordInput

A headless password field using the native HTML `<input type="password">` element. The browser obscures the entered text. Supports accessible labeling, bindable value, and autocomplete hints for password managers.

## What it is

- Component: `PasswordInput`
- HTML element: `<input type="password">`
- Role: implicit textbox (obscured)
- Category: form input

## What it does

- Renders a native password input that masks typed characters.
- Exposes `bind:value` for two-way data binding.
- Applies `autocomplete` (default `"current-password"`) so password managers can fill credentials.
- Forwards `required`, `disabled`, and any other attributes onto the `<input>`.

## When to use it

- Sign-in forms where the existing password is entered.
- Account settings where a single password field is required.
- Any form that needs the browser's native password-manager integration.

## When not to use it

- When you need a show/hide visibility toggle — use `PasswordInputOrTextInputDiv`.
- For new-password entry with validation rules — still use `PasswordInput` but pass `autocomplete="new-password"` via the prop.
- For PINs or one-time codes — use `PinInputDiv`.

## How to use it

Import and bind a value. Override `autocomplete` for registration forms.

```svelte
import PasswordInput from './PasswordInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `password-input`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: string, default `""`. Bindable via `bind:value`.
- `autocomplete`: string, default `"current-password"`. Autocomplete hint.
- `required`: boolean, default `false`.
- `disabled`: boolean, default `false`.
- `...restProps`: spread onto the `<input>` (e.g. `minlength`, `maxlength`, `pattern`, `placeholder`).

## Usage

### Sign-in password field

```svelte
<script lang="ts">
  import PasswordInput from './PasswordInput.svelte';

  let password = $state("");
</script>

<PasswordInput label="Password" bind:value={password} required />
```

### New-password field on registration

```svelte
<script lang="ts">
  import PasswordInput from './PasswordInput.svelte';

  let newPassword = $state("");
</script>

<PasswordInput
  label="New password"
  bind:value={newPassword}
  autocomplete="new-password"
  minlength={12}
  required
/>
```

### Disabled field

```svelte
<script lang="ts">
  import PasswordInput from './PasswordInput.svelte';
</script>

<PasswordInput label="Password" value="••••••••" disabled />
```

### Inside a form with submit

```svelte
<script lang="ts">
  import PasswordInput from './PasswordInput.svelte';

  let password = $state("");
  function signIn(e: SubmitEvent) { e.preventDefault(); /* auth */ }
</script>

<form onsubmit={signIn}>
  <PasswordInput label="Password" bind:value={password} required />
  <button type="submit">Sign in</button>
</form>
```

### Localized label

```svelte
<PasswordInput label="Mot de passe" required />
```

## Accessibility

- `aria-label` supplies the accessible name since no visible `<label>` is rendered. Wrap in `Field` or add a visible `<label for>` if you need a sighted label.
- Native `<input type="password">` handles text obscuring and clipboard conventions appropriately.
- `autocomplete` hints help password managers and assistive tools.
- WCAG 2.2 AAA: consumer CSS must provide a visible focus indicator.

## Related components

- `PasswordInputOrTextInputDiv` — password input with a built-in show/hide toggle.
- `PinInputDiv` — segmented input for PINs and OTPs.
- `TextInput` — single-line text input for non-sensitive fields.
- `Field`, `Label`, `Hint`, `ErrorMessage` — wrappers for labels and messaging.
