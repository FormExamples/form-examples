<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import RepeatList from '$lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 8 — Crosscutting Concepts</h2>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Crosscutting overview</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.crosscuttingOverview}></textarea>
  </label>

  <RepeatList
    bind:items={store.data.crosscuttingConcepts}
    title="Crosscutting concepts (max 10)"
    max={10}
    create={() => ({ ordinal: store.data.crosscuttingConcepts.length + 1, name: '', description: '' })}>
    {#snippet children(c, _i)}
      <input type="text" placeholder="Concept name" class="w-full border rounded px-2 py-1 mb-1" bind:value={c.name} />
      <textarea rows="3" placeholder="Description" class="w-full border rounded px-2 py-1" bind:value={c.description}></textarea>
    {/snippet}
  </RepeatList>
</section>
