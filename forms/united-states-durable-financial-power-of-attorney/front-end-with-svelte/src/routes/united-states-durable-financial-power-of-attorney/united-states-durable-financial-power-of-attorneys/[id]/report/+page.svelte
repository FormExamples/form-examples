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
    relationshipLabel,
    effectivenessLabel,
    compensationLabel,
    giftLimitLabel,
    bankFormLabel,
    form2848Label,
    yesNoLabel,
    GRANT_LABELS,
    HOT_LABELS
  } from '#lib/engine/utils.js';
  import { GRANT_FIELDS, HOT_FIELDS, ruleFor } from '#lib/engine/dpoa-rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const rule = $derived(ruleFor(assessment.data));
  const grants = $derived(GRANT_FIELDS.filter((f) => assessment.data.authority[f] === 'yes'));
  const hots = $derived(HOT_FIELDS.filter((f) => assessment.data.authority[f] === 'yes'));

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-durable-financial-power-of-attorney/united-states-durable-financial-power-of-attorneys/${id}`
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
        a.download = `durable-poa-${id}.pdf`;
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
        Durable power of attorney readiness report
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
              `/united-states-durable-financial-power-of-attorney/united-states-durable-financial-power-of-attorneys/${id}`
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
          Governing rule: {result.governingState} ({rule.citation}) — execution risk indicated: {result.executionRiskIndicated
            ? 'Yes'
            : 'No'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.validityClass === 'execution-risk'}
        <p class="text-sm text-base-content/80">
          At least one answered item contradicts the governing state's rule, so this plan is
          classified <strong>execution risk</strong>. Fix the high-priority items before signing: an
          instrument that misses a formality may be refused by banks and recorders or later
          challenged. This is a documentation finding, not a legal opinion.
        </p>
      {:else if result.validityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The plan is <strong>incomplete</strong>: a core item is unanswered (principal, state,
          agent, effectiveness, durability, capacity, notary plan, or any granted authority).
          Execution defects are not judged until it is complete.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The plan is <strong>ready to execute</strong> against the {result.governingState} rule: no execution
          defect was detected. This is a completeness finding, not a legal opinion; have a lawyer licensed
          in the state review the final document.
        </p>
      {/if}
    </div>

    <!-- Fired rules -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">
        Rules that fired ({result.firedRules.length})
      </h2>
      {#if result.firedRules.length === 0}
        <p class="text-sm text-base-content/80">None.</p>
      {:else}
        <ul class="list-disc pl-5 text-sm text-base-content/80">
          {#each result.firedRules as r (r.ruleId)}
            <li><strong>{r.ruleId}</strong> {r.description}</li>
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
                <span class="font-medium">{flag.category}:</span>
                {flag.description} — {flag.suggestedAction}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Instrument summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Instrument summary</h2>
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
          {data.agents.agentName || 'N/A'}
          {data.agents.agentRelationship
            ? `(${relationshipLabel(data.agents.agentRelationship)})`
            : ''}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Successor agent:</span>
          {data.agents.successorAgentName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Effective:</span>
          {effectivenessLabel(data.instrument.effectiveness) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Durable:</span>
          {yesNoLabel(data.instrument.durableStatement) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">General authority:</span>
          {grants.map((f) => GRANT_LABELS[f]).join('; ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Hot powers granted:</span>
          {hots.map((f) => HOT_LABELS[f]).join('; ') || 'None'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Gift limit:</span>
          {giftLimitLabel(data.authority.giftLimitType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Compensation:</span>
          {compensationLabel(data.agents.compensation) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Notary / witnesses:</span>
          {yesNoLabel(data.execution.notaryArranged) || 'N/A'} / {data.execution.witnessCount ??
            'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Bank form:</span>
          {bankFormLabel(data.acceptance.bankFormCompleted) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">IRS Form 2848:</span>
          {form2848Label(data.acceptance.form2848Status) || 'N/A'}
        </div>
      </div>
      <p class="mt-4 text-xs text-base-content/60">
        Documentation support, not legal advice. The statute, the notary, and a court decide.
      </p>
    </div>
  </main>
{/if}
