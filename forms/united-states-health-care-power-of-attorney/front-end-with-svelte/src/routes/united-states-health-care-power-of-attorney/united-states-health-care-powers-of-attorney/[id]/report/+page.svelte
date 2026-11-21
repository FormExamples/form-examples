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
    agentRelationshipLabel,
    effectiveWhenLabel,
    executionMethodLabel,
    organDonationLabel,
    polstStatusLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-health-care-power-of-attorney/united-states-health-care-powers-of-attorney/${id}`
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
        a.download = `health-care-poa-${id}.pdf`;
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
        Health care power of attorney readiness report
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
              `/united-states-health-care-power-of-attorney/united-states-health-care-powers-of-attorney/${id}`
            )}>Edit</Button
        >
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
        <span class="text-sm text-base-content/70">State rule applied: {result.ruleSetName}</span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.readinessClass === 'execution-risk'}
        <p class="text-sm text-base-content/80">
          This directive carries an <strong>execution risk</strong>: an eligibility, capacity, or
          signing-formality problem could lead a hospital to refuse it or a court to set it aside.
          Fix the high-priority items below <strong>before anyone signs</strong>.
        </p>
      {:else if result.readinessClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The directive is <strong>incomplete</strong>: required content is missing. Complete the
          flagged items before printing it for signing.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The directive is <strong>ready to execute</strong> under the rule applied: required content
          is present, the agent is eligible, and the signing method matches. This is a completeness check,
          not legal advice.
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
          {#each result.flaggedIssues as flag (flag.id + flag.description)}
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

    <!-- Directive summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Directive summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Principal:</span>
          {data.principal.principalName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">State:</span>
          {data.principal.state || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Agent:</span>
          {data.agent.agentName || 'N/A'}
          {#if data.agent.agentRelationship}
            ({agentRelationshipLabel(data.agent.agentRelationship)})
          {/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Successors:</span>
          {[data.agent.successor1Name, data.agent.successor2Name].filter(Boolean).join(', ') ||
            'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Authority begins:</span>
          {effectiveWhenLabel(data.authority.effectiveWhen) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">HIPAA release:</span>
          {yesNoLabel(data.authority.hipaaRelease) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Organ donation:</span>
          {organDonationLabel(data.authority.organDonation) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">POLST:</span>
          {polstStatusLabel(data.wishes.polstStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Signing method:</span>
          {executionMethodLabel(data.execution.executionMethod) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Signature date:</span>
          {data.execution.signatureDate || 'N/A'}
        </div>
      </div>
      {#if data.wishes.wishesNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Wishes and values:</span>
          <p class="mt-1 text-base-content/80">{data.wishes.wishesNote}</p>
        </div>
      {/if}
    </div>
  </main>
{/if}
