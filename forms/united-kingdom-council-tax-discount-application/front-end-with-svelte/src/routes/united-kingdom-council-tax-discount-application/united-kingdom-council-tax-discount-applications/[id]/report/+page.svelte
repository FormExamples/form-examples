<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    eligibilityClassLabel,
    eligibilityClassColor,
    priorityLabel,
    priorityColor,
    claimTypeLabel,
    occupantStatusLabel,
    indicativeOutcomeLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-kingdom-council-tax-discount-application/united-kingdom-council-tax-discount-applications/${id}`
      );
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(
        `/united-kingdom-council-tax-discount-applications/${id}/report/pdf`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: assessment.data, result: assessment.result })
        }
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `council-tax-${data.claim.accountReference || id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        pdfError = 'Failed to generate PDF. Please try again.';
      }
    } catch {
      pdfError = 'Failed to generate PDF. Please check your connection and try again.';
    }
  }
</script>

{#if result}
  <header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
      <h1 class="text-lg font-bold text-base-content">Council Tax eligibility report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(
              `/united-kingdom-council-tax-discount-application/united-kingdom-council-tax-discount-applications/${id}`
            )}>Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <!-- Classification banner -->
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Eligibility: {eligibilityClassLabel(result.eligibilityClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {eligibilityClassColor(
            result.eligibilityClass
          )}"
        >
          {eligibilityClassLabel(result.eligibilityClass)}
        </span>
        <span class="text-sm text-base-content/70">
          Counted adults: {result.countedAdults}
        </span>
        <span class="text-sm text-base-content/70">
          Indicative outcome: {indicativeOutcomeLabel(result.indicativeOutcome)}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      <p class="text-sm text-base-content/80">
        <strong>Eligibility is decided by the billing authority</strong>, not by this form. This
        result is a pre-check and not a decision, an award or a promise of any discount.
      </p>
      {#if result.eligibilityClass === 'likely-ineligible'}
        <p class="mt-2 text-sm text-base-content/80">
          On the answers given, this application is <strong>likely ineligible</strong> for the claim chosen.
        </p>
      {:else if result.eligibilityClass === 'incomplete'}
        <p class="mt-2 text-sm text-base-content/80">
          The application is <strong>incomplete</strong>. Provide the outstanding items before
          sending it to the billing authority.
        </p>
      {:else}
        <p class="mt-2 text-sm text-base-content/80">
          The application looks <strong>likely eligible</strong>: it is complete and nothing
          disqualifies it. Send it with your evidence to the billing authority.
        </p>
      {/if}
      {#if result.reasons.length > 0}
        <ul class="mt-2 list-disc pl-6 text-sm text-base-content/80">
          {#each result.reasons as reason (reason)}
            <li>{reason}</li>
          {/each}
        </ul>
      {/if}
    </div>

    <!-- Household roster -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Household roster</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-base-300 text-left text-base-content/70">
            <th class="pb-2 pr-4">Person</th>
            <th class="pb-2 pr-4">Name</th>
            <th class="pb-2 pr-4">Status</th>
            <th class="pb-2">Evidence held</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-base-200">
            <td class="py-2 pr-4">Applicant</td>
            <td class="py-2 pr-4">{data.applicant.name || '—'}</td>
            <td class="py-2 pr-4"
              >{occupantStatusLabel(data.applicant.status || 'counted-adult')}</td
            >
            <td class="py-2">—</td>
          </tr>
          {#if data.household.othersLive !== 'no'}
            {#each data.household.occupants as occupant, index (index)}
              <tr class="border-b border-base-200">
                <td class="py-2 pr-4">Occupant {index + 1}</td>
                <td class="py-2 pr-4">{occupant.name || '—'}</td>
                <td class="py-2 pr-4">
                  {occupantStatusLabel(occupant.status || 'counted-adult')}
                </td>
                <td class="py-2">{yesNoLabel(occupant.evidenceHeld) || '—'}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Flagged issues -->
    {#if result.flaggedIssues.length > 0}
      <div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
        <h2 class="mb-4 text-lg font-bold text-error">
          Flagged issues ({result.flaggedIssues.length})
        </h2>
        <div class="space-y-2">
          {#each result.flaggedIssues as flag (flag.id)}
            <div
              class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}"
            >
              <span
                class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
                  flag.priority
                )}"
              >
                {priorityLabel(flag.priority)}
              </span>
              <div>
                <span class="font-medium">{flag.category}:</span>
                {flag.description} — {flag.suggestedAction}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Application summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Application summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Claim:</span>
          {claimTypeLabel(data.claim.claimType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Billing authority:</span>
          {data.claim.billingAuthority || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Account reference:</span>
          {data.claim.accountReference || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Effective from:</span>
          {data.claim.effectiveDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Property postcode:</span>
          {data.property.postcode || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Band:</span>
          {data.property.band || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Main home:</span>
          {yesNoLabel(data.property.mainResidence) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Duty to report changes (21 days):</span>
          {yesNoLabel(data.declaration.agreesToReportChanges) || 'N/A'}
        </div>
      </div>
      <p class="mt-4 text-sm text-base-content/70">
        Tell the council within 21 days of any change in your circumstances. False information can
        lead to a penalty and prosecution.
      </p>
    </div>
  </main>
{/if}
