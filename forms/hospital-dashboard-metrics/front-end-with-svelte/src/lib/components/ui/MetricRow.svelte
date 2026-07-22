<script lang="ts">
  // One metric row: id + text, a Lily NumberInput for the recorded value, and
  // a TextInput for an optional note. Used in a plain {#each} loop over a
  // category's metrics — see AGENTS-front-end-svelte.md §4 for the
  // component-composition pattern this mirrors.
  import { store } from '$lib/stores/metrics.svelte.js';
  import type { MetricDef } from '$lib/config/metrics.js';
  import NumberInput from './NumberInput.svelte';
  import TextInput from './TextInput.svelte';

  let { metric }: { metric: MetricDef } = $props();

  const response = $derived(store.data.items[metric.id]);
</script>

<div class="item-row">
  <div class="item-row-header">
    <code class="item-row-id">{metric.id}</code>
    <p class="item-row-text">{metric.text}</p>
  </div>
  <div class="metric-row-inputs">
    <NumberInput
      id={`value-${metric.id}`}
      label={`Recorded value for metric ${metric.id} — ${metric.text}`}
      class="metric-row-value"
      bind:value={response.value}
    />
    <TextInput
      id={`notes-${metric.id}`}
      label={`Notes for metric ${metric.id}`}
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
  .metric-row-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
  :global(.metric-row-value) {
    max-width: 10rem;
  }
  :global(.item-row-remarks) {
    max-width: 32rem;
    flex: 1 1 16rem;
  }
</style>
