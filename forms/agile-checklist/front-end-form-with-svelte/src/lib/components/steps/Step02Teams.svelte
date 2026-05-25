<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import { TEAMS_ITEMS } from '$lib/config/items.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import ItemRow from '../ui/ItemRow.svelte';

  const r = $derived(store.result.teams);
</script>

<Fieldset legend="Step 2 — Teams (25 items)">
  <p class="hint">
    Concrete behaviours of the people doing the work — autonomy, collaboration,
    learning, finishing, and motivation. Answer <strong>Yes</strong> when the
    behaviour is reliably true today, <strong>No</strong> when it is not, and
    <strong>N/A</strong> when the item does not apply.
  </p>

  <div class="section-progress">
    <strong>Section progress:</strong>
    {r.yesCount} yes · {r.noCount} no · {r.notApplicableCount} n/a · {r.unansweredCount}
    unanswered
    {#if r.percent !== null}
      — <strong>{r.percent.toFixed(0)}% yes</strong> ({r.band.toUpperCase()})
    {/if}
  </div>

  <div class="item-list">
    {#each TEAMS_ITEMS as item (item.id)}
      <ItemRow {item} />
    {/each}
  </div>
</Fieldset>

<style>
  .section-progress {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem 0 0.75rem;
    font-size: 0.875rem;
  }
  .item-list {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.5rem;
  }
</style>
