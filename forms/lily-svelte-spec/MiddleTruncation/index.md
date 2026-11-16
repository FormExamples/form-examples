# MiddleTruncation

A string shortened in the middle to fit its container, keeping the start and the end; the full text stays in the accessibility tree.

## Canonical documentation

See [components/middle-truncation/index.md](../../../components/middle-truncation/index.md) for the full component documentation, including ARIA, props, consumer CSS and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import MiddleTruncation from "./MiddleTruncation.svelte";
</script>

<MiddleTruncation
  text="quarterly-report-final-version-3.pdf"
  ellipsis="…"
  strategy="min-end"
  end={6}
/>
```

## Files

- `MiddleTruncation.svelte` — Svelte 5 implementation using runes
- `middle-truncation.ts` — the pure algorithm, a copy of `shared/middle-truncation.ts` kept current by `bin/sync-shared-modules`
- `MiddleTruncation.test.ts` — vitest + @testing-library/svelte tests
- `MiddleTruncation.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
