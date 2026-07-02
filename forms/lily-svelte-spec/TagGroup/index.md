# TagGroup

A headless container for a set of related `Tag` elements. Renders a `<div>` with `role="group"` and an accessible label.

## What it is

A Svelte 5 headless component that renders `<div class="tag-group ...">` with `role="group"` and `aria-label`. Children are expected to be `Tag` components (or equivalent inline tag elements).

## What it does

- Groups related tags into a named ARIA group so assistive tech announces them as a collection.
- Applies `aria-label`.
- Renders `children` verbatim.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- To group skill chips on a resume, technology chips on a project, or topic chips on an article.
- Anywhere multiple `Tag` elements belong together and should be announced as a set.

## When not to use it

- For a single tag - just render a `Tag`.
- For multi-select chip controls - use `CheckboxGroup` or `ToggleGroup`.
- For a dropdown of tags - use `Combobox` or `Listbox`.

## How to use it

1. Import `TagGroup` and `Tag`.
2. Provide a translated `label` describing what the tags represent.
3. Render one or more `Tag` children.

## Props

- `class` (string, optional, default `""`) - merged with the base `tag-group` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - tag elements.
- `...restProps` - spread onto the `<div>`.

## Usage

Composition with `Tag`:

```svelte
<script lang="ts">
    import TagGroup from "./TagGroup.svelte";
    import Tag from "../Tag/Tag.svelte";
</script>

<TagGroup label="Technologies">
    <Tag label="Technology">Svelte</Tag>
    <Tag label="Technology">TypeScript</Tag>
    <Tag label="Technology">Vite</Tag>
</TagGroup>
```

Dynamic tags from data:

```svelte
<script lang="ts">
    import TagGroup from "./TagGroup.svelte";
    import Tag from "../Tag/Tag.svelte";
    const skills = ["Svelte", "TypeScript", "CSS", "Accessibility"];
</script>

<TagGroup label="Skills">
    {#each skills as s}
        <Tag label="Skill">{s}</Tag>
    {/each}
</TagGroup>
```

Paired with `TagInput` for adding tags:

```svelte
<script lang="ts">
    import TagGroup from "./TagGroup.svelte";
    import Tag from "../Tag/Tag.svelte";
    import TagInput from "../TagInput/TagInput.svelte";
    let tags = $state<string[]>(["svelte"]);
    let newTag = $state("");
</script>

<TagGroup label="Tags">
    {#each tags as t}
        <Tag label="Tag">{t}</Tag>
    {/each}
</TagGroup>
<TagInput label="Add tag" bind:value={newTag} onadd={(v) => (tags = [...tags, v])} />
```

In an article's metadata:

```svelte
<script lang="ts">
    import TagGroup from "./TagGroup.svelte";
    import Tag from "../Tag/Tag.svelte";
</script>

<footer>
    <TagGroup label="Topics">
        <Tag label="Topic">Accessibility</Tag>
        <Tag label="Topic">Design systems</Tag>
    </TagGroup>
</footer>
```

With extra class for layout:

```svelte
<script lang="ts">
    import TagGroup from "./TagGroup.svelte";
    import Tag from "../Tag/Tag.svelte";
</script>

<TagGroup label="Tools" class="wrap">
    <Tag label="Tool">Vitest</Tag>
    <Tag label="Tool">Playwright</Tag>
</TagGroup>
```

## Accessibility

- `role="group"` + `aria-label` semantically groups the tags.
- `TagGroup` does not add keyboard behavior; it is a passive container.

References:
- WAI-ARIA `group` role: https://www.w3.org/TR/wai-aria-1.2/#group

## Related components

- `Tag` - the intended child.
- `TagInput` - input for adding new tags.
- `Badge` - single count/status indicator.
- `CheckboxGroup` - multi-select form group.
