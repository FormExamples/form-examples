# CharacterCounter

A headless status display that shows the current character count for a text input, with an optional maximum. It uses `role="status"` plus `aria-live="polite"` so screen readers announce updates without interrupting the user, and exposes `data-count`, `data-max`, `data-remaining`, and `data-over-limit` attributes so consumers can style the counter by state.

## What it is

CharacterCounter is a passive `<span>` that formats and announces a character count. The component itself does not count characters; callers pass the current `count` (typically `text.length`) and optionally `max`. It computes `remaining` and `overLimit` internally via `$derived()`.

Display format is `"count / max"` when `max` is provided, or just `"count"` otherwise.

## What it does

- Renders `<span role="status" aria-live="polite">` with an optional `aria-label`.
- Displays `count / max` or `count`.
- Adds `data-count`, `data-max`, `data-remaining` attributes.
- Adds `data-over-limit` only when `count > max`.

## When to use it

- Next to text inputs or textareas with a character limit (SMS, tweet-style inputs, bios, summaries).
- When assistive technology users need updates on the character count as they type.
- When visual style should change near or over the limit via CSS selectors.

## When not to use it

- For pure progress indication not tied to characters — use `Progress` or `Meter`.
- For validation error messages — use `ErrorMessage` or `Field`.
- For a combined text-area-input + counter — use `TextAreaInputWithCharacterCounter`.

## How to use it

Pass `count={text.length}` from the parent and optionally `max`. The component auto-announces updates because it is a live region; you do not need to manage that.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `count` | `number` | `0` | Current character count. |
| `max` | `number` | `undefined` | Optional maximum used to compute `remaining` and `over-limit`. |
| `label` | `string` | `undefined` | `aria-label` context (e.g. "Characters"). |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<span>`. |

## Usage

```svelte
<script lang="ts">
    import CharacterCounter from "./CharacterCounter.svelte";

    let text = $state("");
</script>

<textarea bind:value={text} maxlength={280}></textarea>
<CharacterCounter count={text.length} max={280} label="Characters" />
```

```svelte
<script lang="ts">
    import CharacterCounter from "./CharacterCounter.svelte";

    let text = $state("");
</script>

<input type="text" bind:value={text} />
<CharacterCounter count={text.length} label="Characters typed" />
```

```svelte
<script lang="ts">
    import CharacterCounter from "./CharacterCounter.svelte";

    let text = $state("Already over the limit for this demo.");
</script>

<CharacterCounter count={text.length} max={10} label="Bio" />
```

```svelte
<script lang="ts">
    import CharacterCounter from "./CharacterCounter.svelte";

    let title = $state("");
    const MAX = 60;
</script>

<label>
    Title
    <input type="text" bind:value={title} maxlength={MAX} />
</label>
<CharacterCounter count={title.length} max={MAX} label="Title characters" />
```

## Accessibility

- `role="status"` plus `aria-live="polite"` announces updates without interrupting.
- `aria-label` gives the counter meaning when read standalone.
- Visual style for over-limit state should rely on `[data-over-limit]` so screen readers and visual users get parallel signals.

## Related components

- `TextAreaInputWithCharacterCounter` — combines a text-area-input with this counter.
- `ErrorMessage` — error text for form fields.
- `Progress`, `Meter` — generic numeric progress displays.

---

Lily™ and Lily Design System™ are trademarks.
