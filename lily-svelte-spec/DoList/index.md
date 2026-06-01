# DoList

An ordered list of recommended practices, rendered as `<ol role="list">` with an accessible label. Paired with `DoListItem` or any `<li>` child content.

## What it is

`DoList` is the container for a "Do" guideline list in design system documentation, style guides, and instructional content. The `role="list"` preserves list semantics even when consumer CSS removes default list styling. The default `aria-label` is `"Do"`, but can be overridden for any locale.

## What it does

- Renders `<ol class="do-list" role="list" aria-label={label}>`.
- Accepts `<li>` or `<DoListItem>` children.
- Defaults `label` to `"Do"`.

## When to use it

- Guideline pages that show recommended patterns alongside anti-patterns.
- Component documentation, accessibility guidelines, style guides.
- Any instructional content that contrasts "Do" versus "Don't".

## When not to use it

- When you do not need the group label semantics. A plain `<ul>` or `<ol>` is fine.
- For to-do or task lists. Use `TaskList` / `CheckList` instead.
- For a single recommendation. Inline prose is clearer than a one-item list.

## How to use it

Wrap one or more `DoListItem` children inside `DoList`.

```svelte
<script lang="ts">
    import DoList from "./DoList.svelte";
    import DoListItem from "../DoListItem/DoListItem.svelte";
</script>

<DoList>
    <DoListItem>Use descriptive alt text for images</DoListItem>
    <DoListItem>Provide visible focus indicators</DoListItem>
    <DoListItem>Use sufficient color contrast</DoListItem>
</DoList>
```

## Props

| Prop       | Type       | Default | Description                                |
| ---------- | ---------- | ------- | ------------------------------------------ |
| `class`    | `string`   | `""`    | CSS class appended to the base class.     |
| `label`    | `string`   | `"Do"`  | Accessible name via `aria-label`.          |
| `children` | `Snippet`  | required| List items (typically `DoListItem`).       |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the `<ol>`. |

## Usage

### 1. Basic Do list

```svelte
<DoList>
    <DoListItem>Write clear labels</DoListItem>
    <DoListItem>Use semantic HTML</DoListItem>
</DoList>
```

### 2. Localised label

```svelte
<DoList label="Recommended">
    <DoListItem>Provide alt text for images</DoListItem>
    <DoListItem>Use sufficient color contrast</DoListItem>
</DoList>
```

### 3. Side-by-side with DontList

```svelte
<script lang="ts">
    import DoList from "./DoList.svelte";
    import DoListItem from "../DoListItem/DoListItem.svelte";
    import DontList from "../DontList/DontList.svelte";
    import DontListItem from "../DontListItem/DontListItem.svelte";
</script>

<DoList>
    <DoListItem>Write clear error messages</DoListItem>
</DoList>
<DontList>
    <DontListItem>Use technical jargon in errors</DontListItem>
</DontList>
```

### 4. Many recommendations

```svelte
<DoList label="Accessibility checklist">
    <DoListItem>Use semantic elements</DoListItem>
    <DoListItem>Provide keyboard operability</DoListItem>
    <DoListItem>Announce dynamic updates</DoListItem>
    <DoListItem>Label every form control</DoListItem>
</DoList>
```

### 5. With custom class hook

```svelte
<DoList class="guideline-list">
    <DoListItem>Keep paragraphs short</DoListItem>
    <DoListItem>Prefer active voice</DoListItem>
</DoList>
```

## Accessibility

- `role="list"` preserves list semantics even when CSS removes bullets or spacing.
- `aria-label` names the group so screen readers can distinguish it from `DontList`.
- Content and tone come entirely from consumer-provided children, enabling i18n.

## Related components

- `DoListItem` — single recommended-practice item.
- `DontList`, `DontListItem` — the anti-pattern counterpart, always used alongside.
- `CheckList`, `TaskList`, `SummaryList` — other list patterns.
