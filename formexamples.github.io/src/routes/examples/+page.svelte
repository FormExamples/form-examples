<script lang="ts">
  import ExampleCard from '$lib/components/ExampleCard.svelte';
  import { examples } from '$lib/data/examples.generated';

  let query = $state('');

  let filtered = $derived(
    query.trim() === ''
      ? examples
      : examples.filter((e) => {
          const q = query.trim().toLowerCase();
          return (
            e.title.toLowerCase().includes(q) ||
            e.slug.toLowerCase().includes(q) ||
            e.personas.some((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
          );
        })
  );

  const totalPersonas = examples.reduce((sum, e) => sum + e.personas.length, 0);
</script>

<h1 class="text-3xl font-semibold tracking-tight">Examples</h1>
<p class="mt-2 text-muted">
  {totalPersonas} hand-curated, engine-verified worked examples across {examples.length} forms — each a realistic
  scenario with the scoring/grading engine's exact expected output, used as the fleet's regression oracle
  (<code>bin/test-personas</code>). Forms without a card here have no scoring engine by design (pure
  documentation or notice forms).
</p>

<input
  type="search"
  bind:value={query}
  placeholder="Filter by form, slug, or scenario…"
  class="mt-6 w-full max-w-md rounded-md border border-base-300 bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
  aria-label="Filter examples"
/>
<p class="mt-2 text-xs text-muted">{filtered.length} of {examples.length} forms shown</p>

<div class="mt-6 grid gap-4 sm:grid-cols-2">
  {#each filtered as example}
    <ExampleCard {example} />
  {/each}
</div>

{#if filtered.length === 0}
  <p class="mt-8 text-muted">No forms match "{query}".</p>
{/if}
