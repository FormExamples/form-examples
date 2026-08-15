<script lang="ts">
  import { store } from '#lib/stores/indicators.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import { summariseIndicators } from '#lib/engine/summary.js';
  import { TOTAL_INDICATORS } from '#lib/config/indicators.js';

  const result = $derived(summariseIndicators(store.data));
</script>

<Fieldset legend="Step 6 — Summary &amp; sign-off">
  <p class="hint">
    A tally of indicators recorded, grouped by Balanced Scorecard
    perspective, followed by overall notes and sign-off. This is a
    completeness tally, not a scored grading engine.
  </p>

  <div class="summary-box">
    <p><strong>Indicators recorded:</strong> {result.reportedCount} / {TOTAL_INDICATORS}</p>
  </div>

  <div class="category-tally">
    <h3>Recorded by perspective</h3>
    <ul>
      {#each result.categoryCounts as c (c.category)}
        <li>
          <span class="category-number">{c.category}.</span>
          <span class="category-title">{c.categoryTitle}</span>
          <span class="category-count">{c.reported} / {c.total}</span>
        </li>
      {/each}
    </ul>
  </div>

  <Field label="Overall notes" inputId="summary-overallNotes">
    <TextAreaInput
      id="summary-overallNotes"
      label="Overall notes"
      rows={3}
      bind:value={store.data.summary.overallNotes}
    />
  </Field>
  <Field label="Signed at" inputId="summary-signedAt">
    <DateInput id="summary-signedAt" label="Signed at" bind:value={store.data.summary.signedAt} />
  </Field>
</Fieldset>

<style>
  .summary-box {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    margin: 0 0 1rem;
  }
  .summary-box p { margin: 0 0 0.25rem; }
  .category-tally {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    margin: 0 0 1rem;
  }
  .category-tally h3 {
    font-weight: 600;
    margin: 0 0 0.5rem;
    font-size: 0.9375rem;
    color: var(--color-text);
  }
  .category-tally ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .category-tally li {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.875rem;
    margin: 0.25rem 0;
    border-bottom: 1px dashed var(--color-border);
    padding-bottom: 0.25rem;
  }
  .category-tally li:last-child { border-bottom: 0; }
  .category-number { color: var(--color-muted); margin-right: 0.25rem; }
  .category-title { flex: 1; }
  .category-count { font-variant-numeric: tabular-nums; color: var(--color-text); font-weight: 600; }
</style>
