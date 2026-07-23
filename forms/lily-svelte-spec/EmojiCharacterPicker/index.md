# EmojiCharacterPicker

A headless grid container for browsing and selecting emoji characters. Renders a `<div role="grid">` with an accessible label; the consumer supplies rows and grid cells.

## What it is

`EmojiCharacterPicker` is a structural wrapper that provides the ARIA grid semantics needed for an emoji browser. It does not enforce a particular layout or supply emoji data; it simply gives consumers a properly labelled grid region in which to render `role="row"` and `role="gridcell"` children.

## What it does

- Renders `<div role="grid" aria-label={label}>`.
- Forwards children that should include rows and grid cells.
- Forwards `restProps` onto the `<div>`.

## When to use it

- Messaging apps, comment boxes, rich text editors where users pick emoji.
- Feedback pickers where emoji represent options.
- Any grid-of-emoji UI needing proper ARIA grid semantics.

## When not to use it

- For displaying a single emoji. Use `Emoji` instead.
- For a small, linear list of choices. Use a `Listbox` or `SegmentGroup`.
- For rich icon browsing where icons are not emoji. Use a custom grid with `Icon`.

## How to use it

Wrap rows of `role="gridcell"` buttons inside the picker.

```svelte
<script lang="ts">
    import EmojiCharacterPicker from "./EmojiCharacterPicker.svelte";
</script>

<EmojiCharacterPicker label="Choose an emoji">
    <div role="row">
        <button role="gridcell">😀</button>
        <button role="gridcell">😂</button>
        <button role="gridcell">😍</button>
    </div>
</EmojiCharacterPicker>
```

## Props

| Prop       | Type       | Default  | Description                                |
| ---------- | ---------- | -------- | ------------------------------------------ |
| `class`    | `string`   | `""`     | CSS class appended to the base class.     |
| `label`    | `string`   | required | Accessible name via `aria-label`.          |
| `children` | `Snippet`  | required | Grid content (rows and gridcells).         |
| `...rest`  | `unknown`  | —        | Additional HTML attributes on the `<div>`. |

## Usage

### 1. Single row of emoji

```svelte
<EmojiCharacterPicker label="Quick reactions">
    <div role="row">
        <button role="gridcell">👍</button>
        <button role="gridcell">❤️</button>
        <button role="gridcell">😂</button>
    </div>
</EmojiCharacterPicker>
```

### 2. Categorised rows

```svelte
<EmojiCharacterPicker label="Emoji picker">
    <div role="row" aria-label="Smileys">
        <button role="gridcell">😀</button>
        <button role="gridcell">😂</button>
    </div>
    <div role="row" aria-label="Animals">
        <button role="gridcell">🐶</button>
        <button role="gridcell">🐱</button>
    </div>
</EmojiCharacterPicker>
```

### 3. Driven by data

```svelte
<EmojiCharacterPicker label="Emoji">
    {#each rows as row}
        <div role="row">
            {#each row as e}
                <button role="gridcell" onclick={() => pick(e)}>{e}</button>
            {/each}
        </div>
    {/each}
</EmojiCharacterPicker>
```

### 4. Combined with `Emoji`

```svelte
<EmojiCharacterPicker label="Reactions">
    <div role="row">
        <button role="gridcell" onclick={() => react("👍")}>
            <Emoji emoji="👍" label="Thumbs up" />
        </button>
        <button role="gridcell" onclick={() => react("👎")}>
            <Emoji emoji="👎" label="Thumbs down" />
        </button>
    </div>
</EmojiCharacterPicker>
```

### 5. Localised label

```svelte
<EmojiCharacterPicker label="Choisissez un emoji">
    <div role="row">
        <button role="gridcell">😀</button>
    </div>
</EmojiCharacterPicker>
```

## Accessibility

- `role="grid"` identifies the container as a grid widget.
- `aria-label` provides the accessible name.
- Consumers are responsible for `role="row"`, `role="gridcell"`, and arrow-key grid navigation.

## Related components

- `Emoji` — a single emoji with accessible label.
- `Listbox`, `SegmentGroup`, `RadioGroup` — simpler selection widgets.
- `Command` — search-driven command palette.

---

Lily™ and Lily Design System™ are trademarks.
