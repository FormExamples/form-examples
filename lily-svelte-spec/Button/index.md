# Button

A button is a fundamental clickable element for triggering actions such as submitting forms, opening dialogs, toggling state, or navigating menus. This headless Svelte component wraps the native HTML `<button>` element and provides inherent keyboard, focus, and screen-reader support with optional toggle-button semantics via `aria-pressed`.

## What it is

A headless Svelte 5 component that renders a single native `<button>` element. It belongs to the design system's core interaction primitives alongside `ActionLink`, `ToggleButton`, `SwitchButton`, and `Button`-derived inputs like `SubmitInput`, `ResetInput`, and `ButtonInput`. Category: form controls / interactive primitives.

## What it does

- Renders a `<button>` with the base class `button` plus any consumer-supplied `class`.
- Defaults `type` to `"button"` to prevent accidental form submissions when placed inside a `<form>`.
- Supports the toggle-button pattern by rendering `aria-pressed` only when the `pressed` prop is explicitly provided (undefined = not a toggle button).
- Supports an accessible label override via the `label` prop, mapped to `aria-label`.
- Exposes a native disabled state through the `disabled` attribute, which also communicates `aria-disabled` semantics to assistive technology.
- Forwards `onclick` and spreads `...restProps` onto the underlying `<button>` so consumers can add any other HTML/ARIA attributes.
- Renders arbitrary content via the `children` snippet, so consumers can place text, icons, or composite markup inside.

## When to use it

- Triggering an action in the current page or application (save, delete, open menu, copy to clipboard).
- Submitting or resetting a form (`type="submit"` or `type="reset"`).
- Representing a two-state toggle whose value should be announced to screen readers (`pressed`).
- Building higher-level interactive components (menu triggers, dialog triggers, toolbar actions).
- When you need the native keyboard support (Enter, Space) and focusability that a `<button>` provides for free.

## When not to use it

- For navigation that changes the URL or page — use `ActionLink`, `BackLink`, or an `<a>` instead so browser affordances like "open in new tab" work.
- For an on/off setting styled as a switch — use `SwitchButton` for the WAI-ARIA switch pattern.
- For a dedicated toggle with selected/unselected members in a group — use `ToggleButton` inside `ToggleGroup`.
- For a form control that must look like a button but has an input role (submit/reset/button via `<input>`) — use `SubmitInput`, `ResetInput`, or `ButtonInput` as appropriate.
- For a hamburger menu trigger — use `HamburgerMenu`, which encodes the menu-open ARIA contract.
- For a link-to-email or link-to-telephone — use `EmailLink` or `TelLink`.

## How to use it

Import `Button` from `./Button.svelte` and pass children. For toggle buttons, bind `pressed` to a local `$state` boolean and flip it in `onclick`. For form submit, set `type="submit"`. Required prop: `children`.

## Props

- `class` — string, default `""`. CSS class appended to the base `button` class.
- `type` — `"button" | "submit" | "reset"`, default `"button"`. HTML button type.
- `disabled` — boolean, default `false`. Whether the button is disabled.
- `pressed` — boolean | undefined, default `undefined`. Toggle-button state; when provided, `aria-pressed` is rendered.
- `label` — string, optional. Accessible label override mapped to `aria-label`.
- `onclick` — `(event: MouseEvent) => void`, optional. Click handler.
- `children` — `Snippet`, required. The button content.
- `...restProps` — any additional HTML attributes spread onto the `<button>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import Button from './Button.svelte';

  function handleClick() {
    console.log('clicked');
  }
</script>

<Button onclick={handleClick}>Click me</Button>
```

### Submit button in a form

```svelte
<script lang="ts">
  import Button from './Button.svelte';

  let isSubmitting = $state(false);
</script>

<form onsubmit={() => (isSubmitting = true)}>
  <Button type="submit" disabled={isSubmitting}>Submit</Button>
</form>
```

### Toggle button with pressed state

```svelte
<script lang="ts">
  import Button from './Button.svelte';

  let isBold = $state(false);
</script>

<Button pressed={isBold} onclick={() => (isBold = !isBold)}>Bold</Button>
```

### Accessible label override for icon-only button

```svelte
<script lang="ts">
  import Button from './Button.svelte';
  let closeLabel = 'Close dialog';
</script>

<Button label={closeLabel} onclick={() => dialog.close()}>×</Button>
```

### Button as a dialog trigger

```svelte
<script lang="ts">
  import Button from './Button.svelte';
  import Dialog from '../Dialog/Dialog.svelte';

  let open = $state(false);
</script>

<Button aria-haspopup="dialog" aria-expanded={open} onclick={() => (open = true)}>
  Open settings
</Button>

<Dialog {open}>...</Dialog>
```

## Accessibility

- Implicit `button` role from the native `<button>` element.
- `aria-pressed` rendered only when `pressed` is provided (WAI-ARIA toggle button pattern).
- `aria-label` applied via the `label` prop for icon-only or ambiguous button content.
- Native `disabled` attribute prevents click events and communicates the disabled state to assistive tech.
- Keyboard: **Tab** focuses the button; **Enter** and **Space** both activate it — all handled natively.
- Focus indicator is consumer-supplied CSS; the design system contributes no default visible-focus styling.
- Follows WCAG 2.2 AAA guidance for name, role, value and for keyboard operability.

## Related components

- `ActionLink` — navigation styled like an action trigger (renders `<a>`).
- `ToggleButton` — dedicated two-state toggle with pressed styling contract.
- `SwitchButton` — on/off toggle following the WAI-ARIA switch pattern.
- `ButtonInput` / `SubmitInput` / `ResetInput` — `<input>`-based form button variants.
- `ClipboardCopyButton` — button preconfigured for copy-to-clipboard.
- `TimerButton` — button that auto-activates after a countdown.
- `SliderButton` — confirmation slider button.
- `HamburgerMenu` — mobile-menu trigger button.

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- HTML `<button>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
