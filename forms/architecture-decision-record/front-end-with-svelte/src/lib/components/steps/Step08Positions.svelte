<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 8 — Positions (alternatives)</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §7: viable alternatives considered. Mark exactly one as chosen.
  </p>

  <div class="grid gap-3">
    {#each store.data.positions as position, i (i)}
      <div
        class="border rounded p-3 {position.isChosen ? 'bg-primary/10 border-primary' : 'bg-base-200 border-base-300'}"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium text-sm">Position {i + 1}</span>
          <button
            type="button"
            class="text-xs px-2 py-1 rounded bg-error/10 text-error border border-error/30"
            onclick={() => store.removePosition(i)}
          >
            Remove
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="block">
            <span class="text-sm text-base-content">Name</span>
            <input type="text" class="w-full border rounded px-2 py-1" bind:value={position.name} />
          </label>
          <label class="block">
            <span class="text-sm text-base-content">Model or diagram URL</span>
            <input type="url" class="w-full border rounded px-2 py-1" bind:value={position.modelOrDiagramUrl} />
          </label>
          <label class="block md:col-span-2">
            <span class="text-sm text-base-content">Description</span>
            <textarea class="w-full border rounded px-2 py-1 font-mono text-sm" rows="3" bind:value={position.description}></textarea>
          </label>
          <label class="block">
            <span class="text-sm text-base-content">Pros (one per line)</span>
            <textarea class="w-full border rounded px-2 py-1 font-mono text-sm" rows="3" bind:value={position.pros}></textarea>
          </label>
          <label class="block">
            <span class="text-sm text-base-content">Cons (one per line)</span>
            <textarea class="w-full border rounded px-2 py-1 font-mono text-sm" rows="3" bind:value={position.cons}></textarea>
          </label>
          <label class="block md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={position.isChosen}
              onchange={() => store.chooseExclusive(i)}
            />
            <span class="text-sm text-base-content">This is the chosen position</span>
          </label>
        </div>
      </div>
    {/each}
  </div>

  <button
    type="button"
    class="mt-3 text-sm px-3 py-1.5 rounded bg-success/10 text-success border border-success/30"
    onclick={() => store.addPosition()}
  >
    + Add position
  </button>
</section>
