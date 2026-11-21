<script lang="ts">
  import { renderPdf } from '#lib/report/pdf-client.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    applicationClassLabel,
    applicationClassColor,
    priorityLabel,
    priorityColor,
    sexLabel,
    relationshipLabel,
    purposeLabel,
    certificateTypeLabel,
    deliveryMethodLabel,
    idTypeLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-birth-certificate-application/united-states-birth-certificate-applications/${id}`
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
        a.download = `birth-certificate-application-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Birth certificate application report</h1>
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
              `/united-states-birth-certificate-application/united-states-birth-certificate-applications/${id}`
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
        Class: {applicationClassLabel(result.applicationClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {applicationClassColor(
            result.applicationClass
          )}"
        >
          {applicationClassLabel(result.applicationClass)}
        </span>
        <span class="text-sm text-base-content/70">
          Expected fee: {result.expectedFeeUsd === null
            ? 'unknown (no verified state fee)'
            : `$${result.expectedFeeUsd.toFixed(2)}`}
        </span>
        <span class="text-sm text-base-content/70">
          Rule applied: {result.stateRuleApplied === 'state' ? 'state rule' : 'uniform default'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.applicationClass === 'ineligible-requester'}
        <p class="text-sm text-base-content/80">
          Under the rule applied, this requester is <strong>not eligible</strong> to obtain a certified
          copy. Completing the paperwork will not change that. Ask an eligible person to apply, obtain
          a court order, or request an informational copy where the state offers one. This is documentation
          support only; the issuing agency decides.
        </p>
      {:else if result.applicationClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The request is <strong>incomplete</strong>: resolve the high-priority items below before
          sending it, or the office is likely to return it. This tool is not legal advice.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The request looks <strong>ready to submit</strong> against the rule applied. Confirm current
          fees and accepted ID with the issuing office first; it makes the final decision.
        </p>
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

    <!-- Application summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Application summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Applicant:</span>
          {data.applicant.applicantName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Person named:</span>
          {data.registrant.registrantName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Sex:</span>
          {sexLabel(data.registrant.sex) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of birth:</span>
          {data.registrant.dateOfBirth || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Born:</span>
          {[data.registrant.placeOfBirth, data.registrant.state].filter(Boolean).join(', ') ||
            'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Relationship:</span>
          {relationshipLabel(data.purpose.relationship) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Purpose:</span>
          {purposeLabel(data.purpose.purpose) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Copy type:</span>
          {certificateTypeLabel(data.order.certificateType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Copies:</span>
          {data.order.copies ?? 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Delivery:</span>
          {deliveryMethodLabel(data.order.deliveryMethod) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Photo ID:</span>
          {idTypeLabel(data.evidence.idType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Apostille needed:</span>
          {yesNoLabel(data.purpose.needsApostille) || 'N/A'}
        </div>
      </div>
      {#if data.declaration.applicationNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Note:</span>
          <p class="mt-1 text-base-content/80">{data.declaration.applicationNote}</p>
        </div>
      {/if}
    </div>
  </main>
{/if}
