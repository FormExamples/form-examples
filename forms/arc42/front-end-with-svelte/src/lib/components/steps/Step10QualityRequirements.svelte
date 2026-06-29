<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import RepeatList from '$lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 10 — Quality Requirements</h2>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Quality tree summary</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.qualityTreeSummary}></textarea>
  </label>

  <RepeatList
    bind:items={store.data.qualityScenarios}
    title="Quality scenarios (max 10)"
    max={10}
    create={() => ({
      ordinal: store.data.qualityScenarios.length + 1,
      source: '',
      stimulus: '',
      artifact: '',
      response: '',
      measure: '',
    })}>
    {#snippet children(qs, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <input type="text" placeholder="Source" class="border rounded px-2 py-1" bind:value={qs.source} />
        <input type="text" placeholder="Stimulus" class="border rounded px-2 py-1" bind:value={qs.stimulus} />
        <input type="text" placeholder="Artifact" class="border rounded px-2 py-1" bind:value={qs.artifact} />
        <input type="text" placeholder="Response" class="border rounded px-2 py-1" bind:value={qs.response} />
      </div>
      <input type="text" placeholder="Measure" class="w-full border rounded px-2 py-1" bind:value={qs.measure} />
    {/snippet}
  </RepeatList>
</section>
