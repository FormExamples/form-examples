# AddressographBox

A box that shows a person's identification details, such as name, tracking information, and salient notations.

## Canonical documentation

See [components/addressograph-box/index.md](../../../components/addressograph-box/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
    import AddressographBox from "./AddressographBox.svelte";
</script>

<AddressographBox label="Patient identification">
    <span>Jane Doe</span>
</AddressographBox>
```

## Files

- `AddressographBox.svelte` — Svelte 5 implementation using runes
- `AddressographBox.test.ts` — vitest + @testing-library/svelte tests
- `AddressographBox.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
