# Hint

A hint provides subtle, contextual guidance text associated with a form control. Typically placed near an input to clarify expected formats, explain functionality, or offer examples. Renders a `<p>` element with an optional `id` for linking to a form control via `aria-describedby`.

## What it is

A Svelte 5 component that renders a `<p class="hint ...">` containing the `children` snippet. The `id` prop can be set so a sibling input can reference it via `aria-describedby`.

## What it does

- Renders `<p class="hint ..." id={id}>` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<p>`.

## When to use it

- Small instructional text beside a form field (expected format, example values).
- Inline help text that should be announced by screen readers when the linked input receives focus.

## When not to use it

- For error messages. Use `ErrorMessage`.
- For a summary of multiple form errors. Use `ErrorSummary`.
- For tooltips that appear on hover/focus. Use `Tooltip` or `HoverCard`.
- For large explanatory panels. Use `InformationCallout` or `Panel`.

## How to use it

Place near the form control. Set a unique `id` and reference it from the input's `aria-describedby` attribute. The consumer is responsible for that wiring.

## Props

- `class` (string, optional) - CSS class appended after the base `hint` class.
- `id` (string, optional) - ID used for `aria-describedby` targeting.
- `children` (Snippet, required) - Hint text content.
- `...restProps` - Additional HTML attributes spread onto the `<p>`.

## Usage

```svelte
<script lang="ts">
    import Hint from "./Hint.svelte";
</script>

<Hint id="email-hint">Enter your work email</Hint>
<input type="email" aria-describedby="email-hint" />
```

```svelte
<script lang="ts">
    import Hint from "./Hint.svelte";
</script>

<Hint id="password-hint">Must be at least 8 characters</Hint>
<input type="password" aria-describedby="password-hint" />
```

```svelte
<script lang="ts">
    import Hint from "./Hint.svelte";
    import TextInput from "../TextInput/TextInput.svelte";
    let name = $state("");
</script>

<label for="name">Name</label>
<Hint id="name-hint">As shown on your ID</Hint>
<TextInput
    id="name"
    label="Name"
    bind:value={name}
    aria-describedby="name-hint"
/>
```

```svelte
<script lang="ts">
    import Hint from "./Hint.svelte";
</script>

<Hint class="muted-hint" data-testid="phone-hint" id="phone-hint">
    Include country code, e.g. +1 555 123 4567
</Hint>
```

```svelte
<script lang="ts">
    import Hint from "./Hint.svelte";
</script>

<Hint id="url-hint">
    Must start with <code>https://</code>
</Hint>
<input type="url" aria-describedby="url-hint" />
```

## Accessibility

- The `id` attribute provides an anchor that consumer code references via `aria-describedby` on the associated form control.
- Screen readers announce the hint when the described input receives focus.
- Renders a `<p>` (not a `<span>` or `<div>`) for better rhythm when styled as block text.

## Related components

- `ErrorMessage` - error text associated with a field.
- `ErrorSummary` - summary of all validation errors.
- `Tooltip` / `HoverCard` - hover/focus popups.
- `InformationCallout` - larger informational callout.
- `Field` - wraps label, input, hint, and error together.

---

Lily™ and Lily Design System™ are trademarks.
