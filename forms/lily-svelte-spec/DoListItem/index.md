# DoListItem

A single recommended-practice item within a `DoList`. Renders a semantic `<li>` with `data-recommendation="do"` for consumer styling hooks.

## What it is

`DoListItem` represents one approved guideline or best practice. It renders a native `<li>` so it participates correctly in its parent list's semantics, and it exposes `data-recommendation="do"` so consumer CSS can add visual treatments (checkmarks, success colours, borders) without the component shipping any styles itself.

## What it does

- Renders `<li class="do-list-item" data-recommendation="do">`.
- Exposes the `data-recommendation` hook for CSS targeting.
- Forwards `restProps` onto the `<li>`.

## When to use it

- Inside a `DoList` (or any `<ul>`/`<ol>`) to document approved patterns.
- Alongside `DontListItem` to illustrate do/don't contrasts.
- Guideline, checklist, and style-guide pages.

## When not to use it

- Outside a list parent. It should always be inside `<ul>`, `<ol>`, or `DoList`.
- For task-based checklists with interactive state. Use `CheckListItem` / `TaskListItem` instead.
- For purely decorative rendering; use a plain `<li>` if you don't need the data attribute.

## How to use it

Place one or more `DoListItem`s inside a `DoList`.

```svelte
<script lang="ts">
    import DoList from "../DoList/DoList.svelte";
    import DoListItem from "./DoListItem.svelte";
</script>

<DoList>
    <DoListItem>Use descriptive alt text for images</DoListItem>
</DoList>
```

## Props

| Prop       | Type       | Default | Description                              |
| ---------- | ---------- | ------- | ---------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.   |
| `children` | `Snippet`  | required| The recommendation content.              |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the `<li>`.|

## Usage

### 1. Inside DoList

```svelte
<DoList>
    <DoListItem>Write clear labels</DoListItem>
    <DoListItem>Use semantic HTML</DoListItem>
</DoList>
```

### 2. Side-by-side with DontListItem

```svelte
<DoList>
    <DoListItem>Write clear error messages</DoListItem>
</DoList>
<DontList>
    <DontListItem>Use technical jargon in errors</DontListItem>
</DontList>
```

### 3. Rich content

```svelte
<DoList>
    <DoListItem>
        Use <code>aria-label</code> to describe unlabelled controls
    </DoListItem>
</DoList>
```

### 4. Inside a plain list

```svelte
<ul aria-label="Recommended practices">
    <DoListItem>Provide visible focus indicators</DoListItem>
    <DoListItem>Use sufficient color contrast</DoListItem>
</ul>
```

### 5. Styled via data-recommendation

```svelte
<DoListItem class="with-icon">Keep copy short</DoListItem>
<!-- CSS may target [data-recommendation="do"]::before for a checkmark -->
```

## Accessibility

- Native `<li>` participates in its parent list's semantics and count announcements.
- `data-recommendation="do"` is a styling hook only; it is not exposed to assistive technology.
- All text comes from consumer children, so content is fully translatable.

## Related components

- `DoList` — the ordered-list container.
- `DontList`, `DontListItem` — the paired anti-pattern list.
- `CheckListItem`, `TaskListItem`, `SummaryListItem` — other list-item variants.

---

Lily™ and Lily Design System™ are trademarks.
