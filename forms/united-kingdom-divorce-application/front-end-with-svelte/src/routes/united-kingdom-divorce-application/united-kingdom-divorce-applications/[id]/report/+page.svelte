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
    applicationTypeLabel,
    applicationModeLabel,
    stageLabel,
    certificateTypeLabel,
    serviceMethodLabel,
    childrenArrangementsLabel,
    financialOrderLabel,
    feeStatusLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-kingdom-divorce-application/united-kingdom-divorce-applications/${id}`);
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
        a.download = `divorce-application-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Divorce application readiness report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(`/united-kingdom-divorce-application/united-kingdom-divorce-applications/${id}`)}
          >Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <!-- Classification banner -->
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Readiness: {applicationClassLabel(result.applicationClass)}
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
          Jurisdiction ground met: {result.jurisdictionMet ? 'Yes' : 'No'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.applicationClass === 'not-eligible-yet'}
        <p class="text-sm text-base-content/80">
          The {stageLabel(data.application.stage)} stage is <strong>not eligible yet</strong>: the
          time gate has not opened. The earliest date is
          <strong>{result.earliestEligibleDate || 'not determinable'}</strong>. An application made
          now would be refused. This is a timing finding, not legal advice.
        </p>
      {:else if result.applicationClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The application is <strong>incomplete</strong>: required information, a document or an
          eligibility fact is missing or unmet. Resolve the rules and flags below before you apply.
          This is a completeness finding, not legal advice.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The application is <strong>ready to apply</strong> for the {stageLabel(
            data.application.stage
          )} stage: the time gate is met and the required information is present. This does not guarantee
          that the court will grant it, and it is not legal advice.
        </p>
      {/if}
    </div>

    <!-- Earliest eligible date -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">
        Earliest eligible date for this stage
      </h2>
      <p class="text-sm text-base-content/80">
        {result.earliestEligibleDate || 'Not determinable (no time gate, or a date is missing).'}
      </p>
    </div>

    <!-- Rules fired -->
    {#if result.rules.length > 0}
      <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
        <h2 class="mb-4 text-lg font-bold text-base-content">
          Rules fired ({result.rules.length})
        </h2>
        <ul class="space-y-2 text-sm">
          {#each result.rules as rule (rule.id)}
            <li>
              <span class="font-medium">{rule.id}</span>
              <span class="text-base-content/60">({rule.dimension})</span>
              — {rule.description}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

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
          <span class="font-medium text-base-content/70">Type:</span>
          {applicationTypeLabel(data.application.applicationType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Mode:</span>
          {applicationModeLabel(data.application.applicationMode) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Stage:</span>
          {stageLabel(data.application.stage) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of check:</span>
          {data.application.asOfDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Married on:</span>
          {data.marriage.marriageDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Marriage certificate:</span>
          {certificateTypeLabel(data.marriage.marriageCertificateType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Applicant:</span>
          {data.parties.applicantName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Other spouse:</span>
          {data.parties.respondentName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Service:</span>
          {serviceMethodLabel(data.parties.serviceMethod) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Children under 18:</span>
          {yesNoLabel(data.children.childrenUnder18) || 'N/A'}
          {#if data.children.childrenArrangements}
            ({childrenArrangementsLabel(data.children.childrenArrangements)})
          {/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Financial order:</span>
          {financialOrderLabel(data.finances.financialOrderIntended) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Fee:</span>
          {feeStatusLabel(data.finances.feeStatus) || 'N/A'}
        </div>
      </div>
    </div>
  </main>
{/if}
