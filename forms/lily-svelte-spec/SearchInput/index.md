# SearchInput

A headless search field that renders a native `<input type="search">` with an accessible label and two-way bindable value.

## What it is

A Svelte 5 headless component wrapping `<input type="search">`. It renders exactly one `<input class="search-input ...">` with `aria-label`, `type="search"`, `bind:value`, `required`, and `disabled`.

## What it does

- Accepts a required `label` that is applied to `aria-label`.
- Uses `$bindable("")` on `value` so consumers can `bind:value` two-way.
- Forwards `required` and `disabled` directly to the input.
- Inherits all native `<input type="search">` behavior (for example, some browsers render a clear button, and Escape clears the field).
- Spreads `...restProps` onto the `<input>` so placeholder, name, pattern, etc. are consumer-controlled.

## When to use it

- Site-wide search fields or content filters.
- Any query-entry box where search semantics improve mobile keyboards and browser affordances.
- Forms where the value must participate in HTML form submission.

## When not to use it

- A search field that needs a built-in submit button, icon, or combobox suggestions - compose with other components or use `TextInputWithSearch`/`Combobox`.
- Generic text entry (use `TextInput`).
- Tag entry (use `TagInput`).

## How to use it

1. Import from its source file.
2. Provide a localized `label`.
3. Bind `value` with `bind:value` to keep in sync with application state.
4. Add placeholder/name/other attributes via spread.

## Props

- `class` (string, optional, default `""`) - merged with the base `search-input` class.
- `label` (string, required) - accessible name via `aria-label`.
- `value` (string, optional, default `""`, bindable) - current search text.
- `required` (boolean, optional, default `false`).
- `disabled` (boolean, optional, default `false`).
- `...restProps` - spread onto the `<input>`.

## Usage

Basic bound search:

```svelte
<script lang="ts">
    import SearchInput from "./SearchInput.svelte";
    let query = $state("");
</script>

<SearchInput label="Search" bind:value={query} />
<p>Current query: {query}</p>
```

With placeholder and name:

```svelte
<script lang="ts">
    import SearchInput from "./SearchInput.svelte";
    let query = $state("");
</script>

<SearchInput
    label="Search articles"
    bind:value={query}
    name="q"
    placeholder="Type to search..."
/>
```

Required inside a form:

```svelte
<script lang="ts">
    import SearchInput from "./SearchInput.svelte";
    let query = $state("");
</script>

<form>
    <SearchInput label="Filter products" bind:value={query} required />
    <button type="submit">Go</button>
</form>
```

Disabled while loading:

```svelte
<script lang="ts">
    import SearchInput from "./SearchInput.svelte";
    let query = $state("");
    let loading = $state(true);
</script>

<SearchInput label="Search" bind:value={query} disabled={loading} />
```

Debounced filter:

```svelte
<script lang="ts">
    import SearchInput from "./SearchInput.svelte";
    let query = $state("");
    let timer: number;
    $effect(() => {
        clearTimeout(timer);
        timer = setTimeout(() => console.log("search:", query), 250);
    });
</script>

<SearchInput label="Search" bind:value={query} />
```

## Accessibility

- `aria-label` provides the accessible name because there is no visible `<label>`.
- Native `<input type="search">` has implicit search semantics.
- Escape clears the value in browsers that implement it.
- Enter submits the containing form.

References:
- MDN `input type="search"`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search

## Related components

- `TextInput` - generic text entry.
- `TextInputWithSearch` - text input with search affordances.
- `Combobox` - text input with dropdown suggestions.
- `TagInput` - build a list of tags from typed entries.

---

Lily™ and Lily Design System™ are trademarks.
