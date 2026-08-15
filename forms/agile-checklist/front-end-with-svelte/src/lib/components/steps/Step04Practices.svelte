<script lang="ts">
  import { store } from '#lib/stores/checklist.svelte.js';
  import { PRACTICES_ITEMS } from '#lib/config/items.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import ItemRow from '../ui/ItemRow.svelte';

  const r = $derived(store.result.practices);
</script>

<Fieldset legend="Step 4 — Practices (18 items)">
  <p class="hint">
    Operating practices that bind teams and stakeholders together — pace of
    decisions, focus on finished work, transparency, and scope discipline.
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
    {#each PRACTICES_ITEMS as item (item.id)}
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
