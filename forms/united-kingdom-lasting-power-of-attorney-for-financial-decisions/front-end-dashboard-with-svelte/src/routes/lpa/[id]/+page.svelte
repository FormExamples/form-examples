<script lang="ts">
  import { page } from '$app/state';
  import { fetchLpa } from '$lib/api.js';
  import type {
    AdditionalFlag,
    FiredRule,
    Lpa,
    Person,
  } from '$lib/types.js';

  let lpa = $state<Lpa | undefined>(undefined);
  let loading = $state(true);
  let id = $derived(page.params.id ?? '');

  $effect(() => {
    loading = true;
    void fetchLpa(id).then((result) => {
      lpa = result;
      loading = false;
    });
  });

  function fullName(p: Person): string {
    return [p.title, p.firstNames, p.lastName, p.otherNames]
      .filter((s) => s && s.length > 0)
      .join(' ')
      .trim();
  }

  function formatAddress(p: Person): string {
    const a = p.address;
    return [a.addressLine1, a.addressLine2, a.addressLine3, a.postcode]
      .filter((s) => s && s.length > 0)
      .join(', ');
  }

  function riskBadgeClass(risk: string): string {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-900 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  }

  function priorityBadgeClass(p: string): string {
    return riskBadgeClass(p);
  }

  function statusLabel(s: string): string {
    return s ? s.replace(/_/g, ' ') : '—';
  }

  function decisionModeLabel(mode: string): string {
    switch (mode) {
      case 'single_attorney':
        return 'Single attorney';
      case 'jointly_and_severally':
        return 'Jointly and severally';
      case 'jointly':
        return 'Jointly';
      case 'mixed':
        return 'Mixed (some decisions joint, some several)';
      default:
        return '—';
    }
  }

  function whenLabel(w: string): string {
    switch (w) {
      case 'as_soon_as_registered':
        return 'As soon as registered';
      case 'only_when_no_capacity':
        return 'Only when the donor lacks capacity';
      default:
        return '—';
    }
  }
</script>

<p class="mb-3 text-sm">
  <a class="text-brand-600 underline" href="/">&larr; back to dashboard</a>
</p>

