# Autosuggest

A text input that proposes matching options as users type.

## Canonical documentation

See [components/autosuggest/index.md](../../../components/autosuggest/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import Autosuggest from "./Autosuggest.svelte";

  const fruit = ["Apple", "Apricot", "Avocado", "Banana"];
  let value = $state("");
  let suggestions = $state<{ value: string; label: string }[]>([]);

  function search(query: string) {
    const q = query.toLowerCase();
    suggestions = q
      ? fruit.filter((f) => f.toLowerCase().includes(q)).map((f) => ({ value: f, label: f }))
      : [];
  }
</script>

<Autosuggest
  label="Fruit"
  bind:value
  {suggestions}
  onInput={search}
  onSelect={(chosen) => console.log(chosen)}
/>
```

Props: `label` (required), `value` (bindable), `suggestions` (`{ value, label }[]`), `onInput(query)`, `onSelect(value)`,
`placeholder`, `name`, `class`, and rest props on the root `<div>`. The keys: ArrowDown / ArrowUp open and move the
highlight (wrapping), Home / End jump, Enter chooses, Escape closes.

## Files

- `Autosuggest.svelte` — Svelte 5 implementation using runes
- `Autosuggest.test.ts` — vitest + @testing-library/svelte tests
- `Autosuggest.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
