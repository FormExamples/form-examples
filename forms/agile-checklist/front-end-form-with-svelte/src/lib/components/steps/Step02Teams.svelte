<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import { TEAMS_ITEMS } from '$lib/config/items.js';
  import ItemRow from '../ui/ItemRow.svelte';

  const r = $derived(store.result.teams);
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 2 — Teams (25 items)</h2>
  <p class="text-sm text-slate-600 mb-4">
    Concrete behaviours of the people doing the work — autonomy, collaboration,
    learning, finishing, and motivation. Answer <strong>Yes</strong> when the
    behaviour is reliably true today, <strong>No</strong> when it is not, and
    <strong>N/A</strong> when the item does not apply.
  </p>

  <div class="bg-slate-100 p-2 rounded text-sm mb-3">
    <strong>Section progress:</strong>
    {r.yesCount} yes · {r.noCount} no · {r.notApplicableCount} n/a · {r.unansweredCount} unanswered
    {#if r.percent !== null}
      — <strong>{r.percent.toFixed(0)}% yes</strong> ({r.band.toUpperCase()})
    {/if}
  </div>

  <div class="bg-white border border-slate-200 rounded p-2">
    {#each TEAMS_ITEMS as item (item.id)}
      <ItemRow {item} />
    {/each}
  </div>
</section>
