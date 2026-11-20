<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    validityClassLabel,
    validityClassColor,
    priorityLabel,
    priorityColor,
    maritalStatusLabel,
    executionFormLabel,
    soundMindLabel,
    yesNoLabel,
    dollars
  } from '#lib/engine/utils.js';
  import { stateRuleFor } from '#lib/engine/will-rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-states-last-will-and-testament/united-states-last-will-and-testaments/${id}`);
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/united-states-last-will-and-testaments/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: assessment.data, result: assessment.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `will-${data.testator.testatorName || id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Will validity report</h1>
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
              `/united-states-last-will-and-testament/united-states-last-will-and-testaments/${id}`
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
          Residuary total: {result.residuaryPercentTotal}%
        </span>
        {#if result.federalEstateTaxExposure}
          <span class="text-sm text-base-content/70">Federal estate tax may apply</span>
        {/if}
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.validityClass === 'formality-risk'}
        <p class="text-sm text-base-content/80">
          This will plan has a <strong>formality risk</strong>: at least one high-priority flag
          below could make the will, or a gift in it, fail. Fix those items before the signing
          ceremony. This is a documentation finding, not legal advice, and the probate court decides
          validity.
        </p>
      {:else if result.validityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The will plan is <strong>incomplete</strong>: required answers are missing, listed in the
          flags below. Complete them before the will is signed.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The will plan is <strong>valid and ready to execute</strong> under the rules this tool
          checks: capacity, signature, witnesses and bequest arithmetic raise no high-priority
          issue. Review the medium and low flags, then hold the signing ceremony. This does
          <strong>not</strong> guarantee validity; the probate court decides.
        </p>
      {/if}
    </div>

    <!-- Key figures -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Key figures</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">State rule used:</span>
          {stateRuleFor(data.testator.state).rule.name}
          ({result.stateRuleSource === 'state-table'
            ? 'state table'
            : 'Uniform Probate Code default'})
        </div>
        <div>
          <span class="font-medium text-base-content/70">Witnesses named:</span>
          {result.witnessCount} (state needs {stateRuleFor(data.testator.state).rule
            .witnessesRequired})
        </div>
        <div>
          <span class="font-medium text-base-content/70">Self-proved:</span>
          {result.selfProved ? 'Yes' : 'No'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Residuary total:</span>
          {result.residuaryPercentTotal}%
        </div>
        <div>
          <span class="font-medium text-base-content/70">Estimated elective share:</span>
          {result.electiveShareAmount === null
            ? 'Not applicable'
            : dollars(result.electiveShareAmount)}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Federal estate tax may apply:</span>
          {result.federalEstateTaxExposure ? 'Yes' : 'No'}
        </div>
      </div>
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

    <!-- Will summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Will summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Testator:</span>
          {data.testator.testatorName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of birth:</span>
          {data.testator.dateOfBirth || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Sound mind:</span>
          {soundMindLabel(data.testator.soundMind) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Marital status:</span>
          {maritalStatusLabel(data.testator.maritalStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Personal representative:</span>
          {data.provisions.personalRepresentativeName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Form of execution:</span>
          {executionFormLabel(data.execution.executionForm) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Execution date:</span>
          {data.execution.executionDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Self-proving affidavit:</span>
          {yesNoLabel(data.selfProving.selfProvingAffidavit) || 'N/A'}
        </div>
      </div>
      {#if data.provisions.drafterNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Drafter note:</span>
          <p class="mt-1 text-base-content/80">{data.provisions.drafterNote}</p>
        </div>
      {/if}
      <p class="mt-4 text-xs text-base-content/60">
        Documentation support, not legal advice. The probate court decides whether a will is valid.
      </p>
    </div>
  </main>
{/if}
