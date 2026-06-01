# Emoji

An emoji character wrapped in `<span role="img">` with a required `aria-label` so assistive technology announces a meaningful description instead of raw Unicode.

## What it is

`Emoji` makes meaningful emoji usage accessible. It renders a `<span role="img" aria-label={label}>` containing the emoji character. The label is required to encourage callers to supply a proper description.

## What it does

- Renders `<span role="img" aria-label={label}>{emoji}</span>`.
- Forwards `restProps` onto the `<span>`.

## When to use it

- Whenever an emoji conveys meaning that screen readers should announce (status indicators, ratings, prompts).
- Inside buttons, badges, or inline content where the emoji is content, not decoration.

## When not to use it

- For purely decorative emoji — use an inline emoji and hide it from assistive technology with `aria-hidden="true"`.
- For emoji pickers. Use `EmojiCharacterPicker` for a grid of selectable emoji.
- For font-icon icons. Use `Icon` instead.

## How to use it

Pass the emoji and a descriptive label.

```svelte
<script lang="ts">
    import Emoji from "./Emoji.svelte";
</script>

<Emoji emoji="👍" label="Thumbs up" />
```

## Props

| Prop      | Type      | Default  | Description                              |
| --------- | --------- | -------- | ---------------------------------------- |
| `class`   | `string`  | `""`     | CSS class appended to the base class.   |
| `emoji`   | `string`  | required | The emoji character(s).                  |
| `label`   | `string`  | required | Accessible description via `aria-label`. |
| `...rest` | `unknown` | —        | Additional HTML attributes on the span.  |

## Usage

### 1. Thumbs up

```svelte
<Emoji emoji="👍" label="Thumbs up" />
```

### 2. Warning symbol

```svelte
<Emoji emoji="⚠️" label="Warning" />
```

### 3. Inside a button

```svelte
<button type="button">
    <Emoji emoji="🗑️" label="Delete" />
</button>
```

### 4. Inline in prose

```svelte
<p>
    Give feedback by tapping
    <Emoji emoji="😊" label="Happy face" />
    or
    <Emoji emoji="😞" label="Sad face" />
    .
</p>
```

### 5. Flags with locale-appropriate labels

```svelte
<Emoji emoji="🇫🇷" label="France" />
<Emoji emoji="🇪🇸" label="Spain" />
```

## Accessibility

- `role="img"` with `aria-label` ensures screen readers announce the description rather than the raw character.
- Always pass a meaningful label; for purely decorative emoji, use inline text with `aria-hidden="true"` instead of this component.

## Related components

- `EmojiCharacterPicker` — grid of selectable emoji for pickers.
- `Icon` — generic icon container.
- `Character` — single character display primitive.
- `ScreenReaderSpan` — visually hidden descriptive text.
