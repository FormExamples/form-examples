<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import { beneficiaries, witnesses } from '#lib/engine/will-rules.js';
  import {
    validityClassLabel,
    validityClassColor,
    priorityLabel,
    priorityColor,
    domicileLabel,
    maritalStatusLabel,
    estateValueBandLabel,
    relationshipLabel,
    funeralWishesLabel,
    executionStatusLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/${id}`);
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(
        `/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/${id}/report/pdf`,
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
        a.download = `will-${id}.pdf`;
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
              `/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/${id}`
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
          Formality risk indicated: {result.formalityRisk ? 'Yes' : 'No'}
        </span>
        <span class="text-sm text-base-content/70">Shares total: {result.sharesTotalPercent}%</span>
        <span class="text-sm text-base-content/70">Witnesses named: {result.witnessCount}</span>
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
          A formality risk is indicated, so this will is classified <strong>formality risk</strong>.
          Fix the high-priority flags before signing. A will that fails the Wills Act 1837
          formalities (age 18 or over, in writing, signed in front of two independent adult
          witnesses present together) may be invalid, and a gift to a witness fails. This is a
          documentation finding, not legal advice.
        </p>
      {:else if result.validityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The will record is <strong>incomplete</strong>: required content is missing, such as an
          executor, a beneficiary, a residuary clause, shares that total 100%, or a trustee for a
          beneficiary under 18. Complete the flagged items before signing.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The will record is <strong>valid</strong> as it stands: no known formality or content
          problem is flagged. This is a completeness finding and does <strong>not</strong> confirm that
          the will is legally valid. Consider asking a solicitor to review it, particularly for a large
          estate, a complex family, or property abroad.
        </p>
      {/if}
    </div>

    <!-- Beneficiaries -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Beneficiaries</h2>
      {#if beneficiaries(data).length === 0}
        <p class="text-sm text-base-content/80">No beneficiary named.</p>
      {:else}
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-base-300 text-left text-base-content/70">
              <th class="pb-2 pr-4">Name</th>
              <th class="pb-2 pr-4">Relationship</th>
              <th class="pb-2 pr-4">Share</th>
              <th class="pb-2">Age note</th>
            </tr>
          </thead>
          <tbody>
            {#each beneficiaries(data) as b (b.name)}
              <tr class="border-b border-base-200">
                <td class="py-2 pr-4">{b.name}</td>
                <td class="py-2 pr-4">{relationshipLabel(b.relationship as never) || '—'}</td>
                <td class="py-2 pr-4">{b.share != null ? `${b.share}%` : '—'}</td>
                <td class="py-2">
                  {b.isMinor === 'yes'
                    ? b.hasTrustee === 'yes'
                      ? 'Under 18, trustee appointed'
                      : 'Under 18, no trustee'
                    : b.isMinor === 'no'
                      ? 'Adult'
                      : '—'}
                </td>
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
          <span class="font-medium text-base-content/70">Domicile:</span>
          {domicileLabel(data.testator.domicile) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Marital status:</span>
          {maritalStatusLabel(data.testator.maritalStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Estate value:</span>
          {estateValueBandLabel(data.estate.estateValueBand) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Executors:</span>
          {[data.executors.executorFirstName, data.executors.executorSecondName]
            .filter((n) => n.trim() !== '')
            .join(', ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Guardian:</span>
          {data.family.guardianName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Funeral wishes:</span>
          {funeralWishesLabel(data.family.funeralWishes) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Status:</span>
          {executionStatusLabel(data.execution.executionStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of will:</span>
          {data.execution.dateOfWill || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Witnesses:</span>
          {witnesses(data)
            .map((w) => w.name)
            .join(', ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Inheritance Act claims considered:</span>
          {yesNoLabel(data.beneficiaries.dependantsConsidered) || 'N/A'}
        </div>
      </div>
      {#if data.execution.drafterNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Drafter note:</span>
          <p class="mt-1 text-base-content/80">{data.execution.drafterNote}</p>
        </div>
      {/if}
      <p class="mt-6 text-xs text-base-content/60">
        Disclaimer: this report is documentation support, not legal advice. It cannot confirm that a
        will is valid. Take advice from a solicitor or a regulated will writer if your situation is
        not straightforward.
      </p>
    </div>
  </main>
{/if}
