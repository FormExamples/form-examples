<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    eligibilityClassLabel,
    eligibilityClassColor,
    exemptionLabel,
    priorityLabel,
    priorityColor
  } from '#lib/engine/utils.js';
  import { stateRule, stateKnown, claimedExemptions, exemptionStatus } from '#lib/engine/rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const rule = $derived(stateRule(data));
  const claimed = $derived(claimedExemptions(data));

  $effect(() => {
    if (!assessment.result) {
      goto(
        `/united-states-property-tax-exemption-application/property-tax-exemption-applications/${id}`
      );
    }
  });
</script>

{#if result}
  <header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
      <h1 class="text-lg font-bold text-base-content">Property tax exemption eligibility report</h1>
      <div class="flex items-center gap-3">
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(
              `/united-states-property-tax-exemption-application/property-tax-exemption-applications/${id}`
            )}
        >
          Edit
        </Button>
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Eligibility: {eligibilityClassLabel(result.eligibilityClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {eligibilityClassColor(
            result.eligibilityClass
          )}"
        >
          {eligibilityClassLabel(result.eligibilityClass)}
        </span>
        <span class="text-sm text-base-content/70">
          Filing deadline: {result.filingDeadline ?? 'none derived'}{result.filedLate
            ? ' (filed late)'
            : ''}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.eligibilityClass === 'likely-ineligible'}
        <p class="text-sm text-base-content/80">
          The application is <strong>likely ineligible</strong>: a base requirement (ownership,
          occupancy, a single homestead, the filing deadline) or every claimed exemption fails the
          state test. Review the high-priority flags. This is a documentation finding, not a
          decision; the assessor decides.
        </p>
      {:else if result.eligibilityClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The application is <strong>incomplete</strong>: identification, assessment-date answers,
          an exemption claim, proof documents or the signed declaration are missing. Resolve the
          flags below before filing.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The application is <strong>likely eligible</strong>: it is complete, signed, filed on
          time, and each claimed exemption passes the encoded state test. This is not an approval;
          the county assessor decides and may ask for more evidence.
        </p>
      {/if}
    </div>

    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">State rule</h2>
      <p class="text-sm text-base-content/80">
        <strong>{rule.name}</strong>{stateKnown(data) ? '' : ' (default rule)'}: {rule.homestead}
      </p>
      <p class="mt-1 text-sm text-base-content/80">{rule.deadlineNote}</p>
    </div>

    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Exemptions claimed</h2>
      {#if claimed.length === 0}
        <p class="text-sm text-base-content/70">No exemption claimed.</p>
      {:else}
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-base-content/70">
              <th scope="col">Exemption</th>
              <th scope="col">State test</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {#each claimed as c (c)}
              {@const st = exemptionStatus(data, c)}
              <tr>
                <th scope="row" class="text-left font-medium">{exemptionLabel(c)}</th>
                <td>
                  {st.status === 'pass'
                    ? 'Passes'
                    : st.status === 'fail'
                      ? `Fails (${st.reason})`
                      : `Needs an answer (${st.reason})`}
                </td>
                <td>{result.qualifyingExemptions.includes(c) ? 'Qualifies' : '-'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>

    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">
        Flagged issues ({result.flaggedIssues.length})
      </h2>
      {#if result.flaggedIssues.length === 0}
        <p class="text-sm text-base-content/70">No flags raised.</p>
      {:else}
        <ul class="space-y-3 text-sm">
          {#each result.flaggedIssues as f (f.id)}
            <li>
              <span class="font-semibold {priorityColor(f.priority)}">
                {priorityLabel(f.priority)}
              </span>
              <span class="text-base-content/60">{f.category}</span>
              <span class="text-base-content/80">
                {f.description}{f.suggestedAction ? ` - ${f.suggestedAction}` : ''}
              </span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <p class="text-sm text-base-content/60">
      Documentation support, not legal or tax advice. The county assessor or state agency decides
      the application.
    </p>
  </main>
{/if}
