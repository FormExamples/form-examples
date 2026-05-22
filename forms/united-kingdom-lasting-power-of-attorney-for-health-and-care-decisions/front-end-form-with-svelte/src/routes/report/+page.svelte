<script lang="ts">
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const app = $derived(lpaStore.application);
  const v = $derived(lpaStore.validity);
</script>

<section class="rounded-lg bg-white p-6 shadow-sm">
  <header class="mb-6 border-b border-slate-200 pb-4">
    <h2 class="text-2xl font-bold text-slate-900">LP1H Report Preview</h2>
    <p class="text-sm text-slate-600">
      Lasting Power of Attorney for Health and Welfare — Mental Capacity Act 2005
    </p>
    <div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <span
        class="rounded px-2 py-0.5 font-medium {v.validityStatus === 'ready-to-register'
          ? 'bg-green-100 text-green-800'
          : v.validityStatus === 'needs-correction'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-red-100 text-red-800'}"
      >
        {v.validityStatus || 'unknown'}
      </span>
      <span class="text-slate-600">{v.completenessScore}% complete</span>
      <span class="text-slate-500">Engine v{v.engineVersion}</span>
    </div>
  </header>

  <div class="grid gap-6 sm:grid-cols-2">
    <div>
      <h3 class="text-sm font-semibold text-slate-700">Donor (s.1)</h3>
      <p class="text-slate-900">{app.donor.title} {app.donor.givenNames} {app.donor.familyName}</p>
      <p class="text-xs text-slate-600">
        DOB {app.donor.birthDate || '—'} · {app.donor.jurisdiction || 'jurisdiction not set'}
      </p>
      <p class="text-xs text-slate-600">{app.donor.postalAddressAsFullText}</p>
    </div>
    <div>
      <h3 class="text-sm font-semibold text-slate-700">Certificate provider (s.10)</h3>
      {#if app.certificateProvider}
        <p class="text-slate-900">
          {app.certificateProvider.givenNames} {app.certificateProvider.familyName}
        </p>
        <p class="text-xs text-slate-600">
          {app.certificateProvider.route || '—'}
          {#if app.certificateProvider.route === 'skill-based'}
            · {app.certificateProvider.profession}
          {/if}
        </p>
      {:else}
        <p class="text-xs text-slate-500">Not yet nominated.</p>
      {/if}
    </div>
  </div>

  <div class="mt-6">
    <h3 class="text-sm font-semibold text-slate-700">Attorneys (s.2)</h3>
    {#if app.attorneys.length === 0}
      <p class="text-xs text-slate-500">None named.</p>
    {:else}
      <ol class="mt-1 list-decimal pl-5 text-slate-900">
        {#each app.attorneys as a, i (i)}
          <li>
            {a.givenNames} {a.familyName} · DOB {a.birthDate || '—'} · {a.relationshipToDonor || '—'}
          </li>
        {/each}
      </ol>
    {/if}
    <p class="mt-1 text-xs text-slate-600">Decision rule: {app.decisionRule || '—'}</p>
  </div>

  <div class="mt-6 grid gap-6 sm:grid-cols-2">
    <div>
      <h3 class="text-sm font-semibold text-slate-700">Life-sustaining treatment (s.5)</h3>
      <p class="text-slate-900">{app.lstChoice || '—'}</p>
      <p class="text-xs text-slate-600">
        Donor initialled: {app.lstDonorInitialled || '—'}
      </p>
    </div>
    <div>
      <h3 class="text-sm font-semibold text-slate-700">Registration (Part C)</h3>
      <p class="text-slate-900">{app.registration.applicantRole || '—'}</p>
      <p class="text-xs text-slate-600">
        Fee £{app.registration.feeAmountPounds.toFixed(2)} ({app.registration.feeRemission || 'none'})
      </p>
    </div>
  </div>

  {#if app.preferences.length > 0}
    <div class="mt-6">
      <h3 class="text-sm font-semibold text-slate-700">Preferences (s.7 — non-binding)</h3>
      <ul class="mt-1 list-disc pl-5 text-slate-900">
        {#each app.preferences as p, i (i)}
          <li><span class="text-xs uppercase tracking-wide text-slate-500">[{p.category || 'other'}]</span> {p.statement}</li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if app.instructions.length > 0}
    <div class="mt-6">
      <h3 class="text-sm font-semibold text-slate-700">Instructions (s.7 — binding)</h3>
      <ul class="mt-1 list-disc pl-5 text-slate-900">
        {#each app.instructions as ins, i (i)}
          <li><span class="text-xs uppercase tracking-wide text-slate-500">[{ins.category || 'other'}]</span> {ins.statement}</li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if v.firedRules.length > 0}
    <div class="mt-6 rounded border border-amber-200 bg-amber-50 p-4">
      <h3 class="text-sm font-semibold text-amber-900">Fired rules</h3>
      <ul class="mt-2 space-y-1 text-sm text-slate-700">
        {#each v.firedRules as r (r.ruleId)}
          <li>
            <span class="rounded bg-white px-1 font-mono text-xs text-slate-700">{r.severity}</span>
            <span class="font-mono text-xs text-slate-500">{r.ruleId}</span>
            — {r.description}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="mt-8 flex gap-3">
    <a
      href="/report/pdf"
      class="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
    >
      Download PDF
    </a>
    <a
      href="/lpa/14"
      class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      Back to summary
    </a>
  </div>
</section>
