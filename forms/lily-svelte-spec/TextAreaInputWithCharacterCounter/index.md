# TextAreaInputWithCharacterCounter

A multi-line text input combined with a live character-count caption, rendered inside a `<div>` wrapper with `aria-describedby` and `aria-live="polite"` linking the text-area-input to its counter.

## What it is

`TextAreaInputWithCharacterCounter` is a headless Svelte 5 compound input that combines a native `<textarea>` with a live counter `<span>` displaying `"{count} of {max} characters"` (or any consumer-supplied template). It is suitable for feedback forms, comment fields, bios, and anywhere a character limit is enforced.

## What it does

- Renders a wrapper `<div class="text-area-input-with-character-counter">`.
- Inside the wrapper: a `<textarea>` with `aria-label`, `aria-describedby` linking to the counter, and `maxlength={maxLength}`.
- A sibling `<span>` with a generated `id`, `aria-live="polite"`, and the reactive counter text derived from `counterTemplate`, `value.length`, and `maxLength`.
- Replaces `{count}` and `{max}` placeholders in `counterTemplate` with live values using Svelte 5 `$derived`.
- Binds `value` via `bind:value`.
- Spreads additional HTML attributes onto the wrapper `<div>`, not the text-area-input.

## When to use it

- Feedback forms, bio fields, tweet-style composers, and comment boxes with a character limit.
- Interfaces where the user benefits from real-time remaining-capacity feedback.
- Any situation where you want a text-area-input plus a baked-in counter without assembling them separately.

## When not to use it

- Don't use it when you don't need a counter — use `TextAreaInput`.
- Don't use it for single-line inputs — use `TextInput`.
- Don't use it when you need a standalone counter alongside another input — use `CharacterCounter`.
- Don't use it for search inputs — use `SearchInput` or `TextInputWithSearch`.

## How to use it

Import, pass `label`, `maxLength`, and bind `value`. Optionally provide a translated `counterTemplate` using the `{count}` and `{max}` placeholders.

## Props

- `class` — string, optional. Extra CSS class appended to `text-area-input-with-character-counter` on the wrapper.
- `label` — string, required. Accessible name for the text-area-input via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. TextAreaInput content.
- `maxLength` — number, required. Maximum number of characters allowed.
- `counterTemplate` — string, default `"{count} of {max} characters"`. Template with `{count}` and `{max}` placeholders.
- `rows` — number, optional. Visible rows.
- `placeholder` — string, optional. TextAreaInput placeholder text.
- `required` — boolean, default `false`. Whether the text-area-input is required.
- `disabled` — boolean, default `false`. Whether the text-area-input is disabled.
- `...restProps` — any additional HTML attributes spread onto the wrapper `<div>`.

## Usage

```svelte
<script lang="ts">
  import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

  let feedback = $state("");
</script>

<TextAreaInputWithCharacterCounter
  label="Feedback"
  maxLength={500}
  bind:value={feedback}
/>
```

```svelte
<script lang="ts">
  import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

  let bio = $state("");
</script>

<TextAreaInputWithCharacterCounter
  label="Bio"
  maxLength={160}
  rows={3}
  placeholder="Tell us about yourself"
  bind:value={bio}
/>
```

```svelte
<script lang="ts">
  import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

  let note = $state("");
</script>

<TextAreaInputWithCharacterCounter
  label="Remarque"
  maxLength={280}
  counterTemplate="{count} sur {max} caractères"
  bind:value={note}
/>
```

```svelte
<script lang="ts">
  import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

  let body = $state("");
  let required = $state(true);
</script>

<TextAreaInputWithCharacterCounter
  label="Message"
  maxLength={1000}
  rows={8}
  required={required}
  bind:value={body}
/>
```

## Accessibility

- `aria-label` on the text-area-input provides its accessible name.
- `aria-describedby` on the text-area-input links it to the counter `<span>`.
- `aria-live="polite"` on the counter announces updates without interrupting speech.
- `maxlength` on the text-area-input enforces the limit at the browser level.
- Consumers can fully translate the counter text by providing `counterTemplate`.

## Related components

- `TextAreaInput` — the same underlying element without a counter.
- `CharacterCounter` — standalone counter for pairing with other inputs.
- `TextInput` — single-line equivalent.
- `Field` — provides a visible label/hint/error wrapper.

---

Lily™ and Lily Design System™ are trademarks.
