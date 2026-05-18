<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import FlagBanner from '../ui/FlagBanner.svelte';

  const r = $derived(store.result);

  function bandClass(b: string): string {
    if (b === 'high') return 'text-emerald-700';
    if (b === 'mid') return 'text-yellow-700';
    if (b === 'low') return 'text-red-700';
    return 'text-slate-400';
  }

  function pctOrDash(p: number | null): string {
    return p === null ? '—' : `${p.toFixed(0)}%`;
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 5 — Summary, maturity &amp; action plan</h2>

  <div class="bg-slate-100 p-4 rounded mb-4">
    <p><strong>Items answered:</strong> {r.answeredCount} / 57</p>
    <p>
      <strong>Overall:</strong>
      {r.overallPercent !== null ? `${r.overallPercent.toFixed(0)}% yes` : '— (insufficient data)'}
    </p>
    <p><strong>Composite maturity:</strong> {r.maturity.toUpperCase()}</p>
  </div>

  <FlagBanner flags={r.additionalFlags} maturity={r.maturity} />

  <div class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Per-section bands</h3>
    <ul class="text-sm space-y-1">
      <li class="flex justify-between gap-4">
        <span>Teams ({r.teams.yesCount}/{r.teams.applicableCount} yes)</span>
        <span class="{bandClass(r.teams.band)} font-medium">
          {pctOrDash(r.teams.percent)} · {r.teams.band.toUpperCase()}
        </span>
      </li>
      <li class="flex justify-between gap-4">
        <span>Stakeholders ({r.stakeholders.yesCount}/{r.stakeholders.applicableCount} yes)</span>
        <span class="{bandClass(r.stakeholders.band)} font-medium">
          {pctOrDash(r.stakeholders.percent)} · {r.stakeholders.band.toUpperCase()}
        </span>
      </li>
      <li class="flex justify-between gap-4">
        <span>Practices ({r.practices.yesCount}/{r.practices.applicableCount} yes)</span>
        <span class="{bandClass(r.practices.band)} font-medium">
          {pctOrDash(r.practices.percent)} · {r.practices.band.toUpperCase()}
        </span>
      </li>
    </ul>
  </div>

  {#if r.firedRules.length > 0}
    <details class="mb-4">
      <summary class="cursor-pointer text-sm font-medium">
        Fired coaching rules ({r.firedRules.length})
      </summary>
      <ul class="list-disc list-inside text-sm mt-2 space-y-1">
        {#each r.firedRules as f (f.ruleId)}
          <li>
            <code class="text-xs">{f.ruleId}</code>
            — {f.description || '(no coaching note)'}
          </li>
        {/each}
      </ul>
    </details>
  {/if}

  <div class="grid grid-cols-1 gap-3 mb-4">
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Top action 1</span>
      <input
        type="text"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.topAction1}
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Top action 2</span>
      <input
        type="text"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.topAction2}
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Top action 3</span>
      <input
        type="text"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.topAction3}
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Coach notes</span>
      <textarea
        rows="3"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.coachNotes}
      ></textarea>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Overall notes</span>
      <textarea
        rows="3"
        class="w-full border border-slate-300 rounded px-2 py-1"
        bind:value={store.data.actionPlan.overallNotes}
      ></textarea>
    </label>
  </div>

  <p class="text-sm text-slate-600">
    The maturity result is intended to seed coaching conversations and
    retrospective items. It is a self-report; cross-team aggregation should
    be done before drawing organisation-wide conclusions.
  </p>
</section>
