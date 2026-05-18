<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import { STAKEHOLDERS_ITEMS } from '$lib/config/items.js';
  import ItemRow from '../ui/ItemRow.svelte';

  const r = $derived(store.result.stakeholders);
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 3 — Stakeholders (14 items)</h2>
  <p class="text-sm text-slate-600 mb-4">
    Behaviours of sponsors, executives, and other people outside the team
    whose decisions shape what the team can do — trust, delegation,
    experimentation, communication.
  </p>

  <div class="bg-slate-100 p-2 rounded text-sm mb-3">
    <strong>Section progress:</strong>
    {store.result.stakeholders.yesCount} yes · {store.result.stakeholders.noCount} no
    · {store.result.stakeholders.notApplicableCount} n/a
    · {store.result.stakeholders.unansweredCount} unanswered
    {#if store.result.stakeholders.percent !== null}
      — <strong>{store.result.stakeholders.percent.toFixed(0)}% yes</strong>
      ({store.result.stakeholders.band.toUpperCase()})
    {/if}
  </div>

  <div class="bg-white border border-slate-200 rounded p-2">
    {#each STAKEHOLDERS_ITEMS as item (item.id)}
      <ItemRow {item} />
    {/each}
  </div>
</section>
