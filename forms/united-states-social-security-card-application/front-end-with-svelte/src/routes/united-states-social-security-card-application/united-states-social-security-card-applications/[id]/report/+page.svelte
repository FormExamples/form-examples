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
    optionLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-social-security-card-application/united-states-social-security-card-applications/${id}`
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
        a.download = `social-security-card-application-${id}.pdf`;
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
        Social Security card application readiness report
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
              `/united-states-social-security-card-application/united-states-social-security-card-applications/${id}`
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
          Evidence gaps: {result.missingEvidenceCount}
        </span>
        <span class="text-sm text-base-content/70">
          Replacement limit reached: {result.replacementLimitReached ? 'Yes' : 'No'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.applicationClass === 'not-eligible'}
        <p class="text-sm text-base-content/80">
          This application is classified <strong>not eligible</strong>: either the person has died
          (SSA issues no card for a deceased person; report the death instead) or a replacement-card
          limit is reached with no supported exception. This is a documentation finding; SSA makes
          the decision.
        </p>
      {:else if result.applicationClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          This application is <strong>incomplete</strong>: required items are blank, the submission
          route is wrong for the applicant's age, or a parent or guardian must sign. Complete the
          flagged items.
        </p>
      {:else if result.applicationClass === 'evidence-missing'}
        <p class="text-sm text-base-content/80">
          The form is complete but <strong>evidence is missing</strong>: SSA needs current, original
          (or agency-certified) proof of identity, age, citizenship or lawful alien status, and any
          name change.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          This application is <strong>ready to submit</strong>: the items are complete and the
          evidence recorded matches the SS-5 rules. This is a completeness finding only; the Social
          Security Administration decides every application.
        </p>
      {/if}
    </div>

    <!-- Summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Application summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Request:</span>
          {optionLabel('requestType', data.request.requestType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Application date:</span>
          {data.request.applicationDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Name on card:</span>
          {data.applicant.nameOnCard || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">State of residence:</span>
          {data.applicant.stateOfResidence || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Citizenship:</span>
          {optionLabel('citizenship', data.applicant.citizenship) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Proof of identity:</span>
          {optionLabel('identityDocument', data.evidence.identityDocument) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Proof of age:</span>
          {optionLabel('ageDocument', data.evidence.ageDocument) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Proof of citizenship or status:</span>
          {optionLabel('citizenshipDocument', data.evidence.citizenshipDocument) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Original or certified documents:</span>
          {yesNoLabel(data.evidence.documentsOriginalOrCertified) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Signer:</span>
          {optionLabel('signerRelationship', data.filer.signerRelationship) || 'N/A'}
        </div>
      </div>
      {#if data.tellSsa.preparerNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Preparer note:</span>
          <p class="mt-1 text-base-content/80">{data.tellSsa.preparerNote}</p>
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
  </main>
{/if}
