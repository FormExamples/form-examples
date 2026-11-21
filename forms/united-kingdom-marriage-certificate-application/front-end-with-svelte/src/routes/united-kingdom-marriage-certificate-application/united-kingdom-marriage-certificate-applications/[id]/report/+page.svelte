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
    noticeTypeLabel,
    ceremonyTypeLabel,
    nationalityStatusLabel,
    maritalStatusLabel,
    certificateServiceLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-kingdom-marriage-certificate-application/united-kingdom-marriage-certificate-applications/${id}`
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
        a.download = `marriage-${data.partyOne.name || id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Application validity report</h1>
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
              `/united-kingdom-marriage-certificate-application/united-kingdom-marriage-certificate-applications/${id}`
            )}>Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <!-- Classification banner -->
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Application: {validityClassLabel(result.validityClass)}
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
          Immigration referral indicated: {result.immigrationReferralIndicated ? 'Yes' : 'No'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.validityClass === 'ineligible'}
        <p class="text-sm text-base-content/80">
          The application is <strong>ineligible</strong>: a party is under 18 on the ceremony date,
          a party is already married or in a civil partnership, or the parties are closely related.
          Notice cannot be accepted on this basis. This is a documentation result, not legal advice.
        </p>
      {:else if result.validityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The application is <strong>incomplete</strong>: required details are missing, or
          certificate copies are requested without a service. Complete the outstanding items before
          booking the notice appointment.
        </p>
      {:else if result.validityClass === 'needs-evidence'}
        <p class="text-sm text-base-content/80">
          The application <strong>needs evidence or correction</strong>: documents, residence,
          timing, witnesses, or the venue still need attention. Resolve the flagged items and bring
          original documents, not photocopies, to the appointment.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The application is <strong>ready to submit</strong>: both parties are eligible, the
          details are complete, the evidence is in hand, and the ceremony falls inside the permitted
          window. The register office still checks the original documents and decides the notice.
        </p>
      {/if}
    </div>

    <!-- Ceremony window -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Permitted ceremony window</h2>
      <p class="text-sm text-base-content/80">
        {#if result.earliestCeremonyDate}
          {result.earliestCeremonyDate} to {result.latestCeremonyDate}
        {:else}
          Not determinable (no notice date).
        {/if}
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

    <!-- Application summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Application summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Notice:</span>
          {noticeTypeLabel(data.notice.noticeType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Notice date:</span>
          {data.notice.noticeDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Registration district:</span>
          {data.notice.registrationDistrict || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Ceremony:</span>
          {ceremonyTypeLabel(data.ceremony.ceremonyType) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Ceremony date:</span>
          {data.ceremony.ceremonyDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Venue:</span>
          {data.ceremony.venueName || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Witnesses:</span>
          {data.ceremony.witnessCount ?? 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Closely related:</span>
          {yesNoLabel(data.relationship.closelyRelated) || 'N/A'}
        </div>
        {#each [{ label: 'First party', p: data.partyOne }, { label: 'Second party', p: data.partyTwo }] as party (party.label)}
          <div>
            <span class="font-medium text-base-content/70">{party.label}:</span>
            {party.p.name || 'N/A'} (born {party.p.dateOfBirth || 'N/A'})
          </div>
          <div>
            <span class="font-medium text-base-content/70">{party.label} status:</span>
            {nationalityStatusLabel(party.p.nationalityStatus) || 'N/A'};
            {maritalStatusLabel(party.p.maritalStatus) || 'N/A'}
          </div>
        {/each}
        <div>
          <span class="font-medium text-base-content/70">Certificate copies:</span>
          {data.certificate.certificateCopies ?? 'N/A'}
          ({certificateServiceLabel(data.certificate.certificateService) || 'no service chosen'})
        </div>
      </div>
      {#if data.certificate.applicantNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Applicant note:</span>
          <p class="mt-1 text-base-content/80">{data.certificate.applicantNote}</p>
        </div>
      {/if}
    </div>
  </main>
{/if}
