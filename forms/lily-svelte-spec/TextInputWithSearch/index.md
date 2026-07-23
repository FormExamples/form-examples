# TextInputWithSearch

A text input paired with a search button inside a `<div role="search">` wrapper, firing an `onsearch(value)` callback when the user clicks the button or presses Enter.

## What it is

`TextInputWithSearch` is a headless Svelte 5 compound component combining a native `<input type="text">` and a `<button type="button">` inside a `<div role="search">` landmark. It is designed for search bars, filter fields, and lookup inputs with an explicit submit-to-search action.

## What it does

- Renders a `<div role="search" aria-label={label}>` wrapper.
- Contains a `<input type="text">` with `aria-label={inputLabel}`, bound `value`, and optional `placeholder`, `required`, `disabled` attributes.
- Contains a `<button type="button">` labeled with `searchLabel` and disabled together with the input.
- Calls the `onsearch(value)` callback when the button is clicked or when the user presses `Enter` in the input.
- Binds `value` via `bind:value`.
- Spreads additional HTML attributes onto the wrapper `<div>`.

## When to use it

- Site-wide search bars.
- Filter inputs where a separate submit is required.
- Lookup fields that should not search on every keystroke.
- Any interface with a clearly visible search button.

## When not to use it

- Don't use it for live/type-ahead search — use a `TextInput` with a reactive filter instead.
- Don't use it for free-form non-search text entry — use `TextInput`.
- Don't use it for autocomplete dropdowns — use `Combobox`.
- Don't use it inside a broader form's submit flow — the internal button uses `type="button"` and will not submit the parent form.

## How to use it

Import the component, bind `value`, and supply `label`, `inputLabel`, and `searchLabel`. Pass an `onsearch` handler to run the search logic.

## Props

- `class` — string, optional. Extra CSS class appended to `text-input-with-search` on the wrapper.
- `label` — string, required. Accessible name for the search region via `aria-label`.
- `inputLabel` — string, default `"Search"`. Accessible name for the text input.
- `searchLabel` — string, default `"Search"`. Accessible label and visible text of the button.
- `value` — string, default `""`, bindable via `bind:value`. Current input value.
- `placeholder` — string, optional. Placeholder text.
- `onsearch` — `(value: string) => void`, optional. Callback invoked when search is triggered.
- `required` — boolean, default `false`. Whether the input is required.
- `disabled` — boolean, default `false`. Disables both the input and the button.
- `...restProps` — any additional HTML attributes spread onto the wrapper `<div>`.

## Usage

```svelte
<script lang="ts">
  import TextInputWithSearch from "./TextInputWithSearch.svelte";

  let q = $state("");
  function handleSearch(value: string) {
    console.log("searching", value);
  }
</script>

<TextInputWithSearch
  label="Site search"
  onsearch={handleSearch}
  bind:value={q}
/>
```

```svelte
<script lang="ts">
  import TextInputWithSearch from "./TextInputWithSearch.svelte";

  let q = $state("");
  let results = $state<string[]>([]);
  const data = ["Apples", "Oranges", "Bananas"];
</script>

<TextInputWithSearch
  label="Fruit search"
  inputLabel="Fruit name"
  searchLabel="Find"
  placeholder="Type a fruit"
  bind:value={q}
  onsearch={(v) => (results = data.filter((d) => d.toLowerCase().includes(v.toLowerCase())))}
/>

<ul>
  {#each results as r}
    <li>{r}</li>
  {/each}
</ul>
```

```svelte
<script lang="ts">
  import TextInputWithSearch from "./TextInputWithSearch.svelte";

  let q = $state("");
</script>

<TextInputWithSearch
  label="Recherche"
  inputLabel="Requête"
  searchLabel="Rechercher"
  bind:value={q}
  onsearch={(v) => console.log(v)}
/>
```

```svelte
<script lang="ts">
  import TextInputWithSearch from "./TextInputWithSearch.svelte";

  let q = $state("initial");
  let busy = $state(false);
</script>

<TextInputWithSearch
  label="Knowledge base"
  bind:value={q}
  disabled={busy}
  required
  onsearch={async (v) => {
    busy = true;
    await new Promise((r) => setTimeout(r, 500));
    busy = false;
  }}
/>
```

## Accessibility

- `role="search"` on the wrapper designates a search landmark.
- `aria-label` on the wrapper, input, and button provide distinct accessible names.
- Pressing `Enter` in the input triggers the search and prevents default form submission.
- `disabled` removes both controls from the tab order and disables interaction.

## Related components

- `SearchInput` — a single `<input type="search">` without a button.
- `TextInput` — plain single-line text input.
- `Combobox` — text input paired with a filterable dropdown list.
- `DataFilterForm` — form wrapper for complex multi-field filters.

---

Lily™ and Lily Design System™ are trademarks.
