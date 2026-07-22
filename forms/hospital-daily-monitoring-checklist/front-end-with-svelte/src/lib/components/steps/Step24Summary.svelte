<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import { summariseChecklist } from '$lib/engine/summary.js';
  import { TOTAL_ITEMS } from '$lib/config/items.js';

  const result = $derived(summariseChecklist(store.data));
</script>

<Fieldset legend="Step 24 — Summary &amp; sign-off">
  <p class="hint">
    A tally of checkpoints answered and any marked <strong>needs attention</strong>,
    grouped by area, followed by overall notes, an action plan, and sign-off.
    This is an operational tally, not a scored grading engine.
  </p>

  <div class="summary-box">
    <p><strong>Checkpoints answered:</strong> {result.answeredCount} / {TOTAL_ITEMS}</p>
    <p><strong>Needs attention:</strong> {result.needsAttentionCount}</p>
    <p>
      <strong>Areas with needs-attention checkpoints:</strong>
      {result.sectionsWithNeedsAttention.length > 0
        ? result.sectionsWithNeedsAttention.join(', ')
        : 'None'}
    </p>
  </div>

  {#if result.needsAttentionItems.length > 0}
    <div class="needs-attention-list">
      <h3>Needs-attention checkpoints</h3>
      <ul>
        {#each result.needsAttentionItems as item (item.id)}
          <li>
            <code>{item.id}</code>
            <span class="section-title">{item.sectionTitle}</span>
            — {item.text}
            {#if item.remarks}
              <span class="remarks">“{item.remarks}”</span>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <Field label="Overall notes" inputId="summary-overallNotes">
    <TextAreaInput
      id="summary-overallNotes"
      label="Overall notes"
      rows={3}
      bind:value={store.data.summary.overallNotes}
    />
  </Field>
  <Field label="Action plan" inputId="summary-actionPlan">
    <TextAreaInput
      id="summary-actionPlan"
      label="Action plan"
      rows={3}
      placeholder="What will be done about the needs-attention checkpoints, by when, and by whom"
      bind:value={store.data.summary.actionPlan}
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
  .needs-attention-list {
    background: var(--color-danger-bg);
    border: 1px solid var(--color-danger);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    margin: 0 0 1rem;
  }
  .needs-attention-list h3 {
    font-weight: 600;
    margin: 0 0 0.5rem;
    font-size: 0.9375rem;
    color: var(--color-danger);
  }
  .needs-attention-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .needs-attention-list li {
    font-size: 0.875rem;
    margin: 0.375rem 0;
  }
  .needs-attention-list code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    color: var(--color-muted);
    margin-right: 0.375rem;
  }
  .section-title { font-weight: 600; }
  .remarks { color: var(--color-muted); font-style: italic; margin-left: 0.375rem; }
</style>
