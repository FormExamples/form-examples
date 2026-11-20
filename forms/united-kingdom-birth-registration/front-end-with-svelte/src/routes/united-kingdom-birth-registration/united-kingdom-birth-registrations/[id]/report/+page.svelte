<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    readinessClassLabel,
    readinessClassColor,
    priorityLabel,
    priorityColor,
    sexLabel,
    birthCountryLabel,
    parentsRelationshipLabel,
    paternityBasisLabel,
    informantRelationshipLabel,
    registrationRouteLabel,
    identityDocumentLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { missingItems, STATUTORY_DAYS } from '#lib/engine/rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const missing = $derived(missingItems(assessment.data));

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-kingdom-birth-registration/united-kingdom-birth-registrations/${id}`);
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/united-kingdom-birth-registrations/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: assessment.data, result: assessment.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `birth-registration-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Birth registration readiness report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(`/united-kingdom-birth-registration/united-kingdom-birth-registrations/${id}`)}
          >Edit</Button
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
        <span class="text-sm text-base-content/70">
          {#if result.daysSinceBirth === null}
            Days since birth not yet known
          {:else}
            {result.daysSinceBirth} days since birth (limit {STATUTORY_DAYS}){result.lateRegistration ===
            'yes'
              ? ' — late'
              : ''}
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
      {#if result.readinessClass === 'out-of-scope'}
        <p class="text-sm text-base-content/80">
          This birth is <strong>out of scope</strong>: a stillbirth, or a birth outside England and
          Wales, is registered under different rules. Do not use this application; the flagged
          issues say where to register.
        </p>
      {:else if result.readinessClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The application is <strong>incomplete</strong>: {result.missingItemCount} required
          {result.missingItemCount === 1 ? 'item is' : 'items are'} missing, or the dates are inconsistent.
          Complete the outstanding items before attending the register office.
        </p>
      {:else if result.readinessClass === 'needs-additional-evidence'}
        <p class="text-sm text-base-content/80">
          The application is complete but <strong>needs additional evidence</strong>: the informant,
          the basis for the second parent, the identity documents, or the age of the registration
          needs attention. Resolve the high-priority flags before attending.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The application is <strong>ready to submit</strong>: every required item is present, the
          informant is qualified, the identity evidence is sufficient, and the second parent (if
          any) has a valid basis. The registrar still makes the final decision and the entry in the
          register.
        </p>
      {/if}
    </div>

    <!-- Missing items -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Missing required items</h2>
      {#if missing.length === 0}
        <p class="text-sm text-base-content/80">None.</p>
      {:else}
        <ul class="list-disc pl-5 text-sm text-base-content/80">
          {#each missing as m (m.id)}
            <li>{m.label}</li>
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

    <!-- Application summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Application summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Child:</span>
          {[data.child.childForenames, data.child.childSurname].filter(Boolean).join(' ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Sex:</span>
          {sexLabel(data.child.sex) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of birth:</span>
          {data.child.dateOfBirth || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Place and country of birth:</span>
          {[data.child.placeOfBirth, birthCountryLabel(data.child.birthCountry)]
            .filter(Boolean)
            .join(', ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Mother:</span>
          {data.mother.motherName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Parents' relationship:</span>
          {parentsRelationshipLabel(data.parentage.parentsRelationship) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Second parent:</span>
          {data.parentage.secondParentIncluded === 'yes'
            ? `${data.parentage.secondParentName || 'N/A'} (${paternityBasisLabel(data.parentage.paternityBasis) || 'no basis stated'})`
            : yesNoLabel(data.parentage.secondParentIncluded) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Informant:</span>
          {[
            informantRelationshipLabel(data.informant.informantRelationship),
            data.informant.informantName
          ]
            .filter(Boolean)
            .join(': ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Registration:</span>
          {[
            registrationRouteLabel(data.informant.registrationRoute),
            data.informant.registrationDate
          ]
            .filter(Boolean)
            .join(', ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Identity document:</span>
          {data.informant.identityPrimaryDocument
            ? identityDocumentLabel(data.informant.identityPrimaryDocument)
            : data.informant.identitySecondaryCount !== null
              ? `${data.informant.identitySecondaryCount} secondary document(s)`
              : 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Certificates:</span>
          {data.certificate.certificatesRequested ?? 'N/A'}
          {data.certificate.serviceLevel ? `(${data.certificate.serviceLevel})` : ''}
        </div>
      </div>
      {#if data.certificate.applicantNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Note to the registrar:</span>
          <p class="mt-1 text-base-content/80">{data.certificate.applicantNote}</p>
        </div>
      {/if}
    </div>
  </main>
{/if}