{#if loading}
  <p class="text-sm text-slate-500">Loading…</p>
{:else if !lpa}
  <p class="text-sm text-red-600">LPA <code>{id}</code> not found.</p>
{:else}
  <article class="space-y-6">
    <header class="flex flex-wrap items-baseline gap-3">
      <h2 class="text-xl font-bold">{fullName(lpa.donor) || '(unnamed donor)'}</h2>
      <span class="text-sm text-slate-500">{lpa.id}</span>
      <span class="px-2 py-0.5 text-xs rounded border {riskBadgeClass(lpa.validation.compositeRisk)}">
        risk: {lpa.validation.compositeRisk}
      </span>
      <span class="px-2 py-0.5 text-xs rounded border border-slate-300 bg-slate-100">
        validity: {statusLabel(lpa.validation.validityBand)}
      </span>
      <span class="px-2 py-0.5 text-xs rounded border border-slate-300 bg-slate-100">
        OPG: {statusLabel(lpa.status)}
      </span>
    </header>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Donor (section 1)
      </h3>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div><dt class="text-slate-500">Name</dt><dd>{fullName(lpa.donor) || '—'}</dd></div>
        <div><dt class="text-slate-500">Date of birth</dt><dd>{lpa.donor.dateOfBirth || '—'}</dd></div>
        <div class="md:col-span-2"><dt class="text-slate-500">Address</dt><dd>{formatAddress(lpa.donor) || '—'}</dd></div>
        <div><dt class="text-slate-500">Email</dt><dd>{lpa.donor.email || '—'}</dd></div>
        <div><dt class="text-slate-500">Phone</dt><dd>{lpa.donor.phone || '—'}</dd></div>
      </dl>
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Attorneys (section 2)
      </h3>
      {#if lpa.attorneys.length === 0}
        <p class="text-sm text-slate-500">No attorneys recorded.</p>
      {:else}
        <ol class="space-y-2 list-decimal pl-5 text-sm">
          {#each lpa.attorneys as a (a.person.id)}
            <li>
              <strong>{fullName(a.person)}</strong>
              <span class="text-slate-500">— DOB {a.person.dateOfBirth || '—'}</span>
              <div class="text-slate-600">{formatAddress(a.person)}</div>
              {#if a.person.email}<div class="text-slate-600">{a.person.email}</div>{/if}
              {#if a.person.isTrustCorporation}
                <div class="text-xs text-slate-500">Trust corporation #{a.person.trustCorporationNumber}</div>
              {/if}
            </li>
          {/each}
        </ol>
      {/if}
    </section>

    <section class="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
          Decision mode (section 3)
        </h3>
        <p>{decisionModeLabel(lpa.decisionMode)}</p>
        {#if lpa.decisionModeMixedText}
          <p class="mt-2 text-slate-600">{lpa.decisionModeMixedText}</p>
        {/if}
      </div>
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
          When attorneys can act (section 5)
        </h3>
        <p>{whenLabel(lpa.whenAttorneysCanAct)}</p>
      </div>
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Replacement attorneys (section 4)
      </h3>
      {#if lpa.replacementAttorneys.length === 0}
        <p class="text-sm text-slate-500">None.</p>
      {:else}
        <ol class="space-y-2 list-decimal pl-5 text-sm">
          {#each lpa.replacementAttorneys as r (r.person.id)}
            <li>
              <strong>{fullName(r.person)}</strong>
              <span class="text-slate-500">— DOB {r.person.dateOfBirth || '—'}</span>
              <div class="text-slate-600">{formatAddress(r.person)}</div>
              {#if r.replacementStepInCondition}
                <div class="text-xs text-slate-500">Step-in: {r.replacementStepInCondition}</div>
              {/if}
            </li>
          {/each}
        </ol>
      {/if}
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Certificate provider (section 10)
      </h3>
      {#if !lpa.certificateProvider}
        <p class="text-sm text-slate-500">Not yet recorded.</p>
      {:else}
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><dt class="text-slate-500">Name</dt><dd>{fullName(lpa.certificateProvider.person)}</dd></div>
          <div><dt class="text-slate-500">Knows donor as</dt><dd>{lpa.certificateProvider.knowsDonorAs || '—'}</dd></div>
          <div class="md:col-span-2"><dt class="text-slate-500">Address</dt><dd>{formatAddress(lpa.certificateProvider.person)}</dd></div>
        </dl>
      {/if}
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        People to notify (section 6)
      </h3>
      {#if lpa.peopleToNotify.length === 0}
        <p class="text-sm text-slate-500">None.</p>
      {:else}
        <ul class="space-y-1 text-sm list-disc pl-5">
          {#each lpa.peopleToNotify as p (p.person.id)}
            <li>
              <strong>{fullName(p.person)}</strong>
              <span class="text-slate-500"> — {formatAddress(p.person)}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
          Preferences (section 7)
        </h3>
        <p class="whitespace-pre-wrap">{lpa.preferencesText || '—'}</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
          Instructions (section 7)
        </h3>
        <p class="whitespace-pre-wrap">{lpa.instructionsText || '—'}</p>
      </div>
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Registration (sections 12–15)
      </h3>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div><dt class="text-slate-500">Applicant kind</dt><dd>{lpa.registrationApplication.applicantKind || '—'}</dd></div>
        <div><dt class="text-slate-500">Payment method</dt><dd>{lpa.registrationApplication.paymentMethod || '—'}</dd></div>
        <div><dt class="text-slate-500">Reduced fee</dt><dd>{lpa.registrationApplication.reducedFeeRequested ? 'yes' : 'no'}</dd></div>
        <div><dt class="text-slate-500">LPA120A evidence</dt><dd>{lpa.registrationApplication.hasLpa120aEvidence ? 'yes' : 'no'}</dd></div>
        <div><dt class="text-slate-500">OPG reference</dt><dd>{lpa.opgReferenceNumber || '—'}</dd></div>
        <div><dt class="text-slate-500">OPG registered on</dt><dd>{lpa.opgRegistrationDate || '—'}</dd></div>
      </dl>
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Fired rules (statutory blockers)
      </h3>
      {#if lpa.validation.firedRules.length === 0}
        <p class="text-sm text-green-700">No statutory blockers fired.</p>
      {:else}
        <ul class="space-y-2">
          {#each lpa.validation.firedRules as r (r.ruleId)}
            {@const rule = r as FiredRule}
            <li class="border rounded p-2">
              <div class="flex gap-2 items-center mb-1">
                <span class="px-2 py-0.5 text-xs rounded border {priorityBadgeClass(rule.priority)}">
                  {rule.priority}
                </span>
                <strong class="text-sm">{rule.ruleId}</strong>
                <span class="text-xs text-slate-500">{rule.citation}</span>
              </div>
              <p class="text-sm">{rule.message}</p>
              <p class="text-xs text-slate-500 mt-1">Remediation: {rule.remediation}</p>
              <p class="text-xs text-slate-400">at <code>{rule.fieldPath}</code></p>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Additional flags (non-blocking warnings)
      </h3>
      {#if lpa.validation.additionalFlags.length === 0}
        <p class="text-sm text-slate-500">No flags.</p>
      {:else}
        <ul class="space-y-2">
          {#each lpa.validation.additionalFlags as f (f.ruleId)}
            {@const flag = f as AdditionalFlag}
            <li class="border rounded p-2">
              <div class="flex gap-2 items-center mb-1">
                <span class="px-2 py-0.5 text-xs rounded border {priorityBadgeClass(flag.priority)}">
                  {flag.priority}
                </span>
                <strong class="text-sm">{flag.ruleId}</strong>
                <span class="text-xs text-slate-500">{flag.citation}</span>
              </div>
              <p class="text-sm">{flag.message}</p>
              <p class="text-xs text-slate-500 mt-1">Remediation: {flag.remediation}</p>
              <p class="text-xs text-slate-400">at <code>{flag.fieldPath}</code></p>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Signatures (sections 9, 10, 11, 15)
      </h3>
      {#if lpa.signatures.length === 0}
        <p class="text-sm text-slate-500">No signatures recorded.</p>
      {:else}
        <ul class="space-y-1 text-sm">
          {#each lpa.signatures as s (s.id)}
            <li>
              <span class="font-medium">{s.role.replace(/_/g, ' ')}</span>
              — section {s.lp1fSection ?? '—'}, signed {s.signedOn || '—'}
              {#if s.isWitnessed && s.witness}
                <span class="text-slate-500">
                  (witness {fullName(s.witness.person)}, {s.witness.witnessedOn || '—'})
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  </article>
{/if}
