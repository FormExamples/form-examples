<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import {
    classificationLabel,
    classificationColor,
    priorityLabel,
    priorityColor,
    sellerCapacityLabel,
    motStatusLabel,
    financeStatusLabel,
    paymentMethodLabel,
    saleTermsLabel,
    dvlaNotificationLabel,
    yesNoLabel
  } from '#lib/engine/utils.js';
  import { Button } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) {
      goto(`/united-kingdom-vehicle-bill-of-sale/united-kingdom-vehicle-bills-of-sale/${id}`);
    }
  });

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/united-kingdom-vehicle-bills-of-sale/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: assessment.data, result: assessment.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bill-of-sale-${data.vehicle.registration || id}.pdf`;
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
      <h1 class="text-lg font-bold text-base-content">Vehicle bill of sale report</h1>
      <div class="flex items-center gap-3">
        {#if pdfError}
          <span class="text-sm text-error">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() =>
            goto(`/united-kingdom-vehicle-bill-of-sale/united-kingdom-vehicle-bills-of-sale/${id}`)}
          >Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16 px-4 py-6">
    <!-- Classification banner -->
    <div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
      <div class="text-2xl font-bold text-base-content">
        Classification: {classificationLabel(result.classification)}
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span
          class="inline-block rounded-full border px-3 py-1 text-sm font-bold {classificationColor(
            result.classification
          )}"
        >
          {classificationLabel(result.classification)}
        </span>
        <span class="text-sm text-base-content/70">
          {result.missingItemCount} item(s) missing; {result.riskFlagCount} risk condition(s)
        </span>
      </div>
      <div class="mt-2 text-sm text-base-content/70">
        Generated {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>

    <!-- Interpretation -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
      {#if result.classification === 'risk-flagged'}
        <p class="text-sm text-base-content/80">
          A risk condition holds, so this bill of sale is classified <strong>risk flagged</strong>:
          outstanding finance, no V5C or a V5C that does not match, a seller who is not the
          registered keeper, or a vehicle that does not match its description. Resolve the risk
          before the sale goes ahead. This is documentation support, not legal advice.
        </p>
      {:else if result.classification === 'incomplete'}
        <p class="text-sm text-base-content/80">
          The bill of sale is <strong>incomplete</strong>: {result.missingItemCount} required item(s)
          are still missing. Complete them so the record shows who sold what to whom, for how much, and
          on what terms.
        </p>
      {:else}
        <p class="text-sm text-base-content/80">
          The bill of sale is <strong>complete</strong>: every required item is filled in and no
          risk condition holds. That does not prove the seller owns the vehicle, that finance is
          settled, or that the vehicle matches its description.
        </p>
      {/if}
    </div>

    <!-- Missing items -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">
        Missing items ({result.missingItemCount})
      </h2>
      {#if result.missingItems.length === 0}
        <p class="text-sm text-base-content/80">Every required item is filled in.</p>
      {:else}
        <ul class="list-disc pl-6 text-sm text-base-content/80">
          {#each result.missingItems as item (item)}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}
    </div>

    <!-- Next steps -->
    <div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
      <h2 class="mb-2 text-lg font-bold text-base-content">Next steps</h2>
      <p class="text-sm text-base-content/80">
        The seller tells DVLA about the sale (online, or by post with the V5C), which cancels the
        vehicle tax and lets the seller claim a refund for any full months left. The seller gives
        the buyer the V5C/2 new keeper section. The buyer must tax and insure the vehicle before
        driving it, because tax does not transfer.
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
          <span class="font-medium text-base-content/70">Vehicle:</span>
          {[data.vehicle.registration, data.vehicle.make, data.vehicle.model]
            .filter(Boolean)
            .join(' ') || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">VIN:</span>
          {data.vehicle.vin || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Mileage:</span>
          {data.vehicle.mileage != null ? `${data.vehicle.mileage} miles` : 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Date of sale:</span>
          {data.sale.saleDate || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Seller:</span>
          {data.seller.name || 'N/A'}
          {#if data.sale.sellerCapacity}({sellerCapacityLabel(data.sale.sellerCapacity)}){/if}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Buyer:</span>
          {data.buyer.name || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Price:</span>
          {data.payment.priceAsGbp != null ? `£${data.payment.priceAsGbp}` : 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Payment:</span>
          {paymentMethodLabel(data.payment.paymentMethod) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Terms:</span>
          {saleTermsLabel(data.condition.saleTerms) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">MOT:</span>
          {motStatusLabel(data.checks.motStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">Finance:</span>
          {financeStatusLabel(data.checks.financeStatus) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">V5C present:</span>
          {yesNoLabel(data.checks.v5cPresent) || 'N/A'}
        </div>
        <div>
          <span class="font-medium text-base-content/70">DVLA:</span>
          {dvlaNotificationLabel(data.dvla.dvlaNotification) || 'N/A'}
        </div>
      </div>
      {#if data.condition.knownFaults}
        <div class="mt-4 text-sm">
          <span class="font-medium text-base-content/70">Known faults:</span>
          <p class="mt-1 text-base-content/80">{data.condition.knownFaults}</p>
        </div>
      {/if}
      <p class="mt-4 text-xs text-base-content/60">
        This form is documentation support, not legal advice.
      </p>
    </div>
  </main>
{/if}
