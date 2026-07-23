# DataFilterForm

A headless `<form role="search">` container for wrapping filter controls. It prevents the default form submission so the consumer's `onsubmit` callback can apply filters without a page reload. The `onreset` event is forwarded unchanged for native reset behavior.

## What it is

DataFilterForm renders `<form role="search" aria-label={label}>` and wires `onsubmit` to `event.preventDefault()` followed by the consumer's handler. This is the typical landmark for a search/filter region in a WAI-ARIA landmark map.

## What it does

- Renders `<form role="search" aria-label={label}>`.
- Intercepts submit and calls the consumer's `onsubmit` after `preventDefault()`.
- Passes `onreset` through to the form.
- Spreads `restProps` onto the form.

## When to use it

- Client-side filtering UIs for tables, lists, and search results.
- Forms that apply filters over AJAX or via local state updates.
- Anywhere a search landmark is appropriate.

## When not to use it

- Standard submit-to-server forms — use `Form` with a real action.
- Full-page search — use `SearchInput` and a real form.
- Simple toggle filters without a submit step — render controls directly.

## How to use it

Provide `label`. Hook `onsubmit` to your filtering function. Include submit and (optionally) reset buttons as children.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | `aria-label` for the filter region. |
| `onsubmit` | `(event: SubmitEvent) => void` | `undefined` | Called after `preventDefault()`. |
| `onreset` | `(event: Event) => void` | `undefined` | Passed straight to the form. |
| `children` | `Snippet` | required | Filter controls. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<form>`. |

## Usage

```svelte
<script lang="ts">
    import DataFilterForm from "./DataFilterForm.svelte";

    let category = $state("all");

    function applyFilters() {
        console.log("Filter by:", category);
    }
</script>

<DataFilterForm label="Filter results" onsubmit={applyFilters}>
    <label>
        Category
        <select bind:value={category}>
            <option value="all">All</option>
            <option value="articles">Articles</option>
            <option value="videos">Videos</option>
        </select>
    </label>
    <button type="submit">Apply</button>
</DataFilterForm>
```

```svelte
<script lang="ts">
    import DataFilterForm from "./DataFilterForm.svelte";

    let q = $state("");
    let tag = $state("");

    function applyFilters() { /* update state or fetch */ }
    function clearFilters() { q = ""; tag = ""; }
</script>

<DataFilterForm label="Search posts" onsubmit={applyFilters} onreset={clearFilters}>
    <label>Query <input type="search" bind:value={q} /></label>
    <label>Tag <input type="text" bind:value={tag} /></label>
    <button type="submit">Apply</button>
    <button type="reset">Clear</button>
</DataFilterForm>
```

```svelte
<script lang="ts">
    import DataFilterForm from "./DataFilterForm.svelte";

    let priceMin = $state("");
    let priceMax = $state("");

    function apply() { /* ... */ }
</script>

<DataFilterForm label="Price range" onsubmit={apply}>
    <label>Min <input type="number" bind:value={priceMin} /></label>
    <label>Max <input type="number" bind:value={priceMax} /></label>
    <button type="submit">Filter</button>
</DataFilterForm>
```

## Accessibility

- `role="search"` marks the form as a search landmark.
- `aria-label` names the search region so assistive tech can list it alongside others.
- Keyboard support comes from the contained form controls.

## Related components

- `Form` — generic form wrapper.
- `SearchInput` — bare `<input type="search">`.
- `ErrorSummary` — summarize validation errors in a form.

---

Lily™ and Lily Design System™ are trademarks.
