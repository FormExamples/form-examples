# SwitchButton

A headless two-state toggle button rendered as `<button role="switch">` with `aria-checked`.

## What it is

A Svelte 5 headless component that renders `<button class="switch-button ..." type="button" role="switch">`. It binds `checked` two-way and toggles on click, plus handles Space explicitly (with `preventDefault`) so the page does not scroll.

## What it does

- Renders a self-closing `<button>` (no children are rendered by the component).
- Applies `role="switch"`, `aria-checked={checked}`, `aria-label={label}`, and `type="button"`.
- Toggles `checked` on click (when not disabled).
- Handles Space in a custom `onkeydown` to toggle `checked` (with `preventDefault`), preventing default scroll.
- Forwards `disabled`.
- Spreads `...restProps` onto the `<button>`.

Because the component itself renders no children, it is a visually empty button - consumers must style it entirely via CSS (for example, `::before`/`::after` pseudo-elements).

## When to use it

- Settings that toggle a single option on/off (notifications, dark mode).
- Feature flags and preference toggles.
- Any on/off control that does not submit a form.

## When not to use it

- Form submission - use `SubmitInput` or `Button`.
- Pressed/unpressed generic buttons - use `ToggleButton`.
- Selecting one of several options - use `SegmentGroup` or `RadioGroup`.
- Multi-select lists - use `CheckboxGroup`.

## How to use it

1. Import the component.
2. Provide a translated `label`.
3. Bind `checked`.
4. Add CSS for the track and thumb.

## Props

- `class` (string, optional, default `""`) - merged with the base `switch-button` class.
- `label` (string, required) - accessible name via `aria-label`.
- `checked` (boolean, optional, default `false`, bindable).
- `disabled` (boolean, optional, default `false`).
- `...restProps` - spread onto the `<button>`.

## Usage

Basic on/off toggle:

```svelte
<script lang="ts">
    import SwitchButton from "./SwitchButton.svelte";
    let enabled = $state(false);
</script>

<SwitchButton label="Enable notifications" bind:checked={enabled} />
<p>Notifications are {enabled ? "on" : "off"}</p>
```

Dark mode toggle:

```svelte
<script lang="ts">
    import SwitchButton from "./SwitchButton.svelte";
    let dark = $state(false);
</script>

<SwitchButton label="Dark mode" bind:checked={dark} />
```

Disabled switch:

```svelte
<script lang="ts">
    import SwitchButton from "./SwitchButton.svelte";
    let locked = $state(true);
    let x = $state(false);
</script>

<SwitchButton label="Locked feature" bind:checked={x} disabled={locked} />
```

With onchange-like side effect via `$effect`:

```svelte
<script lang="ts">
    import SwitchButton from "./SwitchButton.svelte";
    let sync = $state(false);
    $effect(() => {
        console.log("sync changed:", sync);
    });
</script>

<SwitchButton label="Auto sync" bind:checked={sync} />
```

In a settings form:

```svelte
<script lang="ts">
    import SwitchButton from "./SwitchButton.svelte";
    let prefs = $state({ email: true, sms: false });
</script>

<ul>
    <li><SwitchButton label="Email alerts" bind:checked={prefs.email} /> Email alerts</li>
    <li><SwitchButton label="SMS alerts" bind:checked={prefs.sms} /> SMS alerts</li>
</ul>
```

## Accessibility

- `role="switch"` with `aria-checked` is the correct pattern for binary toggles.
- `aria-label` provides the accessible name.
- Space and Enter activate (Space handled explicitly with `preventDefault`).
- Native `<button disabled>` behavior blocks interaction when disabled.

References:
- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WAI-ARIA `switch` role: https://www.w3.org/TR/wai-aria-1.2/#switch

## Related components

- `ToggleButton` - pressed/unpressed state (uses `aria-pressed`).
- `CheckboxInput` - form-bound boolean input.
- `SegmentGroup` - mutually exclusive options.

---

Lily™ and Lily Design System™ are trademarks.
