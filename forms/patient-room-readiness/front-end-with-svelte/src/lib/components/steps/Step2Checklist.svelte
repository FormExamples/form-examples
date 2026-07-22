<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import { CHECKLIST_ITEMS } from '$lib/engine/types.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

  const r = $derived(store.result);
</script>

<Fieldset legend="Step 2 — Checklist">
  <p class="hint">Confirm each item is present and in acceptable condition.</p>

  <div class="section-progress">
    <strong>{r.checkedCount}</strong> of <strong>{r.totalCount}</strong> checkpoints confirmed
  </div>

  <div class="checklist-grid">
    {#each CHECKLIST_ITEMS as [field, label] (field)}
      <label class="checklist-item" for={`checklist-${field}`}>
        <CheckboxInput
          id={`checklist-${field}`}
          label={label}
          bind:checked={store.data.checklist[field]}
        />
        <span>{label}</span>
      </label>
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
  .checklist-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .checklist-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.625rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .checklist-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 560px) {
    .checklist-grid { grid-template-columns: 1fr; }
  }
</style>
