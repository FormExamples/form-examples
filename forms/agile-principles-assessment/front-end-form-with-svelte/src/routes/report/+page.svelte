<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/assessment.svelte.js';
  import { PRINCIPLES } from '$lib/config/principles.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import { buildPdf } from '$lib/report/pdf-builder.js';

  const r = $derived(store.result);
  const d = $derived(store.data);

  function downloadPdf() {
    buildPdf(d, r);
  }
</script>

<section class="bg-white p-6 rounded-lg shadow-sm">
  <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
    <h2 class="text-xl font-semibold">Assessment report</h2>
    <div class="flex gap-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-sm"
        onclick={() => goto('/')}
      >
        Back to form
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded bg-brand-600 text-white hover:bg-brand-700 text-sm"
        onclick={downloadPdf}
      >
        Download PDF
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
    <p>
      <strong>Respondent:</strong>
      {d.respondent.isAnonymous ? 'Anonymous' : (d.respondent.fullName || '—')}
    </p>
    <p>
      <strong>Role:</strong>
      {d.respondent.isAnonymous ? '—' : (d.respondent.role || '—')}
    </p>
    <p><strong>Team:</strong> {d.respondent.teamName || '—'}</p>
    <p><strong>Organisation:</strong> {d.respondent.organisationName || '—'}</p>
    <p><strong>Date:</strong> {d.respondent.assessmentDate || '—'}</p>
    <p><strong>Cadence:</strong> {d.respondent.assessmentPeriod || '—'}</p>
  </div>

  <div class="bg-slate-100 p-4 rounded mb-4">
    <p>
      <strong>Unweighted mean:</strong>
      {r.meanScore !== null ? r.meanScore.toFixed(2) : '— (insufficient data)'}
      ({r.answeredCount} / 12 answered)
    </p>
    {#if r.weightsCustomised}
      <p>
        <strong>Weighted mean:</strong>
        {r.weightedMeanScore !== null ? r.weightedMeanScore.toFixed(2) : '— (insufficient data)'}
      </p>
    {/if}
    <p>
      <strong>Composite maturity:</strong>
      {r.maturity.toUpperCase()}{r.weightsCustomised ? ' (weighted)' : ''}
    </p>
  </div>

  <FlagBanner flags={r.additionalFlags} maturity={r.maturity} />

  <h3 class="font-semibold mt-4 mb-2">Per-principle scores</h3>
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="bg-slate-100 text-left">
        <th class="p-2 border border-slate-200">#</th>
        <th class="p-2 border border-slate-200">Principle</th>
        <th class="p-2 border border-slate-200">Score</th>
        <th class="p-2 border border-slate-200">Band</th>
        <th class="p-2 border border-slate-200">Comment</th>
      </tr>
    </thead>
    <tbody>
      {#each PRINCIPLES as p (p.number)}
        {@const resp = d.responses[p.number - 1]}
        {@const band = r.perPrincipleBands[p.number - 1]}
        <tr>
          <td class="p-2 border border-slate-200">P{p.number}</td>
          <td class="p-2 border border-slate-200">{p.shortTitle}</td>
          <td class="p-2 border border-slate-200">{resp.score ?? '—'}</td>
          <td class="p-2 border border-slate-200 uppercase">{band}</td>
          <td class="p-2 border border-slate-200">{resp.comment || '—'}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if d.actionPlan.topAction1 || d.actionPlan.topAction2 || d.actionPlan.topAction3}
    <h3 class="font-semibold mt-4 mb-2">Top three actions</h3>
    <ol class="list-decimal list-inside text-sm space-y-1">
      {#if d.actionPlan.topAction1}<li>{d.actionPlan.topAction1}</li>{/if}
      {#if d.actionPlan.topAction2}<li>{d.actionPlan.topAction2}</li>{/if}
      {#if d.actionPlan.topAction3}<li>{d.actionPlan.topAction3}</li>{/if}
    </ol>
  {/if}

  {#if d.actionPlan.coachNotes}
    <h3 class="font-semibold mt-4 mb-2">Coach notes</h3>
    <p class="text-sm whitespace-pre-line">{d.actionPlan.coachNotes}</p>
  {/if}

  {#if d.actionPlan.overallNotes}
    <h3 class="font-semibold mt-4 mb-2">Overall notes</h3>
    <p class="text-sm whitespace-pre-line">{d.actionPlan.overallNotes}</p>
  {/if}
</section>
