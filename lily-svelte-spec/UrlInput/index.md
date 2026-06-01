# UrlInput

A headless URL input built on the native HTML `<input type="url">` element. It provides built-in URL validation, may trigger URL-optimized keyboard layouts on mobile devices, and exposes a bindable `value` for Svelte 5 two-way binding.

## What it is

A thin, unstyled wrapper around `<input type="url">`. The component owns no CSS, no visual styling, no placeholder text, and no error messaging — it is purely a semantic input carrying an accessible label.

## What it does

- Renders `<input type="url">` with `aria-label` set from the `label` prop.
- Supports `bind:value` via Svelte 5 `$bindable()`.
- Passes through `required` and `disabled` attributes.
- Spreads any additional HTML attributes (such as `placeholder`, `name`, `id`, `pattern`, `autocomplete`) onto the native element.

## When to use it

- A profile form asking for a website, portfolio, or social link.
- A link submission form where the browser's built-in URL validation is sufficient.
- Any context where triggering a URL keyboard on mobile (`.com` key, no space bar) is desirable.

## When not to use it

- Collecting plain text — use `TextInput`.
- Collecting an email address — use `EmailInput`.
- Building a combobox for selecting from a set of known URLs — use `Combobox`.
- Scenarios where strict validation rules beyond the browser default are required and must be enforced consistently across browsers.

## How to use it

Import the component, bind `value`, and supply an accessible `label`. Wrap in a `Field` if you want an associated visible label and error messaging.

## Props

| Prop        | Type      | Default | Description                                                              |
| ----------- | --------- | ------- | ------------------------------------------------------------------------ |
| `class`     | `string`  | `""`    | Additional CSS class appended to the base class name.                    |
| `label`     | `string`  | —       | Required. Accessible name set on `aria-label`.                           |
| `value`     | `string`  | `""`    | Bindable URL value. Supports `bind:value`.                               |
| `required`  | `boolean` | `false` | Sets the native `required` attribute for form validation.                |
| `disabled`  | `boolean` | `false` | Sets the native `disabled` attribute.                                    |
| `...rest`   | —         | —       | Additional HTML attributes, spread onto the `<input>`.                   |

## Usage

```svelte
<script lang="ts">
    import UrlInput from "./UrlInput.svelte";

    let website = $state("");
</script>

<UrlInput label="Website" bind:value={website} />
```

```svelte
<script lang="ts">
    import UrlInput from "./UrlInput.svelte";

    let portfolioUrl = $state("");
</script>

<UrlInput
    label="Portfolio link"
    bind:value={portfolioUrl}
    required
    placeholder="https://example.com"
/>
```

```svelte
<script lang="ts">
    import UrlInput from "./UrlInput.svelte";
    import Field from "../Field/Field.svelte";

    let homepage = $state("");
    let error = $state("");
</script>

<Field label="Homepage" required error={error}>
    <UrlInput label="Homepage" bind:value={homepage} required />
</Field>
```

```svelte
<script lang="ts">
    import UrlInput from "./UrlInput.svelte";

    let url = $state("https://example.org");
</script>

<UrlInput label="Editable URL" bind:value={url} />
<p>Current: {url}</p>
```

```svelte
<script lang="ts">
    import UrlInput from "./UrlInput.svelte";
</script>

<UrlInput label="Read-only URL" value="https://example.org" disabled />
```

## Accessibility

- `aria-label` is set from `label`, providing the accessible name when no visible `<label for>` element is associated.
- Implicit `textbox` role with URL semantics; browsers validate URL format on form submission.
- When wrapped in `Field`, prefer an associated visible label plus `aria-describedby` for hints and errors.
- Consumer CSS must provide a visible focus indicator meeting WCAG 2.2 AAA contrast.

## Related components

- `EmailInput` — analogous input for email addresses.
- `TextInput` — for generic single-line text.
- `TelInput` — for telephone numbers.
- `SearchInput` — for search queries.
- `Field` — wraps the input with a label, hint, and error message.
- `Form` — form element for submission.
