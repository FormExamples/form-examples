# Character

A headless component for displaying a single character, glyph, symbol, or emoji with proper accessibility semantics. Meaningful characters are announced to screen readers via `role="img"` and `aria-label`; decorative characters are hidden via `aria-hidden="true"` and `role="presentation"`.

## What it is

Character renders a `<span>` wrapper around a single glyph. It determines accessibility treatment based on the `decorative` prop: when `false` (default), it requires a `label` so assistive technologies describe the glyph; when `true`, it is hidden from assistive technology entirely.

## What it does

- Renders `<span role="img" aria-label={label}>` for meaningful characters.
- Renders `<span role="presentation" aria-hidden="true">` for decorative characters.
- Accepts any single-character content via `children`.

## When to use it

- Displaying a status icon, initial letter, rating symbol, or meaningful emoji that must be announced to screen readers.
- Placing a decorative glyph that should be skipped by assistive technology.
- When a single character needs consistent accessibility semantics rather than plain text.

## When not to use it

- For multi-character text — use plain markup or `BodyText`.
- For actual icons with SVG content — use `Icon`.
- For an emoji picker — use `EmojiCharacterPicker`.

## How to use it

Wrap the glyph in `<Character>`. Always provide `label` when the character conveys meaning; set `decorative` to `true` otherwise.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | `undefined` | Accessible name used when not decorative. |
| `decorative` | `boolean` | `false` | Hide from assistive technology. |
| `children` | `Snippet` | required | The character to display. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<span>`. |

## Usage

```svelte
<script lang="ts">
    import Character from "./Character.svelte";
</script>

<Character label="Check mark">✓</Character>
```

```svelte
<script lang="ts">
    import Character from "./Character.svelte";
</script>

<Character label="Warning">⚠</Character>
```

```svelte
<script lang="ts">
    import Character from "./Character.svelte";
</script>

<Character decorative>★</Character>
```

```svelte
<script lang="ts">
    import Character from "./Character.svelte";
</script>

<p>Press <Character label="Return key">⏎</Character> to submit.</p>
```

## Accessibility

- Meaningful glyphs get `role="img"` with `aria-label`; this is the recommended WAI-ARIA pattern for a non-text character that carries meaning.
- Decorative glyphs get `aria-hidden="true"` and `role="presentation"`, so they are skipped in screen-reader output.
- Avoid passing more than one glyph so the `role="img"` represents a single atomic concept.

## Related components

- `Emoji` — emoji-specific variant with accessibility semantics.
- `Icon` — container for SVG icons.
- `ScreenReaderSpan` — visually hidden text intended only for screen readers.

---

Lily™ and Lily Design System™ are trademarks.
