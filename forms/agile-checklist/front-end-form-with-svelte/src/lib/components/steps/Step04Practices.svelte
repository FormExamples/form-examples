<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import { PRACTICES_ITEMS } from '$lib/config/items.js';
  import ItemRow from '../ui/ItemRow.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 4 — Practices (18 items)</h2>
  <p class="text-sm text-slate-600 mb-4">
    Operating practices that bind teams and stakeholders together — pace of
    decisions, focus on finished work, transparency, and scope discipline.
  </p>

  <div class="bg-slate-100 p-2 rounded text-sm mb-3">
    <strong>Section progress:</strong>
    {store.result.practices.yesCount} yes · {store.result.practices.noCount} no
    · {store.result.practices.notApplicableCount} n/a
    · {store.result.practices.unansweredCount} unanswered
    {#if store.result.practices.percent !== null}
      — <strong>{store.result.practices.percent.toFixed(0)}% yes</strong>
      ({store.result.practices.band.toUpperCase()})
    {/if}
  </div>

  <div class="bg-white border border-slate-200 rounded p-2">
    {#each PRACTICES_ITEMS as item (item.id)}
      <ItemRow {item} />
    {/each}
  </div>
</section>
