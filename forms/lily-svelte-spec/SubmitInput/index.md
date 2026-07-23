# SubmitInput

A headless form submit button rendered as `<input type="submit">`.

## What it is

A Svelte 5 headless component that renders a single `<input class="submit-input ..." type="submit">` element.

## What it does

- Renders a native submit input.
- Uses the `value` prop as the visible button text (default `"Submit"`).
- Forwards `disabled`.
- Spreads `...restProps` onto the `<input>` (`name`, `form`, event handlers, etc.).

No ARIA attributes are added because `<input type="submit">` is natively accessible.

## When to use it

- The primary submit button at the end of an HTML form.
- Any place where `<input type="submit">` semantics are preferred over `<button type="submit">`.

## When not to use it

- For non-submit actions - use `Button` or `ButtonInput`.
- When you need rich content inside the button (icons, spans) - use `<button>` or the `Button` component. `<input>` cannot have children.
- For reset-form actions - use `ResetInput`.

## How to use it

1. Import the component.
2. Provide a translated `value` (button text).
3. Place it inside a `<form>` or `Form` component.

## Props

- `class` (string, optional, default `""`) - merged with the base `submit-input` class.
- `value` (string, optional, default `"Submit"`) - visible button text.
- `disabled` (boolean, optional, default `false`).
- `...restProps` - spread onto the `<input>`.

## Usage

Default:

```svelte
<script lang="ts">
    import SubmitInput from "./SubmitInput.svelte";
</script>

<form>
    <SubmitInput />
</form>
```

Custom label:

```svelte
<script lang="ts">
    import SubmitInput from "./SubmitInput.svelte";
</script>

<form>
    <SubmitInput value="Send message" />
</form>
```

Conditionally disabled:

```svelte
<script lang="ts">
    import SubmitInput from "./SubmitInput.svelte";
    let formValid = $state(false);
</script>

<form>
    <SubmitInput value="Save changes" disabled={!formValid} />
</form>
```

With a `name` for multi-submit forms:

```svelte
<script lang="ts">
    import SubmitInput from "./SubmitInput.svelte";
</script>

<form>
    <SubmitInput value="Approve" name="action" />
    <SubmitInput value="Reject" name="action" />
</form>
```

Inside the `Form` component:

```svelte
<script lang="ts">
    import Form from "../Form/Form.svelte";
    import SubmitInput from "./SubmitInput.svelte";
    function onsubmit(e: SubmitEvent) {
        e.preventDefault();
        console.log("submitted");
    }
</script>

<Form label="Contact" {onsubmit}>
    <!-- fields... -->
    <SubmitInput value="Submit" />
</Form>
```

## Accessibility

- Native `<input type="submit">` has implicit button semantics.
- The `value` attribute is the accessible name.
- Keyboard: Enter and Space activate the button.
- No extra ARIA attributes needed.

References:
- MDN `input type="submit"`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit

## Related components

- `Button` - generic `<button>` element.
- `ButtonInput` - `<input type="button">` (no default submission).
- `ResetInput` - `<input type="reset">`.
- `Form` - form wrapper.

---

Lily™ and Lily Design System™ are trademarks.
