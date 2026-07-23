# DontListItem

A single discouraged-practice item within a `DontList`. Renders a semantic `<li>` with `data-recommendation="dont"` for consumer styling hooks.

## What it is

`DontListItem` represents one anti-pattern or practice to avoid. It renders a native `<li>` so it integrates with its parent list's semantics, and it exposes `data-recommendation="dont"` so consumer CSS can apply visual treatments (crosses, danger colours, borders) without the component shipping any styles.

## What it does

- Renders `<li class="dont-list-item" data-recommendation="dont">`.
- Exposes the `data-recommendation` hook for CSS targeting.
- Forwards `restProps` onto the `<li>`.

## When to use it

- Inside a `DontList` (or any `<ul>`/`<ol>`) to document anti-patterns.
- Alongside `DoListItem` to illustrate do/don't contrasts.
- Guideline, checklist, and style-guide pages.

## When not to use it

- Outside a list parent. It should always be inside `<ul>`, `<ol>`, or `DontList`.
- For task-based checklists with interactive state. Use `CheckListItem` / `TaskListItem` instead.
- For purely decorative rendering; use a plain `<li>` if you don't need the data attribute.

## How to use it

Place one or more `DontListItem`s inside a `DontList`.

```svelte
<script lang="ts">
    import DontList from "../DontList/DontList.svelte";
    import DontListItem from "./DontListItem.svelte";
</script>

<DontList>
    <DontListItem>Use color alone to convey meaning</DontListItem>
</DontList>
```

## Props

| Prop       | Type       | Default | Description                              |
| ---------- | ---------- | ------- | ---------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.   |
| `children` | `Snippet`  | required| The discouraged-practice content.        |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the `<li>`.|

## Usage

### 1. Inside DontList

```svelte
<DontList>
    <DontListItem>Skip alt text</DontListItem>
    <DontListItem>Use only color for meaning</DontListItem>
</DontList>
```

### 2. Side-by-side with DoListItem

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
<DontList>
    <DontListItem>
        Do not override <code>outline</code> without a visible replacement
    </DontListItem>
</DontList>
```

### 4. Inside a plain list

```svelte
<ul aria-label="Practices to avoid">
    <DontListItem>Use placeholders as labels</DontListItem>
    <DontListItem>Trap keyboard focus</DontListItem>
</ul>
```

### 5. Styled via data-recommendation

```svelte
<DontListItem class="with-icon">Skip validation</DontListItem>
<!-- CSS may target [data-recommendation="dont"]::before for a cross mark -->
```

## Accessibility

- Native `<li>` participates in its parent list's semantics and count announcements.
- `data-recommendation="dont"` is a styling hook only; it is not exposed to assistive technology.
- All text comes from consumer children, supporting translation.

## Related components

- `DontList` — the ordered-list container.
- `DoList`, `DoListItem` — the paired recommendation list.
- `CheckListItem`, `TaskListItem`, `SummaryListItem` — other list-item variants.

---

Lily™ and Lily Design System™ are trademarks.
