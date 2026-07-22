<script lang="ts">
  // One indicator row: id + text, a Lily NumberInput for the recorded value,
  // and a TextInput for an optional note. Used in a plain {#each} loop over
  // a perspective's indicators — see AGENTS-front-end-svelte.md §4 for the
  // component-composition pattern this mirrors.
  import { store } from '$lib/stores/indicators.svelte.js';
  import type { IndicatorDef } from '$lib/config/indicators.js';
  import NumberInput from './NumberInput.svelte';
  import TextInput from './TextInput.svelte';

  let { indicator }: { indicator: IndicatorDef } = $props();

  const response = $derived(store.data.items[indicator.id]);
</script>

<div class="item-row">
  <div class="item-row-header">
    <code class="item-row-id">{indicator.id}</code>
    <p class="item-row-text">{indicator.text}</p>
  </div>
  <div class="indicator-row-inputs">
    <NumberInput
      id={`value-${indicator.id}`}
      label={`Recorded value for indicator ${indicator.id} — ${indicator.text}`}
      class="indicator-row-value"
      bind:value={response.value}
    />
    <TextInput
      id={`notes-${indicator.id}`}
      label={`Notes for indicator ${indicator.id}`}
      placeholder="Notes (optional)"
      class="item-row-remarks"
      bind:value={response.notes}
    />
  </div>
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
  .indicator-row-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
  :global(.indicator-row-value) {
    max-width: 10rem;
  }
  :global(.item-row-remarks) {
    max-width: 32rem;
    flex: 1 1 16rem;
  }
</style>
