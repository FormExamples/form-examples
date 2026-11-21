<script lang="ts">
  import { renderPdf } from '#lib/report/pdf-client.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import { outstandingItems, stateRule } from '#lib/engine/title-rules.js';
  import {
    applicationClassLabel,
    applicationClassColor,
    priorityLabel,
    priorityColor,
    vinStatusLabel,
    titleBrandLabel,
    lienStatusLabel,
    odometerStatusLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const items = $derived(outstandingItems(assessment.data));
  const rule = $derived(stateRule(assessment.data.application.state));

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-vehicle-title-and-registration-application/vehicle-title-applications/${id}`
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
        a.download = `vehicle-title-application-${data.vehicle.vin || id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Vehicle title application report</h1>
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
              `/united-states-vehicle-title-and-registration-application/vehicle-title-applications/${id}`
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
          Brand or lien issue: {result.brandOrLienIssue ? 'Yes' : 'No'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.applicationClass === 'title-brand-or-lien-issue'}
        <p class="text-sm text-base-content/80">
          This application is classified <strong>title brand or lien issue</strong>: a branded
          title, an NMVTIS brand or theft record, an unreleased lien, or a "not actual mileage"
          disclosure needs special handling by the agency. Resolve or disclose each flagged item
          before submitting; the agency decides whether and how to issue the title.
        </p>
      {:else if result.applicationClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          This application is <strong>incomplete</strong>: the outstanding items below are missing
          or invalid. Complete them before submitting, or the agency will reject or delay the
          application.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          This application is <strong>ready to submit</strong>: every required item is present and
          consistent with the federal rules and the state rule applied. This is a completeness
          finding. It does <strong>not</strong> guarantee a title; the issuing agency decides.
        </p>
      {/if}
      <p class="mt-2 text-sm text-base-content/70">
        {#if data.application.state}
          {#if result.stateRuleKnown}
            {rule.rule.name} ({rule.rule.agency}) rules applied.
          {:else}
            State {rule.code} is not encoded: the uniform default rule was applied. Verify the state rule.
          {/if}
        {:else}
          No state selected.
        {/if}
      </p>
    </div>

    <!-- Outstanding items -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">
        Outstanding items ({result.outstandingItemCount})
      </h2>
      {#if items.length === 0}
        <p class="text-sm text-base-content/80">No outstanding items.</p>
      {:else}
        <ul class="list-disc pl-5 text-sm text-base-content/80">
          {#each items as item (item.id)}
            <li>{item.label}</li>
          {/each}
        </ul>
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
                <span class="font-medium">{flag.id} ({flag.category}):</span>
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
          <span class="font-medium text-base-content/70">State:</span>
          {data.application.state || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Owner:</span>
          {data.owner.ownerName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Vehicle:</span>
          {[data.vehicle.modelYear, data.vehicle.make, data.vehicle.model]
            .filter((p) => p !== null && p !== '')
            .join(' ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">VIN:</span>
          {data.vehicle.vin || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">VIN check:</span>
          {vinStatusLabel(result.vinStatus)}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Odometer:</span>
          {result.odometerDisclosureRequired
            ? data.odometer.odometerReading !== null
              ? `${data.odometer.odometerReading} miles, ${odometerStatusLabel(data.odometer.odometerStatus)}`
              : 'Required, not recorded'
            : 'Not required (exempt)'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Title brand:</span>
          {titleBrandLabel(data.titleHistory.titleBrand) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Lien:</span>
          {lienStatusLabel(data.lien.lienStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Out-of-state transfer:</span>
          {yesNoLabel(data.application.outOfStateTransfer) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">State-level tax estimate:</span>
          {result.estimatedStateTaxUsd === null
            ? 'N/A'
            : `$${result.estimatedStateTaxUsd.toFixed(2)} (excludes local tax)`}
        </div>
      </div>
    </div>

    <p class="text-sm text-base-content/60">
      Documentation support, not legal advice. The issuing state agency decides whether to issue a
      title and registration.
    </p>
  </main>
{/if}
