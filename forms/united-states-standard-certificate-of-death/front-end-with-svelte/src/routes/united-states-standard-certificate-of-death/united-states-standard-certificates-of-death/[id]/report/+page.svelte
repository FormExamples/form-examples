<script lang="ts">
  import { renderPdf } from '#lib/report/pdf-client.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    validityClassLabel,
    validityClassColor,
    priorityLabel,
    priorityColor,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { optionLabel } from '#lib/engine/options.js';
  import { stateRule } from '#lib/engine/rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const rule = $derived(stateRule(assessment.data));

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-standard-certificate-of-death/united-states-standard-certificates-of-death/${id}`
      );
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await renderPdf({ data: assessment.data, result: assessment.result });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `death-certificate-${data.decedent.decedentName || id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">
        US Standard Certificate of Death validity report
      </h1>
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
              `/united-states-standard-certificate-of-death/united-states-standard-certificates-of-death/${id}`
            )}
        >
          Edit
        </Button>
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <!-- Classification banner -->
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Validity: {validityClassLabel(result.validityClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {validityClassColor(
            result.validityClass
          )}"
        >
          {validityClassLabel(result.validityClass)}
        </span>
        <span class="text-sm text-base-content/70">
          Medical examiner or coroner referral indicated: {result.referralIndicated ? 'Yes' : 'No'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.validityClass === 'refer-to-medical-examiner-or-coroner'}
        <p class="text-sm text-base-content/80">
          A medical examiner or coroner referral criterion is met, so this certificate is classified
          <strong>refer to medical examiner or coroner</strong>. The certifying physician should
          <strong>not</strong> complete the cause and manner of death until that office has accepted or
          declined the case. This is a documentation finding; the law of the state decides who certifies.
        </p>
      {:else if result.validityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The certificate is <strong>incomplete</strong>: a required item is blank or the only cause
          given is a mechanism of death. Complete the outstanding items before the certificate is
          filed with the registrar. This tool validates and classifies only; it does not diagnose
          and is not legal advice.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The certificate is <strong>valid</strong>: the required items are present, Part I line (a)
          states a disease or injury, no mechanism stands alone, and no referral criterion is met.
          The derived underlying cause is
          <strong>{result.underlyingCause || 'not derived'}</strong>. The registering state agency
          decides whether to accept the certificate.
        </p>
      {/if}
    </div>

    <!-- Underlying cause -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Derived underlying cause</h2>
      <p class="text-sm text-base-content/80">
        {result.underlyingCause || 'Not derived (Part I is empty).'}
      </p>
    </div>

    <!-- Part I sequence -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Part I: cause of death chain</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-base-300 text-left text-base-content/70">
            <th class="pb-2 pr-4">Line</th>
            <th class="pb-2 pr-4">Condition</th>
            <th class="pb-2">Interval</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-base-200">
            <td class="py-2 pr-4">Line (a)</td>
            <td class="py-2 pr-4">{data.partI.causeIaCondition || '—'}</td>
            <td class="py-2">{data.partI.causeIaInterval || '—'}</td>
          </tr>
          <tr class="border-b border-base-200">
            <td class="py-2 pr-4">Line (b)</td>
            <td class="py-2 pr-4">{data.partI.causeIbCondition || '—'}</td>
            <td class="py-2">{data.partI.causeIbInterval || '—'}</td>
          </tr>
          <tr class="border-b border-base-200">
            <td class="py-2 pr-4">Line (c)</td>
            <td class="py-2 pr-4">{data.partI.causeIcCondition || '—'}</td>
            <td class="py-2">{data.partI.causeIcInterval || '—'}</td>
          </tr>
          <tr class="border-b border-base-200">
            <td class="py-2 pr-4">Line (d)</td>
            <td class="py-2 pr-4">{data.partI.causeIdCondition || '—'}</td>
            <td class="py-2">{data.partI.causeIdInterval || '—'}</td>
          </tr>
        </tbody>
      </table>
      {#if data.partII.partIiConditions}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">
            Part II (other significant conditions):
          </span>
          {data.partII.partIiConditions}
        </div>
      {/if}
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

    <!-- Certificate summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Certificate summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Decedent:</span>
          {data.decedent.decedentName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">State of registration:</span>
          {rule.name}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Sex:</span>
          {optionLabel('sex', data.decedent.sex) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Age at death:</span>
          {data.decedent.ageYears != null ? `${data.decedent.ageYears} years` : 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of death:</span>
          {data.death.dateOfDeath || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Place of death:</span>
          {optionLabel('placeOfDeathType', data.death.placeOfDeathType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Certifier:</span>
          {data.certifier.certifierName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Certifier type:</span>
          {optionLabel('certifierType', data.certifier.certifierType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Manner of death:</span>
          {optionLabel('manner', data.manner.mannerOfDeath) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Tobacco use contributed:</span>
          {optionLabel('tobacco', data.manner.tobaccoUseContributed) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Pregnancy:</span>
          {optionLabel('pregnancy', data.manner.pregnancyStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Autopsy performed:</span>
          {yesNoLabel(data.partII.autopsyPerformed) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">
            Referred to medical examiner or coroner:
          </span>
          {yesNoLabel(data.referral.referredToMedicalExaminer) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Referral reason:</span>
          {optionLabel('referralReason', data.referral.referralReason) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Funeral director:</span>
          {data.funeral.funeralDirectorName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Method of disposition:</span>
          {optionLabel('dispositionMethod', data.funeral.dispositionMethod) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Certified copies:</span>
          {data.copies.certifiedCopiesRequested ?? 'N/A'}
        </div>
      </div>
      {#if data.referral.certifierNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Certifier note:</span>
          <p class="mt-1 text-base-content/80">{data.referral.certifierNote}</p>
        </div>
      {/if}
    </div>
  </main>
{/if}
