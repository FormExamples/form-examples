<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { PRINCIPLES } from '#lib/config/principles.js';
  import FlagBanner from '#lib/components/ui/FlagBanner.svelte';

  const r = $derived(store.result);

  function bandClass(b: string): string {
    if (b === 'high') return 'text-success';
    if (b === 'mid') return 'text-warning';
    if (b === 'low') return 'text-error';
    return 'text-base-content/40';
  }

  function bandLabel(b: string): string {
    if (b === 'unanswered') return '—';
    return b.toUpperCase();
  }

  function resetWeights() {
    for (const resp of store.data.responses) resp.weight = 1.0;
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 14 — Summary, maturity &amp; action plan</h2>

  <div class="bg-base-200 p-4 rounded mb-4">
    <p><strong>Principles answered:</strong> {r.answeredCount} / 12</p>
    <p>
      <strong>Unweighted mean:</strong>
      {r.meanScore !== null ? r.meanScore.toFixed(2) : '— (insufficient data)'}
    </p>
    {#if r.weightsCustomised}
      <p>
        <strong>Weighted mean:</strong>
        {r.weightedMeanScore !== null ? r.weightedMeanScore.toFixed(2) : '— (insufficient data)'}
      </p>
    {/if}
    <p><strong>Composite maturity:</strong> {r.maturity.toUpperCase()}{r.weightsCustomised ? ' (weighted)' : ''}</p>
  </div>

  <FlagBanner flags={r.additionalFlags} maturity={r.maturity} />

  <div class="bg-base-100 border border-base-300 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Per-principle bands</h3>
    <ul class="text-sm space-y-1">
      {#each PRINCIPLES as p (p.number)}
        {@const band = r.perPrincipleBands[p.number - 1]}
        {@const score = store.data.responses[p.number - 1].score}
        <li class="flex justify-between gap-4">
          <span>P{p.number} — {p.shortTitle}</span>
          <span class="{bandClass(band)} font-medium">
            {score ?? '—'} · {bandLabel(band)}
          </span>
        </li>
      {/each}
    </ul>
  </div>

  <details class="mb-4 bg-base-100 border border-base-300 rounded p-4">
    <summary class="cursor-pointer text-sm font-medium">
      Customise weights
      {#if r.weightsCustomised}
        <span class="text-xs text-primary">(active)</span>
      {/if}
    </summary>
    <p class="text-xs text-base-content/70 mt-2">
      Weight each principle between <strong>0.5</strong> (half-weight) and
      <strong>2.0</strong> (double-weight). Default is <strong>1.0</strong>.
      Weights only affect the weighted mean and the composite maturity; the
      unweighted mean remains visible above.
    </p>
    <ul class="mt-3 space-y-2 text-sm">
      {#each PRINCIPLES as p (p.number)}
        <li class="flex items-center gap-3">
          <span class="flex-1">P{p.number} — {p.shortTitle}</span>
          <input
            type="number"
            min="0.5"
            max="2.0"
            step="0.1"
            class="w-20 border border-base-300 rounded px-2 py-1 text-right"
            bind:value={store.data.responses[p.number - 1].weight}
          />
        </li>
      {/each}
    </ul>
    <button
      type="button"
      class="mt-3 px-3 py-1 text-sm border border-base-300 rounded bg-base-100 hover:bg-base-200"
      onclick={resetWeights}
    >
      Reset all weights to 1.0
    </button>
  </details>

  {#if r.firedRules.length > 0}
    <details class="mb-4">
      <summary class="cursor-pointer text-sm font-medium">
        Fired coaching rules ({r.firedRules.length})
      </summary>
      <ul class="list-disc list-inside text-sm mt-2 space-y-1">
        {#each r.firedRules as f (f.ruleId)}
          <li>
            <code class="text-xs">{f.ruleId}</code>
            — P{f.principleNumber} {f.band.toUpperCase()}: {f.description || '(no coaching note)'}
          </li>
        {/each}
      </ul>
    </details>
  {/if}

  <div class="grid grid-cols-1 gap-3 mb-4">
    <label class="block">
      <span class="text-sm font-medium text-base-content/70">Top action 1</span>
      <input
        type="text"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.topAction1}
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-base-content/70">Top action 2</span>
      <input
        type="text"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.topAction2}
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-base-content/70">Top action 3</span>
      <input
        type="text"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.topAction3}
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-base-content/70">Coach notes</span>
      <textarea
        rows="3"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.coachNotes}
      ></textarea>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-base-content/70">Overall notes</span>
      <textarea
        rows="3"
        class="w-full border border-base-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.overallNotes}
      ></textarea>
    </label>
  </div>

  <p class="text-sm text-base-content/70">
    The maturity result is intended to seed coaching conversations and
    retrospective items. It is a self-report; cross-team aggregation should
    be done before drawing organisation-wide conclusions.
  </p>
</section>
