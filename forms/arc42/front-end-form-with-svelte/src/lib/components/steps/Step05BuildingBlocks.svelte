<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import RepeatList from '$lib/components/ui/RepeatList.svelte';

  // Top-level blocks are those with no parentOrdinal
  function topLevelBlocks() {
    return store.data.buildingBlocks.filter((b) => b.parentOrdinal === null);
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 5 — Building Block View</h2>

  <label class="block mb-4">
    <span class="text-sm text-slate-700">Overview</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.buildingBlockOverview}></textarea>
  </label>

  <RepeatList
    bind:items={store.data.buildingBlocks}
    title="Building blocks (max 12)"
    max={12}
    create={() => ({ ordinal: store.data.buildingBlocks.length + 1, parentOrdinal: null, name: '', responsibility: '', interfaces: '' })}>
    {#snippet children(bb, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <input type="text" placeholder="Name" class="border rounded px-2 py-1" bind:value={bb.name} />
        <select class="border rounded px-2 py-1" bind:value={bb.parentOrdinal}>
          <option value={null}>Top-level (no parent)</option>
          {#each topLevelBlocks() as tl}
            {#if tl.ordinal !== bb.ordinal}
              <option value={tl.ordinal}>{tl.name || `Block ${tl.ordinal}`}</option>
            {/if}
          {/each}
        </select>
      </div>
      <textarea rows="2" placeholder="Responsibility" class="w-full border rounded px-2 py-1 mb-1" bind:value={bb.responsibility}></textarea>
      <textarea rows="2" placeholder="Interfaces" class="w-full border rounded px-2 py-1" bind:value={bb.interfaces}></textarea>
    {/snippet}
  </RepeatList>
</section>
