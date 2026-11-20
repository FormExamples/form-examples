<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    registrationClassLabel,
    registrationClassColor,
    deadlineStatusLabel,
    priorityLabel,
    priorityColor,
    sexLabel,
    jurisdictionLabel,
    relationshipLabel,
    disposalMethodLabel,
    tellUsOnceStatusLabel,
    copyOrderChannelLabel,
    coronerStageLabel,
    medicalExaminerStatusLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-kingdom-death-registration/united-kingdom-death-registrations/${id}`);
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/united-kingdom-death-registrations/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: assessment.data, result: assessment.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `death-registration-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Death registration readiness report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(`/united-kingdom-death-registration/united-kingdom-death-registrations/${id}`)}
          >Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <!-- Classification banner -->
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Registration: {registrationClassLabel(result.registrationClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {registrationClassColor(
            result.registrationClass
          )}"
        >
          {registrationClassLabel(result.registrationClass)}
        </span>
        <span class="text-sm text-base-content/70">
          5-day deadline: {deadlineStatusLabel(result.deadlineStatus)}
          {#if result.daysSinceConfirmation !== null}
            ({result.daysSinceConfirmation} days since confirmation)
          {/if}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.registrationClass === 'referred-to-coroner-pending'}
        <p class="text-sm text-base-content/80">
          The death has been reported to a coroner and the coroner’s certificate has not arrived, so
          this registration is <strong>referred to coroner - pending</strong>. The 5-day clock is
          paused. Ask the coroner for an interim certificate if proof of death is needed meanwhile.
        </p>
      {:else if result.registrationClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          This registration is <strong>incomplete</strong>. Resolve the blocking issues below before
          the appointment. This tool checks readiness only — it is not legal advice.
        </p>
      {:else if result.registrationClass === 'registered'}
        <p class="text-sm text-base-content/80">
          The death is <strong>registered</strong>. Make sure you have the certificate for burial or
          cremation, the Tell Us Once reference, and the certified copies you need.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          This registration is <strong>ready to register</strong>: the medical examiner has
          confirmed (or the coroner has released the death) and a qualified informant is identified.
          Register within 5 days of the confirmation.
        </p>
      {/if}
    </div>

    <!-- Blocking issues -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">
        Blocking issues ({result.blockingRules.length})
      </h2>
      {#if result.blockingRules.length === 0}
        <p class="text-sm text-base-content/80">No blocking issues.</p>
      {:else}
        <ul class="list-disc pl-6 text-sm text-base-content/80">
          {#each result.blockingRules as rule (rule.ruleId)}
            <li>{rule.description}</li>
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

    <!-- Registration summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Registration summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Deceased:</span>
          {data.deceased.deceasedName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Sex:</span>
          {sexLabel(data.deceased.sex) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of death:</span>
          {data.deceased.dateOfDeath || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Place of death:</span>
          {data.deceased.placeOfDeath || 'N/A'}
          ({jurisdictionLabel(data.deceased.deathJurisdiction) || 'N/A'})
        </div>
        <div>
          <span class="font-medium text-base-content/70">MCCD received:</span>
          {yesNoLabel(data.medical.mccdReceived) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Medical examiner:</span>
          {medicalExaminerStatusLabel(data.medical.medicalExaminerStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Referred to coroner:</span>
          {yesNoLabel(data.coroner.referredToCoroner) || 'N/A'}
          {#if data.coroner.coronerStage}({coronerStageLabel(data.coroner.coronerStage)}){/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Informant:</span>
          {data.informant.informantName || 'N/A'}
          ({result.informantQualified ? 'qualified' : 'not qualified'})
        </div>
        <div>
          <span class="font-medium text-base-content/70">Basis:</span>
          {relationshipLabel(data.informant.informantRelationship) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Register office:</span>
          {data.registration.registerOffice || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Disposal:</span>
          {disposalMethodLabel(data.aftercare.disposalMethod) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Tell Us Once:</span>
          {tellUsOnceStatusLabel(data.aftercare.tellUsOnceStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Copies:</span>
          {data.aftercare.copiesRequested ?? 'N/A'}
          {#if data.aftercare.copyOrderChannel}({copyOrderChannelLabel(
              data.aftercare.copyOrderChannel
            )}){/if}
        </div>
      </div>
    </div>
  </main>
{/if}
