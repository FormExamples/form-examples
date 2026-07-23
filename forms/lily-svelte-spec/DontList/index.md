# DontList

An ordered list of discouraged practices to avoid, rendered as `<ol role="list">` with an accessible label. Paired with `DontListItem` or any `<li>` child content.

## What it is

`DontList` is the container for a "Don't" guideline list used in design system documentation, style guides, and instructional content. The `role="list"` preserves list semantics even when consumer CSS removes default styling. The default `aria-label` is `"Don't"`, but can be overridden for any locale.

## What it does

- Renders `<ol class="dont-list" role="list" aria-label={label}>`.
- Accepts `<li>` or `<DontListItem>` children.
- Defaults `label` to `"Don't"`.

## When to use it

- Guideline pages that contrast anti-patterns with approved patterns.
- Component docs, accessibility guidelines, style guides, and content style rules.
- Any instructional content where avoiding specific choices is as important as recommending others.

## When not to use it

- When you do not need the group label semantics. A plain `<ul>` or `<ol>` is fine.
- For task or to-do tracking. Use `TaskList` / `CheckList` instead.
- For a single anti-pattern. Inline prose is clearer than a one-item list.

## How to use it

Wrap one or more `DontListItem` children inside `DontList`.

```svelte
<script lang="ts">
    import DontList from "./DontList.svelte";
    import DontListItem from "../DontListItem/DontListItem.svelte";
</script>

<DontList>
    <DontListItem>Use color alone to convey meaning</DontListItem>
    <DontListItem>Remove focus outlines without replacement</DontListItem>
</DontList>
```

## Props

| Prop       | Type       | Default   | Description                                |
| ---------- | ---------- | --------- | ------------------------------------------ |
| `class`    | `string`   | `""`      | CSS class appended to the base class.     |
| `label`    | `string`   | `"Don't"` | Accessible name via `aria-label`.          |
| `children` | `Snippet`  | required  | List items (typically `DontListItem`).     |
| `...rest`  | `unknown`  | —         | Additional HTML attributes on the `<ol>`. |

## Usage

### 1. Basic Don't list

```svelte
<DontList>
    <DontListItem>Skip alt text</DontListItem>
    <DontListItem>Use only color for meaning</DontListItem>
</DontList>
```

### 2. Localised label

```svelte
<DontList label="Avoid">
    <DontListItem>Hard-code user-facing strings</DontListItem>
    <DontListItem>Rely on placeholder text as labels</DontListItem>
</DontList>
```

### 3. Paired with DoList

```svelte
<script lang="ts">
    import DoList from "../DoList/DoList.svelte";
    import DoListItem from "../DoListItem/DoListItem.svelte";
    import DontList from "./DontList.svelte";
    import DontListItem from "../DontListItem/DontListItem.svelte";
</script>

<DoList>
    <DoListItem>Write clear error messages</DoListItem>
</DoList>
<DontList>
    <DontListItem>Use technical jargon in errors</DontListItem>
</DontList>
```

### 4. Many anti-patterns

```svelte
<DontList label="Accessibility anti-patterns">
    <DontListItem>Remove outlines without a replacement</DontListItem>
    <DontListItem>Trap keyboard focus</DontListItem>
    <DontListItem>Rely on hover only</DontListItem>
</DontList>
```

### 5. With custom class hook

```svelte
<DontList class="red-border">
    <DontListItem>Skip screen reader text</DontListItem>
</DontList>
```

## Accessibility

- `role="list"` preserves list semantics regardless of CSS.
- `aria-label` distinguishes the anti-pattern list from its `DoList` counterpart.
- All content is supplied via children, enabling full translation.

## Related components

- `DontListItem` — a single discouraged-practice item.
- `DoList`, `DoListItem` — the recommended-practice counterpart, usually paired.
- `CheckList`, `TaskList`, `SummaryList` — other list patterns.

---

Lily™ and Lily Design System™ are trademarks.
