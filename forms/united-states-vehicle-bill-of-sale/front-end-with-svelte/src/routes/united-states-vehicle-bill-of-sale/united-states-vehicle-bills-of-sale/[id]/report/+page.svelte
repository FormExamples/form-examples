<script lang="ts">
  import { renderPdf } from '#lib/report/pdf-client.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    completenessClassLabel,
    completenessClassColor,
    priorityLabel,
    priorityColor,
    partyTypeLabel,
    paymentMethodLabel,
    taxBasisLabel,
    titleBrandLabel,
    odometerStatusLabel,
    lienStatusLabel,
    asIsClauseLabel,
    notarizedLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { stateRule } from '#lib/engine/bill-of-sale-rules.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);
  const rule = $derived(stateRule(data.transaction.state));

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-states-vehicle-bill-of-sale/united-states-vehicle-bills-of-sale/${id}`);
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
        a.download = `bill-of-sale-${data.vehicle.vin || id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        pdfError = 'Failed to generate PDF. Please try again.';
      }
    } catch {
      pdfError = 'Failed to generate PDF. Please check your connection and try again.';
    }
  }

  function party(p: {
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
  }) {
    return [p.name, p.streetAddress, p.city, p.state, p.postalCode].filter((x) => x).join(', ');
  }
</script>

{#if result}
  <header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
      <h1 class="text-lg font-bold text-base-content">Vehicle bill of sale completeness report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(`/united-states-vehicle-bill-of-sale/united-states-vehicle-bills-of-sale/${id}`)}
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
        Class: {completenessClassLabel(result.completenessClass)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {completenessClassColor(
            result.completenessClass
          )}"
        >
          {completenessClassLabel(result.completenessClass)}
        </span>
        <span class="text-sm text-base-content/70">
          Federal odometer disclosure: {result.odometerExempt ? 'exempt' : 'required'}
        </span>
        <span class="text-sm text-base-content/70">
          State rule: {result.stateRuleKnown ? 'from the rule table' : 'uniform default (verify)'}
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.completenessClass === 'risk-flagged'}
        <p class="text-sm text-base-content/80">
          The bill of sale is <strong>risk flagged</strong>: an odometer discrepancy, an invalid
          VIN, an outstanding lien, no title in hand, or a branded title needs attention. Resolve
          the high-priority flags, and make sure the buyer has been told, before the sale is
          completed. This is documentation support, not legal advice.
        </p>
      {:else if result.completenessClass === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The bill of sale is <strong>incomplete</strong>: required details, signatures, the
          odometer disclosure, or a state-required notarization are missing. Complete the flagged
          items before the parties sign.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The bill of sale is <strong>complete</strong>: parties, vehicle, price, terms, odometer
          disclosure (or its exemption), title, and any required notarization are recorded, and no
          risk condition was found. Finish the post-sale filings flagged below, and keep a signed
          copy for at least five years.
        </p>
      {/if}
    </div>

    <!-- State rule -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">State rule applied</h2>
      <p class="text-sm text-base-content/80">
        {#if data.transaction.state === ''}
          No state chosen.
        {:else}
          <strong>
            {rule.known ? rule.rule.name : 'Not in the rule table (uniform default)'}
          </strong>:
          {rule.rule.notary === 'none'
            ? 'no notarization required'
            : rule.rule.notary === 'title'
              ? 'title signatures must be notarized'
              : 'the bill of sale must be notarized'};
          {rule.rule.sellerNoticeDays === null
            ? 'no seller notice deadline encoded'
            : `seller notice within ${rule.rule.sellerNoticeDays} days`};
          {rule.rule.buyerTransferDays === null
            ? 'no buyer title deadline encoded'
            : `buyer applies within ${rule.rule.buyerTransferDays} days`}. {rule.rule.taxNote}
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

    <!-- Sale summary -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-4 text-lg font-bold text-base-content">Sale summary</h2>
      <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <span class="font-medium text-base-content/70">State:</span>
          {data.transaction.state || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of sale:</span>
          {data.transaction.saleDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Price:</span>
          {data.transaction.salePriceAsUsd != null
            ? `$${data.transaction.salePriceAsUsd.toLocaleString('en-US')}`
            : 'N/A'}
          {#if data.transaction.paymentMethod}({paymentMethodLabel(
              data.transaction.paymentMethod
            )}){/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Sales-tax basis:</span>
          {taxBasisLabel(data.transaction.taxBasis) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Seller:</span>
          {party(data.seller) || 'N/A'}
          {#if data.seller.type}({partyTypeLabel(data.seller.type)}){/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Buyer:</span>
          {party(data.buyer) || 'N/A'}
          {#if data.buyer.type}({partyTypeLabel(data.buyer.type)}){/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Vehicle:</span>
          {[data.vehicle.year, data.vehicle.make, data.vehicle.model].filter((x) => x).join(' ') ||
            'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">VIN:</span>
          {data.vehicle.vin || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Title brand:</span>
          {titleBrandLabel(data.vehicle.titleBrand) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Odometer:</span>
          {data.odometer.readingMiles != null
            ? `${data.odometer.readingMiles.toLocaleString('en-US')} miles`
            : 'N/A'}
          {#if data.odometer.status}({odometerStatusLabel(data.odometer.status)}){/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Warranty terms:</span>
          {asIsClauseLabel(data.terms.asIsClause) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Lien:</span>
          {lienStatusLabel(data.terms.lienStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Title signed over:</span>
          {yesNoLabel(data.terms.titleSigned) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Notarized:</span>
          {notarizedLabel(data.terms.notarized) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Release of liability filed:</span>
          {yesNoLabel(data.afterSale.releaseOfLiabilityFiled) || 'N/A'}
        </div>
      </div>
    </div>
  </main>
{/if}
