# TagInputDiv

A headless text input that submits a new tag when the user presses Enter.

## What it is

A Svelte 5 headless component that renders `<div class="tag-input-div ..." role="group">` around the consumer's tags and `<input class="tag-input-div-field" type="text">`, with `aria-label`, `bind:value`, a built-in `onkeydown` handler, and optional `onadd` callback.

## What it does

- Renders a `<div role="group">` holding the consumer's tags and a native text input.
- Applies `aria-label` to the group and the field.
- Binds `value` two-way via `$bindable("")`.
- On Enter: if the trimmed value is non-empty, calls `preventDefault()`, invokes `onadd(value.trim())`, then clears the input.
- Sets `disabled`, `placeholder`, `name` and `required` on the field.
- Spreads `...restProps` onto the root `<div>`.

## When to use it

- Tag entry alongside a `TagGroup` (skills, keywords, labels).
- Free-form chip input in forms.
- Autocomplete scenarios where the consumer drives suggestions separately.

## When not to use it

- Picking from a fixed list of tags - use `Combobox` or `CheckboxGroup`.
- Generic free-form text entry - use `TextInput`.
- Email/URL/tel input - use the specialized input components.

## How to use it

1. Import the component.
2. Provide a translated `label`.
3. Bind `value` and provide an `onadd` callback that appends the new tag to your collection.

## Props

- `class` (string, optional, default `""`) - merged with the base `tag-input-div` class.
- `label` (string, required) - accessible name via `aria-label`.
- `value` (string, optional, default `""`, bindable).
- `onadd` (`(value: string) => void`, optional) - called on Enter when the trimmed value is non-empty.
- `disabled` (boolean, optional, default `false`).
- `...restProps` - spread onto the `<input>`.

## Usage

Adding to a list:

```svelte
<script lang="ts">
  import TagInputDiv from "./TagInputDiv.svelte";
  let tags = $state<string[]>([]);
  let value = $state("");
</script>

<TagInputDiv
  label="Add tag"
  bind:value
  onadd={(t) => (tags = [...tags, t])}
/>
<ul>
  {#each tags as t}<li>{t}</li>{/each}
</ul>
```

With `TagGroup` and `Tag` for rendering:

```svelte
<script lang="ts">
  import TagInputDiv from "./TagInputDiv.svelte";
  import TagGroup from "../TagGroup/TagGroup.svelte";
  import Tag from "../Tag/Tag.svelte";
  let skills = $state<string[]>(["Svelte"]);
  let v = $state("");
</script>

<TagGroup label="Skills">
  {#each skills as s}<Tag label="Skill">{s}</Tag>{/each}
</TagGroup>
<TagInputDiv
  label="Add skill"
  bind:value={v}
  onadd={(s) => (skills = [...skills, s])}
/>
```

De-duplicated on add:

```svelte
<script lang="ts">
  import TagInputDiv from "./TagInputDiv.svelte";
  let tags = $state<string[]>([]);
  let v = $state("");
  function add(t: string) {
    if (!tags.includes(t)) tags = [...tags, t];
  }
</script>

<TagInputDiv
  label="Add unique tag"
  bind:value={v}
  onadd={add}
/>
```

Disabled while submitting:

```svelte
<script lang="ts">
  import TagInputDiv from "./TagInputDiv.svelte";
  let v = $state("");
  let submitting = $state(false);
</script>

<TagInputDiv
  label="Add"
  bind:value={v}
  disabled={submitting}
  onadd={() => {}}
/>
```

Placeholder via restProps:

```svelte
<script lang="ts">
  import TagInputDiv from "./TagInputDiv.svelte";
  let v = $state("");
</script>

<TagInputDiv
  label="Add tag"
  bind:value={v}
  placeholder="Type and press Enter..."
  onadd={(t) => console.log("add", t)}
/>
```

## Accessibility

- `aria-label` provides the accessible name.
- Enter adds a tag and clears the field (with `preventDefault` so forms do not submit).
- Consumers should render the resulting tags as real content that is visible and accessible (for example, via `Tag`/`TagGroup`).
- For screen-reader feedback when a tag is added, consider a live region updated by the `onadd` handler.

## Related components

- `Tag`, `TagGroup` - rendered output.
- `TextInput` - generic text input.
- `Combobox` - text input with filterable dropdown.

---

Lily™ and Lily Design System™ are trademarks.
