# Details

A disclosure widget built on the native `<details>` and `<summary>` elements. Shows and hides supplementary content on demand with full browser-native accessibility.

## What it is

`Details` is a headless wrapper around the HTML `<details>` element. It renders the provided `summary` text inside a `<summary>` element and the `children` snippet as the expandable content. The `open` state is bindable, so parent components can both read and drive the expanded/collapsed state.

## What it does

- Renders `<details>` with a `<summary>` toggle and a child content region.
- Binds the `open` attribute for two-way state sync.
- Leaves all visual styling (arrows, spacing, animation) to consumer CSS.

## When to use it

- FAQ items, progressive disclosure, optional explanatory text.
- Any case where the standards-based `<details>` semantics are sufficient.
- Content that should remain in the accessible tree and work without JavaScript.

## When not to use it

- When you need a custom trigger element (button, link, icon) or an animated content region. Use `Expander` or `Collapsible` instead.
- When the content must be announced as a dialog or a live region.
- When you need to control the expanded state via a separate trigger element.

## How to use it

Pass a required `summary` string and wrap the revealed content in the default slot.

```svelte
<script lang="ts">
    import Details from "./Details.svelte";
</script>

<Details summary="More information">
    <p>Additional details shown when expanded.</p>
</Details>
```

## Props

| Prop       | Type       | Default  | Description                                      |
| ---------- | ---------- | -------- | ------------------------------------------------ |
| `class`    | `string`   | `""`     | CSS class appended to the base class.           |
| `summary`  | `string`   | required | Text shown in the clickable `<summary>`.         |
| `open`     | `boolean`  | `false`  | Whether the details section is expanded. Bindable. |
| `children` | `Snippet`  | required | Content revealed when expanded.                  |
| `...rest`  | `unknown`  | —        | Additional HTML attributes on the `<details>`.   |

## Usage

### 1. Basic disclosure

```svelte
<Details summary="Read more">
    <p>Lorem ipsum dolor sit amet.</p>
</Details>
```

### 2. Bound open state

```svelte
<script lang="ts">
    import Details from "./Details.svelte";
    let open = $state(false);
</script>

<Details summary="Advanced options" bind:open>
    <p>Configure advanced settings here.</p>
</Details>
<p>Open: {open}</p>
```

### 3. Open by default

```svelte
<Details summary="Terms and conditions" open>
    <p>Full terms text…</p>
</Details>
```

### 4. Multiple details

```svelte
<Details summary="Question 1"><p>Answer 1</p></Details>
<Details summary="Question 2"><p>Answer 2</p></Details>
<Details summary="Question 3"><p>Answer 3</p></Details>
```

### 5. With a programmatic toggle

```svelte
<script lang="ts">
    import Details from "./Details.svelte";
    let open = $state(false);
</script>

<button type="button" onclick={() => open = !open}>
    Toggle details
</button>
<Details summary="Details" bind:open>
    <p>Controlled from outside.</p>
</Details>
```

## Accessibility

- `<details>` and `<summary>` natively expose disclosure semantics. No extra ARIA needed.
- Keyboard: Enter and Space on the focused `<summary>` toggle the state.
- Assistive technology announces the expanded/collapsed state automatically.

## Related components

- `Expander` — button-triggered disclosure with `aria-expanded`/`aria-controls`.
- `Collapsible` — generic collapsible container.
- `AccordionList` / `AccordionListItem` — grouped disclosures in an accordion pattern.

---

Lily™ and Lily Design System™ are trademarks.
