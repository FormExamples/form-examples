# Draft

An early preliminary version of content such as an article, email, report, etc.

## Canonical documentation

See [components/draft/index.md](../../../../components/draft/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
    import Draft from "./Draft.svelte";
</script>

<Draft label="Draft article" status="in-progress">
    <p>Working title — opening paragraph still needs a hook.</p>
</Draft>
```

## Files

- `Draft.svelte` — Svelte 5 implementation using runes
- `Draft.test.ts` — vitest + @testing-library/svelte tests
- `Draft.stories.svelte` — Storybook stories
