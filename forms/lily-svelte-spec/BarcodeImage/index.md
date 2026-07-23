# BarcodeImage

A visual machine-readable symbolic code image, such as for a scanner.

## Canonical documentation

See [components/barcode-image/index.md](../../../components/barcode-image/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
    import BarcodeImage from "./BarcodeImage.svelte";
</script>

<BarcodeImage src="/barcode-images/order-12345.svg" alt="Order number 12345" />
```

## Files

- `BarcodeImage.svelte` — Svelte 5 implementation using runes
- `BarcodeImage.test.ts` — vitest + @testing-library/svelte tests
- `BarcodeImage.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
