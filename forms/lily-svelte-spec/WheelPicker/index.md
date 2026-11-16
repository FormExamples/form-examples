# WheelPicker

A single-select listbox, vertical by default, where the selection follows the cursor, for choosing one of a short list by scrolling, typing or clicking.

## Canonical documentation

See [components/wheel-picker/index.md](../../../components/wheel-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, props and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import WheelPicker from "./WheelPicker.svelte";
  let month = $state("2");
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
  ];
</script>

<WheelPicker
  label="Month"
  options={months}
  bind:value={month}
/>
```

## Files

- `WheelPicker.svelte` — Svelte 5 implementation using runes
- `wheel-picker.ts` — the keyboard model, a copy of `shared/wheel-picker.ts` kept current by `bin/sync-shared-modules`
- `WheelPicker.test.ts` — vitest + @testing-library/svelte tests
- `WheelPicker.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
