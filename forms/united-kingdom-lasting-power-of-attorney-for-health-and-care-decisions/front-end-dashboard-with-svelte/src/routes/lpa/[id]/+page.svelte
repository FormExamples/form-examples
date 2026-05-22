<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { fetchLpa } from '$lib/api/lpa.js';
  import type { LpaRow } from '$lib/data/sample.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  let row = $state<LpaRow | undefined>(undefined);

  onMount(async () => {
    row = await fetchLpa(page.params.id ?? '');
  });
</script>

<a href="/" class="text-sm text-brand-700 hover:underline">← Back to dashboard</a>

{#if row}
  <article class="mt-4 space-y-6">
    <header class="flex flex-wrap items-baseline gap-3 border-b border-slate-200 pb-4">
      <h2 class="font-mono text-lg text-slate-900">{row.id}</h2>
      <span class="text-slate-700">{row.donorMaskedName}</span>
      <StatusBadge status={row.validityStatus} />
      <span class="ml-auto text-xs text-slate-500">
        Updated {row.updatedAt.slice(0, 10)}
      </span>
    </header>

    <dl class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      <dt class="text-slate-600">Jurisdiction</dt>
      <dd class="capitalize">{row.jurisdiction}</dd>
      <dt class="text-slate-600">Donor birth year</dt>
      <dd>{row.donorBirthYear}</dd>
      <dt class="text-slate-600">Attorneys</dt>
      <dd>{row.attorneyCount} (with {row.replacementAttorneyCount} replacement{row.replacementAttorneyCount === 1 ? '' : 's'})</dd>
      <dt class="text-slate-600">Decision rule</dt>
      <dd>{row.decisionRule}</dd>
      <dt class="text-slate-600">Life-sustaining treatment</dt>
      <dd>{row.lstChoice || 'not chosen'}</dd>
      <dt class="text-slate-600">Completeness</dt>
      <dd>{row.completenessScore}%</dd>
      <dt class="text-slate-600">Registration stage</dt>
      <dd>{row.registrationStage}</dd>
      <dt class="text-slate-600">Fatal rule count</dt>
      <dd>{row.fatalRuleCount}</dd>
    </dl>

    {#if row.firedRules.length > 0}
      <section>
        <h3 class="mb-2 text-sm font-semibold text-slate-700">Fired rules</h3>
        <ul class="space-y-2 text-sm">
          {#each row.firedRules as r (r.ruleId)}
            <li class="rounded border-l-4 p-3 {r.severity === 'fatal' ? 'border-red-500 bg-red-50' : r.severity === 'high' ? 'border-amber-500 bg-amber-50' : 'border-slate-300 bg-slate-50'}">
              <div class="flex items-baseline gap-2">
                <span class="rounded bg-white px-1 font-mono text-xs">{r.severity}</span>
                <span class="font-mono text-xs text-slate-700">{r.ruleId}</span>
              </div>
              <p class="mt-1 text-slate-800">{r.description}</p>
            </li>
          {/each}
        </ul>
      </section>
    {:else}
      <p class="text-sm text-slate-500">No rules fired against the latest validity computation.</p>
    {/if}
  </article>
{:else}
  <p class="mt-4 text-sm text-slate-500">Loading…</p>
{/if}
