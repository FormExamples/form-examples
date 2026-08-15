<script lang="ts">
  import { store } from '#lib/stores/documentation.svelte.js';
  import RepeatList from '#lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 6 — Runtime View</h2>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Runtime overview</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.runtimeOverview}></textarea>
  </label>

  <RepeatList
    bind:items={store.data.runtimeScenarios}
    title="Runtime scenarios (max 8)"
    max={8}
    create={() => ({ ordinal: store.data.runtimeScenarios.length + 1, name: '', triggerDescription: '', stepsSummary: '' })}>
    {#snippet children(s, _i)}
      <input type="text" placeholder="Scenario name" class="w-full border rounded px-2 py-1 mb-1" bind:value={s.name} />
      <input type="text" placeholder="Trigger description" class="w-full border rounded px-2 py-1 mb-1" bind:value={s.triggerDescription} />
      <textarea rows="3" placeholder="Steps summary" class="w-full border rounded px-2 py-1" bind:value={s.stepsSummary}></textarea>
    {/snippet}
  </RepeatList>
</section>
