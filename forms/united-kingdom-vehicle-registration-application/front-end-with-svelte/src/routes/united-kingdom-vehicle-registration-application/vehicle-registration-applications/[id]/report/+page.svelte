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
    applicationTypeLabel,
    identityDocumentTypeLabel,
    yesNoLabel,
    poundsLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-kingdom-vehicle-registration-application/vehicle-registration-applications/${id}`
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
        a.download = `vehicle-registration-application-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Vehicle registration validity report</h1>
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
              `/united-kingdom-vehicle-registration-application/vehicle-registration-applications/${id}`
            )}>Edit</Button
        >
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
          Fee due: {poundsLabel(result.feeDueAsPence)} · Missing items: {result.missingItemCount}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.validityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The application is <strong>incomplete</strong>: required details are missing, a format
          check failed, the vehicle cannot be registered, or the declaration is not signed. Complete
          the items listed below before gathering the documents to send.
        </p>
      {:else if result.validityClass === 'needs-supporting-documents'}
        <p class="text-sm text-base-content/80">
          All details are present, but the application <strong
            >needs supporting documents or payment</strong
          >. Enclose the evidence and fee listed below, then post it to the DVLA. The DVLA may
          inspect the vehicle and decides every application.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The application is <strong>ready to submit</strong>: the details are complete and the
          documents and fee match what the DVLA asks for. This is a completeness check, not a
          decision; the DVLA decides every application.
        </p>
      {/if}
    </div>

    <!-- Findings -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Findings ({result.rules.length})</h2>
      {#if result.rules.length === 0}
        <p class="text-sm text-base-content/80">No missing items.</p>
      {:else}
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-base-300 text-left text-base-content/70">
              <th class="pb-2 pr-4">Rule</th>
              <th class="pb-2 pr-4">Dimension</th>
              <th class="pb-2">Finding</th>
            </tr>
          </thead>
          <tbody>
            {#each result.rules as rule (rule.ruleId)}
              <tr class="border-b border-base-200">
                <td class="py-2 pr-4">{rule.ruleId}</td>
                <td class="py-2 pr-4">{rule.dimension}</td>
                <td class="py-2">{rule.description}</td>
              </tr>
            {/each}
          </tbody>
        </table>
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
          <span class="font-medium text-base-content/70">Application:</span>
          {applicationTypeLabel(data.application.applicationType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Applicant:</span>
          {data.applicant.name || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Keeper:</span>
          {data.keeper.keeperName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Vehicle:</span>
          {[data.vehicle.make, data.vehicle.model].filter(Boolean).join(' ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Registration number:</span>
          {data.vehicle.registrationNumber || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">VIN:</span>
          {data.vehicle.vehicleIdentificationNumber || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Identity evidence:</span>
          {identityDocumentTypeLabel(data.applicant.identityDocumentType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Declaration signed:</span>
          {yesNoLabel(data.feeAndDeclaration.declarationSigned) || 'N/A'}
        </div>
      </div>
      {#if data.feeAndDeclaration.applicantNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Note:</span>
          <p class="mt-1 text-base-content/80">{data.feeAndDeclaration.applicantNote}</p>
        </div>
      {/if}
    </div>
  </main>
{/if}
