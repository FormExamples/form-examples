<script lang="ts">
  import { renderPdf } from '#lib/report/pdf-client.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    readinessClassLabel,
    readinessClassColor,
    priorityLabel,
    priorityColor,
    caseTypeLabel,
    groundTypeLabel,
    faultGroundLabel,
    propertyRegimeLabel,
    serviceMethodLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-states-divorce-petition/united-states-divorce-petitions/${id}`);
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
        a.download = `divorce-petition-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Divorce petition readiness report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(`/united-states-divorce-petition/united-states-divorce-petitions/${id}`)}
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
        Readiness: {readinessClassLabel(result.readinessClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {readinessClassColor(
            result.readinessClass
          )}"
        >
          {readinessClassLabel(result.readinessClass)}
        </span>
        <span class="text-sm text-base-content/70">
          Property regime: {propertyRegimeLabel(result.propertyRegime)}
        </span>
        {#if !result.stateRuleKnown}
          <span class="text-sm font-semibold text-warning">Verify the state rule</span>
        {/if}
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.readinessClass === 'not-yet-eligible'}
        <p class="text-sm text-base-content/80">
          The petition is <strong>not yet eligible</strong>: a residency requirement, a separation
          period, or a waiting period in the filing state is not yet satisfied. Filing or entering a
          decree early risks dismissal or a void decree. Wait until the period has run, then
          re-check.
        </p>
      {:else if result.readinessClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The petition is <strong>incomplete</strong>: required details, a custody plan or
          child-support worksheet, a settlement agreement for an uncontested case, or an available
          ground is missing. Resolve the flagged items before filing.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The petition looks <strong>ready to file</strong>: the filing state's residency and
          separation rules appear satisfied and the required items are present. Confirm the current
          county forms and fee with the clerk of court. This is documentation support, not legal
          advice.
        </p>
      {/if}
    </div>

    <!-- Earliest decree date -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Earliest permitted decree date</h2>
      <p class="text-sm text-base-content/80">
        {result.earliestDecreeDate ??
          'None (the state has no waiting period) or not yet determinable.'}
      </p>
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

    <!-- Petition summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Petition summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Filing:</span>
          {data.filing.state || 'N/A'} / {data.filing.county || 'N/A'}, {data.filing.filingDate ||
            'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Case:</span>
          {caseTypeLabel(data.filing.caseType) || 'N/A'}; {groundTypeLabel(
            data.filing.groundType
          ) || 'N/A'}{data.filing.faultGround
            ? ` — ${faultGroundLabel(data.filing.faultGround)}`
            : ''}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Petitioner:</span>
          {data.spouses.petitionerName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Respondent:</span>
          {data.spouses.respondentName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Marriage:</span>
          {data.spouses.marriageDate || 'N/A'}, {data.spouses.marriagePlace || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Minor children:</span>
          {yesNoLabel(data.children.hasMinorChildren) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Settlement agreement:</span>
          {yesNoLabel(data.property.settlementAgreementSigned) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Service:</span>
          {serviceMethodLabel(data.service.serviceMethod) || 'N/A'}, {data.service.serviceDate ||
            'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Decree entered:</span>
          {yesNoLabel(data.decree.decreeEntered) || 'N/A'}, {data.decree.decreeDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Divorce certificate requested:</span>
          {yesNoLabel(data.decree.certificateRequested) || 'N/A'}
        </div>
      </div>
      <p class="mt-4 text-xs text-base-content/60">
        Documentation support, not legal advice. The court decides.
      </p>
    </div>
  </main>
{/if}
