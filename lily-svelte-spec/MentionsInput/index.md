# MentionsInput

A text input with at-mention autocomplete suggestions. This headless Svelte component pairs an `<input role="combobox">` with a suggestions panel that consumers fill (typically with a Listbox).

## What it is

A headless Svelte 5 component inspired by [Ant Design Mentions](https://ant.design/components/mentions). Consumers manage `value`, `expanded`, and suggestions content. Category: form controls.

## What it does

- Renders a `<div class="mentions-input">` wrapping an `<input class="mentions-input-control" type="text" role="combobox">`.
- Applies `aria-haspopup="listbox"`, `aria-expanded`, `aria-autocomplete="list"`, and `aria-label`.
- Renders a `<div class="mentions-input-suggestions">` panel hidden when not expanded.
- Exposes `data-trigger-char` for consumer logic.
- Forwards `oninput` and spreads `...restProps`.

## When to use it

- Comments, posts, or chat where users mention people, channels, or tags.
- Any text field that benefits from inline autocomplete tied to a trigger character.

## When not to use it

- For plain text input, use `TextInput` or `TextAreaInput`.
- For tag selection, use `TagInput`.

## Props

- `class` — string, default `""`. CSS class appended to `mentions-input`.
- `label` — string, **required**. Accessible name via `aria-label`.
- `value` — string, default `""`. Input value.
- `triggerChar` — string, default `"@"`. Character that opens suggestions.
- `expanded` — boolean, default `false`. Whether the suggestions panel is open.
- `placeholder` — string, optional.
- `disabled` — boolean, default `false`.
- `oninput` — `(event: Event) => void`, optional.
- `children` — `Snippet`, optional. Suggestions panel content.
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import MentionsInput from './MentionsInput.svelte';

  let value = $state('');
  let expanded = $state(false);

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    value = input.value;
    expanded = input.value.endsWith('@');
  }
</script>

<MentionsInput
  label="Comment"
  value={value}
  expanded={expanded}
  oninput={handleInput}
  placeholder="Type @ to mention"
>
  <ul role="listbox" aria-label="People">
    <li role="option" aria-selected="false">@alice</li>
  </ul>
</MentionsInput>
```

## Accessibility

- `<input role="combobox">` with `aria-haspopup="listbox"`, `aria-expanded`, and `aria-autocomplete="list"`.
- Consumers should manage focus and active descendant via `aria-activedescendant` on the input as the user navigates suggestions.

## Related components

- `Combobox` — generic text-with-list combobox.
- `TextInput`, `TextAreaInput` — plain text inputs.
- `Listbox` — selectable list often used as the suggestions panel.

## References

- Ant Design Mentions: https://ant.design/components/mentions
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
