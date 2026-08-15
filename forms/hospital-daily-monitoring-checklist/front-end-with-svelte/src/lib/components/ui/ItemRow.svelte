<script lang="ts">
  // One checkpoint row: id + text, a Lily RadioGroup of three statuses
  // (satisfactory / needs-attention / not-applicable), and a remarks
  // TextInput. Used in a plain {#each} loop over a section's checkpoints —
  // see AGENTS-front-end-svelte.md §4 for the raw radio-input-inside-RadioGroup
  // pattern this mirrors.
  import { store } from '#lib/stores/assessment.svelte.js';
  import type { ChecklistItemDef } from '#lib/config/items.js';
  import RadioGroup from './RadioGroup.svelte';
  import TextInput from './TextInput.svelte';

  let { item }: { item: ChecklistItemDef } = $props();

  const STATUS_OPTIONS: { value: 'satisfactory' | 'needs-attention' | 'not-applicable'; label: string }[] = [
    { value: 'satisfactory', label: 'Satisfactory' },
    { value: 'needs-attention', label: 'Needs attention' },
    { value: 'not-applicable', label: 'N/A' },
  ];

  const response = $derived(store.data.items[item.id]);
</script>

<div class="item-row">
  <div class="item-row-header">
    <code class="item-row-id">{item.id}</code>
    <p class="item-row-text">{item.text}</p>
  </div>
  <RadioGroup label={`Status for checkpoint ${item.id} — ${item.text}`} class="item-row-status">
    {#each STATUS_OPTIONS as opt (opt.value)}
      <label class="radio-input-label">
        <input
          type="radio"
          class="radio-input"
          name={`status-${item.id}`}
          value={opt.value}
          bind:group={response.status}
        />
        {opt.label}
      </label>
    {/each}
  </RadioGroup>
  <TextInput
    id={`remarks-${item.id}`}
    label={`Remarks for checkpoint ${item.id}`}
    placeholder="Remarks (optional)"
    class="item-row-remarks"
    bind:value={response.remarks}
  />
</div>

<style>
  .item-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  .item-row:last-child { border-bottom: 0; }
  .item-row-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: baseline;
  }
  .item-row-id {
    font-size: 0.75rem;
    color: var(--color-muted);
    padding-top: 0.125rem;
  }
  .item-row-text {
    font-size: 0.875rem;
    color: var(--color-text);
    margin: 0;
  }
  :global(.item-row-status) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  :global(.item-row-remarks) {
    max-width: 32rem;
  }
</style>
