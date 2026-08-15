<script lang="ts">
  import { store } from '#lib/stores/checklist.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import FlagBanner from '../ui/FlagBanner.svelte';

  const r = $derived(store.result);

  function bandClass(b: string): string {
    if (b === 'high') return 'band-high';
    if (b === 'mid') return 'band-mid';
    if (b === 'low') return 'band-low';
    return 'band-unanswered';
  }

  function pctOrDash(p: number | null): string {
    return p === null ? '—' : `${p.toFixed(0)}%`;
  }
</script>

<Fieldset legend="Step 5 — Summary, maturity &amp; action plan">
  <div class="summary-box">
    <p><strong>Items answered:</strong> {r.answeredCount} / 57</p>
    <p>
      <strong>Overall:</strong>
      {r.overallPercent !== null
        ? `${r.overallPercent.toFixed(0)}% yes`
        : '— (insufficient data)'}
    </p>
    <p><strong>Composite maturity:</strong> {r.maturity.toUpperCase()}</p>
  </div>

  <FlagBanner flags={r.additionalFlags} maturity={r.maturity} />

  <div class="band-list">
    <h3>Per-section bands</h3>
    <ul>
      <li>
        <span>Teams ({r.teams.yesCount}/{r.teams.applicableCount} yes)</span>
        <span class={bandClass(r.teams.band)}>
          {pctOrDash(r.teams.percent)} · {r.teams.band.toUpperCase()}
        </span>
      </li>
      <li>
        <span>Stakeholders ({r.stakeholders.yesCount}/{r.stakeholders.applicableCount} yes)</span>
        <span class={bandClass(r.stakeholders.band)}>
          {pctOrDash(r.stakeholders.percent)} · {r.stakeholders.band.toUpperCase()}
        </span>
      </li>
      <li>
        <span>Practices ({r.practices.yesCount}/{r.practices.applicableCount} yes)</span>
        <span class={bandClass(r.practices.band)}>
          {pctOrDash(r.practices.percent)} · {r.practices.band.toUpperCase()}
        </span>
      </li>
    </ul>
  </div>

  {#if r.firedRules.length > 0}
    <details class="fired-rules">
      <summary>Fired coaching rules ({r.firedRules.length})</summary>
      <ul>
        {#each r.firedRules as f (f.ruleId)}
          <li>
            <code>{f.ruleId}</code>
            — {f.description || '(no coaching note)'}
          </li>
        {/each}
      </ul>
    </details>
  {/if}

  <Field label="Top action 1" inputId="action-1">
    <TextInput id="action-1" label="Top action 1" bind:value={store.data.actionPlan.topAction1} />
  </Field>
  <Field label="Top action 2" inputId="action-2">
    <TextInput id="action-2" label="Top action 2" bind:value={store.data.actionPlan.topAction2} />
  </Field>
  <Field label="Top action 3" inputId="action-3">
    <TextInput id="action-3" label="Top action 3" bind:value={store.data.actionPlan.topAction3} />
  </Field>
  <Field label="Coach notes" inputId="coach-notes">
    <TextAreaInput
      id="coach-notes"
      label="Coach notes"
      rows={3}
      bind:value={store.data.actionPlan.coachNotes}
    />
  </Field>
  <Field label="Overall notes" inputId="overall-notes">
    <TextAreaInput
      id="overall-notes"
      label="Overall notes"
      rows={3}
      bind:value={store.data.actionPlan.overallNotes}
    />
  </Field>

  <p class="signoff-note">
    The maturity result is intended to seed coaching conversations and
    retrospective items. It is a self-report; cross-team aggregation should
    be done before drawing organisation-wide conclusions.
  </p>
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
  .band-list {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    margin: 0 0 1rem;
  }
  .band-list h3 { font-weight: 600; margin: 0 0 0.5rem; font-size: 0.9375rem; }
  .band-list ul { list-style: none; padding: 0; margin: 0; }
  .band-list li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 0.25rem 0;
    font-size: 0.875rem;
  }
  .band-high { color: var(--color-success); font-weight: 600; }
  .band-mid { color: var(--color-warning); font-weight: 600; }
  .band-low { color: var(--color-danger); font-weight: 600; }
  .band-unanswered { color: var(--color-muted); font-weight: 600; }
  .fired-rules { margin: 0 0 1rem; }
  .fired-rules summary { cursor: pointer; font-weight: 500; font-size: 0.875rem; }
  .fired-rules ul { margin: 0.5rem 0 0 1.25rem; padding: 0; font-size: 0.875rem; }
  .fired-rules code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .signoff-note { font-size: 0.875rem; color: var(--color-muted); margin-top: 1rem; }
</style>
