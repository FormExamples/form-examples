<script lang="ts">
  import { store } from '#lib/stores/documentation.svelte.js';
  import RepeatList from '#lib/components/ui/RepeatList.svelte';

  const MAX_QUALITY_STRATEGIES = 5;

  function addQualityStrategy() {
    if (store.data.qualityStrategies.length < MAX_QUALITY_STRATEGIES) {
      store.data.qualityStrategies = [...store.data.qualityStrategies, ''];
    }
  }
  function removeQualityStrategy(i: number) {
    store.data.qualityStrategies = store.data.qualityStrategies.filter((_, j) => j !== i);
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 4 — Solution Strategy</h2>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Solution strategy summary</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.solutionStrategySummary}></textarea>
  </label>

  <RepeatList
    bind:items={store.data.technologyDecisions}
    title="Technology decisions (max 6)"
    max={6}
    create={() => ({ ordinal: store.data.technologyDecisions.length + 1, category: '', choice: '', rationale: '' })}>
    {#snippet children(td, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <input type="text" placeholder="Category (e.g. language, database)" class="border rounded px-2 py-1" bind:value={td.category} />
        <input type="text" placeholder="Choice" class="border rounded px-2 py-1" bind:value={td.choice} />
      </div>
      <textarea rows="2" placeholder="Rationale" class="w-full border rounded px-2 py-1" bind:value={td.rationale}></textarea>
    {/snippet}
  </RepeatList>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Top-level decomposition summary</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.topLevelDecompositionSummary}></textarea>
  </label>

  <!-- Quality strategies — free-text bullets -->
  <div class="mb-6">
    <header class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-base-content/80">Quality strategies (max {MAX_QUALITY_STRATEGIES})</h3>
      <button type="button"
              class="text-sm px-2 py-1 rounded bg-base-300 hover:bg-base-300 disabled:opacity-50"
              disabled={store.data.qualityStrategies.length >= MAX_QUALITY_STRATEGIES}
              onclick={addQualityStrategy}>
        Add ({store.data.qualityStrategies.length}/{MAX_QUALITY_STRATEGIES})
      </button>
    </header>
    {#each store.data.qualityStrategies as _s, i (i)}
      <div class="flex gap-2 mb-2 items-start">
        <input type="text" placeholder="Quality strategy" class="flex-1 border rounded px-2 py-1"
               bind:value={store.data.qualityStrategies[i]} />
        <button type="button" class="text-xs text-error mt-1" onclick={() => removeQualityStrategy(i)}>Remove</button>
      </div>
    {/each}
  </div>
</section>
