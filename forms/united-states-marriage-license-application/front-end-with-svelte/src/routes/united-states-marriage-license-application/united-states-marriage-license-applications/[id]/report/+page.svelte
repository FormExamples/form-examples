<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    applicationClassLabel,
    applicationClassColor,
    priorityLabel,
    priorityColor,
    sexLabel,
    maritalStatusLabel,
    officiantTypeLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { ruleFor, waitingDays, witnessesRequired } from '#lib/engine/rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const rule = $derived(ruleFor(assessment.data));
  const wait = $derived(waitingDays(assessment.data));

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-marriage-license-application/united-states-marriage-license-applications/${id}`
      );
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/united-states-marriage-license-applications/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: assessment.data, result: assessment.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marriage-license-application-${id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Marriage license eligibility report</h1>
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
              `/united-states-marriage-license-application/united-states-marriage-license-applications/${id}`
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
        {#if !result.stateRuleKnown}
          <span class="text-sm text-warning">Verify the state rule with the clerk</span>
        {/if}
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Earliest permitted ceremony: {result.earliestCeremonyDate || 'not determinable'} · License valid
        through: {result.licenseExpiryDate || 'not determinable'}
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.applicationClass === 'not-eligible'}
        <p class="text-sm text-base-content/80">
          Something recorded bars the license under the rule applied: an applicant is under the
          minimum age with no permitted path, an applicant is still married, the applicants are
          related within a prohibited degree, or a proxy marriage is requested that the state does
          not allow. The county clerk cannot issue the license until the bar is removed. This is a
          documentation finding; the clerk or a court decides.
        </p>
      {:else if result.applicationClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The application is <strong>incomplete</strong>: required details, identification, the
          prior-marriage end date, minor consent, or the ceremony timing, witnesses, or officiant
          still need attention. Resolve the flags below before applying or before the ceremony.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The application is <strong>ready to apply</strong>: nothing recorded bars the license
          under the rule applied. The county clerk decides whether the license issues, and rules
          change, so confirm the waiting period, fee, and appointment steps with the clerk.
        </p>
      {/if}
    </div>

    <!-- State rule -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">State rule applied: {rule.name}</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div><span class="font-medium text-base-content/70">Minimum age:</span> {rule.minAge}</div>
        <div>
          <span class="font-medium text-base-content/70">Waiting period:</span>
          {rule.waitingHours === 0
            ? 'None'
            : `${rule.waitingHours} hours after issuance`}{wait.waivedBy
            ? ` (waived: ${wait.waivedBy})`
            : ''}
        </div>
        <div>
          <span class="font-medium text-base-content/70">License valid for:</span>
          {rule.validDays} days
        </div>
        <div>
          <span class="font-medium text-base-content/70">Witnesses:</span>
          {witnessesRequired(data)}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Signed license due back:</span>
          {rule.returnWithinDays} days after the ceremony
        </div>
        <div>
          <span class="font-medium text-base-content/70">Proxy marriage:</span>
          {rule.proxy === 'none' ? 'Not allowed' : 'Active-duty service members only'}
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

    <!-- Application summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Application summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">Jurisdiction:</span>
          {data.jurisdiction.county || 'N/A'}, {data.jurisdiction.state || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Applied:</span>
          {data.jurisdiction.applicationDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">First applicant:</span>
          {data.applicantOne.name || 'N/A'} ({data.applicantOne.dateOfBirth || 'N/A'})
        </div>
        <div>
          <span class="font-medium text-base-content/70">Second applicant:</span>
          {data.applicantTwo.name || 'N/A'} ({data.applicantTwo.dateOfBirth || 'N/A'})
        </div>
        <div>
          <span class="font-medium text-base-content/70">First applicant sex or gender:</span>
          {sexLabel(data.applicantOne.sex) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Second applicant sex or gender:</span>
          {sexLabel(data.applicantTwo.sex) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">First applicant marital status:</span>
          {maritalStatusLabel(data.applicantOne.maritalStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Second applicant marital status:</span>
          {maritalStatusLabel(data.applicantTwo.maritalStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Appearing in person:</span>
          {yesNoLabel(data.eligibility.appearInPerson) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">License issued:</span>
          {data.issuance.licenseIssuedDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Ceremony:</span>
          {data.ceremony.ceremonyDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Officiant:</span>
          {officiantTypeLabel(data.ceremony.officiantType) || 'N/A'}
          {data.ceremony.officiantName ? `— ${data.ceremony.officiantName}` : ''}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Witnesses present:</span>
          {data.ceremony.witnessCount ?? 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">License returned:</span>
          {data.ceremony.licenseReturnedDate || 'N/A'}
        </div>
      </div>
      {#if data.issuance.clerkNote}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Note:</span>
          <p class="mt-1 text-base-content/80">{data.issuance.clerkNote}</p>
        </div>
      {/if}
    </div>

    <p class="text-sm text-base-content/60">
      Documentation support, not legal advice. The issuing county clerk or a court decides, and
      state rules change.
    </p>
  </main>
{/if}
